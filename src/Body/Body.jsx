import React, {useState} from 'react'
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
    const [websocket, setWebsocket]=useState(null);
    
    /*useEffect(() => {//function only to see if canvas works
        setResponseData([
            { id: 1, position: [10,10], infected: true, alive: false }, 
            
        ]);
    }, []);    */
    const submitHandler = async (e) => {
        let requiredDataString = JSON.stringify(sliderValue);
        console.log(requiredDataString);
        if (websocket) {
            websocket.close();
        }
        startWebSocket(requiredDataString); 
    };
    const startWebSocket = (requiredDataString) => {
        
        const webSocket = new WebSocket('ws://192.168.200.38:8080/'); // websocket endpoint on server
        console.log(webSocket)
        webSocket.onopen = () => {
            console.log('Connected to server');
            webSocket.send(requiredDataString);
        };
        webSocket.onmessage = (event) => {
            //console.log("Received:", event.data); 
            let parsed_data=JSON.parse(event.data);
            //  console.log(parsed_data)
            setResponseData(parsed_data);
        };
        webSocket.onerror = (error) => {
            console.error("Error:", error);
            setError(error.message);
            webSocket.close();
        };
        setWebsocket(webSocket);
    };
    
    return(
        <div className={styles.body}>
            <Parameters 
                responseData={responseData}
                sliderValue={sliderValue} 
                setSlidervalue={setSlidervalue}
                submitHandler={submitHandler}/>
            <Map responseData={responseData}/>
        </div>
    )
}
export default Body;