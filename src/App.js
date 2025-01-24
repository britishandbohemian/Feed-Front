import React, { useEffect, useContext, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';

// Import components
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import Verify from './components/VerifyOTP';
import ViewTask from './components/ViewTask';
import TaskForm from './components/TaskForm';
import ResetPassword from './components/ResetPassword';
import ForgotPassword from './components/ForgotPassword';
import { UserProvider, UserContext } from './context/UserContext';

function App() {
    return (
        <UserProvider>
            <Router>
                <InactivityMonitor />
            </Router>
        </UserProvider>
    );
}

/**
 * This component wraps your routes in an "inactivity monitor".
 * It handles all the routing as well as the inactivity logic.
 */

function InactivityMonitor() {
    const navigate = useNavigate();
    const { logout } = useContext(UserContext);

    const inactivityTimerRef = useRef(null);

    const resetTimer = useCallback(() => {
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
        }
        inactivityTimerRef.current = setTimeout(() => {
            logout();
            navigate('/login');
        }, 600000);
    }, [logout, navigate]);

    useEffect(() => {
        const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
        const handleActivity = () => resetTimer();

        events.forEach((event) => window.addEventListener(event, handleActivity));
        resetTimer();

        return () => {
            events.forEach((event) => window.removeEventListener(event, handleActivity));
            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current);
            }
        };
    }, [resetTimer]);

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/verify-otp" element={<Verify />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/home" element={<Home />} />
                <Route path="/task" element={<ViewTask />} />
                <Route path="/task/new" element={<TaskForm />} />
                <Route path="/task/edit/:id" element={<TaskForm />} />
            </Routes>
        </div>
    );
}





export default App;
