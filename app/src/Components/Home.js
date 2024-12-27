import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PocketBaseContext from "./PocketBaseContext";

import Navbar from "./Navbar.js"

const Home = () => {
    let navigate = useNavigate();

    return ( 
        <div className="flex justify-center flex-col gap-2 items-center">
        <Navbar />
        <button className="btn btn-block rounded-none" onClick={() => navigate('/quiz?mode=competitive')}>Competitive Mode</button>
        <button className="btn btn-block rounded-none" onClick={() => navigate('/quiz?mode=chill')}>Chill Mode</button>
        </div>
     );
}
 
export default Home;