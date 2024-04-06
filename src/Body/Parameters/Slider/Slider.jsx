import styles from "./Slider.module.css"
function Slider(props){
    return(
        <div className={styles.slider_container}>
            <div className={styles.parameter_info}>{props.prop_name}</div>
            <input value={props.sliderValue} 
            type="range" 
            min="1" 
            max="100" 
            className={styles.slider} 
            onChange={props.onChange} 
            name={props.name}
            />
            <input 
            value={props.sliderValue} 
            type="text" 
            className={styles.textbox} 
            onChange={props.onChange} 
            name={props.prop_name}
            />
        </div>
    )
}
export default Slider;