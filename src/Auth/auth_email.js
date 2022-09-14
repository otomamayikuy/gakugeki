import { Link } from "react-router-dom";
import Button from './button'
import {React, useState} from "react";

export default function AuthEmail({str, submit}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="py-2">
            <h2 className="text-gray-700 text-xs mb-2">ID／メールアドレスで{str}</h2>
            <form className="mb-2" onSubmit={(e)=>submit(e, email, password)}>
                <div className="mb-1">
                    <input onChange={(e)=>setEmail(e.target.value)} className="text-xs shadow-inner appearance-none rounded w-full py-3 px-4 text-gray-800 bg-gray-50 mb-2 focus:outline-solid focus:shadow-outline" id="user_id" type="text" placeholder="ID または メールアドレス" />
                    <input onChange={(e)=>setPassword(e.target.value)} className="text-xs shadow-inner appearance-none rounded w-full py-3 px-4 text-gray-800 bg-gray-50 focus:outline-solid focus:shadow-outline" id="user_pw" type="password" placeholder="パスワード" />
                </div>
                <div className="mb-1">
                    <Link to="/forget_password">
                        <a className="text-xs text-gray-700 underline">パスワードをお忘れの方はこちら</a>
                    </Link>
                </div>
                <div className="flex items-center justify-between">
                    <Button type="submit" className="border-blue-700 text-blue-700 w-full focus:outline-none focus:shadow-outline">
                    {str}
                    </Button>
                </div>
            </form>
        </div>
    );
}