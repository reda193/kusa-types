import React, { useRef, useState } from 'react';
import './Verification.css'
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const VALIDATE_URL = '/validate';

const VERIFY_URL = '/verify';

const Verification = () => {
    const [code, setCode] = useState(Array(6).fill(''));
    const [errMsg, setErrMsg] = useState('');
    const errRef = useRef();
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const handleInput = (e, index) => {
        const value = e.target.value.slice(-1);
        if (isNaN(value)) return;

        setCode(prev => {
            const newCode = [...prev];
            newCode[index] = value;
            return newCode;
        });

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleValidate = async (e) => {
        e.preventDefault();
        
        // Combine code
        const enteredCode = code.join('');
        if (enteredCode.length < 6) {
            setErrMsg("Please complete the verification code.");
            return;
        }
    
        const registeredEmail = localStorage.getItem('registrationEmail');
        if(!registeredEmail) {
            setErrMsg("You must register first.");
            return;
        }
        const user = JSON.parse(registeredEmail);
        
        try {
            const response = await axios.post(
                VALIDATE_URL, 
                JSON.stringify({ email: user.email, code: enteredCode }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log('Verification Successful', response.data);
            setTimeout(() => {
                navigate('/login');
            });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg(err.response.data.message);
            } else if (err.response?.status === 404) {
                setErrMsg(err.response.data.message);
            } else if (err.response?.status === 500) {
                setErrMsg('Server Error');
            } else {
                setErrMsg('Verification failed. Please try again.');
            }
            console.error('Verification Failed:', err);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        
        const registeredEmail = localStorage.getItem('registrationEmail');
        
        if(!registeredEmail) {
            navigate('/verify')
            return;
        }
        const user = JSON.parse(registeredEmail);

        try {
            const response = await axios.post(
                VERIFY_URL,
                JSON.stringify({ email: user.email }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            navigate('/validate');

        } catch (err) {
            if(!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 429) {
                const errMessage = err.response.data.message;
                setErrMsg('Code already sent. ' + errMessage);
            } else {
                setErrMsg('Verification Failed.');
            }
        }
    };

    return (
        <div className="verify-container">
            <h1 className="verify-header">Verify Code</h1>
            <p ref={errRef} className={errMsg ? "errMsg" : 
                "offscreen"} aria-live="assertive">
                {errMsg}
            </p>
            <div className="code-inputs">
                {Array(6).fill().map((_, i) => (
                    <input
                        key={i}
                        ref={el => inputRefs.current[i] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={code[i]}
                        onChange={e => handleInput(e, i)}
                        onKeyDown={e => handleKeyDown(e, i)}
                    />
                ))}
            </div>
            <button onClick={handleValidate} className='verifybutton'>Verify Email</button>
            <button onClick={handleVerify} className='verifybutton'>Request New Code</button>
        </div>
    );
};

export default Verification;