import { useNavigate } from "react-router-dom";
import {  useEffect } from 'react';

function Buck(props) {
    const navigate = useNavigate();
    useEffect(() => {
        if(!props.login){
            navigate("/")
        }
    },[])
    return <></>
}
export default Buck;