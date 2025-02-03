export function compareCombos(combo1, combo2) {
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
export function generateWrongAnswers(combo, allCombos) {
    var similarCombos = [...new Set(allCombos)];
    similarCombos.sort((a, b) => compareCombos(combo, a) - compareCombos(combo, b));

    return similarCombos.slice(0, 3);
}

export function generateResults(quizQuestions, answers) {
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

    return {
        "numCorrect" : numCorrect,
        "results" : results
    };
}