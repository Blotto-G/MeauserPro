import StackedLineChart from "../component/chart/StackedLineChart.jsx";
import MetrologySensor from "../component/chart/MetrologySensor.jsx";

function Report() {

    return (
        <div className={"d-flex"} style={{backgroundColor: '#f5f5f5', height: '100vh',
            paddingLeft: '330px'}}>
            <MetrologySensor />
            <div>
                {/*<StackedLineChart />*/}
            </div>

        </div>
    )
}

export default Report;