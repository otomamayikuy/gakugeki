import { initializeApp } from "firebase/app";
import './App.css';
import Home from './videoComponents/Home.jsx'
import Screen from './videoComponents/Screen.jsx'
import Introduction from './introductionComponents/introduuction'
import Login from './Auth/login'
import Signup from './Auth/signup'
import Buck from './Buck'
import React, { useState } from 'react';
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Room from './Room/Room'
import Stage from "./stageComponents/Stage"
import FindChatPartner from "./Chat/FindChatPartner"
import Chat from "./Chat/Chat"

function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyDF8NPfovfGf9YH1q0Jp0J1LEns21Bsp7U",
    authDomain: "gakugeki-rooms.firebaseapp.com",
    projectId: "gakugeki-rooms",
    storageBucket: "gakugeki-rooms.appspot.com",
    messagingSenderId: "798166539037",
    appId: "1:798166539037:web:1f61ea87c4ac62fcb05ff4",
    measurementId: "G-M2D2H702S8"
  };
  const app = initializeApp(firebaseConfig);
  const [login,setLogin]=useState(false)
  const [uid,setUid] = useState(null)
  //すべての動画
  const allURL = [
    {url:'gs://gakugeki-rooms.appspot.com/sample.png', path:"/video/sample2", title:"サンプル１"},
    {url:'gs://gakugeki-rooms.appspot.com/sample2.png', path:"/video/sample1", title:"サンプル2"}
  ]
  //サンプル１の関連動画
  const sample1_others=[
    {url:'gs://gakugeki-rooms.appspot.com/sample.png', path:"/video/sample2", title:"サンプル１"},
    {url:'gs://gakugeki-rooms.appspot.com/sample.png', path:"/video/sample2", title:"サンプル１"}
  ]
  //サンプル２の関連動画
  const sample2_others=[
    {url:'gs://gakugeki-rooms.appspot.com/sample2.png', path:"/video/sample1", title:"サンプル2"},
    {url:'gs://gakugeki-rooms.appspot.com/sample2.png', path:"/video/sample1", title:"サンプル2"}
  ]
  //サンプル１の動画の情報[タイトル、概要、[出演者、出演者の説明]、関連論文リスト、関連論文のタイトルリスト]
  const sample1_videoInfo=["サンプル１", "これはサンプル１です", ["出演者！", "出演者です！"], ["https://scholar.google.co.jp/", "https://scholar.google.co.jp/"], ["グーグルスカラーのトップページ", "グーグルスカラーのトップページ"]]
  //サンプル２の動画の情報
  const sample2_videoInfo=["サンプル２", "これはサンプル２です", ["出演者？", "出演者です？"], ["https://scholar.google.co.jp/"], ["グーグルスカラーのトップページ"]]
  //環境問題タグに含まれる動画のタイトル
  const environment = ["サンプル１"]
  //社会問題タグに含まれる動画のタイトル
  const society = ["サンプル2"]
  const tag={environment:environment, society:society}

  return (
    < div className="app">
      <Router>
        <Routes>
          <Route exact path="/home" element={<Home app={app} url={allURL} tag={tag} login={login}/>} />
          <Route exact path="/video/sample1" element={<Screen url='gs://gakugeki-rooms.appspot.com/sample.mp4' app={app} otherURL={sample1_others} title={"sample1"} videoInfo={sample1_videoInfo} login={login}/>} />
          <Route exact path="/video/sample2" element={<Screen url='gs://gakugeki-rooms.appspot.com/sample.mp4' app={app} otherURL={sample2_others} title={"sample2"} videoInfo={sample2_videoInfo} login={login}/>} />
          <Route exact path="/room" element={<Room app={app} login={login} uid={uid}/>}/>
          <Route exact path="/stage" element={<Stage app={app} login={login} uid={uid}/>}/>
          <Route exact path="/introduction" element={<Introduction/>}/>
          <Route exact path="/" element={<Login setLogin={setLogin} setUid={setUid}/>}/>
          <Route exact path="/signup" element={<Signup/>}/>
          <Route exact path="/myPage" element={<FindChatPartner app={app} uid={uid} login={login}/>}/>
          <Route exact path="/chat/:id/:partner" element={<Chat app={app} uid={uid} login={login}/>}/>
          <Route path="*" element={<Buck/>}/>
        </Routes>
      </Router>
    </ div>
  );
}

export default App;
