import {useState, useEffect} from 'react'
import axios from 'axios'
import styles from "./Body.module.css"
import Parameters from "./Parameters/Parameters";
import Map from "./Map/map";
function Body(  ){
    const [sliderValue, setSlidervalue]=useState({
        Infectioness: 1,
        Radius: 1,
        Distancing: 1,
        Speed: 1,
        Quarantine: 1,
    });
    const [responseData, setResponseData] = useState();
    const [error, setError] = useState(null);
    
    
    useEffect(() => {//function only to see if canvas works
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
        ]);
    }, []);

    const submitHandler=async (e)=>{
        let sliderData=[];
        let requiredDataString='{';
        for (let key in sliderValue) {//modify object to array
            sliderData.push(key);
            sliderData.push(sliderValue[key]);
        }
       
        for(let el in sliderData){//save as required string
            requiredDataString+='<'+sliderData[el]+'>'+',';
        }
        requiredDataString+='}';

        console.log(sliderData);
        console.log(requiredDataString);

        fetchData(requiredDataString);
    }
    const fetchData = async (requiredDataString) => {
        try {
            const response = await axios.post('http://192.168.1.7:8080', requiredDataString);
            setResponseData(response.data);
        } catch (error) {
            setError(error.message);
        }
    };
    
    
   /* useEffect(() => {
        const intervalId = setInterval(() => {
            fetchData();
        }, 100);
        return () => clearInterval(intervalId);
    }, []);*/ //cchoose a proper dependency array

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