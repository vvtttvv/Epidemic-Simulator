import {useState, useEffect} from 'react'
import axios from 'axios'
import styles from "./Body.module.css"
import Parameters from "./Parameters/Parameters";
import Map from "./Map/map";
function Body(){
    const [sliderValue, setSlidervalue]=useState({
        Infectioness: 1,
        Radius: 1,
        Distancing: 1,
        Speed: 1,
        Quarantine: 1,
        Iterations: 1,
    });
    const [responseData, setResponseData] = useState('');
    const [error, setError] = useState(null);
    
    
    /*useEffect(() => {//function only to see if canvas works
        setResponseData([
            { id: 1, position_x: 10, position_y: 10, infected: true, dead: false }, 
            { id: 2, position_x: 20, position_y: 20, infected: false, dead: false },
            { id: 3, position_x: 30, position_y: 30, infected: true, dead: true }, 
            { id: 1, position_x: 60, position_y: 10, infected: true, dead: false }, 
            { id: 2, position_x: 40, position_y: 20, infected: false, dead: false },
            { id: 3, position_x: 330, position_y: 30, infected: true, dead: true }, 
            { id: 1, position_x: 120, position_y: 10, infected: true, dead: false }, 
            { id: 2, position_x: 450, position_y: 20, infected: false, dead: false },
            { id: 3, position_x: 320, position_y: 30, infected: true, dead: true }, 
            { id: 1, position_x: 190, position_y: 10, infected: true, dead: false }, 
            { id: 2, position_x: 270, position_y: 20, infected: false, dead: false },
            { id: 3, position_x: 500, position_y: 500, infected: true, dead: true }, 
            { id: 2, position_x: 270, position_y: 20, infected: false, dead: false },
            { id: 2, position_x: 270, position_y: 30, infected: false, dead: false },
            { id: 2, position_x: 270, position_y: 40, infected: false, dead: false },
            { id: 2, position_x: 270, position_y: 50, infected: false, dead: false },
            { id: 2, position_x: 270, position_y: 60, infected: false, dead: false },
            { id: 2, position_x: 270, position_y: 70, infected: false, dead: false },
            { id: 2, position_x: 270, position_y: 80, infected: false, dead: false },
            { id: 2, position_x: 270, position_y: 90, infected: false, dead: false },

        ]);
    }, []);*/

    // Define webSocket globally

    const submitHandler = async (e) => {
        let requiredDataString = JSON.stringify(sliderValue);
        console.log(requiredDataString);
        startWebSocket(requiredDataString); // Start SSE connection
    };

    
    const startWebSocket = (requiredDataString) => {
        const webSocket = new WebSocket('http://192.168.188.76:8080/'); // websopcket endpoint on server

        webSocket.onopen = () => {
            console.log('Connected to server');
            webSocket.send(requiredDataString);
        };

        webSocket.onmessage = (event) => {
            
            console.log("Received:", event.data);
            // Process the received data here
            setResponseData(event.data);
        };
        webSocket.onerror = (error) => {
            console.error("Error:", error);
            // Handle error
            setError(error.message);
            webSocket.close(); // Close the SSE connection
        };
    };
    

    return(
        <div className={styles.body}>
            <Parameters 
                //graphData={responseData}
                sliderValue={sliderValue} 
                setSlidervalue={setSlidervalue}
                submitHandler={submitHandler}/>
            <Map responseData={responseData}/>
        </div>
    )
}
export default Body;