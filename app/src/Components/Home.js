import { useContext, useState } from "react";
import PocketBaseContext from "./PocketBaseContext";

const Home = () => {
    const pb = useContext(PocketBaseContext);

    return ( 
        <div className="flex justify-center flex-col gap-2 items-center h-full bg-slate-100">
        <div className="card w-96 bg-base-100 shadow-xl h-80">
        <div className="card-body">
            <h1 className="card-title flex justify-center">Welcome!</h1>
            <form className="h-full flex flex-col justify-between gap-5">
                
            </form>
        </div>
        </div>
        </div>
     );
}
 
export default Home;