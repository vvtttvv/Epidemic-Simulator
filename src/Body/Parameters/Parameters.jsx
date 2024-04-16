import styles from "./Parameters.module.css"
import Slider from "./Slider/Slider"
import {useEffect, useState, useRef} from 'react'
function Parameters({responseData, sliderValue, setSlidervalue, submitHandler}){
    const [selectedPreset, setSelectedPreset]=useState('');
    const infectionPresets=[
        {name:"Custom",infection_probability:'1', infection_radius:'1', movement_speed: '1', probability_of_dying:'10'},
        {name:"Covid-19",infection_probability:'50', infection_radius:'100', movement_speed: '50', probability_of_dying:'10'},
        {name:"EBOLA",infection_probability:'20', infection_radius:'1', movement_speed: '1', probability_of_dying:'10'},
        {name:"HIV",infection_probability:'10', infection_radius:'1', movement_speed: '1', probability_of_dying:'10'},
    ]
    const sliderNames = ["Movement speed","Number of individuals", "Number of iterations", "Infection Radius", "Infection probability", "Dying probability"];
    
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
            ...sliderValue,
            movement_speed: selectedPreset.movement_speed,
            infection_probability: selectedPreset.infection_probability,
            infection_radius: selectedPreset.infection_radius,
            probability_of_dying: selectedPreset.probability_of_dying,
            
            //num_individuals: selectedPreset.num_individuals,
            //num_iterations: selectedPreset.num_iterations,
        });
    }
    function selectObjectByName(name) {
        return infectionPresets.find(preset => preset.name === name);
    }
    function handleParam(e){
        if(e.target.value<parseInt(e.target.min) || e.target.value>parseInt(e.target.max)){
            return;
        }
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
                    <Slider minmax={['1','10']} onChange={handleParam} sliderValue={sliderValue.movement_speed} name="movement_speed" prop_name={sliderNames[0]}/>
                    <Slider minmax={['1','200']} onChange={handleParam} sliderValue={sliderValue.num_individuals} name="num_individuals" prop_name={sliderNames[1]}/>
                    <Slider minmax={['1','10000']} onChange={handleParam} sliderValue={sliderValue.num_iterations} name="num_iterations" prop_name={sliderNames[2]}/>
                    <Slider minmax={['1','100']} onChange={handleParam} sliderValue={sliderValue.infection_radius} name="infection_radius" prop_name={sliderNames[3]}/>
                    <Slider minmax={['1','100']} onChange={handleParam} sliderValue={sliderValue.infection_probability} name="infection_probability" prop_name={sliderNames[4]}/>                
                    <Slider minmax={['1','100']} onChange={handleParam} sliderValue={sliderValue.probability_of_dying} name="probability_of_dying" prop_name={sliderNames[5]}/>  
                </div>
            </div>
        </div>
    )
}
export default Parameters;
/*<Slider minmax={['1','100']} onChange={handleParam} sliderValue={sliderValue.Infectioness} name="Infectioness" prop_name={sliderNames[1]}/>
                    <Slider minmax={['1','100']} onChange={handleParam} sliderValue={sliderValue.Radius} name="Radius" prop_name={sliderNames[2]}/>
                    <Slider minmax={['1','100']} onChange={handleParam} sliderValue={sliderValue.Distancing} name="Distancing" prop_name={sliderNames[3]}/>
                    <Slider minmax={['1','100']} onChange={handleParam} sliderValue={sliderValue.Speed} name="Speed" prop_name={sliderNames[4]}/>
                    <Slider minmax={['1','100']} onChange={handleParam} sliderValue={sliderValue.Quarantine} name="Quarantine" prop_name={sliderNames[5]}/>
                    <Slider minmax={['1','100']} onChange={handleParam} sliderValue={sliderValue.Iterations} name="Iterations" prop_name={sliderNames[6]}/>*/   