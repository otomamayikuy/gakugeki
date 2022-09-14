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
    alert("ログインしてください")
}
  useEffect(()=>{getStage()},[])
    return (
      <>
      <div className="reserve">
      <h1>ステージ予約</h1>
      <button type="button" onClick={props.login ? props.function1 : loginAlert}>ステージ予約</button>
      </div>
      {props.stageSelect &&
      <div className="stageSelectBack">
        <div className="stageSelect">
          <p>ステージタイトル</p><input value={stageTitle} onChange={(e) => setStageTitle(e.target.value)}></input><br/>
          <p>ステージ予約日</p><p className="explain">本日から１ヶ月以内の予約したい日をクリックしてください</p>
          <div className="selectCalender">
            <FullCalendar
              plugins={[dayGridPlugin,interactionPlugin]}
              initialView="dayGridMonth"
              locale="ja" // 日本語化
              selectable="true"
              dateClick={dateClick}
            />
          </div>
          <p>ステージ開始時間</p><p className="explain">ステージは１時間予約できます</p><br/>
          <select name="hour" onChange={(e) => setStageStartHour(Number(e.target.value))}>
            <option value="0">0時</option>
            <option value="1">1時</option>
            <option value="2">2時</option>
            <option value="3">3時</option>
            <option value="4">4時</option>
            <option value="5">5時</option>
            <option value="6">6時</option>
            <option value="7">7時</option>
            <option value="8">8時</option>
            <option value="9">9時</option>
            <option value="10">10時</option>
            <option value="11">11時</option>
            <option value="12">12時</option>
            <option value="13">13時</option>
            <option value="14">14時</option>
            <option value="15">15時</option>
            <option value="16">16時</option>
            <option value="17">17時</option>
            <option value="18">18時</option>
            <option value="19">19時</option>
            <option value="20">20時</option>
            <option value="21">21時</option>
            <option value="22">22時</option>
            <option value="23">23時</option>
          </select>
          <button onClick={submit}>決定</button>
        </div>
      </div>}
      <div className="calender">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        locale="ja" // 日本語化
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