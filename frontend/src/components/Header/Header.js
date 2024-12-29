import React, { useState, useEffect} from 'react';
import { FaRegUser, FaCrown, FaInfo } from "react-icons/fa";
import { IoMdSettings } from 'react-icons/io';
import styles from './Header.module.css';
import { useNavigate } from 'react-router-dom';
import axios from "../../api/axios";
import Modal from '../Modal/Modal';
const LOGOUT_URL = '/logout'

const Header = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(LOGOUT_URL, 
                JSON.stringify({}),
                {   
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response.status === 204) {
                localStorage.removeItem('user');
                setUser(null);
                navigate('/');
            }
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };
    return (
        <div className={styles.header}>
            <div className={styles.leftheader}>
                <h1
                    onClick={() => handleNavigation('/')}
                    className={styles.logo}
                >
                    KusaTypes
                </h1>
                <div onClick={() => setIsSettingsModalOpen(true)} style={{ cursor: 'pointer' }}>
        <IoMdSettings className={styles.icon} />
      </div>

      <Modal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)}>
        <h2 className={styles.title}>Settings</h2>
        <div className={styles.text}>
          <p>Soon to come</p>
        </div>
      </Modal>                
      <FaCrown onClick={() => handleNavigation('/leaderboard')} className={styles.icon} />
      <div onClick={() => setIsModalOpen(true)} style={{ cursor: 'pointer' }}>
        <FaInfo className={styles.icon} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className={styles.title}>About KusaTypes</h2>
        <div className={styles.text}>
          <p>
            Project I wanted to do for myself... a lot of stuff to still fix, 
            but ability to register/login, view stats, and check leaderboard 
            all available. Various gamemodes as well.
          </p>
        </div>
      </Modal>
            </div>
            <div className={styles.rightheader}>
            {user ? (
                    <div className={styles.profile}>  
                        <div 
                            className={styles.user} onClick={() => handleNavigation('/profile')}
                        >
                            <FaRegUser className="icon" />
                            <span>   {user.username}</span>
                        </div>
                        
                        <div className={styles.logout}>
                            <button onClick={handleLogout} className={styles.signout}>
                             Sign Out
                            </button>
                        </div>
                    </div>
                ) : (
                    <FaRegUser 
                        className={styles.icon}
                        onClick={() => handleNavigation('/register')}
                    />
                )}
            </div>
        </div>

    );
};

export default Header;