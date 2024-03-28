import styles from "./Body.module.css"
import Parameters from "./Parameters/Parameters";
import Map from "./Map/map";
function Body(){
    return(
        <div className={styles.body}>
            <Parameters/>
            <Map/>
        </div>
    )
}
export default Body;