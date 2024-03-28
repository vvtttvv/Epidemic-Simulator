import styles from "./Slider.module.css"
function Slider(){
    return(
        <div className={styles.slider_container}>
            <div className={styles.parameter_info}>parameter 1</div>
            <input type="range" min="1" max="100" 
            className={styles.slider}/>
            <input type="text" className={styles.textbox} placeholder="hello"/>
        </div>
    )
}
export default Slider;