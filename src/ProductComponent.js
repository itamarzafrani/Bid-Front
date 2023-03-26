import { useEffect, useState } from "react";
import "./css/ProductComponent.css";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import React from "react";

function ProductComponent(props) {
    const [highestOffer, setHighestOffer] = useState(0.0);
    const [offerUserAmount, setOfferUserAmount] = useState(0);
    const [offerList, setOfferList] = useState([{}]);
    const [offerAmount, setOfferAmount] = useState(0);

    const token = Cookies.get("token");

    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            axios.get("http://localhost:8989/get-highest-offer?productId=" + props.data.id)
                .then((response) => {
                    // const offerFound = response.data.offer;
                    // const highestOfferFound = offerFound.offerAmount
                    setHighestOffer(response.data.offer.offerAmount);
                });
            axios.get("http://localhost:8989/get-amount-of-offers-on-product?token="+token+"&productId=" + props.data.id)
                .then((response) => {
                    setOfferUserAmount(response.data.amountOfUsersOnProduct)
                });


            axios.get("http://localhost:8989/get-amount-of-my-offers-on-product?token="+token+"&productId="+props.data.id)
                .then((response) => {
                    setOfferList(response.data.myOffersOnProduct)
                    setOfferAmount(response.data.myOffersOnProduct.length);
                });

        }, 1000);
        return () => clearInterval(interval);
    }, [offerList]);

    const ClickCom = () => {
        Cookies.set("productId",props.data.id)
        navigate("../inner-product");
    };


        return (
            <div className="ProductComponent1" onClick={ClickCom} >
                <h1> {props.data.productName} By {props.data.publisher.username}</h1>
                <img  className="productImg" src={props.data.productImg} alt="product"/>
                <h6>There Is {offerUserAmount} Users That Offer To that Sale</h6>
                <h5> Description : {props.data.productDescription}</h5>
                <h3> Highest Offer : <div style={{color: "green"}}>{highestOffer}$ </div></h3>
                <h6>The minimum offer is: {props.data.productStartingPrice}</h6>

            </div>
        );

}
export default ProductComponent;