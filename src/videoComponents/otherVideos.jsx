import {React,useEffect,useState} from 'react'
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { Link } from "react-router-dom";

const OtherVideos = (props) => {
    const [urls, setURL] = useState([])
    const storage = getStorage(props.app);
    let flag=false
    for(let i = 0; i < urls.length; i++){
        if(urls[i].path!==props.url[i].path){
            flag=true
        }
    }
    if(flag===true){
        URLsetting()
    }
    function URLsetting() {
        const URLlist=[]
        if(props.url.length>=1){
            getDownloadURL(ref(storage,props.url[0].url))
            .then((urls) => {
                URLlist.push({url:urls, path:props.url[0].path, title:props.url[0].title})
                if(props.url.length>=2){
                    getDownloadURL(ref(storage,props.url[1].url))
                    .then((urls) => {
                        URLlist.push({url:urls, path:props.url[1].path, title:props.url[1].title})
                        if(props.url.length>=3){
                            getDownloadURL(ref(storage,props.url[2].url))
                            .then((urls) => {
                                URLlist.push({url:urls, path:props.url[2].path, title:props.url[2].title})
                                setURL(URLlist)
                            })
                        }else{
                            setURL(URLlist)
                        }
                    })
                }else{
                    setURL(URLlist)
                }
            })
        }
    }
    useEffect(() => {URLsetting()},[])
    return (
        <div className="othervideos">
            <h2>関連動画</h2>
            {urls.map((url,index) => (
                <Link to={url.path} key={index}><input type="image" src={url.url} alt="関連動画" className="relatedVideos"/><p>{url.title}</p></Link>
            ))}
        </div>
    );
};

export default OtherVideos;