import React, { useState, useEffect }from "react"
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./CalenderData.css";
import { getFirestore, doc, setDoc, collection, getDocs} from "firebase/firestore";

const CalendarData = (props) => {
  const now = new Date()
  const db = getFirestore(props.app);
  const [stageTitle, setStageTitle] = useState("")
  const [stageStartYear, setStageStartYear] = useState(now.getFullYear())
  const [stageStartMonth, setStageStartMonth] = useState(now.getMonth())
  const [stageStartDate, setStageStartDate] = useState(now.getDate())
  const [stageStartHour, setStageStartHour] = useState(0)
  const [stageStartMinute, setStageStartMinute] = useState(0)
  const [stage, setStage] = useState([])
  async function getStage() {
    const querySnapshot = await getDocs(collection(db, "stages"));
    const newData=[]
    querySnapshot.forEach((doc) => {
      if(doc.data()) {
        newData.push(doc.data())
      }
    });
    setStage([...newData])
    console.log(newData)
  }
  const NextMonth = new Date(now.getFullYear(),now.getMonth()+1,now.getDate())
  const stageNumber=stage.length
  async function submit() {
    let flag=true
    if(stageTitle !== ""){
      console.log(stageTitle)
    }else{
      flag=false
    }
    if((NextMonth>new Date(stageStartYear,stageStartMonth,stageStartDate,stageStartHour,stageStartMinute)) && (now<new Date(stageStartYear,stageStartMonth,stageStartDate,stageStartHour,stageStartMinute))){
      console.log(new Date(stageStartYear,stageStartMonth,stageStartDate,stageStartHour,stageStartMinute))
      console.log(NextMonth)
    }else{
      flag=false
    }
    if(flag===true){
      const DocumentRef = doc(db, "stages", String(stageNumber+1));
      console.log(DocumentRef)
      await setDoc(DocumentRef,{title:stageTitle, start:String(stageStartYear)+"-"+(stageStartMonth+1<10?"0"+String(stageStartMonth+1):String(stageStartMonth+1))+"-"+(stageStartDate<10?"0"+String(stageStartDate):String(stageStartDate))+"T"+(stageStartHour<10?"0"+String(stageStartHour):String(stageStartHour))+":"+(stageStartMinute<10?"0"+String(stageStartMinute):String(stageStartMinute))+":00", uid:props.uid});
      setStageTitle("");
      setStageStartYear(now.getFullYear());
      setStageStartMonth(now.getMonth());
      setStageStartDate(now.getDate());
      setStageStartHour(now.getHours());
      setStageStartMinute(0);
      getStage()
      props.function2()
    }
  }
  function dateClick(info) {
    let date = info.dateStr.split("-")
    setStageStartYear(Number(date[0]))
    setStageStartMonth(Number(date[1])-1)
    setStageStartDate(Number(date[2]))
  }
  function loginAlert(){
    alert("??????????????????????????????")
}
  useEffect(()=>{getStage()},[])
    return (
      <>
      <div className="reserve">
      <h1>??????????????????</h1>
      <button type="button" onClick={props.login ? props.function1 : loginAlert}>??????????????????</button>
      </div>
      {props.stageSelect &&
      <div className="stageSelectBack">
        <div className="stageSelect">
          <p>????????????????????????</p><input value={stageTitle} onChange={(e) => setStageTitle(e.target.value)}></input><br/>
          <p>?????????????????????</p><p className="explain">?????????????????????????????????????????????????????????????????????????????????</p>
          <div className="selectCalender">
            <FullCalendar
              plugins={[dayGridPlugin,interactionPlugin]}
              initialView="dayGridMonth"
              locale="ja" // ????????????
              selectable="true"
              dateClick={dateClick}
            />
          </div>
          <p>????????????????????????</p><p className="explain">??????????????????????????????????????????</p><br/>
          <select name="hour" onChange={(e) => setStageStartHour(Number(e.target.value))}>
            <option value="0">0???</option>
            <option value="1">1???</option>
            <option value="2">2???</option>
            <option value="3">3???</option>
            <option value="4">4???</option>
            <option value="5">5???</option>
            <option value="6">6???</option>
            <option value="7">7???</option>
            <option value="8">8???</option>
            <option value="9">9???</option>
            <option value="10">10???</option>
            <option value="11">11???</option>
            <option value="12">12???</option>
            <option value="13">13???</option>
            <option value="14">14???</option>
            <option value="15">15???</option>
            <option value="16">16???</option>
            <option value="17">17???</option>
            <option value="18">18???</option>
            <option value="19">19???</option>
            <option value="20">20???</option>
            <option value="21">21???</option>
            <option value="22">22???</option>
            <option value="23">23???</option>
          </select>
          <button onClick={submit}>??????</button>
        </div>
      </div>}
      <div className="calender">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        locale="ja" // ????????????
        events={stage}
        headerToolbar={{
          left: "prev,next,today",
          center: "title",
          right: "dayGridMonth,timeGridWeek",
        }}
      />
      </div>
      </>
    );
  };
  export default CalendarData;