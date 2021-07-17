import React, {useEffect, useState} from 'react';
import axios from "axios";

function Subscribe(props) {

    const [subscribeNumber, setSubscribeNumber] = useState(0);
    const [subscribed, setSubscribed] = useState(false);
    useEffect(() => {
        let userInfo = {userTo: props.userTo}
        axios.post('/api/subscribe/subscribeNumber', userInfo)
            .then(res => {
                if (res.data.success) {
                    console.log('subscribeNumber', res.data.subscribeNumber)
                    setSubscribeNumber(res.data.subscribeNumber);
                } else {
                    alert('구독자 수 정보를 받아오지 못했습니다.')

                }
            })

        userInfo['userFrom'] = localStorage.getItem('userId');

        axios.post('/api/subscribe/subscribed', userInfo)
            .then(res => {
                if(res.data.success) {
                    console.log(res.data.subscribed)
                    setSubscribed(res.data.subscribed);
                } else {
                    alert('정보를 받아오지 못했습니다.');
                }
            })
    }, );


    return (
        <div>
            <button
                style={{
                    backgroundColor: `${subscribed ? '#AAAAAA': '#CC0000'}`, borderRadius: '4px',
                    color: 'white', padding: '10px 16px', fontWeight: '500',
                    fontSize: '1rem', textTransform: 'uppercase'
                }}
                onClick
            >{subscribeNumber} {subscribed ? 'Subscribed': 'Subscribe'}
            </button>
        </div>
    );
}

export default Subscribe;