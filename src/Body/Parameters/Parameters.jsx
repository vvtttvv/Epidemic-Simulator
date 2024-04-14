import styles from "./Parameters.module.css"
import Slider from "./Slider/Slider"
import {useEffect, useState, useRef} from 'react'
function Parameters({responseData, sliderValue, setSlidervalue, submitHandler}){
    const [selectedPreset, setSelectedPreset]=useState('');
    const infectionPresets=[
        {name:"Custom",Infectioness:'1', Radius:'1', Distancing:'1', Speed: '1',Quarantine: '1', Iterations:'1'},
        {name:"Covid-19",Infectioness:'50', Radius:'100', Distancing:'30', Speed: '50',Quarantine: '14', Iterations:'1'},
        {name:"EBOLA",Infectioness:'20', Radius:'1', Distancing:'23', Speed: '1',Quarantine: '7', Iterations:'1'},
        {name:"HIV",Infectioness:'10', Radius:'1', Distancing:'15', Speed: '1',Quarantine: '28', Iterations:'100'},
    ]
    const sliderNames = ["Infectioness", "Radius of infection", "Social distancing", "Speed", "Quarantine time", "Iterations"];
    
    /////canvas handling
    /*const canvasRef=useRef(null);
    const canvas=canvasRef.current;
    const ctx=canvas.getContext("2d");
    let x_values=[];
    let count_dead=[];
    let count_infected=[];
    let count_healthy=[]
    let counter=1
    useEffect(()=>{
        //establishing the data arrays
        x_values=[];
        let alive_counter=0;
        let dead_counter=0;
        let infected_counter=0;
        for(let i=0; i<responseData.length; i++){
            if(alive) alive_counter++;//not an optimal approach for now. change to substraction if 'number of individuals' appear
            if(infected) infected_counter++;
            if(!infected && !alive) dead_counter++; 
        }
        count_dead.push(dead_counter);
        count_healthy.push(alive_counter);
        count_infected.push(infected_counter);
        let interval=canvas.displayWidth/counter;
        for(let i=0;i<counter; i++){
            x_values.push(interval*i);
        }
        //first make a shape  for dead
        //make a shape for infected
        //make a shape for alive
        counter++;
    },[responseData]);
    */

    //////////

    function handlePresetsOnChange(e){
        setSelectedPreset(e.target.value)
        const selectedPreset = selectObjectByName(e.target.value);
        setSlidervalue({
            Infectioness: selectedPreset.Infectioness,
            Radius: selectedPreset.Radius,
            Distancing: selectedPreset.Distancing,
            Speed: selectedPreset.Speed,
            Quarantine: selectedPreset.Quarantine,
            Iterations: selectedPreset.Iterations,
        });
    }
    function selectObjectByName(name) {
        return infectionPresets.find(preset => preset.name === name);
    }
    function handleParam(e){
        if(e.target.value>100 || e.target.value<0)return;
        setSlidervalue({...sliderValue,[e.target.name]: e.target.value,});
        setSelectedPreset('Custom');
    }
   
    
    return(
        <div className={styles.wrapper}>
            <div className={styles.graph}>
                <canvas className={styles.canvas} >
                </canvas>
            </div>
            <div className={styles.settings}>
                <div className={styles.buttons}>
                    <p>Presets</p>
                    <select onChange={handlePresetsOnChange} value={selectedPreset}>
                        <option value="Custom">Custom</option>
                        <option value="Covid-19">Covid-19</option>
                        <option value="EBOLA">EBOLA</option>
                        <option value="HIV">HIV</option>
                    </select>
                    <button onClick={submitHandler}>Start</button>
                </div>
                <div className={styles.sliders}>
                    <Slider onChange={handleParam} sliderValue={sliderValue.Infectioness} name="Infectioness" prop_name={sliderNames[0]}/>
                    <Slider onChange={handleParam} sliderValue={sliderValue.Radius} name="Radius" prop_name={sliderNames[1]}/>
                    <Slider onChange={handleParam} sliderValue={sliderValue.Distancing} name="Distancing" prop_name={sliderNames[2]}/>
                    <Slider onChange={handleParam} sliderValue={sliderValue.Speed} name="Speed" prop_name={sliderNames[3]}/>
                    <Slider onChange={handleParam} sliderValue={sliderValue.Quarantine} name="Quarantine" prop_name={sliderNames[4]}/>
                    <Slider onChange={handleParam} sliderValue={sliderValue.Iterations} name="Iterations" prop_name={sliderNames[5]}/>
                </div>
            </div>
        </div>
    )
}
export default Parameters;
