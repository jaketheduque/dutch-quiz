import { useEffect, useState } from "react";

const Correct = () => {
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
        <div className="flex justify-center items-center quiz-result w-screen h-screen bg-green-600 text-white">
            <div className="flex flex-col justify-center items-center gap-3">
                <progress className="progress w-full" value={timeElapsed} max="300"></progress>
                <h1 className="text-6xl">Correct!</h1>
            </div>
        </div>
    );
}

export default Correct;