import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import TypingScreen from './screens/TypingScreen/TypingScreen';
import RegisterScreen from './screens/RegisterScreen/RegisterScreen';
import LoginScreen from './screens/LoginScreen/LoginScreen';
import ProfileScreen from './screens/ProfileScreen/ProfileScreen';
import Leaderboard from './screens/LeaderboardScreen/LeaderboardScreen';
import Verification from './screens/VerificationScreen/VerificationScreen';
import VerifyScreen from './screens/VerfiyScreen/VerifyScreen';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/" element={<TypingScreen />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfileScreen />
            </ProtectedRoute>
          } />
          <Route path="/validate" element={
            <ProtectedRoute>
              <Verification />
            </ProtectedRoute>
          } />
          <Route path="/verify" element={
            <ProtectedRoute>
              <VerifyScreen />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;