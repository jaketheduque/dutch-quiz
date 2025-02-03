import { useState, useEffect } from 'react';

export function useTimer(startingTime) {
    const [intervalID, setIntervalID] = useState();
    const [isRunning, setIsRunning] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(startingTime); // remaining time in milliseconds

    useEffect(() => {
        if (isRunning && timeRemaining > 0) {
            // reduce time remaining by 10 milliseconds every 10 milliseconds
            const id = setInterval(() => {            
                setTimeRemaining(timeRemaining - 50);
            }, 50);
            setIntervalID(id);
        }

        return () => clearInterval(intervalID);
    }, [isRunning, timeRemaining]);

    return [timeRemaining, isRunning, setIsRunning];
}