import React,{ useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { getFirestore, getDoc, doc, collection, query, setDoc, orderBy, onSnapshot, where } from "firebase/firestore";
import Header from "../Header/Header"
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function Mypage(props) {
    const db = getFirestore(props.app);
    const storage = getStorage(props.app)
    const [partner, setPartner] = useState("")
    const [newMessageUid, setNewMessageUid] = useState([])
    const [friends, setFriends] = useState([])
    const [myname, setMyname] = useState(props.uid)
    const [name, setName] = useState("")
    const [image, setImage] = useState("")
    const [imageUrl, setImageUrl] = useState("");
    const [applicationParties, setApplicationParties] = useState([])
    const [changeProfile, setChangeProfile] = useState(false)
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
        const pathReference = ref(storage, `icons/${props.uid}`);
        console.log(pathReference)
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
        getName()
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
    async function setNewName() {
        const DocumentRef = doc(db, "mypage", props.uid);
        await setDoc(DocumentRef, {uid:props.uid, name:name})
        setMyname(name)
        setName("")
    }
    async function getNewMessage(){
        const DocumentRef = doc(db, "mypage", props.uid);
        const q = query(collection(DocumentRef, "partner"), orderBy("time","desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const uids = []
            const friendUids = []
            querySnapshot.forEach((doc) => {
                if(doc.data().newMessage===true){
                    uids.push(doc.data())
                    friendUids.push(doc.data())
                }else{
                    friendUids.push(doc.data())
                }
            });
            setNewMessageUid([...uids])
            setFriends([...friendUids])
            console.log(friendUids)
        });
    }
    useEffect(()=>{
        getNewMessage()
        getMenberStates()
    },[])
    function handleImage(e) {
        const Image = e.target.files[0];
        setImage(Image)
    }
    function submit(e) {
        e.preventDefault();
        if(image === ""){
            console.log("ファイルが選択されていません")
            return
        }
        const iconImageRef =  ref(storage, `icons/${props.uid}`);
        uploadBytes(iconImageRef, image).then((snapshot) => {
            console.log('Uploaded a blob or file!');
            const pathReference = ref(storage, `icons/${props.uid}`);
            getDownloadURL(pathReference)
            .then((url) => {
                setImageUrl(url)
                setImage("")
            })
        });
    }
    async function getMenberStates(){
        const DocumentRef = doc(db, "mypage", props.uid);
        const q = query(collection(DocumentRef, "parties"), where("state", "==", "waiting"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const NewApplications = []
            querySnapshot.forEach((doc) => {
                NewApplications.push(doc.data())
            });
            setApplicationParties([...NewApplications])
        });
    }
    async function join(value){
        const DocumentRef = doc(db, "mypage", props.uid);
        const subDocumentRef = doc(DocumentRef, "parties", value.partyID)
        await setDoc(subDocumentRef, {state:"menber", uid:props.uid, name:myname, partyID:value.partyID, partyName:value.partyName, leaderUid:value.leaderUid, leaderName:value.leaderName, abstract:value.abstract})
        const DocumentRefParties = doc(db, "parties", value.partyID)
        const subDocumentRefParties = doc(DocumentRefParties, "menbers", props.uid);
        await setDoc(subDocumentRefParties, {state:"menber", uid:props.uid, name:myname, partyID:value.partyID, partyName:value.partyName, leaderUid:value.leaderUid, leaderName:value.leaderName, abstract:value.abstract})
    }
    async function reject(value){
        const DocumentRef = doc(db, "mypage", props.uid);
        const subDocumentRef = doc(DocumentRef, "parties", value.partyID)
        await setDoc(subDocumentRef, {state:"reject", uid:props.uid, name:myname, partyID:value.partyID, partyName:value.partyName, leaderUid:value.leaderUid, leaderName:value.leaderName, abstract:value.abstract})
        const DocumentRefParties = doc(db, "parties", value.partyID)
        const subDocumentRefParties = doc(DocumentRefParties, "menbers", props.uid);
        await setDoc(subDocumentRefParties, {state:"reject", uid:props.uid, name:myname, partyID:value.partyID, partyName:value.partyName, leaderUid:value.leaderUid, leaderName:value.leaderName, abstract:value.abstract})
    }

    return(
        <div>
            <Header/>
            <div className="absolute text-center h-auto w-4/5 top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2 rounded-xl border-4 bg-blue-300 border-blue-300 my-5">
            <h1 className="relative px-10 text-black text-3xl mt-3">{imageUrl ? <img alt="アイコン" src={imageUrl} className="object-cover h-10 w-10 rounded-full inline"/>: <div className="inline-block bg-blue-700 text-white h-10 w-10 rounded-full">{myname && myname[0]}</div>}　{myname}</h1>
            <div className="h-6"></div>
            <h2 className="relative px-10 text-black text-lg my-1 border-b-2 border-blue-400">新規メッセージ：{newMessageUid.length}件</h2>
            {newMessageUid.map((value, index)=>(
                <div key={index}><button onClick={() => go(value.uid)} className="relative px-10 text-black text-base my-1">{value.name}</button><br/></div>
            ))}
            <div className="h-6"></div>
            <h2 className="relative px-10 text-black text-lg mt-1 border-b-2 border-blue-400">友達一覧</h2>
            {friends.map((value, index)=>(
                <div key={index}><button onClick={() => go(value.uid)} className="relative px-10 text-black text-base my-1">{value.name}</button><br/></div>
            ))}
            
            {false && <><h2 className="relative px-10 text-black text-lg mt-3 border-b-2 border-blue-400">ユーザーIDで検索</h2>
            <input value={partner} onChange={(e) => setPartner(e.target.value)} placeholder="相手のID" className="rounded-xl px-3 my-1 bg-purple-200"></input><br/>
            <button onClick={partnerDicision} className="relative px-3 text-black text-base rounded-xl border-4 bg-blue-400 border-blue-400" disabled={partner===""}>決定</button>
            </>}
            <div className="h-6"></div>

            {applicationParties.length>=1 && 
            <><h2 className="relative px-10 text-black text-lg mt-1 border-b-2 border-blue-400">新規パーティー申請</h2>
            {applicationParties.map((value, index) => (
                <div key={index} className="mt-3">
                <h3 className="inline-block w-24 text-center align-middle"><p className="text-black block font-bold">パーティー名</p><p className="text-black block">{value.partyName}</p></h3>
                <h3 className="inline-block w-20 text-center align-middle"><p className="text-black block font-bold">リーダー</p><p className="text-black block">{value.leaderName}</p></h3>
                <h3 className="inline-block w-16 text-center align-middle"><p className="text-black block font-bold">参加</p><button onClick={()=>join(value)} className="relative px-3 text-black text-base rounded-xl bg-blue-400 border-blue-400">参加</button></h3>
                <h3 className="inline-block w-16 text-center align-middle"><p className="text-black block font-bold">拒否</p><button onClick={()=>reject(value)} className="relative px-3 text-black text-base rounded-xl bg-blue-400 border-blue-400">拒否</button></h3>
                <h3 className="inline-block w-72 text-center align-middle"><p className="text-black block font-bold">概要</p><p className="text-black block">{value.abstract}</p></h3>
                </div>
            ))}
            </>
            }
            {applicationParties.length>=1 && <div className="h-6"></div>}

            
            {changeProfile && <> 
            <h2 className="relative px-10 text-black text-lg mt-1 border-b-2 border-blue-400">名前の変更</h2>
            <input className="rounded-xl px-3 mr-3 bg-purple-200" value={name} placeholder="新しい名前" onChange={(e)=>setName(e.target.value)}/>
            <button className="relative p-1 text-black text-sm my-1 rounded-xl bg-blue-400 border-blue-400" onClick={setNewName} disabled={name===""}>名前を変更</button>
            <div className="h-3"></div>
            <h2 className="relative px-10 text-black text-lg mt-1 border-b-2 border-blue-400">アイコンの変更</h2>
            <div className="h-2"></div>
            <form onSubmit={submit}>
                <label className="p-1 rounded-xl bg-blue-400 border-blue-400"><input className="hidden" type="file"  onChange={handleImage} accept=".png,.jpg,.jpeg"/>ファイルを選択</label>{image && image.name}<br/>
                {image && <button className="my-2 p-1 rounded-xl bg-blue-400 border-blue-400">アップロード</button>}
            </form>
            <div className="h-6"></div>
            </>}
            <button className="relative p-1 text-black text-sm my-1 rounded-xl bg-blue-400 border-blue-400" onClick={() => setChangeProfile(!changeProfile)}>{changeProfile ? "変更をやめる" :"プロフィール変更"}</button>
            </div>
        </div>
    )
}
export default Mypage;