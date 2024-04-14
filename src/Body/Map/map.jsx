import React, { useState , useRef, useEffect} from 'react';
import styles from "./Map.module.css";

function Map({responseData}) {
    const [isPaused, setIsPaused] = useState(true);
    const canvasRef=useRef(null);
    let scale=1;
    let displayWidth=500;
    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = displayWidth * scale;
        canvas.height = displayWidth * scale;
        const context = canvas.getContext('2d')
        for(let el in responseData){
            //set the position
            context.beginPath();
            context.arc(responseData[el].position[0], responseData[el].position[1], Math.round(Math.sqrt( (canvas.width*canvas.height/100) / (8* Math.PI))), 0, 2*Math.PI); //size_of_individuals will be Math.round(Math.sqrt( (canvas.width*canvas.height/numberofparticles) / (coefficient* Math.PI)))
            //console.log("xpoz: "+responseData[el].position[0]+ " y_poz:"+responseData[el].position[1])
            if(responseData[el].is_infected===true){//conditions to set the color
                context.fillStyle = 'red';
            }else if(responseData[el].alive===true){
                context.fillStyle = 'blue';
            }else{
                context.fillStyle = 'gray';
            }
            context.fill();
            context.closePath();
        }
        
        let animationFrameId;
        const render = ()=>{
            draw();
            if(!isPaused)animationFrameId=requestAnimationFrame(render);
        }
        return()=>{
            cancelAnimationFrame(animationFrameId);
        }
    }, [responseData, isPaused]);
    
    const handlePausePlayClick = () => {
        setIsPaused(!isPaused);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.canvas_wrapper}>
                <canvas className={styles.canvas} ref={canvasRef}></canvas>
            </div>
            <div className={styles.start_buttons}>
                <div className={styles.pausePlayContainer}>
                    <button onClick={handlePausePlayClick} style={{ minWidth: '100px' }}>{isPaused ?'Pause' : 'Play'}</button>
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
