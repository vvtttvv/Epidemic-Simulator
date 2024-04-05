
import styles from "./Parameters.module.css"
import Slider from "./Slider/Slider"
function Parameters({sliderValue, setSlidervalue, submitHandler}){
    
    function handleParam(e){
        if(e.target.value>100 || e.target.value<0)return;
        setSlidervalue({...sliderValue,[e.target.name]: e.target.value,});
    }
    
    return(
        <div className={styles.wrapper}>
            <div className={styles.graph}>
                <canvas className={styles.canvas}>
                </canvas>
            </div>
            <div className={styles.settings}>
                <div className={styles.buttons}>
                    <select>
                        Presets(change tag)
                        <option value="covid">covid</option>
                        <option value="HIV">HIV</option>
                        <option value="covid">covid</option>
                        <option value="HIV">HIV</option>
                        <option value="covid">covid</option>
                        <option value="HIV">HIV</option>
                        <option value="covid">covid</option>
                        <option value="HIV">HIV</option>
                        <option value="covid">covid</option>
                        <option value="HIV">HIV</option>
                    </select>
                    <button onClick={submitHandler}>Start</button>
                </div>
                <div className={styles.sliders}>
                    <Slider onChange={handleParam} sliderValue={sliderValue.Infectioness} name="Infectioness"/>
                    <Slider onChange={handleParam} sliderValue={sliderValue.param2} name="param2"/>
                    <Slider onChange={handleParam} sliderValue={sliderValue.param3} name="param3"/>
                    <Slider onChange={handleParam} sliderValue={sliderValue.param4} name="param4"/>
                    <Slider onChange={handleParam} sliderValue={sliderValue.param5} name="param5"/>
                </div>
            </div>
        </div>
    )
}
export default Parameters;
