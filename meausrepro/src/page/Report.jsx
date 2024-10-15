import MetrologySensor from "../component/analysisPaper/MetrologySensor.jsx";
import Graph from "../component/analysisPaper/Graph.jsx";

function Report() {

    const graph = [
        { key: 1, name: '1번 그래프'},
        { key: 2, name: '2번 그래프'},
        { key: 3, name: '3번 그래프'},
        { key: 4, name: '4번 그래프'},
        { key: 5, name: '5번 그래프'}
    ]

    return (
        <div className={"d-flex"} style={{backgroundColor: '#f5f5f5', height: '100vh'}}>
            <MetrologySensor />
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '75%'}}>
                {graph.map(item => (
                    <div key={item.key} style={{width: '30%', margin: '10px'}}>
                        <Graph data={item} />
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Report;