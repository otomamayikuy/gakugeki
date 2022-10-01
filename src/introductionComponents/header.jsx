import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
    const [open,setOpen] = useState(false);
    function menu(){
        setOpen(!open);
    }
    return(
        <>
        <div id="header">
            <div className="hamburger_position">
                <div className="hamburger_btn" onClick={menu}>
                <span></span>
                <span></span>
                <span></span>
                </div>
            </div>
            <nav className="nav_links">
            <ul>
                <li><a href="#activities">活動内容</a></li>
                <li><a href="#organizationChart">組織図</a></li>
                <li><a href="#menbers">メンバー</a></li>
                <li><a href="#Groups">参画団体</a></li>
                <li><Link to="/home">動画ホーム</Link></li>
            </ul>
            </nav>
        </div>
        {open &&
            <div id="menu" >
                <nav className="menu_links">
                    <a href="#activities">活動内容</a>
                    <a href="#organizationChart">組織図</a>
                    <a href="#menbers">メンバー</a>
                    <a href="#Groups">参画団体</a>
                    <Link to="/">動画ホーム</Link>
                </nav>
        </div>}
        </>
    )
}