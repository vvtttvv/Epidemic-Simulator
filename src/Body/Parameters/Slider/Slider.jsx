import {useState} from 'react'
import styles from "./Slider.module.css"
function Slider(props){
    const [sliderValue, setSlidervalue]=useState(0);
    function handleChange(e){
        if(e.target.value>100 || e.target.value<0){
            return;
        }
        setSlidervalue(e.target.value);
    
    }
    return(
        <div className={styles.slider_container}>
            <div className={styles.parameter_info}>{props.name}</div>
            <input value={sliderValue} type="range" min="1" max="100" 
            className={styles.slider} onChange={handleChange}/>
            <input value={sliderValue} type="text" className={styles.textbox} onChange={handleChange}/>
        </div>
    )
}
export default Slider;