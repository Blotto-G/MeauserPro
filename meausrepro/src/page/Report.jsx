import MetrologySensor from "../component/analysisPaper/MetrologySensor.jsx";
import Graph from "../component/analysisPaper/Graph.jsx";

function Report() {

    return (
        <div className={"d-flex"} style={{backgroundColor: '#f5f5f5', height: '100vh',
        paddingLeft: '330px'}}>
            <MetrologySensor />
            <div>
                <Graph />
            </div>

        </div>
    )
}

export default Report;