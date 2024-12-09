import { useContext, useState, useEffect } from "react";
import PocketBaseContext from "./PocketBaseContext";

import FlavorCombo from "./FlavorCombo";

const FlavorCombosPage = () => {
    const pb = useContext(PocketBaseContext);

    const [search, setSearch] = useState("");
    const [combos, setCombos] = useState([]);

    useEffect(() => {
        pb.collection('flavor_combos').getFullList({ requestKey: null, expand: 'flavors'}).then(result => {
            setCombos(result);
        });
    }, []);

    return (
        <div class="flex flex-col p-4 gap-4 bg-slate-100 h-screen">
            <div class="flex bg-base-100 p-4 self-center rounded-xl">
                <div class="flex items-center p-1 pr-4">
                    <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input type="text" class="bg-base-100 outline-none" placeholder="Search flavor combos..." onChange={(e) => {setSearch(e.target.value)}}/>
            </div>
            <div class="flex flex-row flex-wrap gap-3 justify-center">
                {combos.filter((val) => val.name.includes(search.replace(" ", "_").toUpperCase())).map((val) => {
                    return <FlavorCombo combo={val} />
                })}
            </div>
        </div>
    );
}

export default FlavorCombosPage;