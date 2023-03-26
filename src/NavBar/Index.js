import React, {useState, useEffect} from "react";
import {Nav, NavLink, NavMenu} from "./NavbarElements";
import Cookies from "js-cookie";
import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";

import axios from "axios";
import '../App.css'

const Index = () => {
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState({});
    const [userName, setUserName] = useState("");
    const [credits, setCredits] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get("token");

    useEffect(() => {
        token !== undefined && (setIsLogged(true))
        const interval = setInterval(() => {

            axios.get("http://localhost:8989/get-user-by-token?token=" + token)
            .then((response) => {
                    setUser(response.data.user);
                    setUserName(response.data.user.username)
                    setCredits(response.data.user.credits)
                    if (response.data.user.id === 1) {
                        setIsAdmin(true)
                    }else setIsAdmin(false)
                }
            )
        }, 500);
        return () => clearInterval(interval);
    }, [token]);


    const logOut = () => {
        Cookies.remove("token")
        setIsLogged(false)
        setIsAdmin(false)
        navigate("../login")
    }

    const logIn = () => {
        isLogged &&
        Cookies.set("token", token)
        navigate("../login")
    }

    const newSale = () => {
        navigate("../upload-sale")
    }
    const dashboard = () => {
        Cookies.remove("productId")    }


    return (
        <div className='navbar'>
            <div className="userInfo">
                {isLogged && (
                    <div style={{textAlign:"left"}}>
                        Hello, {userName} <br/>
                        <div>
                            {isAdmin?(<div> The Amount In The System Is: {credits}$ </div>):(<div>  Credits: {credits}$</div>)}
                        </div>

                    </div>)}
            </div>
            <h5 style={{textAlign: "left"}}>Bid It</h5>
            <div>
                {
                    isLogged && (
                        <div>
                            {isAdmin ? (
                                <Nav>
                                    <NavMenu>
                                        <NavLink to="/manage" activeStyle>
                                            Manage
                                        </NavLink>
                                        {
                                            isLogged ? (
                                                    <div>
                                                        <Button onClick={logOut}>Logout</Button>
                                                    </div>
                                                ) :
                                                <Button onClick={logIn}>Login</Button>

                                        }
                                    </NavMenu>
                                </Nav>
                            ) : (
                                <Nav>
                                    <NavMenu>
                                        <NavLink onClick= {dashboard} to="/dashboard" activeStyle>
                                            Dashboard
                                        </NavLink>
                                        <NavLink to="/my-offer" activeStyle>
                                            My Offers
                                        </NavLink>
                                        <NavLink to="/my-product" activeStyle>
                                            My-Products
                                        </NavLink>
                                        {
                                            isLogged ? (
                                                    <div>
                                                        <Button onClick={logOut}>Logout</Button>
                                                        <Button onClick={newSale}> New Sale </Button>
                                                    </div>
                                                ) :
                                                <Button onClick={logIn}>Login</Button>

                                        }
                                    </NavMenu>
                                </Nav>

                            )}
                        </div>

                    )
                }
            </div>
        </div>
    )
}
export default Index;




