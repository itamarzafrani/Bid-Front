import {useEffect, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";
import ProductComponent from "./ProductComponent";


function ManagePage() {

    const [users, setUsers] = useState([]);
    const [errorCode, setErrorCode] = useState(-1);
    const [openProducts, setOpenProducts] = useState([]);
    const [profitAmount, setProfitAmount] = useState(0);
    const [productAmount, setProductAmount] = useState(-1);
    const [credits, setCredits] = useState(0);
    const [isUserClicked, setIsUserClicked] = useState(false);
    const [currentUser, setCurrentUser] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get("token");
        if (token == undefined) {
            navigate("../login");
        }
        axios.get("http://localhost:8989/get-user-by-token?token=" + token)
            .then((response) => {
                setProfitAmount(response.data.user.credits);
            })
        axios.get("http://localhost:8989/get-all-users")
            .then((response) => {
                if (response.data.success) {
                    const usersList = response.data.users;
                    setUsers(usersList)
                }
            })
        axios.get("http://localhost:8989/get-all-open-products")
            .then((response) => {
                if (response.data.success) {
                    const openProducts = response.data.product
                    setOpenProducts(openProducts)
                    console.log(openProducts)
                }
            })
        axios.get("http://localhost:8989/get-all-open-products-by-id?userId=" + currentUser.id)
            .then((response) => {
                if (response.data.success) {
                    const allUserProducts = response.data.productsAmount
                    setProductAmount(allUserProducts);
                } else {
                    setProductAmount(0);
                }
            })
    }, [currentUser])

    const creditToAddChanged = (event) => {
        setCredits(event.target.value)
    }

    const addCredits = () => {
        const token = Cookies.get("token")
        const userIdForChangeCredits = currentUser.id
        axios.post("http://localhost:8989/add-credit-to-user?token="+token+"&credits="+credits+"&userIdForChangeCredits="+userIdForChangeCredits)
            .then((response) => {
            if (response.data.success) {
                setErrorCode(0)
            } else {
                setErrorCode(response.data.errorCode)
            }
        })
    }


    const handleUserClick = (user) => {
        setIsUserClicked(true)
        setCurrentUser(user);
        setErrorCode(-1)
        setCredits("")

    }


    return (
        <div className="page">

            <h2>System's users: {users.length} </h2>
            <table>
                <tr>
                    {users.map((user) => (
                        <tr style={{color: "blue"}} key={user.id} onClick={() => handleUserClick(user)}>
                            <button className={"button"} disabled={user.id == 1}>{user.username}</button>
                        </tr>
                    ))}
                </tr>
                Information About User: {errorCode === 0 && <div> Changes Save</div>}

                {(isUserClicked) && (
                    <tr>
                        <td>
                            UserName: {currentUser.username}
                        </td>

                        <td>
                            |
                        </td>
                        <td>
                            Credits : <input value={credits} onChange={creditToAddChanged} placeholder={"the user have: "+currentUser.credits +"$"} />
                            <button onClick={addCredits}>Save New Credit</button>
                        </td>
                        <td>
                            |
                        </td>
                        <td >
                            Open auctions : {productAmount}
                        </td>
                    </tr>


                )}
            </table>

            <div>
                <h2>System's Open Products: {openProducts.length} </h2>
                <div className="dashBoard1">
                    {openProducts.map((product) => (
                        <ProductComponent data={product}/>
                    ))}

                </div>
            </div>
        </div>

    )

}

export default ManagePage;


