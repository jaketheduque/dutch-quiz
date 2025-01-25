import { useSearchParams } from "react-router-dom";

import Chill from "./quizzes/Chill.js";
import Competitive from "./quizzes/Competitive.js";

const Quiz = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const mode = searchParams.get('mode');

    if (mode === 'competitive') {
        return <Competitive />
    } else {
        return <Chill />
    }
}
 
export default Quiz;