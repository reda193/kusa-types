import React, { useRef, useState } from 'react';
import './Verify.css'
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const VERIFY_URL = '/verify';

const Verify = () => {
    const [email, setEmail] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const errRef = useRef();
    const navigate = useNavigate();

    const handleVerify = async (e) => {
        e.preventDefault();

        if (!email) {
            setErrMsg('Email is required');
            return;
        }

        try {
            const response = await axios.post(
                VERIFY_URL,
                JSON.stringify({ email }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            localStorage.setItem('registrationEmail', JSON.stringify({
                email: email,
                isRegistered: true
            }));
            navigate('/validate');
        } catch (err) {
            if(!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 429) {
                const errMessage = err.response.data.message;
                setErrMsg('Code already sent. ' + errMessage);
                navigate('/validate');
            } else if (err.response?.status === 400) {
                const errMessage = err.response.data.message;
                setErrMsg(errMessage);
            } else if (err.response?.status === 404) {
                const errMessage = err.response.data.message;
                setErrMsg(errMessage);
            } else {
                setErrMsg('Verification Failed.');
            }
        }
    };

    return (
        <div className="verify-container">
            <h1 className="verify-header">Verify Code</h1>
            <p ref={errRef} className={errMsg ? "errMsg" : "offscreen"} 
                aria-live="assertive">
                {errMsg}
            </p>
            <div className="email-input-container">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="email-input"
                />
            </div>
            <button className="verify-button" onClick={handleVerify}>
                Send Verification
            </button>
        </div>
    );
};

export default Verify;