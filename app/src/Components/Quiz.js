import { useContext, useState, useEffect } from "react";
import PocketBaseContext from "./PocketBaseContext";

import Correct from './Correct.js';
import Incorrect from "./Incorrect.js";

import Select, { createFilter } from 'react-select';
import arrayShuffle from 'array-shuffle';

const Quiz = () => {
    const pb = useContext(PocketBaseContext);

    const filterOptions = {
        ignoreCase: true,
        ignoreAccents: true,
        matchFrom: 'start',
        stringify: option => `${option.label} ${option.value}`,
        trim: true,
    }

    const [index, setIndex] = useState(0);
    const [numQuestions, setNumQuestions] = useState(10);
    const [allCombos, setAllCombos] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [quizCombos, setQuizCombos] = useState([]);
    const [options, setOptions] = useState([]);
    const [selectedFlavors, setSelectedFlavors] = useState([]);
    const [selectedToppings, setSelectedToppings] = useState([]);
    const [transition, setTransition] = useState(null);

    useEffect(() => {
        pb.collection('flavor_combos').getFullList({ requestKey: null, expand: 'flavors,toppings'}).then(result => {
            setAllCombos(result);
        });

        pb.collection('flavors').getFullList({ requestKey: null }).then(result => {
            const flavors = [];
            for (var i = 0 ; i < result.length ; i++) {
                const flavor = result[i];
                flavors.push({value: flavor.name, label: flavor.name});                
            }            

            setOptions(flavors.sort((a, b) => {return a.value.localeCompare(b.value)}));
        });
    }, []);

    async function initQuiz(num) {
        const combos = arrayShuffle(allCombos);
        setQuizCombos(combos.slice(0, num));
    }

    function checkAnswers() {
        const combo = quizCombos[index];

        const correctFlavors = combo.expand.flavors.map((e) => e.name);
        var correctToppings = [];
        
        var correct = correctFlavors.sort().join(',') === selectedFlavors.map(val => val.value).sort().join(',');

        // checks if toppings are correct if the combo has toppings
        if (Object.hasOwn(combo.expand, 'toppings')) {
            correctToppings = combo.expand.toppings.map((e) => e.name);
            correct = correct && correctToppings.sort().join(',') === selectedToppings.map(val => val.value).sort().join(',');
        }

        // add answer to list
        answers.push({
            'correct': correct,
            'flavors': selectedFlavors.map(val => val.value),
            'toppings': selectedToppings.map(val => val.value)
        });
        
        // checks if answers are correct
        if (correct) {
            setTransition(<Correct onClick={() => setTransition(null)}></Correct>);
        } else {
            setTransition(<Incorrect combo={combo} onClick={() => setTransition(null)}></Incorrect>);
        }

        if (quizCombos.length - index != 1) {
            setIndex(index+1);
            setSelectedFlavors([]);
            setSelectedToppings([]);
        }
        
    }
    
    if (quizCombos === undefined | quizCombos.length == 0) { // quiz has not been initialized yet
        return ( 
            <div className="flex justify-center flex-col items-center min-h-screen">
            <div className="card w-fit bg-base-100 shadow-xl h-fit">
            <div className="flex card-body gap-5">
                <h1 className="card-title flex justify-center">How many questions?</h1>
                <div className="flex flex-row gap-2">
                    <p className="w-8">{numQuestions}</p>
                    <input type="range" step={1} min={1} max={allCombos.length} value={numQuestions} className="range" onChange={(e) => {
                        setNumQuestions(e.target.value);                        
                    }}/>
                </div>
                <button className="btn btn-block" onClick={() => initQuiz(numQuestions)}>Start Quiz</button >
            </div>
            </div>
            </div>
         );
    } else if (answers.length === quizCombos.length) { // quiz has been finished
        const results = [];
        var correct = 0;
        for (var i = 0 ; i < answers.length ; i++) {
            // create empty toppings array if doesn't exist
            if (!Object.hasOwn(quizCombos[i].expand, 'toppings')) {
                quizCombos[i].expand.toppings = [];
            }

            if (answers[i].correct) {
                correct++;
                results.push(
                    <div className="card bg-green-600 w-75% text-white">
                    <div className="flex card-body items-center">
                        <h2 className="text-2xl card-title">{quizCombos[i].name}</h2>
                        <ul className="list-disc">
                            {quizCombos[i].expand.flavors.map((e) => {
                                return <li>{e.name}</li>;
                            })}
                            {quizCombos[i].expand.toppings.map((e) => {
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
                        <h2 className="text-2xl card-title">{quizCombos[i].name}</h2>
                        <ul className="list-disc">
                            {quizCombos[i].expand.flavors.map((e) => {
                                return <li>{e.name}</li>;
                            })}
                            {quizCombos[i].expand.toppings.map((e) => {
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
            <h1 className="text-2xl font-bold">You got {correct} out of {quizCombos.length} correct!</h1>
            <div className="flex flex-col gap-5">
                {(transition == null) && results}
            </div>
            {transition}
            </div>
        );
    } else { // quiz has been initialized, starting showing questions
        const combo = quizCombos[index];
        
        return (
            <div className="flex justify-center flex-col gap-2 items-center w-screen min-h-screen">
            <h1 className="text-xl">{index+1} of {numQuestions}</h1>
            <div className="flex flex-col w-screen h-fit items-center p-5 gap-3 bg-base-100 shadow-xl">
                <h1 className="text-lg italic flex justify-center">What flavors are in:</h1>
                <h1 className="text-2xl font-bold flex justify-center">{combo.name}</h1>
                <div className="flex flex-row w-full justify-center items-center gap-2">
                    <h1 className="text-sm flex justify-center">Flavors:</h1>
                    <div className="w-3/4">
                        <Select className="text-sm" options={options} value={selectedFlavors} isMulti filterOption={createFilter(filterOptions)} onChange={(e) => setSelectedFlavors(e)}/>
                    </div>
                </div>
                <div className="flex flex-row w-full justify-center items-center gap-2">
                    <h1 className="text-sm flex justify-center">Toppings:</h1>
                    <div className="w-3/4">
                        <Select className="text-sm" options={options} value={selectedToppings} isMulti filterOption={createFilter(filterOptions)} onChange={(e) => setSelectedToppings(e)}/>  
                    </div>
                </div>
                <button className="btn btn-block" onClick={() => checkAnswers()}>Submit</button >
            </div>
            {transition}
            </div>
        );
    }
    
}
 
export default Quiz;