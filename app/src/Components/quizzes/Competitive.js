import { useContext, useState, useEffect, useRef, useMemo } from "react";
import PocketBaseContext from "../PocketBaseContext.js";

import { useTimer } from "../hooks/useTimer.js";

import arrayShuffle from 'array-shuffle';
import { generateWrongAnswers, compareCombos, generateResults } from "../../Util.js";

const Competitive = () => {
    const pb = useContext(PocketBaseContext);

    const [allCombos, setAllCombos] = useState([]);
    const [allIngredients, setAllIngredients] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const radioRef = useRef(null);
    const answers = useRef([]);

    const [index, setIndex] = useState(-1);
    const [numQuestions, setNumQuestions] = useState(10);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [timeRemaining, isRunning, setIsRunning] = useTimer(5 * 1000);

    const [isFinished, setIsFinished] = useState(false);
    const [afterQuizPage, setAfterQuizPage] = useState("results"); // results, leaderboard
    const [result, setResult] = useState();
    const [leaderboard, setLeaderboard] = useState();

    const optionsMemo = useMemo(() => {
        if (quizQuestions.length > 0) {
            const combo = quizQuestions[index];
            var options = [...combo.wrong, combo.correct];
            return arrayShuffle(options);
        }
    }, [index]);

    useEffect(() => {
        pb.collection('flavor_combos').getFullList({ requestKey: null, expand: 'flavors,toppings'}).then(result => {
            setAllCombos(result);
        });

        pb.collection('ingredients').getFullList({ requestKey: null}).then(result => {
            setAllIngredients(result);
        });
    }, []);

    useEffect(() => {
        pb.collection('competitive_leaderboard').getFullList({ requestKey: null, expand: 'user'}).then(result => {
            setLeaderboard(result);
        });
    }, [isFinished]);

    function getRadios() {
        if (!radioRef.current) {
            radioRef.current = new Array();
        }

        return radioRef.current;
    }

    // will multiple choice questions for the quiz from allCombos
    function initQuiz() {
        const combos = arrayShuffle(allCombos);

        // for each combo, generate 3 wrong answers
        for (var i = 0 ; i < combos.length ; i++) {
            const wrongAnswers = generateWrongAnswers(combos[i], allCombos);
            const question = {
                name: combos[i].name,
                correct: combos[i],
                wrong: wrongAnswers
            };

            setQuizQuestions(old => [...old, question]);
        }

        setIndex(0);
        setIsRunning(true);
    }

    function checkAnswer() {
        // check if there is a selected answer
        if (selectedAnswer == null) {
            return;
        }

        const combo = quizQuestions[index];

        // add answer to list
        answers.current.push(selectedAnswer);

        // moves question forward by one
        if (quizQuestions.length - index != 1) {
            setIndex(index+1);
        }

        // unchecks each radio box and clears selected answer
        radioRef.current.forEach((element) => element.checked = false);
        setSelectedAnswer(null);
    }

    function msToTime(s) {
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        
        return secs + '.' + (Math.floor(ms/100));
    }

    // runs only once when quiz is finished
    if (timeRemaining === 0 && isFinished === false) {
        setResult(generateResults(quizQuestions, answers));
        setIsFinished(true);
    }
    
    if (quizQuestions === undefined | quizQuestions.length == 0) { // quiz has not been started yet
        return ( 
            <div className="flex justify-center flex-col items-center min-h-screen">
            <div className="card w-fit bg-base-100 shadow-xl h-fit">
            <div className="flex card-body gap-5 text-center">
                <h1 className="card-title flex justify-center">Ready to begin?</h1>
                <p>Choose the correct flavor combination as fast as possible!</p>
                <button className="btn btn-block" onClick={() => initQuiz()}>Start Quiz</button >
            </div>
            </div>
            </div>
         );
    } else if (isFinished) { // time is up, quiz is over
        var data;
        switch(afterQuizPage) {
            case "results":
                data = result.results;
                break;
            case "leaderboard":
                // TODO add other thing to check if user is signed in
                // TODO add highlighted row for the just finished run
                data = (
                    <div className="w-full">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Date</th>
                                <th>Username</th>
                                <th># Correct</th>
                            </tr>
                            </thead>
                            <tbody>
                                {leaderboard.sort((a, b) => b.num_correct - a.num_correct).map((entry) => {
                                    const created = new Date(entry.created.replace(" ", "T"));
                                    const formattedCreated = (created.getMonth()+1) + "/" + created.getDate() + "/" + created.getFullYear() + " " + created.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                                    return (
                                        <tr>
                                            <th>{formattedCreated}</th>
                                            <td>{entry.expand.user.displayName}</td>
                                            <td>{entry.num_correct}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )
                break;
        }

        return (
            <div className="flex flex-col p-10 gap-8 items-center min-h-screen h-max">
                <h1 className="text-2xl font-bold">You got {result.numCorrect} out of {answers.current.length} correct!</h1>
                <div className="join">
                    <input className="join-item btn" type="radio" name="options" aria-label="Results" defaultChecked onClick={() => setAfterQuizPage("results")}/>
                    <input className="join-item btn" type="radio" name="options" aria-label="Leaderboard" onClick={() => setAfterQuizPage("leaderboard")}/>
                </div>
                <div className="flex flex-col gap-5">
                    {data}
                </div>
            </div>
        );
    } else { // quiz is in progress
        const options = optionsMemo;
        
        return (
            <div className="flex justify-center flex-col gap-2 items-center w-screen min-h-screen">
            <h1 className="text-3xl">Time Remaining: {msToTime(timeRemaining)}</h1>
            <div className="flex flex-col w-screen h-fit items-center p-5 gap-3 bg-base-100 shadow-xl">
                <h1 className="text-lg italic flex justify-center">What flavors are in:</h1>
                <h1 className="text-2xl font-bold flex justify-center">{quizQuestions[index].name}</h1>
                {options.map((option, index) => {
                    return (<div key={index} className="form-control">
                        <label className="label cursor-pointer">
                            <input type="radio" name="answers" ref={(node) => getRadios()[index] = node} className="radio mx-3" onClick={() => setSelectedAnswer(option)}/>
                            <div>
                                <p className="label-text"><span className="font-bold">Flavors: </span>{option.expand.flavors.map(e => e.name).join(', ')}</p>
                                {option.expand.toppings != null ? 
                                    <p className="label-text"><span className="font-bold">Toppings: </span>{option.expand.toppings.map(e => e.name).join(', ')}</p> :
                                    <p className="label-text"><span className="font-bold">Toppings: </span>None</p>
                                }
                            </div>
                        </label>
                    </div>);
                })}
                <button className="btn btn-block" onClick={() => checkAnswer()}>Submit</button >
            </div>
            </div>
        );
    }
    
}
 
export default Competitive;