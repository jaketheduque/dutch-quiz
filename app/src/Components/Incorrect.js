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

    return (
        <div className="flex justify-center items-center quiz-result w-screen h-screen bg-red-600 text-white">
            <div className="flex flex-col justify-center items-center gap-3">
                <progress className="progress w-full" value={timeElapsed} max="300"></progress>
                <h1 className="text-8xl">Incorrect!</h1>
                <div>
                    <p>{combo.combo.name} is made with:</p>
                    {combo.combo.expand.flavors.map((e) => {
                        return <p>{e.name}</p>;
                    })}
                </div>
            </div>
        </div>
    );
}

export default Incorrect;