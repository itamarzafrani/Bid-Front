import {useEffect, useState} from "react";
import axios from "axios";
import ErrorMessage from "./ErrorMessage";
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";

function MyProductPage() {

    const [username , setUsername] = useState("");
    const [userBalance , setUserBalance] = useState("");
    const [errorCode , setErrorCode] = useState(0);
    const [myProducts , setMyProducts] = useState([]);
    const [token , setToken] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get("token");
            if (token == undefined) {
            navigate("../login")
        } else {
            setToken(token);
            const interval = setInterval(() => {
            axios.get("http://localhost:8989/get-username?token=" + token)
                .then((response) => {
                    setUsername(response.data.username);
                    setUserBalance(response.data.credits)
                })
            axios.get("http://localhost:8989/my-products?token=" + token)
                .then((response) => {
                    setMyProducts(response.data.product)
                })
            }, 1000);
                return () => clearInterval(interval);
        }
    })


    return (
        <div className={"page"}>

            <div>
                <h3>Hello , {username}</h3>
                <h3>All Your Product: </h3>
            </div>

            <table className={"list-table"}>
                <thead>
                <tr>
                    <th style={{border: "1px solid black"}} >Product Name</th>
                    <th style={{border: "1px solid black"}} >Price</th>
                    <th style={{border: "1px solid black"}} >Status</th>
                </tr>
                </thead>
                <tbody>
                {
                    myProducts.map((product) => {
                        return(
                            <tr>
                                <td>{product.productName}</td>
                                <td>{product.productStartingPrice}</td>
                                <td>{product.open?"Available":"NotAvailable"}</td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
        </div>
    )
}

export default MyProductPage;