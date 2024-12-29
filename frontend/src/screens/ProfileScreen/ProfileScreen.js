import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Results from '../../components/Results/Results';
import './Profile.css';
import axios from "../../api/axios";

const ProfileScreen = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [wpmPeak, setWpmPeak] = useState(0);
    const [wpmAvg, setWpmAvg] = useState([]);
    const [totalGames, setTotalGames] = useState(0);
    const [accuracyAVG, setAccuracyAVG] = useState([]);
    useEffect(() => {
        const userData = localStorage.getItem('user');

        // Checks if user exists
        if (userData) {
            const parsedUser =JSON.parse(userData);
            const userId = parsedUser.userId;
            const response = axios.get(`/user/${userId}`, {
                withCredentials: true
            })
            .then(response => {
                setUser(response.data);
                setWpmPeak(response.data.wpm_peak);
                setWpmAvg(response.data.wpm_avg);
                setTotalGames(response.data.total_games);
                setAccuracyAVG(response.data.accuracy);
                if(wpmAvg === null) console.log('Null');
            })
            .catch(err => console.error('Error:', err));
        } else {
            navigate('/register');
        }
    }, [navigate]);


    return (
        <>
            <Header />
            <Results 
                userData={user}
                wpmPeak={wpmPeak}
                wpmAvg={wpmAvg}
                totalGames={totalGames}
                accuracy={accuracyAVG}
            />
        </>
    );
};

export default ProfileScreen;