import { useContext, useState } from "react";
import PocketBaseContext from "./PocketBaseContext";
import {Link} from "react-router-dom";

const Register = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [errorText, setErrorText] = useState("");

    const pb = useContext(PocketBaseContext);

    async function handleSubmit(e) {
        e.preventDefault();
        if (password.length < 8) {
            setErrorText("Password needs to be at least 8 characters!");
            return;
        }
        if (password != passwordConfirm) {
            setErrorText("Passwords do not match!");
            return;
        }

        try {
            const data = {
                "password": password,
                "passwordConfirm": passwordConfirm,
                "name": name,
                "email": email,
                "emailVisibility": false,
            };

            const record = await pb.collection('users').create(data);
        } catch (error) {
            console.error(error);
            setErrorText("Error was encountered!")
        }
    }

    return (  
        <div className="flex justify-center flex-col gap-2 items-center h-screen">
            <div className="card w-96 bg-base-100 shadow-xl h-96">
                <div className="card-body">
                    <h1 className="card-title flex justify-center">Register</h1>
                    <form className="h-full flex flex-col justify-between gap-5" onSubmit={handleSubmit}>
                        <div className="h-full flex flex-col justify-center gap-3">
                            <label className="input input-bordered flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                                <input required type="email" className="grow" placeholder="Email" onChange={(e) => {setEmail(e.target.value)}}/>
                            </label>
                            <label className="input input-bordered flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                                <input required type="text" className="grow" placeholder="Name" onChange={(e) => {setName(e.target.value)}}/>
                            </label>
                            <label className="input input-bordered flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                                <input required type="password" className="grow" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                            </label>
                            <label className="input input-bordered flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                                <input required type="password" className="grow" placeholder="Confirm password" onChange={(e) => setPasswordConfirm(e.target.value)}/>
                            </label>
                        </div>
                        <div className="card-actions justify-center">
                        <input type="submit" className="btn btn-primary w-full" value="Register" />
                        </div>
                    </form>
                    {/** Here an error text will be shown */}
                    <p className="text-red-500"></p>
                </div>
            </div>
            <Link className="text-neutral-500 text-md" to="/login">Already have an account?</Link>
        </div>
    );
}
 
export default Register;