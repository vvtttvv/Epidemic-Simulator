import React, {useState, useEffect, useCallback} from 'react'
import styles from "./Body.module.css"
import Parameters from "./Parameters/Parameters";
import Map from "./Map/map";

function Body(){
    const [sliderValue, setSlidervalue]=useState({
        Infectioness: '1',
        Radius: '1',
        Distancing: '1',
        Speed: '1',
        Quarantine: '1',
        Iterations: '1',
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
    
    const submitHandler = async (e) => {
        let requiredDataString = JSON.stringify(sliderValue);
        console.log(requiredDataString);
        startWebSocket(requiredDataString); 
    };
    const startWebSocket = (requiredDataString) => {
        
        const webSocket = new WebSocket('ws://192.168.200.38:8080'); // websocket endpoint on server
        
        webSocket.onopen = () => {
            console.log('Connected to server');
            webSocket.send(requiredDataString);
        };
        webSocket.onmessage = (event) => {
            
            console.log("Received:", event); 
            let parsed_data=JSON.parse(event.data);
            console.log(parsed_data)
            setResponseData(parsed_data);
        };
        webSocket.onerror = (error) => {
            console.error("Error:", error);
            setError(error.message);
            webSocket.close();
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