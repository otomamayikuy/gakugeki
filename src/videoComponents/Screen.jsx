import React,{ useEffect, useState } from 'react';
import VideoPlayer from './VideoPlayer';
import MiniVideoPlayer from './MiniVideoPlayer';
import Header from '../Header/Header';
import MainContents from './MainContents';
import OtherVideos from './otherVideos'
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { getFirestore, collection,getDocs } from "firebase/firestore";
import "./video.css";
import { useNavigate } from "react-router-dom";


function Screen(props) {
  const navigate = useNavigate();
  useEffect(() => {
    if(!props.login){
        navigate("/")
    }
},[])
  const [url, setURL] = useState('')
  const storage = getStorage(props.app);
  const db = getFirestore(props.app);
  const [videoURL,setVideoURL] = useState(props.url)
  if(props.url!==videoURL){
    getURL()
    setVideoURL(props.url)
  }
  function getURL(){
    getDownloadURL(ref(storage, props.url))
    .then((url) => {
      setURL(url)
    })
  }
  const [reports,setReport]=useState([])
  async function getReport() {
    const querySnapshot = await getDocs(collection(db, props.title+"comments"));
    const newData=[]
    querySnapshot.forEach((doc) => {
      if(doc.data()) {
        newData.push(doc.data())
      }
    });
    setReport([...newData])
  }
  useEffect(() => {
    getReport()
    getURL()
},[])
  const [scrollPosition, setScrollPosition] = useState(0)
  const [pageTitle, setPageTitle] = useState(props.title)
  if(props.title!== pageTitle){
    getReport()
    setPageTitle(props.title)
  }
  useEffect(() => {
    const PositionUp = () => {
      setScrollPosition(window.pageYOffset);
    }
    window.addEventListener("scroll", PositionUp);
    PositionUp();
    return () => window.removeEventListener("scroll", PositionUp);
  }, [props.otherURL]);
  return (
    <div className="videoScreen">
    <Header/>
    {url!=="" && (
    <VideoPlayer VideoURL = {url}/>
    )}
    {scrollPosition>=300 && (url!=="" && (
    <MiniVideoPlayer VideoURL = {url} id="videoScreen2"/>
    ))}
    {url==="" && <div className="videoBlackScreen"></div>}
    <div className="videoMain">
      <div className="videoContents">
        <MainContents reports={reports} db={db} function={getReport} title={props.title} videoInfo={props.videoInfo} login={props.login}/>
      </div>
      <div className="videoSide">
        <OtherVideos app={props.app} url={props.otherURL}/>
      </div>
    </div>
    </div>
  )
}

export default Screen;