import { useEffect, useState } from "react";

const Incorrect = (combo) => {
    const [timeElapsed, setTimeElapsed] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimeElapsed((timeElapsed) => {
                if (timeElapsed >= 5000) {
                    clearInterval(intervalId);
                    return 5000;
                } else {
                    return timeElapsed + 1;
                }
            });
        }, 10);
        return () => clearInterval(intervalId);
    }, []);

    if (!Object.hasOwn(combo.combo.expand, 'toppings')) {
        combo.combo.expand.toppings = [];
    }

    return (
        <div className="flex justify-center items-center quiz-result w-screen h-screen bg-red-600 text-white">
            <div className="flex flex-col justify-center items-center gap-3">
                <progress className="progress w-full" value={timeElapsed} max="300"></progress>
                <h1 className="text-6xl">Incorrect!</h1>
                <div className="flex flex-col justify-center items-center gap-1">
                    <p className="text-lg italic">{combo.combo.name} is made with:</p>
                    <ul class="list-disc">
                        {combo.combo.expand.flavors.map((e) => {
                            return <li>{e.name}</li>;
                        })}
                        {combo.combo.expand.toppings.map((e) => {
                            return <li>{e.name} (Topping)</li>;
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Incorrect;