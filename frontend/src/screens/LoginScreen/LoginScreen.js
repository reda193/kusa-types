import { useRef, useState, useEffect } from "react";
import './Login.css';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from 'react-router-dom';
import axios from "../../api/axios";
import Header from "../../components/Header/Header";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const LOGIN_URL = '/login';
const Login = () => {
    const navigate = useNavigate();
    
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validUser, setValidUser] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        setValidPwd(result);
    }, [pwd]);

    useEffect(() => {
        const result = USER_REGEX.test(user);
        setValidUser(result);
    }, [user])
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);

        if(!v1 || !v2) {
            setErrMsg('Invalid Entry');
            return;
        }
        try {   
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ username: user, password: pwd }),
                {
                    headers: { 'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );
            setSuccess(true);
            localStorage.setItem('user', JSON.stringify({
                username: user,
                userId: response.data.userId,
                isLoggedIn: true
            }));
            setTimeout(() => {
                navigate('/');
            })
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?. status === 409) {
                const errorMessage = err.response.data.message;
                setErrMsg(errorMessage);

            } else if(err.response?.status === 400) {
                const errorMessage = err.response.data.message;
                setErrMsg(errorMessage);
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }
    return (
        <>
        <Header />
        <div className='login'>

        {success ? (
            navigate('/')
        ) : (
        <section>
            <p ref={errRef} className={errMsg ? "errMsg" : "offscreen"} aria-live="assertive">
                {errMsg}
            </p>

            <h1 className="loginheader">Login</h1>
            <form onSubmit={handleSubmit}>
            <div className="username">
                <label htmlFor="username">
                    Username:
                    <span className={validUser ? "valid" : "hide"}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span  className={validUser || !user ? "hide": "invalid"}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </label>
                
                <input
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete = "off"
                    onChange = {(e) => setUser(e.target.value)}
                    required
                    aria-invalid={validUser ? "false": "true"}
                    aria-describedby = "uidnote"
                    onFocus = {() => setUserFocus(true)}
                    onBlur = {() => setUserFocus(false)}
                />
                <p id="uidnote" className={userFocus && user && 
                    !validUser ? "instructions": "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    4 to 24 characters. <br />
                    Must begin with a letter. <br />
                    Letters, numbers, underscores, hypens allowed.
                </p>
            </div>
            <div className="password">
                <label htmlFor="password">
                    Password:
                    <span className={validPwd ? "valid" : "hide"}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span  className={validPwd || !pwd ? "hide": "invalid"}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </label>
                <input
                    type="password"
                    id="password"
                    onChange = {(e) => setPwd(e.target.value)}
                    required
                    aria-describedby = "pwdnote"
                    onFocus = {() => setPwdFocus(true)}
                    onBlur = {() => setPwdFocus(false)}
                />
                <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Enter a valid password.
                </p>
            </div>
            <button className="loginbutton" disabled={!validUser || !validPwd ? true : false}>
                Login
            </button>
            <button 
    onClick={() => navigate('/verify')} 
    className="verifybutton"
>
    Verify your Email
</button>
            <p>
                Not Registered?<br />
                <span className="line" onClick={() => navigate('/register')}>
                    Sign Up
                </span>
            </p>
            </form>
        </section>
        )};
        </div>
        </>
    )
};

export default Login;