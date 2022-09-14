import {React,useEffect,useState} from 'react'
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { Link, useNavigate } from "react-router-dom";
import Header from '../Header/Header';
import "./video.css";

function Home(props){
    const navigate = useNavigate();
    console.log(props.login)
    useEffect(() => {
        if(!props.login){
            navigate("/")
        }
    },[])
    const storage = getStorage(props.app);
    const [urls, setURL] = useState([])
    const [checkEnvironment, setCheckEnvironment] = useState(false);
    const [checkSociety, setCheckSociety] = useState(false);
    const [environment, setEnvironment] = useState([])
    const [society, setSociety] = useState([])
    
    function URLsetting(n,URLlist,environmentList, societyList) {
        if(n>=props.url.length){
            setURL(URLlist)
            setEnvironment(environmentList)
            setSociety(societyList)
            return
        }
        if(n<props.url.length){
            getDownloadURL(ref(storage,props.url[n].url))
                .then((urls) => {
                    URLlist.push({url:urls, path:props.url[n].path, title:props.url[n].title})
                    console.log(n)
                    if(props.tag.environment.includes(props.url[n].title)){
                        environmentList.push({url:urls, path:props.url[n].path, title:props.url[n].title})
                        console.log("a")
                    }
                    if(props.tag.society.includes(props.url[n].title)){
                        societyList.push({url:urls, path:props.url[n].path, title:props.url[n].title})
                        console.log("b")
                    }
                    URLsetting(n+1,URLlist,environmentList,societyList)
                })
        }
    }
    useEffect(() => {URLsetting(0,[],[],[])},[])
    return(
        <>
        <Header/>
        <div id="home">
            <h2>最新の番組</h2>
            {urls.length>=1 && <Link to={urls[0].path}><div className="newest"><input className="thumbnail" type="image" src={urls[0].url} alt="動画一覧"/><h3>{urls[0].title}</h3></div></Link>}
            <h2>タグ一覧</h2>
            <h3 className="tag" onClick={() => {
                setCheckEnvironment(!checkEnvironment)
                setCheckSociety(false)
            }}>環境問題</h3>
            <h3 className="tag" onClick={() => {
                setCheckSociety(!checkSociety)
                setCheckEnvironment(false)
            }}>社会問題</h3>
            {checkEnvironment ? <h4>環境問題に関連のある動画</h4> : checkSociety && <h4>社会問題に関連のある動画</h4>}
            {checkEnvironment && environment.map((url,index) => (
                <Link to={url.path} key={index}><div className="allVideo"><input className="thumbnail" type="image" src={url.url} alt="動画一覧"/><p>{url.title}</p></div></Link>
            ))}
            {checkSociety && society.map((url,index) => (
                <Link to={url.path} key={index}><div className="allVideo"><input className="thumbnail" type="image" src={url.url} alt="動画一覧"/><p>{url.title}</p></div></Link>
            ))}
            <h2>動画一覧</h2>
            {urls.map((url,index) => (
                <Link to={url.path} key={index}><div className="allVideo"><input className="thumbnail" type="image" src={url.url} alt="動画一覧"/><p>{url.title}</p></div></Link>
            ))}
        </div>
        </>
    )
}
export default Home;
