import React,{ useEffect, useRef, useState } from 'react';
import { useParams } from "react-router-dom";
import { getFirestore, doc, setDoc, collection, onSnapshot, query, limit, orderBy} from "firebase/firestore";
import "./Chat.css"
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";

function Chat(props) {
    const db = getFirestore(props.app);
    const [message, setMessage] = useState("")
    const params = useParams()
    const [pairName,setPairName] = useState("")
    const [messageNumber, setMessageNumber] = useState(1)
    const [messages, setMessages] = useState([])
    const scrollBottomRef = useRef(null);
    const navigate = useNavigate()
    useEffect(() => {
        if(!props.login){
            navigate("/")
        }
    },[])
    useEffect(()=>{
        let users = [params.id,params.partner]
        users.sort();
        setPairName(users[0]+users[1])
    },[])
    async function getMessage() {
        if(pairName!==""){
            const DocumentRef = doc(db, "messages", pairName);
            const subQuery = query(collection(DocumentRef, "messages"), orderBy("number", "desc"), limit(20))
            const unsubscribe = onSnapshot(subQuery, (querySnapshot) => {
                const newMessage = [];
                querySnapshot.forEach((doc) => {
                    newMessage.push(doc.data());
                });
                newMessage.reverse()
                setMessages([...newMessage])
                setMessageNumber(newMessage[newMessage.length-1].number+1)
                console.log(newMessage)
            });
            const DocumentRef2 = doc(db, "mypage", params.id);
            const subDocumentRef2 = doc(DocumentRef2, "partner", params.partner)
            await setDoc(subDocumentRef2, {newMessage:false, uid:params.partner})
        }
    }
    useEffect(()=>{getMessage()},[pairName])
    async function send(){
        const DocumentRef = doc(db, "messages", pairName);
        const subDocumentRef = doc(DocumentRef,"messages", String(messageNumber))
        await setDoc(subDocumentRef,{number:messageNumber, message:message, uid:props.uid});
        const DocumentRef2 = doc(db, "mypage", params.partner);
        const subDocumentRef2 = doc(DocumentRef2, "partner", params.id)
        await setDoc(subDocumentRef2, {newMessage:true, uid:props.uid})
        setMessage("")
    }
    useEffect(() => {
        if(scrollBottomRef && scrollBottomRef.current) {
            scrollBottomRef.current.scrollIntoView()
        }
    },[messages])
    return(
        <>
        <Header/>
        <div className="w-4/5 bg-indigo-200 relative left-2/4 -translate-x-1/2 p-5">
            {messages.map((value,index) => (
                value.uid===props.uid?
                <p id="message" className="relative left-full -translate-x-full px-10 text-black text-3xl rounded-xl border-4 border-green-300 bg-green-300 my-3" key={index}>{value.message}</p>:
                <p id="message" className="px-10 text-black text-3xl rounded-xl border-4 border-gray-50 bg-gray-50 my-3" key={index}>{value.message}</p>
            ))}
        </div>
        <div className="relative h-48" ref={scrollBottomRef}></div>
        <div className="w-4/5 h-44 bg-indigo-200 fixed left-2/4 top-full -translate-x-1/2 -translate-y-full">
            <textarea id="messageBox" clos="30" rows="3" className="absolute text-2xl" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
            <button id="sendButton" className="text-2xl bg-blue-500 w-20 rounded-xl" onClick={send} disabled={message===""}>送信</button>
            <button id="buckButton" className="text-sm bg-gray-400 w-20 rounded-xl" onClick={()=> navigate("/mypage")}>マイページ</button>
        </div>
        </>
    )
}
export default Chat;