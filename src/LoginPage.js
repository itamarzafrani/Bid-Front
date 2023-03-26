import {useEffect, useState} from "react";
import axios from "axios";
import ErrorMessage from "./ErrorMessage";
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";

function LoginPage() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [type, setType] = useState("login");
    const [errorCode, setErrorCode] = useState(0);
    const [offerAmount, setOfferAmount] = useState(1);
    const [userAmount, setUserAmount] = useState(1);
    const [productAmount, setProductAmount] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            const token = Cookies.get("token");
            if (token == undefined) {
                axios.get("http://localhost:8989/get-all-users")
                    .then((response) => {
                        const usersSize = response.data.users.length
                        setUserAmount(usersSize)
                    })
                axios.get("http://localhost:8989/get-all-offers")
                    .then((response) => {
                        const offersSize = response.data.offers.length
                        setOfferAmount(offersSize)
                    })
                axios.get("http://localhost:8989/get-all-products")
                    .then((response) => {
                        const productSize = response.data.product.length
                        setProductAmount(productSize)
                    })
            }
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const usernameChanged = (event) => {
        setUsername(event.target.value);
    }

    const passwordChanged = (event) => {
        setPassword(event.target.value);
    }

    const password2Changed = (event) => {
        setPassword2(event.target.value)
    }


    const typeChanged = (event) => {
        setType(event.target.value);
    }

    const submitAsAdmin = (event) => {
        if (type == "admin") {
            axios.get("http://localhost:8989/login-as-admin", {
                params: {username, password}
            }).then((response) => {
                if (response.data.success) {
                    setErrorCode(0)
                    Cookies.set("token", response.data.token)
                    navigate("../manage")
                } else {
                    setErrorCode(response.data.errorCode)
                }
            })
        }
    }

    const submit = (event) => {
        if (type == "admin") {
            axios.get("http://localhost:8989/login-as-admin", {
                params: {username, password}
            }).then((response) => {
                if (response.data.success) {
                    setErrorCode(0)
                    Cookies.set("token", response.data.token)
                    navigate("../manage")
                } else {
                    setErrorCode(response.data.errorCode)
                }
            })
        }
        if (type == "signUp") {
            axios.post("http://localhost:8989/sign-up", null, {
                params: {username, password}
            }).then((response) => {
                if (response.data.success) {
                    setErrorCode(0)
                    alert("OK")
                    navigate("../login")
                } else {
                    setErrorCode(response.data.errorCode);
                }
            })
        } else {
            axios.get("http://localhost:8989/login", {
                params: {username, password}
            }).then((response) => {
                if (response.data.success) {
                    setErrorCode(0)
                    Cookies.set("token", response.data.token)
                    navigate("../dashboard")
                } else {
                    setErrorCode(response.data.errorCode)
                }
            })
        }
    }

    return (
        <div className="page">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh'}}>
                <h4 className={"h4-style"}>User Amount In The System:{userAmount}<br />
                    Offers Amount In The System:{offerAmount} <br />
                    Products Amount In The System:{productAmount} </h4>
            </div>

            <div className="main">
                <div className="sub-main" >
                    <table id={"login-table"}>
                        <tr className={"tr-login-radio"}>
                            <input type={"radio"} name={"type"} value={"login"} checked={type == "login"} onChange={typeChanged}/> Login
                            <input type={"radio"} name={"type"} value={"signUp"} checked={type == "signUp"} onChange={typeChanged}/> Sign Up
                            <input type={"radio"} name={"type"} value={"admin"} checked={type == "admin"} onChange={typeChanged}/> Login For Admin
                        </tr>

                        <tr >
                            <input className="box" type={"text"} placeholder={"Username"} value={username} onChange={usernameChanged}/>
                        </tr>
                        <tr >
                            <input className="box" type={"password"} placeholder={"Password"}  value={password} onChange={passwordChanged}/>
                            {
                                type == "signUp" && password.length<6 && password.length>0 &&
                                <ErrorMessage message={"Password Too Weak"} lineBreak={"false"}/>
                            }
                        </tr>
                        {
                            type == "signUp" &&
                            <tr>
                                <input className="box" type={"password"} placeholder={"Repeat Password"} value={password2} onChange={password2Changed}/>
                                {
                                    password != password2 &&
                                    <ErrorMessage message={"Password Don't Match"} lineBreak={"true"}/>
                                }
                            </tr>
                        }
                        {
                            errorCode > 0 &&
                            <ErrorMessage message={errorCode} lineBreak={true}/>
                        }
                        {(type == "signUp") || (type == "login") ?
                            <button className="login-button" onClick={submit} disabled={
                                password.length < 6 ||
                                (type == "signUp" && password != password2) ||
                                username.length == 0
                            }>{type == "signUp" ? "Sign Up" : "Login"}</button>
                            :
                            <button className="login-button" onClick={submitAsAdmin} disabled={password.length < 6}>Login As Admin</button>
                        }
                    </table>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;