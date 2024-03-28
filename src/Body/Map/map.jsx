import styles from "./Map.module.css"
function Map(){
    return (
        <div className={styles.wrapper}>
            <div className={styles.canvas_wrapper}>
                <canvas className={styles.canvas}>

                </canvas>
            </div>
            <div className={styles.start_buttons}>
                <button>Pause</button>
                <button>Reset</button>
            </div>
            <div className={styles.settings_buttons}>
                <button className={styles.simple_button}>Simple</button>
                <button className={styles.community_button}>Communities</button>
            </div>
        </div>
    )
}
export default Map;