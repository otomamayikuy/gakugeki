import AuthWith from './auth_with'
import AuthEmail from './auth_email'
import Copyright from './copyright'
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import {Helmet} from 'react-helmet';
import "./globals.css"
import "./Home.module.css"


export default function Index(props) {
    const auth = getAuth(props.app);
    function signupSend(e, email, password){
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("新規登録しました。");
        })
        .catch((error) => {
            alert("既に登録されているメールアドレスです。");
        });
    }
    return (
        <div className="w-screen h-screen flex justify-center items-center bg-gray-800">
            <Helmet>
                <style>{'body { background-color: #aaa; }'}</style>
            </Helmet>
            <header>
                <title>新規登録 - 学檄Web</title>
                <meta name="description" content="Generated by create next app" />
            </header>
            <div className="w-full max-w-xs bg-white shadow-md rounded p-8">
                <h1 className="text-gray-900 text-lg font-bold mb-4">新規登録</h1>
                <AuthWith str="登録" />
                <hr className="my-2" />
                <AuthEmail str="登録" submit={(e, email, password)=>signupSend(e, email, password)} />
                <Link to="/">
                    <a className="text-sm text-gray-900 font-bold underline">→ログインはこちら</a>
                </Link>
                <p className="text-center text-gray-700 text-xs mt-4">
                    <Copyright />
                </p>
            </div>
        </div>
    );
}