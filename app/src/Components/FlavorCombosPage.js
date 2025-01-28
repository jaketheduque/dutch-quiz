import { useContext, useState, useEffect } from "react";
import PocketBaseContext from "./PocketBaseContext";

import FlavorCombo from "./FlavorCombo";

const FlavorCombosPage = () => {
    const pb = useContext(PocketBaseContext);

    const [search, setSearch] = useState("");
    const [combos, setCombos] = useState([]);

    useEffect(() => {
        pb.collection('flavor_combos').getFullList({ requestKey: null, expand: 'ingredients'}).then(result => {
            setCombos(result);
        });
    }, []);

    return (
        <div className="flex flex-col p-4 gap-4 min-h-screen h-max">
            <label className="input input-bordered flex items-center gap-2">
            <input type="text" className="grow" placeholder="Search" onChange={(e) => setSearch(e.target.value)}/>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70">
                <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd" />
            </svg>
            </label>
            <div className="flex flex-row flex-wrap gap-5 justify-center">
                {combos.sort((a, b) => {return a.name.localeCompare(b.name)}).filter((val) => val.name.startsWith(search.toUpperCase())).map((val) => {
                    return <FlavorCombo combo={val} />
                })}
            </div>
        </div>
    );
}

export default FlavorCombosPage;