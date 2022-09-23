import React,{ useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { getFirestore, getDoc, getDocs, doc, collection, query, where} from "firebase/firestore";
import Header from "../Header/Header"

function FindChatPartner(props) {
    const db = getFirestore(props.app);
    const [partner, setPartner] = useState("")
    const [newMessageUid, setNewMessageUid] = useState([])
    const [friends, setFriends] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        if(!props.login){
            navigate("/")
        }
    },[])
    async function partnerDicision(){
        const DocumentRef = doc(db, "mypage", partner);
        const docSnap = await getDoc(DocumentRef);
        if(docSnap.exists()){
            navigate({
                pathname:`/chat/${props.uid}/${partner}`,
            })
        }else{
            alert("ユーザーIDが間違っています")
        }
    }
    function go(value){
        navigate({
            pathname:`/chat/${props.uid}/${value}`,
        })
    }
    async function getNewMessage(){
        const DocumentRef = doc(db, "mypage", props.uid);
        const q = query(collection(DocumentRef, "partner"));
        const querySnapshot = await getDocs(q);
        const uids = []
        const friendUids = []
        querySnapshot.forEach((doc) => {
            if(doc.data().newMessage===true){
                uids.push(doc.data().uid)
                friendUids.push(doc.data().uid)
            }else{
                friendUids.push(doc.data().uid)
            }
        });
        setNewMessageUid([...uids])
        setFriends([...friendUids])
        console.log(friendUids)
    }
    useEffect(()=>{
        getNewMessage()
    },[])
    return(
        <div>
            <Header/>
            <div className="absolute text-center h-auto w-4/5 top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2 rounded-xl border-4 bg-blue-300 border-blue-300 my-5">
            <h1 className="relative px-10 text-black text-3xl my-3">マイページ</h1>
            <h2 className="relative px-10 text-black text-lg my-1">新規メッセージ：{newMessageUid.length}件</h2>
            {newMessageUid.map((value, index)=>(
                <><button key={index} onClick={() => go(value)} className="relative px-10 text-black text-base my-1">{value}</button><br/></>
            ))}
            <h2 className="relative px-10 text-black text-lg mt-1">友達一覧</h2>
            {friends.map((value, index)=>(
                <><button key={index} onClick={() => go(value)} className="relative px-10 text-black text-base my-1">{value}</button><br/></>
            ))}
            <h2 className="relative px-10 text-black text-lg mt-3">ユーザーIDで検索</h2>
            <input value={partner} onChange={(e) => setPartner(e.target.value)}></input><br/>
            <button onClick={partnerDicision} className="relative px-3 text-black text-base rounded-xl border-4 bg-blue-500 border-blue-500" disabled={partner===""}>決定</button>
            </div>
        </div>
    )
}
export default FindChatPartner;