import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthContext, AuthProvider } from "./context/Auth";



import Home from "./pages/home/Home";
import Login from "./pages/Login";
import Register from "./pages/home/Register";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        return <div>Loading...</div>;
    }

    const { user, loading } = authContext;

    if (loading) return <div>Loading...</div>;

    return user ? children : <Navigate to="/login" />;
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
