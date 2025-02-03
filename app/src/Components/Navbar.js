import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import PocketBaseContext from "./PocketBaseContext";

const Navbar = () => {
    const pb = useContext(PocketBaseContext);
    const isAuthenticated = pb.authStore.isValid;

    const navigate = useNavigate()

    function signOut() {
        pb.authStore.clear();
        window.location.reload();
    }

    // var avatarURL;
    // // get avatar image // TODO maybe implement this with external storage?
    // if (isAuthenticated) {
    //     avatarURL = pb.files.getURL(pb.authStore.record, pb.authStore.record.avatar, {'thumb': '100x100'});
    // }    

    return (
        <div className="navbar p-5">
            <div className="navbar-start">
                
            </div>
            <div className="navbar-center">
                <a className="btn btn-ghost text-2xl">Dutch Quiz</a>
            </div>
            <div className="navbar-end">
                {
                    isAuthenticated ?
                    <div className="dropdown dropdown-end">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8" tabIndex={0}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        <div
                            tabIndex={0}
                            className="dropdown-content card card-compact bg-primary text-primary-content w-fit p-2 shadow">
                            <div className="card-body">
                                {/* <img src={avatarURL} alt="Avatar Image" /> */}
                                <h3 className="card-title">{pb.authStore.record.displayName}</h3>
                                <button className="btn btn-outline btn-sm" onClick={signOut}>Sign Out</button>
                            </div>
                        </div>
                    </div>
                    :
                    <button className="btn btn-outline btn-sm" onClick={() => navigate("/login")}>Sign In</button>
                }
            </div>
            </div>
    );
}

export default Navbar;