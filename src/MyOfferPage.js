import {useEffect, useState} from "react";
import axios from "axios";
import ErrorMessage from "./ErrorMessage";
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";

function MyOfferPage() {

    const [username, setUsername] = useState("");
    const [myOffers, setMyOffers] = useState([]);
    const [token, setToken] = useState("");
    const [highestOffer, setHighestOffer] = useState("");
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
                    })
                axios.get("http://localhost:8989/my-offers?token=" + token)
                    .then((response) => {
                        setMyOffers(response.data.offers)

                    })
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [myOffers])


    return (
        <div className="page">
            <div>
                <h4>Hello , {username} <br/> All your offers on product table : {}</h4>
            </div>

            <table className={"list-table"}>
                <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Offer Amount</th>
                    <th>Status</th>
                    <th>Winning Offer</th>
                </tr>
                </thead>
                <tbody>
                {
                    myOffers.map((offer) => {
                        return (
                            <tr>
                                <td>{offer.product.productName}</td>
                                <td>{offer.offerAmount}</td>
                                <td>{offer.product.open ? "Available" : "NotAvailable"}</td>
                                <td>{
                                    offer.product.open ? (
                                        <td>
                                            The Product For Sale
                                        </td>
                                    ) : (
                                        <td>
                                            {offer.winningOffer? (
                                                <td>
                                                    Won The Sale
                                                </td>
                                            ) : (
                                                <td>
                                                    Lost The Sale
                                                </td>
                                            )}
                                        </td>
                                    )
                                }</td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>


        </div>
    )
}

export default MyOfferPage;