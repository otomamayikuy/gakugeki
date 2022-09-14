import React, { useState, useEffect } from 'react';
import NewRoom from "./newRoom";
import Header from "../Header/Header"
import "./Room.css"
import { useNavigate } from "react-router-dom";


function Room(props) {
    const navigate = useNavigate();
    useEffect(() => {
        if(!props.login){
            navigate("/")
        }
    },[])
    const [roomSelect, setRoomSelect] = useState(false)
    function setTrue() {
        setRoomSelect(true)
      }
      function setFalse() {
        setRoomSelect(false)
    }
    return (
        <>
        {roomSelect && <div className="back" onClick={() => setRoomSelect(false)}></div>}
        <Header></Header>
        <NewRoom app={props.app} roomSelect={roomSelect} function1={setTrue} function2={setFalse} login={props.login} uid={props.uid}/>
        </>
    );
}

export default Room;