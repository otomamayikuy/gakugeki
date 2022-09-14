import {React, useState} from "react"
import logo from "../gakugeki_logo.jpg"
import "./Header.css"
import { Link } from "react-router-dom";

const Header = () => {
    const style = {
        position: "fixed",
        width:"100%",
        height:"70px",
        textAlign: "left",
        display:"inline-block",
        backgroundColor: "#222",
    }
    const style2 = {
        height:"70px",
        width:"100%"
    }
    const [open,setOpen] = useState(false);
    function menu(){
        setOpen(!open);
    }
    return (
        <header>
        <div style = {style} id="MainHeader">
            <img src={logo} alt="ロゴ" className="logo"/>
            <div className="hamburger_position">
                <div className="hamburger_btn" onClick={menu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            {open &&
            <div id="home_link">
                <Link to="/home">動画ホーム</Link>
                <Link to="/stage">ステージ一覧・予約</Link>
                <Link to="/room">ルーム一覧・ルーム作成</Link>
                <Link to="/introduction">学檄INFINITE紹介ページ</Link>
            </div>}
        </div>
        <div style = {style2}></div>
        </header>
    );
};

export default Header;