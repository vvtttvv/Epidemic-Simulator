import styles from "./Parameters.module.css"
import Slider from "./Slider/Slider"
function Parameters(){
    function submitHandler(e){
        alert("subitted the form")
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
                    <Slider name="Infectioness"/>
                    <Slider name="Social distancing"/>
                    <Slider name="a"/>
                    <Slider name="b"/>
                    <Slider name="c"/>
                </div>
            </div>
        </div>
    )
}
export default Parameters;
