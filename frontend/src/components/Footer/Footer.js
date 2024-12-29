import React from 'react';
import styles from './Footer.module.css';
import { FaTwitter, FaGithub, FaLinkedin, FaHome } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer>
            <div className={styles.sectionone}>
                <div className={styles.name}>Created by Mohamed Reda</div>
                <div className={styles.monkeytype}>Inspired by Monkeytype</div>
            </div>
            <div className={styles.sectiontwo}>
                <a href="https://x.com/reedaazz">
                <FaTwitter className={styles.icon} size={24}/>
                </a>
                <a href="https://github.com/reda193">
                <FaGithub className={styles.icon} size={24}/>
                </a>
                <a href="https://linkedin.com/in/mohamed-reda12">
                <FaLinkedin className={styles.icon} size={24}/>
                </a>
                <a href="">
                <FaHome className={styles.icon} size={24}/>
                </a>
            </div>
        </footer>
    );
};

export default Footer;