import { Link, useNavigate } from "react-router-dom";
import AuthWith from './auth_with'
import AuthEmail from './auth_email'
import Copyright from './copyright';
import {Helmet} from 'react-helmet';
import "./globals.css"
import "./Home.module.css"


import { signInWithEmailAndPassword, getAuth, onAuthStateChanged } from "firebase/auth";


export default function Login(props) {
    const auth = getAuth(props.app);
    const navigate = useNavigate();

    function loginSend(e, email, password){
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            onAuthStateChanged(auth, (user) => {
            if (user) {
                props.setLogin(true)
                props.setUid(user.uid)
                navigate("../myPage");
            } else {

            }
            });
        })
        .catch((error) => {
            alert("メールアドレスまたはパスワードが間違っています。");
        });
    }
    return (
        <div className="w-screen h-screen flex justify-center items-center bg-gray-800">
            <Helmet>
                <style>{'body { background-color: #aaa; }'}</style>
            </Helmet>
            <header>
                <title>ログイン - 学檄Web</title>
                <meta name="description" content="Generated by create next app" />
            </header>
            <div className="w-full max-w-xs bg-white shadow-md rounded p-8">
                <h1 className="text-gray-900 text-lg font-bold mb-4">ログイン</h1>
                <AuthWith str="ログイン" />
                <hr className="my-2" />
                <AuthEmail str="ログイン" submit={(e, email, password)=>loginSend(e, email, password)} />
                <Link to="/signup">
                    <a className="text-sm text-gray-900 font-bold underline">→新規登録はこちら</a>
                </Link>
                <p className="text-center text-gray-700 text-xs mt-4">
                    <Copyright />
                </p>
            </div>
        </div>
    );
}