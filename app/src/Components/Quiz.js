import { useContext, useState, useEffect } from "react";
import PocketBaseContext from "./PocketBaseContext";

import Correct from './Correct.js';
import Incorrect from "./Incorrect.js";

import { MultiSelect } from 'primereact/multiselect';
import arrayShuffle from 'array-shuffle';

const Quiz = () => {
    const pb = useContext(PocketBaseContext);

    const [index, setIndex] = useState(0);
    const [numQuestions, setNumQuestions] = useState(10);
    const [allCombos, setAllCombos] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [quizCombos, setQuizCombos] = useState([]);
    const [options, setOptions] = useState([]);
    const [selectedFlavors, setSelectedFlavors] = useState([]);
    const [selectedToppings, setSelectedToppings] = useState([]);
    const [result, setResult] = useState(null);

    useEffect(() => {
        pb.collection('flavor_combos').getFullList({ requestKey: null, expand: 'flavors,toppings'}).then(result => {
            setAllCombos(result);
        });

        pb.collection('flavors').getFullList({ requestKey: null }).then(result => {
            const flavors = [];
            for (var i = 0 ; i < result.length ; i++) {
                const flavor = result[i];
                flavors.push({label: flavor.name, value: flavor.name});                
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
        
        var correct = correctFlavors.sort().join(',') === selectedFlavors.sort().join(',');

        // checks if toppings are correct if the combo has toppings
        if (Object.hasOwn(combo.expand, 'toppings')) {
            correctToppings = combo.expand.toppings.map((e) => e.name);
            correct = correct && correctToppings.sort().join(',') === selectedToppings.sort().join(',');
        }

        // add answer to list
        answers.push({
            'correct': correct,
            'flavors': selectedFlavors,
            'toppings': selectedToppings
        });
        
        // checks if answers are correct
        if (correct) {
            setResult(<Correct></Correct>);
        } else {
            setResult(<Incorrect combo={combo}></Incorrect>);
        }

        setTimeout(() => {setResult(null)}, 3000);

        if (quizCombos.length - index != 1) {
            setIndex(index+1);
            setSelectedFlavors([]);
            setSelectedToppings([]);
        }
        
    }
    
    if (quizCombos === undefined | quizCombos.length == 0) { // quiz has not been initialized yet
        return ( 
            <div className="flex justify-center flex-col items-center h-full bg-slate-100">
            <div className="card w-fit bg-base-100 shadow-xl h-fit">
            <div className="flex card-body gap-5">
                <h1 className="card-title flex justify-center">How many questions?</h1>
                <div className="flex flex-row gap-2">
                    <p className="w-8">{numQuestions}</p>
                    <input type="range" step={1} min={1} max={allCombos.length} value={numQuestions} className="range" onChange={(e) => {
                        setNumQuestions(e.target.value);
                        console.log(e.target.value);
                        
                    }}/>
                </div>
                <button className="btn btn-primary w-full" onClick={() => initQuiz(numQuestions)}>Start Quiz</button >
            </div>
            </div>
            </div>
         );
    } else if (answers.length === quizCombos.length) { // quiz has been finished
        var correct = 0;
        for (var i = 0 ; i < answers.length ; i++) {
            if (answers[i].correct) {
                correct++;
            }
        }

        return (
            <div className="flex justify-center flex-col gap-2 items-center h-full bg-slate-100">
            <h1 className="text-9xl font-bold text-black">You got {correct} out of {quizCombos.length} correct!</h1>
            {result}
            </div>
        );
    } else { // quiz has been initialized, starting showing questions
        const combo = quizCombos[index];       
        
        // TODO change from primereact multiselect
        return (
            <div className="flex justify-center flex-col gap-2 items-center w-screen h-full bg-slate-100">
            <h1 className="text-xl text-black">{index+1} of {numQuestions}</h1>
            <div className="card w-screen bg-base-100 shadow-xl h-fit">
            <div className="flex card-body items-center gap-3">
                <h1 className="text-lg italic flex justify-center">What flavors are in:</h1>
                <h1 className="text-2xl font-bold flex justify-center">{combo.name}</h1>
                <div className="flex flex-row items-center gap-2">
                    <h1 className="text-sm flex justify-center">Flavors:</h1>
                    <MultiSelect className="text-sm" value={selectedFlavors} onChange={(e) => setSelectedFlavors(e.value)} options={options} filter
                        display="chip" placeholder="Select Flavors"/>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <h1 className="text-sm flex justify-center">Toppings:</h1>
                    <MultiSelect className="text-sm" value={selectedToppings} onChange={(e) => setSelectedToppings(e.value)} options={options} filter
                        display="chip" placeholder="Select Toppings"/>
                </div>
                <button className="btn btn-primary w-full" onClick={() => checkAnswers()}>Submit</button >
            </div>
            </div>
            {result}
            </div>
        );
    }
    
}
 
export default Quiz;