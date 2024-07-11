import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const accessToken = localStorage.getItem('jwt-access-token'); // Check if the access token exists

    return accessToken ? children : <Navigate to="/" />;
};

export default PrivateRoute;