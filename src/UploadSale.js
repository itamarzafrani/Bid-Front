import React, {useState} from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import ErrorMessage from "./ErrorMessage";
import './css/UploadSale.css';



function UploadSale() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [pictureLink, setPictureLink] = useState("");
    const [minimumPrice, setMinimumPrice] = useState(0);
    const [postSale, setPostSale] = useState(false);
    const [errorCode, setErrorCode] = useState(0);

    const token = Cookies.get("token");

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8989/post-product?token=' + token + '&productName=' + name + '&productDescription=' + description + '&startingPrice=' + minimumPrice + '&productImg=' + pictureLink)
            .then(response => {
                if (response.data.success) {
                    setPostSale(true)
                } else setErrorCode(response.data.errorCode)
            });
    };

    return (
        <div >
            {
                postSale ? (<h1>Your Product Posted Successfully! </h1>) : (
                    <form className="border" style={{paddingTop: "6%", paddingLeft: "12%" }} onSubmit={handleSubmit}>
                        <div>
                            Make a new Offer:
                            <br/>-------------------
                        </div>
                        <label>
                            Name:
                            <input type="text" value={name} onChange={e => setName(e.target.value)}/>
                        </label> <br/>
                        <label>
                            Description:
                            <input value={description} onChange={e => setDescription(e.target.value)}/>
                        </label><br/>
                        <label>
                            Picture Link:
                            <input type="text" value={pictureLink} onChange={e => setPictureLink(e.target.value)}/>
                        </label><br/>
                        <label>
                            Minimum Price:
                            <input type="text" value={minimumPrice} onChange={e => setMinimumPrice(e.target.value)}/>
                        </label><br/>
                        <button type="submit">Upload Product</button>
                        <div>
                            {
                                errorCode > 0 &&
                                <ErrorMessage message={errorCode} lineBreak={true}/>
                            }
                        </div>

                    </form>
                )
            }
        </div>


    );
}

export default UploadSale;
