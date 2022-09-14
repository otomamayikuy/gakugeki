import React, { useState, useEffect } from 'react';
import { getFirestore, doc, setDoc, collection, getDocs} from "firebase/firestore";

const NewRoom = (props) => {
    const db = getFirestore(props.app);
    const [roomTitle, setRoomTitle] = useState("")
    const [roomMenber, setRoomMenber] = useState(0)
    const [roomStartHour, setRoomStartHour] = useState(0)
    const [roomStartMinute, setRoomStartMinute] = useState(0)
    const [roomFinishHour, setRoomFinishHour] = useState(0)
    const [roomFinishMinute, setRoomFinishMinute] = useState(0)
    const [room, setRoom] = useState([])
    async function getRoom() {
        const querySnapshot = await getDocs(collection(db, "rooms"));
        const newData=[]
        querySnapshot.forEach((doc) => {
            if(doc.data()) {
                newData.push(doc.data())
            }
        });
        setRoom([...newData])
    }
    
    const roomNumber=room.length
    async function submit() {
        let flag=true
        if(roomTitle !== ""){
            console.log(roomTitle)
        }else{
            flag=false
        }
        if(roomMenber > 0 && Number.isInteger(roomMenber)){
            console.log(roomMenber)
        }else{
            flag=false
        }
        if(0 <= roomStartHour && 24>=roomStartHour && Number.isInteger(roomStartHour) && 0 <= roomStartMinute && 60>=roomStartMinute && Number.isInteger(roomStartMinute)){
            console.log(roomStartHour+":"+roomStartMinute)
        }else{
            flag=false
        }
        if(0 <= roomFinishHour && 24>=roomFinishHour && Number.isInteger(roomFinishHour) && 0 <= roomFinishMinute && 60>=roomFinishMinute && Number.isInteger(roomFinishMinute)){
            console.log(roomFinishHour+":"+roomFinishMinute)
        }else{
            flag=false
        }
        if(flag===true){
            props.function2()
            const DocumentRef = doc(db, "rooms", String(roomNumber));
            console.log(DocumentRef)
            await setDoc(DocumentRef,{title:roomTitle, menber:roomMenber, startHour:roomStartHour, startMinute:roomStartMinute, finishHour:roomFinishHour, finishMinute:roomFinishMinute, uid:props.uid});
            setRoomTitle("");
            setRoomMenber(0);
            setRoomStartHour(0);
            setRoomStartMinute(0);
            setRoomFinishHour(0);
            setRoomFinishMinute(0);
            getRoom()
        }
    }
    function loginAlert(){
        alert("ログインしてください")
    }
    useEffect(()=>{getRoom()},[])
    const hour=[]
    for(let i = 0; i < 24; i++ ){
        hour.push(i)
    }
    const minute=[]
    for(let i = 0; i < 60; i+=15 ){
        minute.push(i)
    }
    return (
        <div className="room">
        <h1>ルーム一覧・作成ページ</h1>
        <h2>オープンルーム<p>　みんなで好きなことを語ろう！　</p><button type="button" onClick={props.login ? props.function1 : loginAlert}>新規作成</button></h2>
        {props.roomSelect &&
        <div className="roomSelectBack">
            <div className="roomSelect">
                <p>ルームタイトル</p><input value={roomTitle} onChange={(e) => setRoomTitle(e.target.value)}></input><br/>
                <p>ルーム最低人数</p><input value={roomMenber!==0 ? roomMenber : ""} onChange={(e) => ((Number(e.target.value)||e.target.value==="") && setRoomMenber(e.target.value==="" ? 0 : Number(e.target.value)))}></input><br/>
                <p>ルーム開始時刻</p>
                <select onChange={(e) => setRoomStartHour(Number(e.target.value))}>
                    {hour.map(arrayItem => <option key={arrayItem} value={arrayItem}>{arrayItem}時</option>)}
                </select>
                <select onChange={(e) => setRoomStartMinute(Number(e.target.value))}>
                    {minute.map(arrayItem => <option key={arrayItem} value={arrayItem}>{arrayItem}分</option>)}
                </select>
                <p>ルーム終了時刻</p><select onChange={(e) => setRoomFinishHour(Number(e.target.value))}>
                    {hour.map(arrayItem => <option key={arrayItem} value={arrayItem}>{arrayItem}時</option>)}
                </select>
                <select onChange={(e) => setRoomFinishMinute(Number(e.target.value))}>
                    {minute.map(arrayItem => <option key={arrayItem} value={arrayItem}>{arrayItem}分</option>)}
                </select>
                <button onClick={submit}>決定</button>
            </div>
        </div>}
        <h2>ルーム一覧</h2>
        <table>
            <thead>
                <tr>
                <th>タイトル</th>
                <th>最低人数</th>
                <th>開始時刻</th>
                <th>終了時刻</th>
                <th>参加</th>
                </tr>
            </thead>
            <tbody>
                {room.map((item,index) => (
                    <tr key={index}>
                        <td>{item.title}</td>
                        <td>{item.menber}</td>
                        <td>{item.startHour+":"+(item.startMinute===0 ? "00" : item.startMinute)}</td>
                        <td>{item.finishHour+":"+(item.finishMinute===0 ? "00" : item.finishMinute)}</td>
                        <td><button>参加</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    )
}
export default NewRoom