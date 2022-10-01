import React,{ useEffect, useRef, useState } from 'react';
import { useParams } from "react-router-dom";
import { getFirestore, doc, setDoc, collection, onSnapshot, query, limit, orderBy, serverTimestamp, getDoc, Timestamp} from "firebase/firestore";
import "./Chat.css"
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import { getStorage, ref, getDownloadURL } from 'firebase/storage';


function Chat(props) {
    const db = getFirestore(props.app);
    const storage = getStorage(props.app)
    const [message, setMessage] = useState("")
    const params = useParams()
    const [pairName,setPairName] = useState("")
    const [messageNumber, setMessageNumber] = useState(1)
    const [messages, setMessages] = useState([])
    const scrollBottomRef = useRef(null);
    const [name, setName] = useState(params.partner)
    const [myname, setMyname] = useState(params.id)
    const [partnerLookTime, setPartnerLookTime] = useState(new Timestamp(new Date(2022),0))
    const [imageUrl, setImageUrl] = useState("")
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
    async function getNameTimeAndIcon() {
        const DocumentRef = doc(db, "mypage", params.partner);
        const DocSnap = await getDoc(DocumentRef);
        if(DocSnap.data()){
            setName(DocSnap.data().name)
        }
        const DocumentRef2 = doc(db, "mypage", params.id);
        const DocSnap2 = await getDoc(DocumentRef2);
        if(DocSnap2.data()){
            setMyname(DocSnap2.data().name)
        }
        const subDocumentRef = doc(DocumentRef, "partner", params.id);
        const unsub = onSnapshot(subDocumentRef, (doc) => {
            if(doc.data()){
                console.log(doc.data().time)
                setPartnerLookTime(doc.data().time)
            }
        });
        const pathReference = ref(storage, `icons/${params.partner}`);
        if(pathReference){
            getDownloadURL(pathReference)
            .then((url) => {
                setImageUrl(url)
            })
            .catch((error) => {
                console.log(error)
            })
        }
    }
    useEffect(() => {
        getNameTimeAndIcon()
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
        }
    }
    useEffect(()=>{getMessage()},[pairName])
    async function send(){
        const DocumentRef = doc(db, "messages", pairName);
        const subDocumentRef = doc(DocumentRef,"messages", String(messageNumber))
        await setDoc(subDocumentRef,{number:messageNumber, message:message, uid:props.uid, time:serverTimestamp()});

        const DocumentRef2 = doc(db, "mypage", params.partner);
        const subDocumentRef2 = doc(DocumentRef2, "partner", params.id)
        await setDoc(subDocumentRef2, {newMessage:true, uid:props.uid ,name:myname, time:partnerLookTime})
        
        const DocumentRef3 = doc(db, "mypage", params.id);
        const subDocumentRef3 = doc(DocumentRef3, "partner", params.partner)
        await setDoc(subDocumentRef3, {newMessage:false, uid:params.partner ,name:name, time:serverTimestamp()})
        setMessage("")
    }
    async function look(){
        const DocumentRef3 = doc(db, "mypage", params.id);
        const subDocumentRef3 = doc(DocumentRef3, "partner", params.partner)
        await setDoc(subDocumentRef3, {newMessage:false, uid:params.partner ,name:name, time:serverTimestamp()})
    }
    useEffect(() => {
        if(scrollBottomRef && scrollBottomRef.current) {
            scrollBottomRef.current.scrollIntoView()
        }
    },[messages])
    return(
        <>
        <Header/>
        <div id="messagePartner" className="w-4/5 h-10 bg-indigo-200 fixed left-2/4 -translate-x-1/2">
            <h1 className="relative left-2/4 -translate-x-1/2 text-black text-3xl rounded-xl">{imageUrl ? <img alt="アイコン" src={imageUrl} className="object-cover h-10 w-10 rounded-full inline"/>: <div className="inline-block bg-blue-700 text-white h-10 w-10 rounded-full">{name && name[0]}</div>}　{name}</h1>
        </div>
        <div className="w-4/5 bg-indigo-200 relative left-2/4 -translate-x-1/2 p-5">
            <div className="h-10 w-full"></div>
            {messages.map((value,index) => (
                value.uid===props.uid?
                <div key={index}>
                    <p id="message" className="relative left-full -translate-x-full px-10 text-black text-3xl rounded-xl border-4 border-purple-400 bg-purple-400">{value.message}</p>
                    {value.time && <p id="message" className="relative left-full -translate-x-full text-black text-sm">{("0"+(value.time.toDate().getMonth()+1)).slice(-2)+"/"+("0"+(value.time.toDate().getDate()+1)).slice(-2)+"　"+("0"+(value.time.toDate().getHours()+1)).slice(-2)+":"+("0"+(value.time.toDate().getMinutes()+1)).slice(-2)}　{partnerLookTime && partnerLookTime.toDate()>value.time.toDate() && "既読"}</p>}
                    
                </div>:
                <div key={index}>
                    <p id="message" className="px-10 text-black text-3xl rounded-xl border-4 border-purple-100 bg-purple-100" key={index}>{value.message}</p>
                    <p id="message" className="relative text-black text-sm">{("0"+(value.time.toDate().getMonth()+1)).slice(-2)+"/"+("0"+(value.time.toDate().getDate()+1)).slice(-2)+"　"+("0"+(value.time.toDate().getHours()+1)).slice(-2)+":"+("0"+(value.time.toDate().getMinutes()+1)).slice(-2)}</p>
                </div>
            ))}
        </div>
        <div className="relative h-48" ref={scrollBottomRef}></div>
        <div className="w-4/5 h-44 bg-indigo-200 fixed left-2/4 top-full -translate-x-1/2 -translate-y-full">
            <textarea id="messageBox" clos="30" rows="3" className="absolute text-2xl" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
            <button id="sendButton" className="text-2xl bg-blue-500 w-20 rounded-xl" onClick={send} disabled={message===""}>送信</button>
            <button id="lookButton" className="text-xl bg-blue-500 w-32 rounded-xl" onClick={look}>既読をつける</button>
        </div>
        </>
    )
}
export default Chat;