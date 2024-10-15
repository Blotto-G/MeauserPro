function Graph(props) {
    return (
        <div>
            <div className={"container-box"} style={{width: '100%', height: '300px'}}>
                <h4>{props.data.name}</h4>
            </div>
        </div>
    )
}

export default Graph;