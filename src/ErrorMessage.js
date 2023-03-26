function ErrorMessage(props) {
    let message = props.message

    switch (message) {
        case 0:
            message = ""
            break;
        case 1000:
            message = "Username is required!"
            break;
        case 1001:
            message = "Password is required!"
            break;
        case 1002:
            message = "Password is too weak"
            break;
        case 1003:
            message = "Username already taken"
            break;
        case 1004:
            message = "Wrong username or password"
            break;
        case 1005:
            message = "Username is required!"
            break;
        case 1006:
            message = "Password is required!"
            break;
        case 1007:
            message = "Password is too weak"
            break;
        case 1008:
            message = "Username already taken"
            break;
        case 1009:
            message = "Wrong username or password"
            break;
        case 1010:
            message = "No Product Description"
            break;
        case 1011:
            message = "No Product Img"
            break;
        case 1012:
            message = "No Product Name"
            break;
        case 1013:
            message = "No Product Staring Price"
            break;
        case 1014:
            message = "No 3 Offers On Sale"
            break;
        case 1020:
            message = "Offer Amount Is Lower Than Highest Offer"
            break;
        case 1021:
            message = "Offer Amount Is Lower Than Starting Price"
            break;
        case 1022:
            message = "Product Is Not For Sale Anymore"
            break;
        case 1023:
            message = "No Offer In The System"
            break;
        case 1024:
            message = "No Enough Money"
            break;
    }
    return (
        <span style={{color: "red"}}>
            {
                props.lineBreak ?
                    <div>
                        {message}
                    </div>
                    :
                    <span>
                        {message}
                    </span>
            }
        </span>
    )
}

export default ErrorMessage;