import {useEffect, useState} from "react";
import axios from "axios";
import ProductComponent from "./ProductComponent";
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";
import './css/DashBoard.css';


function DashboardPage() {

// eslint-disable-next-line react-hooks/rules-of-hooks
    const [Products, setProducts] = useState([]);
    const [token, setToken] = useState("");
    const [userName, setUsername] = useState("");
    const [offerUsername, setOfferUsername] = useState("");
    const [offerNotification, setOfferNotification] = useState(false);
    const [sellerUsername, setSellerUsername] = useState("");
    const [sellerNotification, setSellerNotification] = useState(false);

    const navigate = useNavigate();


    useEffect(() => {
        let closeProductSse
        const token = Cookies.get("token");
        if (token == undefined) {
            navigate("../login");
        } else {
            setToken(token);
            const interval = setInterval(() => {
                axios.get("http://localhost:8989/get-username?token=" + token)
                .then((response) => {
                    setUsername(response.data.username);
                })
            axios.get("http://localhost:8989/get-all-open-products").then((response) => {
                    const openProducts = response.data.product;
                    setProducts(openProducts)
                }
            );
            }, 2000);
            closeProductSse = new EventSource("http://localhost:8989/dashboard-sse-handler?token=" + token);
            console.log(closeProductSse)
            closeProductSse.onmessage = (message) => {
                const data = JSON.parse(message.data);
                if (data.eventType == "1") {
                    setSellerUsername(data.sellerUsername);
                    setSellerNotification(true);
                    setTimeout(() => {
                        setSellerNotification(false);
                    }, 10000)
                } else if (data.eventType == "2") {
                    setOfferUsername(data.offerUsername);
                    setOfferNotification(true);
                    setTimeout(() => {
                        setOfferNotification(false);
                    }, 10000)
                }
            }
            return () => {
                clearInterval(interval);
                closeProductSse.close();
            }


        }
    }, );


    const [searchText, setSearchText] = useState('');
    const handleSearch = (event) => {
        setSearchText(event.target.value);
    };

    const filteredProducts = Products.filter((product) =>
        product.productName.includes(searchText)
    );

    return (

        <div>
            <header>
                <h1>Open Products</h1>
                <input type="text" onChange={handleSearch} placeholder="Search Products" />
            </header>

            <div className={"sse"} >
                {
                    offerNotification &&
                    <div>
                        {offerUsername} has new offer on your product
                    </div>
                }
                {
                    sellerNotification
                    &&
                    <div>
                        {sellerUsername} has closed the auction on the product you offered on"
                    </div>
                }
            </div>

            <div className="dashBoard1">
                {
                    filteredProducts.length==0?(
                        <h1>There Is No Products To Sell Yet!</h1>
                    ):(
                        filteredProducts.map((product) => {
                            return (
                                <div >
                                    <ProductComponent  data={product} username = {userName}/>
                                </div>
                            )
                        })
                    )


                }
            </div>
        </div>
    )
}
export default DashboardPage;