import React, { useState, useEffect } from 'react';

import styles from './Leaderboard.module.css';
import axios from '../../api/axios';

const Leader = ({}) => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    // Calculate total pages
    const totalPages = Math.ceil(leaderboardData.length / itemsPerPage);

    // Get current page's data
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = leaderboardData.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get('/leaderboard');
                setLeaderboardData(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch leaderboard data');
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (loading) return <div>Loading leaderboard...</div>;
    if (error) return <div>{error}</div>;
    return (
        <div className={styles.leaderboardContainer}>
            <h2 className={styles.leaderboardTitle}>Leaderboard</h2>
            <table className={styles.table}>
                <thead>
                    <tr className={styles.tableHeader}>
                        <th>Rank</th>
                        <th>Username</th>
                        <th>Peak WPM</th>
                        <th>Avg WPM</th>
                        <th>Accuracy</th>
                        <th>Games</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((user, index) => (
                        <tr key={user.username} className={styles.tableRow}>
                            <td className={`${styles.rank} ${(index + (currentPage - 1) * itemsPerPage) < 3 ? styles.topRank : ''} ${
                                (index + (currentPage - 1) * itemsPerPage) === 0 ? styles.firstPlace :
                                (index + (currentPage - 1) * itemsPerPage) === 1 ? styles.secondPlace :
                                (index + (currentPage - 1) * itemsPerPage) === 2 ? styles.thirdPlace : ''
                            }`}>
                                #{index + 1 + (currentPage - 1) * itemsPerPage}
                            </td>
                            <td className={styles.username}>{user.username}</td>
                            <td>{user.peakWPM}</td>
                            <td>{user.avgWPM}</td>
                            <td>{user.avgAccuracy} %</td>
                            <td>{user.totalGames}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className={styles.pagination}>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                        // If total pages is 5 or less, show all pages
                        pageNumber = i + 1;
                    } else {
                        // Calculate page numbers to show around current page
                        if (currentPage <= 3) {
                            pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNumber = totalPages - 4 + i;
                        } else {
                            pageNumber = currentPage - 2 + i;
                        }
                    }

                    return (
                        <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`${styles.pageButton} ${currentPage === pageNumber ? styles.activePage : ''}`}
                        >
                            {pageNumber}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default Leader;