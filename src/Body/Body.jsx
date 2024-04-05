import {useState} from 'react'
import axios from 'axios'
import styles from "./Body.module.css"
import Parameters from "./Parameters/Parameters";
import Map from "./Map/map";
function Body(  ){
    const [sliderValue, setSlidervalue]=useState({//name attribute of sliders has to be same as name of parameters(кастыль-надо будет исправить)
        Infectioness: 1,
        param2: 1,
        param3: 100,
        param4: 1,
        param5: 1,
    });
    
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState(null);
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

        try{//sending itself
            const response=await axios.post('/link', requiredDataString); 
        }catch(error){
            setError(error.message);
        }
    }
    return(
        <div className={styles.body}>
            <Parameters 
                sliderValue={sliderValue} 
                setSlidervalue={setSlidervalue}
                submitHandler={submitHandler}/>
            <Map/>
        </div>
    )
}
export default Body;