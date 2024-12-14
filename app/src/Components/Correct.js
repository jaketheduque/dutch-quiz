import { useEffect, useState } from "react";

const Correct = (params) => {
    return (
        <div className="flex justify-center items-center quiz-result w-screen h-screen bg-green-600 text-white">
            <div className="flex flex-col justify-center items-center gap-5">
                <h1 className="text-6xl">Correct!</h1>
                <button className="btn btn-lg btn-outline text-white" onClick={params.onClick}>
                    Continue
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default Correct;