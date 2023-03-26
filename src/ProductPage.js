import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useEffect, useState} from "react";

function ProductPage() {

    const [publisherName , setPublisherName] = useState("");
    const [product , setProduct] = useState({});
    const [errorCode , setErrorCode] = useState(0);
    const [myoffers , setMyOffers] = useState([]);
    const [highestOffer , setHighestOffer] = useState(0);
    const [offerAmount , setOfferAmount] = useState(0);
    const [token , setToken] = useState("");
    const [username , setUsername] = useState("");
    const [userCredits , setUserCredits] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get("token");
        const productId = Cookies.get("productId")
        if (token == undefined) {
            navigate("../login")
        } else {
            setToken(token);
            axios.get("http://localhost:8989/get-user-by-token?token=" + token)
                .then((response) => {
                    setUsername(response.data.user.username)
                    setUserCredits(response.data.user.credits)
                })
            axios.get("http://localhost:8989/get-product?productId=" + productId)
                .then((response) => {
                    setProduct(response.data.product);
                    setPublisherName(product.publisherName)
                })
            axios.get("http://localhost:8989/my-offers?token=" + token)
                .then((response) => {
                    setMyOffers(response.data.Offers)
                })
            axios.get("http://localhost:8989/get-highest-offer?productId=" + productId)
                .then((response) => {
                    setHighestOffer(response.data.offer)
                })
        }
    },[])

    const submitOffer = () => {

    }


    return (
        <div>
            <h2>hello , {username}</h2>
            <h2>Your Credits is: {userCredits}</h2>

            {/*<Product data={product}/>*/}
            {
                publisherName == username ?
                    <button onClick={submitOffer} disabled={product.open}>Close Product</button>
                    :
                    <button onClick={submitOffer} disabled={product.open}>New Offer</button>
            }

            <div>
                <h2>My Offers: {myoffers.length}</h2>
                <ul>
                    {myoffers.map((offer) => (
                        <li style={{color : "blue"}} key={offer.id}>
                            {offer.offerAmount}
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    )
}

export default ProductPage;