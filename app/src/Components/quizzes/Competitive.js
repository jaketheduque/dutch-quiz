import { useContext, useState, useEffect, useRef, useMemo } from "react";
import PocketBaseContext from "../PocketBaseContext.js";

import { useTimer } from "../hooks/useTimer.js";

import arrayShuffle from 'array-shuffle';

const Competitive = () => {
    const pb = useContext(PocketBaseContext);

    const [allCombos, setAllCombos] = useState([]);
    const [allIngredients, setAllIngredients] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState();

    const radioRef = useRef(null);
    const answers = useRef([]);

    const [index, setIndex] = useState(-1);
    const [numQuestions, setNumQuestions] = useState(10);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [timeRemaining, isRunning, setIsRunning] = useTimer(60 * 1000);

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
            const wrongAnswers = generateWrongAnswers(combos[i]);
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

    function compareCombos(combo1, combo2) {
        var sweet1, sour1, bitter1, salt1, spicy1;
        var sweet2, sour2, bitter2, salt2, spicy2;

        combo1.expand.flavors.forEach(flavor => {
            sweet1 += flavor.sweet;
            sour1 += flavor.sour;
            bitter1 += flavor.bitter;
            salt1 += flavor.salt;
            spicy1 += flavor.spicy;
        });

        sweet1 /= combo1.flavors.length;
        sour1 /= combo1.flavors.length;
        bitter1 /= combo1.flavors.length;
        salt1 /= combo1.flavors.length;
        spicy1 /= combo1.flavors.length;

        combo2.expand.flavors.forEach(flavor => {
            sweet2 += flavor.sweet;
            sour2 += flavor.sour;
            bitter2 += flavor.bitter;
            salt2 += flavor.salt;
            spicy2 += flavor.spicy;
        });

        sweet2 /= combo2.flavors.length;
        sour2 /= combo2.flavors.length;
        bitter2 /= combo2.flavors.length;
        salt2 /= combo2.flavors.length;
        spicy2 /= combo2.flavors.length;

        var totalDiff = 0;
        totalDiff += Math.abs(sweet1 - sweet2);
        totalDiff += Math.abs(sour1 - sour2);
        totalDiff += Math.abs(bitter1 - bitter2);
        totalDiff += Math.abs(salt1 - salt2);
        totalDiff += Math.abs(spicy1 - spicy2);

        return totalDiff;
    }

    // takes in a flavor combo, and returns an array of three other "plausible" answer choices based on the flavors in the combo
    function generateWrongAnswers(combo) {
        var similarCombos = [...new Set(allCombos)];
        similarCombos.sort((a, b) => compareCombos(combo, a) - compareCombos(combo, b));

        return similarCombos.slice(0, 3);
    }

    function checkAnswer() {
        const combo = quizQuestions[index];

        // add answer to list
        answers.current.push(selectedAnswer);        
        
        // checks if answers are correct
        if (combo.correct == selectedAnswer) {
            console.log("correct!");
        } else {
            console.log("incorrect!");
        }

        // moves question forward by one
        if (quizQuestions.length - index != 1) {
            setIndex(index+1);
        }

        // unchecks each radio box
        radioRef.current.forEach((element) => element.checked = false);
    }

    function msToTime(s) {
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
      
        return secs + '.' + (Math.floor(ms/100));
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
    } else if (timeRemaining === 0) { // time is up
        const results = [];
        var numCorrect = 0;
        for (var i = 0 ; i < answers.current.length ; i++) {            
            // create empty toppings array if doesn't exist
            if (!Object.hasOwn(quizQuestions[i].correct.expand, 'toppings')) {
                quizQuestions[i].correct.expand.toppings = [];
            }            

            if (answers.current[i] == quizQuestions[i].correct) {                
                numCorrect++;
                results.push(
                    <div className="card bg-green-600 w-75% text-white">
                    <div className="flex card-body items-center">
                        <h2 className="text-2xl card-title">{quizQuestions[i].name}</h2>
                        <ul className="list-disc">
                            {quizQuestions[i].correct.expand.flavors.map((e) => {
                                return <li>{e.name}</li>;
                            })}
                            {quizQuestions[i].correct.expand.toppings.map((e) => {
                                return <li>{e.name} <span className="italic">(Topping)</span></li>;
                            })}
                        </ul>
                    </div>
                    </div>
                )
            } else {
                results.push(
                    <div className="card bg-red-600 w-75% text-white">
                    <div className="flex card-body items-center">
                        <h2 className="text-2xl card-title">{quizQuestions[i].name}</h2>
                        <ul className="list-disc">
                            {quizQuestions[i].correct.expand.flavors.map((e) => {
                                return <li>{e.name}</li>;
                            })}
                            {quizQuestions[i].correct.expand.toppings.map((e) => {
                                return <li>{e.name} <span className="italic">(Topping)</span></li>;
                            })}
                        </ul>
                    </div>
                    </div>
                )
            }
        }

        return (
            <div className="flex flex-col p-10 gap-8 items-center min-h-screen h-max">
                <h1 className="text-2xl font-bold">You got {numCorrect} out of {answers.current.length} correct!</h1>
                <div className="flex flex-col gap-5">
                    {results}
                </div>
            </div>
        );
    } else { // quiz is currently being done
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