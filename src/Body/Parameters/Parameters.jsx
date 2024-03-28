import styles from "./Parameters.module.css"
import Slider from "./Slider/Slider"
function Parameters(){
    return(
        <div className={styles.wrapper}>
            <div className={styles.graph}>
                <canvas className={styles.canvas}>
                </canvas>
            </div>
            <div className={styles.settings}>
                <div className={styles.buttons}>
                    <button>
                        Presets(change tag)
                    </button>
                    <button>Start</button>
                </div>
                <div className={styles.sliders}>
                    <Slider/>
                    <Slider/>
                    <Slider/>
                    <Slider/>
                    <Slider/>
                </div>
            </div>
        </div>
    )
}
export default Parameters;