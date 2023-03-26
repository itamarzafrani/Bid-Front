import React, {useState, useEffect} from 'react';
import axios from "axios";
import Cookies from "js-cookie";
import ErrorMessage from "./ErrorMessage";
import './css/InnerProduct.css';
import {useNavigate} from "react-router-dom";




function InnerProduct() {
    const [product, setProduct] = useState({});
    const [publisher, setPublisher] = useState({});
    const [closedSale, setClosedSale] = useState(false);
    const [errorCode, setErrorCode] = useState(0);
    const [offerPrice, setOfferPrice] = useState("");
    const [offerSuccess, setIsOfferSuccess] = useState(false);
    const [offerAmount, setOfferAmount] = useState(0);
    const [offerList, setOfferList] = useState([{}]);

    const navigate = useNavigate();
    const productId = Cookies.get("productId");
    const token = Cookies.get("token");

    useEffect(() => {
        const interval = setInterval(() => {

            axios.get("http://localhost:8989/get-product?productId=" + productId)
            .then((response) => {
                const productThatFound = response.data.product;
                setProduct(productThatFound);
                setPublisher(productThatFound.publisher)

            });

        axios.get("http://localhost:8989/get-amount-of-my-offers-on-product?token="+token+"&productId="+productId)
            .then((response) => {
                setOfferList(response.data.myOffersOnProduct)
                setOfferAmount(response.data.myOffersOnProduct.length);
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [offerList]);



    const closeSale = () => {
        axios.post("http://localhost:8989/close-product?token=" + token + "&productId=" + productId).then((response) => {
            if (response.data.success) {
                setClosedSale(true)
                console.log(closedSale)
            } else {
                const newErrorCode = response.data.errorCode;
                setErrorCode(newErrorCode)
                setTimeout(() => {

                    }, 2000)
                navigate("./dashboard")
            }
        })
    }

    const saleOffer = () => {
        axios.post("http://localhost:8989/post-offer?token=" + token + "&productId=" + productId + "&offerPrice=" + offerPrice).then((response) => {
            if (response.data.success) {
                setIsOfferSuccess(true)
            } else {
                const newErrorCode = response.data.errorCode;
                setErrorCode(newErrorCode)
            }
        })

    }



    return (
        <div  className="borderrr">
            {
                closedSale ? (
                    <div>
                        The Sale closed sucessfuly!
                        Your Credit will Shortly Arrived!
                    </div>
                ) : (
                    <div >
                        <h1>{product.productName}</h1>
                        <img src={product.productImg} alt="product"/>
                        <h2>By {publisher.username}</h2>
                        <h2> The Creation Date Of This Product Is:<br/> {product.creationDate}</h2>
                        <br/>
                        <br/>
                        <h2>You have {offerAmount} offer on this product</h2>
                        <div>
                            Your Offers Are
                            {offerList.map((offer) => (
                                <div>

                                       In {offer.offerDate} Your Offer Was {offer.offerAmount}$

                                </div>
                            ))}
                        </div>

                        <div>
                            {
                                token === publisher.token ? (<button onClick={closeSale}>Close Sale</button>) : (
                                    <div>
                                        {
                                            offerSuccess ? (<h1> The Offer Upload Successfully</h1>) : (
                                                <div>
                                                    <button onClick={saleOffer}>Give An Offer</button>
                                                    <input
                                                        onChange={e => setOfferPrice(e.target.value) & setErrorCode(0)}/>
                                                    <ErrorMessage message={errorCode} lineBreak={true}/>
                                                </div>
                                            )
                                        }
                                    </div>
                                )
                            }
                        </div>
                        <div>
                            {errorCode === 1014 && <h1> There is no 3 offers on this Sale</h1>}
                        </div>
                    </div>

                )


            }
        </div>
    )
}

export default InnerProduct;