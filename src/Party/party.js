import React,{ useEffect, useState } from 'react';
import { getFirestore, getDoc, doc, collection, query, setDoc, orderBy, onSnapshot, where, getDocs, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import UUID from 'uuidjs';
import Header from "../Header/Header"


function Party (props) {
    const db = getFirestore(props.app);

    const [friends, setFriends] = useState([]);
    const [selectMenbers, setSelectMenbers] = useState([])
    const [myname, setMyname] = useState(props.uid)
    const [waitingMenbers, setWaitingMenbers] = useState([])
    const [doneMenbers, setDoneMenbers] = useState([])
    const [rejectMenbers, setRejectMenbers] = useState([])
    const [partyName, setPartyName] = useState("")
    const [partyAbstract, setPartyAbstract] = useState("")
    const [partyInfo, setPartyInfo] = useState("")
    const [partyInfomations, setPartyInfomations] = useState([])
    const [newPartyLook, setNewPartyLook] = useState(false)

    const navigate = useNavigate()
    useEffect(() => {
        if(!props.login){
            navigate("/")
        }
    },[])
    async function getName(){
        const DocumentRef2 = doc(db, "mypage", props.uid);
        const DocSnap2 = await getDoc(DocumentRef2);
        if(DocSnap2.data().name){
            setMyname(DocSnap2.data().name)
        }
    }
    async function getFriends(){
        const DocumentRef = doc(db, "mypage", props.uid);
        const q = query(collection(DocumentRef, "partner"), orderBy("time","desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const friendUids = []
            querySnapshot.forEach((doc) => {
                friendUids.push(doc.data());
            });
            setFriends([...friendUids]);
            console.log(friendUids);
        });
    }
    useEffect(()=>{
        getFriends()
        getName()
    },[])
    async function getPartyInfo(){
        const DocumentRef = doc(db, "mypage", props.uid);
        const q = query(collection(DocumentRef, "parties"), where("partyName", "==", partyName ))
        const querySnapshot = await getDocs(q);
        const partyInfos=[]
        querySnapshot.forEach((doc) => {
            partyInfos.push(doc.data())
        });
        if(partyInfos.length===1){
            setPartyInfo(partyInfos[0])
            getMenberStates(partyInfos[0].partyID)
        }else if(partyInfos.length>=1){
            setPartyInfomations(partyInfos)
            setPartyInfo("")
            setWaitingMenbers([])
            setRejectMenbers([])
            setDoneMenbers([])

        }else {
            alert(`${partyName}には参加していません`)
            setPartyName(partyInfo.partyID ? partyInfo.partyName : "")
        }
    }
    async function getMenberStates(partyid){
        if(partyid!==""){
            const DocumentRef = doc(db, "parties", partyid);
            const q = query(collection(DocumentRef, "menbers"));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const waitings = []
                const dones = []
                const rejects = []
                querySnapshot.forEach((doc) => {
                    if(doc.data().state==="waiting"){
                        waitings.push(doc.data())
                    }else if(doc.data().state==="menber" || doc.data().state==="leader"){
                        dones.push(doc.data())
                    }else if(doc.data().state==="reject"){
                        rejects.push(doc.data())
                    }
                    setPartyName(doc.data().partyName)
                    setPartyInfo(doc.data())
                });
                console.log(waitings)
                setWaitingMenbers([...waitings])
                setDoneMenbers([...dones])
                setRejectMenbers([...rejects])
            });
        }
    }
    function select(menber){
        if(selectMenbers.includes(menber)){
            setSelectMenbers(selectMenbers.filter((oldMenber)=>(oldMenber!==menber)))
            return
        }
        setSelectMenbers([...selectMenbers, menber])
    }
    async function newApplication(){
        setNewPartyLook(false)
        const ID = UUID.generate();
        const DocumentRef = doc(db, "parties", ID);
        const subDocumentRef1 = doc(DocumentRef,"menbers", props.uid)
        await setDoc(subDocumentRef1, {state:"leader", uid:props.uid, name:myname, partyID:ID, partyName:partyName, leaderUid:props.uid, leaderName:myname, abstract:partyAbstract})
        const DocumentRefMypage1 = doc(db, "mypage", props.uid)
        const subDocumentRefParties1 = doc(DocumentRefMypage1, "parties", ID)
        await setDoc(subDocumentRefParties1, {state:"leader", uid:props.uid, name:myname, partyID:ID, partyName:partyName, leaderUid:props.uid, leaderName:myname, abstract:partyAbstract})
        for(const selectMenber of selectMenbers){
            const subDocumentRef2 = doc(DocumentRef, "menbers", selectMenber.uid)
            await setDoc(subDocumentRef2, {state:"waiting", uid:selectMenber.uid, name:selectMenber.name, partyID:ID, partyName:partyName, leaderUid:props.uid, leaderName:myname, abstract:partyAbstract})
            const DocumentRefMypage2 = doc(db, "mypage", selectMenber.uid)
            const subDocumentRefParties2 = doc(DocumentRefMypage2, "parties", ID)
            await setDoc(subDocumentRefParties2, {state:"waiting", uid:selectMenber.uid, name:selectMenber.name, partyID:ID, partyName:partyName, leaderUid:props.uid, leaderName:myname, abstract:partyAbstract})
        }
        setWaitingMenbers([...selectMenbers])
        setSelectMenbers([])
        setPartyAbstract("")
        getPartyInfo()
    }
    function NewPartyLookOnclick(){
        if(!newPartyLook){
            setPartyName("")
        }else{
            setPartyName(partyInfo.partyName ? partyInfo.partyName : (partyInfomations.length>=1 ? partyInfomations[0].partyName : ""))
        }
        setNewPartyLook(!newPartyLook)
    }
    async function consent(value){
        const DocumentRef = doc(db, "mypage", value.uid);
        const subDocumentRef = doc(DocumentRef, "parties", value.partyID)
        await deleteDoc(subDocumentRef)
        const DocumentRefParties = doc(db, "parties", value.partyID)
        const subDocumentRefParties = doc(DocumentRefParties, "menbers", value.uid);
        await deleteDoc(subDocumentRefParties)
    }
    async function reApplication(value){
        const DocumentRef = doc(db, "mypage", value.uid);
        const subDocumentRef = doc(DocumentRef, "parties", value.partyID)
        await setDoc(subDocumentRef, {state:"waiting", uid:value.uid, name:value.name, partyID:value.partyID, partyName:value.partyName, leaderUid:value.leaderUid, leaderName:value.leaderName, abstract:value.abstract})
        const DocumentRefParties = doc(db, "parties", value.partyID)
        const subDocumentRefParties = doc(DocumentRefParties, "menbers", value.uid);
        await setDoc(subDocumentRefParties, {state:"waiting", uid:value.uid, name:value.name, partyID:value.partyID, partyName:value.partyName, leaderUid:value.leaderUid, leaderName:value.leaderName, abstract:value.abstract})
    }

    return(
        <div>
            <Header/>
            <div className="absolute text-center h-auto w-4/5 top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2 rounded-xl border-4 bg-blue-300 border-blue-300 my-5">
                <h1 className="relative px-10 text-black text-3xl mt-3">{newPartyLook ? "新規登録" :"パーティーページ"}</h1>
                <h2 className="relative px-10 text-black text-lg mt-1 border-b-2 border-blue-400">パーティー名</h2>
                <input placeholder="パーティー名" value={partyName} onChange={(e) => setPartyName(e.target.value)} className="rounded-xl px-3 my-1 bg-purple-200"/>
                {!newPartyLook && <button onClick={getPartyInfo} disabled={partyName===""} className="relative p-1 text-black text-sm my-1 rounded-xl bg-blue-400 border-blue-400">検索</button>}
                <div className="h-6"></div>
                
                {(newPartyLook || partyInfo) && <h2 className="relative px-10 text-black text-lg mt-1 border-b-2 border-blue-400">パーティー概要</h2>}
                {newPartyLook ?
                <textarea className="rounded-xl px-3 my-1 bg-purple-200 w-2/4" onChange={(e) => setPartyAbstract(e.target.value)} value={partyAbstract} placeholder="パーティーの概要"></textarea>
                :<p className="relative px-10 text-black text-base my-1">{partyInfo && partyInfo.abstract}</p>}
                {(newPartyLook || partyInfo) && <div className="h-6"></div>}
                
                {!newPartyLook && <> {partyInfomations.length>=2 && <h2 className="relative px-10 text-black text-lg mt-1 border-b-2 border-blue-400">概要一覧</h2>}
                {partyInfomations.map((value,index) => (
                    <p onClick={() => {
                        setPartyInfomations([])
                        setPartyInfo(value)
                        getMenberStates(value.partyID)
                    }} key={index} className="relative px-10 text-black text-base my-3">{value.abstract}</p>
                ))}
                {partyInfomations.length>=2 && <div className="h-6"></div>}
                </>}

                {!newPartyLook && <>
                {doneMenbers.length>=1 && <h2 className="relative px-10 text-black text-lg mt-1 border-b-2 border-blue-400">登録済み</h2>}
                {doneMenbers.map((value,index) => (
                    <p className="relative px-10 text-black text-base my-1" key={index}>{value.name}</p>
                ))}
                {rejectMenbers.length>=1 && <h2 className="relative px-10 text-black text-lg mt-1 border-b-2 border-blue-400">拒否</h2>}
                {rejectMenbers.map((value,index) => (
                    <div key={index}>
                        <p className="relative px-3 text-black text-base my-1 inline">{value.name}</p>
                        <button onClick={()=>consent(value)} className="relative p-1 text-black text-sm my-1 rounded-xl bg-blue-400 border-blue-400">承諾</button>　
                        <button onClick={()=>reApplication(value)} className="relative p-1 text-black text-sm my-1 rounded-xl bg-blue-400 border-blue-400">再申請</button>
                    </div>
                ))}
                {waitingMenbers.length>=1 && <h2 className="relative px-10 text-black text-lg mt-1 border-b-2 border-blue-400">待機中</h2>}
                {waitingMenbers.map((value,index) => (
                    <p className="relative px-10 text-black text-base my-1" key={index}>{value.name}</p>
                ))}
                </>}
                {newPartyLook && <>
                <h2 className="relative px-10 text-black text-lg mt-1 border-b-2 border-blue-400">選択中</h2>
                {selectMenbers.length===0 && <p className="relative px-10 text-black text-base my-1">メンバーを追加してください</p>}
                {selectMenbers.map((value,index) => (
                    <p className="relative px-10 text-black text-base my-1" onClick={() => select(value)} key={index}>{value.name}</p>
                ))}
                <button onClick={newApplication} disabled={partyName==="" || partyAbstract==="" || selectMenbers.length===0} className="relative p-1 text-black text-sm my-1 rounded-xl bg-blue-400 border-blue-400">申請</button>
                <div className="h-6"></div>
                <h2 className="relative px-10 text-black text-lg mt-1 border-b-2 border-blue-400">申請可能メンバー</h2>
                {friends.map((value,index) => (
                    <p className="relative px-10 text-black text-base my-1" onClick={() => select(value)} key={index}>{value.name}</p>
                ))}</>}
                <button className="relative p-1 text-black text-sm my-1 rounded-xl bg-blue-400 border-blue-400" onClick={NewPartyLookOnclick}>{!newPartyLook ? "新規登録":"新規登録をやめる"}</button>
            </div>
        </div>
    )
}

export default Party