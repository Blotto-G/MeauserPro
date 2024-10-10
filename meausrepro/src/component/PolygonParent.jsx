import MainSideBar from './MainSideBar';
import {useState} from "react";
import MapComponent from "./MapComponent.jsx";

function PolygonParent() {
    const [moveToPolygon, setMoveToPolygon] = useState(null);

    return (
        <div>
            <MapComponent setMoveToPolygon={setMoveToPolygon} />
            <MainSideBar moveToPolygon={moveToPolygon} />
        </div>
    );
}

export default PolygonParent;