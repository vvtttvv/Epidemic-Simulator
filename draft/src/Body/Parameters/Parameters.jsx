import styles from "./Parameters.module.css";
import Slider from "./Slider/Slider";

function Parameters({sliderValue, setSliderValue, submitHandler}) {
    
    function handleParam(name, value) {
        if (value > 100 || value < 0) return;
        setSliderValue({...sliderValue, [name]: value});
    }
    
    const sliderNames = ["Infections", "Radius of inf", "Hz", "Lol gg", "We done!"];

    return (
        <div className={styles.wrapper}>
            <div className={styles.graph}>
                <canvas className={styles.canvas}></canvas>
            </div>
            <div className={styles.settings}>
                <div className={styles.buttons}>
                    <select>
                        Presets (change tag)
                        <option value="covid">covid</option>
                        <option value="HIV">HIV</option>
                    </select>
                    <button onClick={submitHandler}>Start</button>
                </div>
                <div className={styles.sliders}>
                    {sliderNames.map((name, index) => (
                        <Slider 
                            key={index} 
                            name={name} 
                            value={sliderValue[name]} 
                            onChange={(value) => handleParam(name, value)} 
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Parameters;