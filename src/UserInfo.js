import React from 'react';

function UserInfo(props) {
    return (
        <div style={{textAlign: "left" , float: "left"}}>
            <p>Hello, {props.data.username}</p>
            <p>Credits: {props.data.credits} $</p>

        </div>
    );
}

export default UserInfo;