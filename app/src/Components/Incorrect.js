import { useEffect, useState } from "react";

const Incorrect = (params) => {
    if (!Object.hasOwn(params.combo.expand, 'toppings')) {
        params.combo.expand.toppings = [];
    }

    return (
        <div className="flex justify-center items-center quiz-result w-screen h-screen bg-red-600 text-white">
            <div className="flex flex-col justify-center items-center gap-3">
                <h1 className="text-6xl">Incorrect!</h1>
                <div className="flex flex-col justify-center items-center gap-1">
                    <p className="text-lg italic">{params.combo.name} is made with:</p>
                    <ul className="list-disc">
                        {params.combo.expand.flavors.map((e) => {
                            return <li>{e.name}</li>;
                        })}
                        {params.combo.expand.toppings.map((e) => {
                            return <li>{e.name} (Topping)</li>;
                        })}
                    </ul>
                </div>
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

export default Incorrect;