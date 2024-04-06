import styles from "./Slider.module.css";

function Slider({name, value, onChange}) {
    return (
        <div className={styles.slider_container}>
            <div className={styles.parameter_info}>{name}</div>
            <input 
                value={value} 
                type="range" 
                min="1" 
                max="100" 
                className={styles.slider} 
                onChange={(e) => onChange(parseInt(e.target.value))} 
            />
            <input 
                value={value} 
                type="text" 
                className={styles.textbox} 
                onChange={(e) => onChange(parseInt(e.target.value))} 
            />
        </div>
    )
}

export default Slider;