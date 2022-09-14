import React, { useState, useEffect } from 'react';
import CalendarData from "./CalenderData";
import Header from "../Header/Header"
import { useNavigate } from "react-router-dom";

function Room(props) {
    const navigate = useNavigate();
    useEffect(() => {
        if(!props.login){
            navigate("/")
        }
    },[])
    const [stageSelect, setStageSelect] = useState(false)
    function setTrue() {
        setStageSelect(true)
    }
    function setFalse() {
        setStageSelect(false)
    }
    return (
        <>
        {stageSelect && <div className="StageBack" onClick={() => setStageSelect(false)}></div>}
        <Header></Header>
        <CalendarData app={props.app} stageSelect={stageSelect} function1={setTrue} function2={setFalse} login={props.login} uid={props.uid}/>
        </>
    );
}

export default Room;