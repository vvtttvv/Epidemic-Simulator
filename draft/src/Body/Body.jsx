// Body component
import { useState } from 'react';
import axios from 'axios';
import styles from "./Body.module.css";
import Parameters from "./Parameters/Parameters";
import Map from "./Map/map";

function Body() {
    const [sliderValue, setSliderValue] = useState({
        InfectedRate: 1,
        param2: 1,
        param3: 100,
        param4: 1,
        param5: 1,
    });

    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState(null);

    const submitHandler = async (e) => {
        try {
            const response = await axios.post('/link', sliderValue); 
        } catch(error) {
            setError(error.message);
        }
    }

    return (
        <div className={styles.body}>
            <Parameters 
                sliderValue={sliderValue} 
                setSliderValue={setSliderValue}
                submitHandler={submitHandler}
            />
            <Map />
        </div>
    )
}

export default Body;