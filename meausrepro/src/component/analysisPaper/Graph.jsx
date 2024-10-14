function Graph(props) {
    return (
        <div>
            <div className={"container-box"} style={{width: '300%', height: '25%'}}>
                <h4>{props.data.name}</h4>
            </div>
        </div>
    )
}

export default Graph;