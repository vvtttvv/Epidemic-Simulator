import React, { useState } from 'react';
import styles from "./Map.module.css";

function Map() {
    const [isPaused, setIsPaused] = useState(false);

    const handlePausePlayClick = () => {
        setIsPaused(!isPaused);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.canvas_wrapper}>
                <canvas className={styles.canvas}></canvas>
            </div>
            <div className={styles.start_buttons}>
                <div className={styles.pausePlayContainer}>
                    <button onClick={handlePausePlayClick} style={{ minWidth: '100px' }}>{isPaused ? 'Play' : 'Pause'}</button>
                </div>
                <button style={{ minWidth: '100px' }}>Reset</button>
            </div>
            <div className={styles.settings_buttons}>
                <button className={styles.simple_button}>Simple</button>
                <button className={styles.community_button}>Communities</button>
            </div>
        </div>
    );
}

export default Map;
