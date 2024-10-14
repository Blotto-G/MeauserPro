import MetrologySensor from "../component/analysisPaper/MetrologySensor.jsx";
import Graph from "../component/analysisPaper/Graph.jsx";

function Report() {

    const graph = [
        {
            key: 1,
            name: '1번 그래프',
        },
        {
            key: 2,
            name: '2번 그래프'
        },
        {
            key: 3,
            name: '3번 그래프'
        },
        {
            key: 4,
            name: '4번 그래프'
        },
        {
            key: 5,
            name: '5번 그래프'
        },
    ]

    return (
        <div className={"d-flex"} style={{backgroundColor: '#f5f5f5', height: '100vh'}}>
            <MetrologySensor />
            <div className={'col'}>
                {graph.map(item => {
                    return <Graph key={item.key} data={item} />
                })}
            </div>

        </div>
    )
}

export default Report;