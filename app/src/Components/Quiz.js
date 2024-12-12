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
    const [quizCombos, setQuizCombos] = useState([]);
    const [options, setOptions] = useState([]);
    const [selectedFlavors, setSelectedFlavors] = useState([]);
    const [result, setResult] = useState(null);

    useEffect(() => {
        pb.collection('flavor_combos').getFullList({ requestKey: null, expand: 'flavors'}).then(result => {
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
        
        // checks if answers are correct
        if (correctFlavors.sort().join(',') === selectedFlavors.sort().join(',')) {
            setResult(<Correct></Correct>);
        } else {
            setResult(<Incorrect combo={combo}></Incorrect>);
        }

        setTimeout(() => {setResult(null)}, 3000);

        if (quizCombos.length - index == 1) {
            console.log("finished");
        } else {
            setIndex(index+1);
            setSelectedFlavors([]);
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
                    <input type="range" step={1} min={0} max={allCombos.length} value={numQuestions} className="range" onChange={(e) => {
                        setNumQuestions(e.target.value);
                        console.log(e.target.value);
                        
                    }}/>
                </div>
                <button className="btn btn-primary w-full" onClick={() => initQuiz(numQuestions)}>Start Quiz</button >
            </div>
            </div>
            </div>
         );
    } else { // quiz has been initialized
        const combo = quizCombos[index];        
        
        return (
            <div className="flex justify-center flex-col gap-2 items-center h-full bg-slate-100">
            <div className="card w-100 bg-base-100 shadow-xl h-80">
            <div className="card-body">
                <h1 className="text-xl italic flex justify-center">What flavors are in:</h1>
                <h1 className="text-5xl font-bold flex justify-center">{combo.name}</h1>
                <MultiSelect value={selectedFlavors} onChange={(e) => setSelectedFlavors(e.value)} options={options} filter
                    placeholder="Select Flavors"/>
                <button className="btn btn-primary w-full" onClick={() => checkAnswers()}>Submit</button >
            </div>
            </div>
            {result}
            </div>
        );
    }
    
}
 
export default Quiz;