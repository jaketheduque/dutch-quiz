import { useContext, useState, useEffect, useRef } from "react";
import PocketBaseContext from "../PocketBaseContext.js";

import Correct from '../Correct.js';
import Incorrect from "../Incorrect.js";

import Select, { createFilter } from 'react-select';
import arrayShuffle from 'array-shuffle';

const Competitive = () => {
    const pb = useContext(PocketBaseContext);

    const filterOptions = {
        ignoreCase: true,
        ignoreAccents: true,
        matchFrom: 'start',
        stringify: option => `${option.label} ${option.value}`,
        trim: true,
    }

    var allCombos;
    var allFlavors;
    var selectedAnswer = null;

    const radioRef = useRef(null);

    const [index, setIndex] = useState(0);
    const [numQuestions, setNumQuestions] = useState(10);
    const [answers, setAnswers] = useState([]);
    const [quizQuestions, setQuizQuestions] = useState([]);

    useEffect(() => {
        pb.collection('flavor_combos').getFullList({ requestKey: null, expand: 'flavors,toppings'}).then(result => {
            allCombos = result;
        });

        pb.collection('flavors').getFullList({ requestKey: null}).then(result => {
            allFlavors = result;
        });
    }, []);

    function getRadios() {
        if (!radioRef.current) {
            radioRef.current = new Array();
        }

        return radioRef.current;
    }

    // will generate 10 multiple choice questions for the quiz
    function initQuiz() {
        const combos = arrayShuffle(allCombos);

        // for each combo, generate 3 wrong answers
        for (var i = 0 ; i < 10 ; i++) {
            const wrongAnswers = generateWrongAnswers(combos[i]).map((combo) => combo.expand.flavors.map((val) => val.name));
            const question = {
                name: combos[i].name,
                correct: combos[i].expand.flavors.map((val) => val.name),
                wrong: wrongAnswers
            };

            setQuizQuestions(old => [...old, question]);
        }
    }

    function similarFlavors(flavor) {
        // TODO evaluate the "flavor profile" of the combo as a whole and sub in something for ANY_FLAVOR if needed
        if (flavor.name === 'ANY_FLAVOR') {
            const shuffled = arrayShuffle(allFlavors);
            return shuffled[0];
        }

        const flavorsSorted = allFlavors.filter((val) => val.id !== flavor.id).filter((val) => flavor.aroma === val.aroma).sort((val1, val2) => {
            var totalDiff1 = 0;
            var totalDiff2 = 0

            totalDiff1 += Math.abs(flavor.sweet - val1.sweet);
            totalDiff1 += Math.abs(flavor.sour - val1.sour);
            totalDiff1 += Math.abs(flavor.bitter - val1.bitter);
            totalDiff1 += Math.abs(flavor.salt - val1.salt);
            totalDiff1 += Math.abs(flavor.spicy - val1.spicy);

            totalDiff2 += Math.abs(flavor.sweet - val2.sweet);
            totalDiff2 += Math.abs(flavor.sour - val2.sour);
            totalDiff2 += Math.abs(flavor.bitter - val2.bitter);
            totalDiff2 += Math.abs(flavor.salt - val2.salt);
            totalDiff2 += Math.abs(flavor.spicy - val2.spicy);

            return totalDiff1 - totalDiff2;
        });

        return flavorsSorted;
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
        var similarCombos = Array.from(allCombos);
        similarCombos.sort((a, b) => compareCombos(combo, a) - compareCombos(combo, b));

        return similarCombos.slice(1, 4);
    }

    function checkAnswers() {
        const combo = quizQuestions[index];

        // add answer to list
        answers.push(selectedAnswer);
        
        // checks if answers are correct
        if (combo.correct == selectedAnswer) {
            console.log("correct!");
            
        } else {
            console.log("incorrect!");
        }

        if (quizQuestions.length - index != 1) {
            setIndex(index+1);
        }

        radioRef.current.forEach((element) => element.checked = false);
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
    } else if (answers.length === quizQuestions.length) { // quiz has been finished
        const results = [];
        var correct = 0;
        for (var i = 0 ; i < answers.length ; i++) {
            // create empty toppings array if doesn't exist
            if (!Object.hasOwn(quizQuestions[i].expand, 'toppings')) {
                quizQuestions[i].expand.toppings = [];
            }

            if (answers[i].correct) {
                correct++;
                results.push(
                    <div className="card bg-green-600 w-75% text-white">
                    <div className="flex card-body items-center">
                        <h2 className="text-2xl card-title">{quizQuestions[i].name}</h2>
                        <ul className="list-disc">
                            {quizQuestions[i].expand.flavors.map((e) => {
                                return <li>{e.name}</li>;
                            })}
                            {quizQuestions[i].expand.toppings.map((e) => {
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
                            {quizQuestions[i].expand.flavors.map((e) => {
                                return <li>{e.name}</li>;
                            })}
                            {quizQuestions[i].expand.toppings.map((e) => {
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
                <h1 className="text-2xl font-bold">You got {correct} out of {quizQuestions.length} correct!</h1>
                <div className="flex flex-col gap-5">
                    {results}
                </div>
            </div>
        );
    } else { // quiz has been initialized, starting showing questions
        const combo = quizQuestions[index];
        var options = [...combo.wrong, combo.correct];
        options = arrayShuffle(options);
        
        return (
            <div className="flex justify-center flex-col gap-2 items-center w-screen min-h-screen">
            <h1 className="text-xl">{index+1} of {numQuestions}</h1>
            <div className="flex flex-col w-screen h-fit items-center p-5 gap-3 bg-base-100 shadow-xl">
                <h1 className="text-lg italic flex justify-center">What flavors are in:</h1>
                <h1 className="text-2xl font-bold flex justify-center">{combo.name}</h1>
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <input type="radio" name="answers" ref={(node) => getRadios()[0] = node} className="radio" onClick={() => selectedAnswer = options[0]}/>
                        <span className="label-text">{options[0].join(', ')}</span>
                    </label>
                </div>
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <input type="radio" name="answers" ref={(node) => getRadios()[1] = node} className="radio" onClick={() => selectedAnswer = options[1]}/>
                        <span className="label-text">{options[1].join(', ')}</span>
                    </label>
                </div>
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <input type="radio" name="answers" ref={(node) => getRadios()[2] = node} className="radio" onClick={() => selectedAnswer = options[2]}/>
                        <span className="label-text">{options[2].join(', ')}</span>
                    </label>
                </div>
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <input type="radio" name="answers" ref={(node) => getRadios()[3] = node} className="radio" onClick={() => selectedAnswer = options[3]}/>
                        <span className="label-text">{options[3].join(', ')}</span>
                    </label>
                </div>
                <button className="btn btn-block" onClick={() => checkAnswers()}>Submit</button >
            </div>
            </div>
        );
    }
    
}
 
export default Competitive;