import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './Results.module.css';

const Results = ({ userData, wpmPeak, wpmAvg, totalGames, accuracy }) => {
    const renderScreen = () => {
        if (wpmPeak === 0 || wpmPeak === null || !wpmAvg.length || wpmAvg === null || totalGames === 0 || totalGames === null) {
            return (
                <div className={styles.noData}>
                    <h2 className={styles.noDataTitle}>No Data Available</h2>
                    <p className={styles.noDataText}>You need to play a game!</p>
                </div>
            );
        }

        // Calculate averages
        const avgWPM = wpmAvg.reduce((a, b) => a + b, 0) / wpmAvg.length;
        const accuracyAVG = accuracy.reduce((a, b) => a + b, 0) / accuracy.length;

        // Create data points for the graph
        const graphData = wpmAvg.map((wpm, index) => ({
            game: index + 1,
            wpm: wpm,
            accuracy: accuracy[index] || 0
        }));

        return (
            <div className={styles.container}>
                <h2 className={styles.title}>
                    Typing Performance
                </h2>
                
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <h3 className={styles.statLabel}>Peak WPM</h3>
                        <p className={styles.statValue}>{wpmPeak}</p>
                    </div>
                    <div className={styles.statCard}>
                        <h3 className={styles.statLabel}>Avg WPM</h3>
                        <p className={styles.statValue}>{avgWPM.toFixed(1)}</p>
                    </div>
                    <div className={styles.statCard}>
                        <h3 className={styles.statLabel}>Avg Accuracy</h3>
                        <p className={styles.statValue}>{accuracyAVG.toFixed(1)}%</p>
                    </div>
                </div>

                <div className={styles.graphContainer}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart 
                            data={graphData} 
                            margin={{ top: 20, right: 50, left: 20, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis 
                                dataKey="game" 
                                stroke="#fff"
                                tick={{ fill: '#fff' }}
                                axisLine={{ stroke: '#fff' }}
                            />
                            <YAxis 
                                yAxisId="left"
                                stroke="#fff"
                                tick={{ fill: '#fff' }}
                                axisLine={{ stroke: '#fff' }}
                            />
                            <YAxis 
                                yAxisId="right" 
                                orientation="right"
                                domain={[0, 100]}
                                stroke="#fff"
                                tick={{ fill: '#fff' }}
                                axisLine={{ stroke: '#fff' }}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                                    border: '1px solid #374151',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    color: '#fff',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                }}
                                labelStyle={{ color: '#fff', marginBottom: '4px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend 
                                wrapperStyle={{ 
                                    padding: '20px 0',
                                    color: '#fff'
                                }}
                            />
                            <Line 
                                yAxisId="left"
                                type="monotone" 
                                dataKey="wpm" 
                                stroke="#3b82f6" 
                                name="WPM"
                                strokeWidth={3}
                                dot={{ fill: '#3b82f6', r: 4 }}
                                activeDot={{ r: 6, stroke: '#fff' }}
                            />
                            <Line 
                                yAxisId="right"
                                type="monotone" 
                                dataKey="accuracy" 
                                stroke="#fbbf24" 
                                name="Accuracy"
                                strokeWidth={3}
                                dot={{ fill: '#fbbf24', r: 4 }}
                                activeDot={{ r: 6, stroke: '#fff' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    };

    return <div className="p-4">{renderScreen()}</div>;
};

export default Results;