import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Sidebar from './Sidebar';
import Messages from './Messages';
import axiosInstance from '../AxiosInstance';
import ChatHeader from './ChatHeader';

export default function Chat() {
    const [currentUser, setCurrentUser] = useState(null);
    const [unfriendedUsers, setUnfriendedUsers] = useState([]);
    const [activeFriends, setActiveFriends] = useState([]);

    useEffect(() => {
        axiosInstance.get('/users/my_details/')
            .then(response => {
                setCurrentUser("personal",response.data);
                setActiveFriends(response.data.friends)
            })
            .catch(error => {
                console.error('Error fetching current user details:', error);
            });

        axiosInstance.get('/users/unfriended_users/')
            .then(response => {
                setUnfriendedUsers(response.data); // Assuming response.data is an array of unfriended users
            })
            .catch(error => {
                console.error('Error fetching unfriended users:', error);
            });
    }, []);

    const handleUserClick = (user) => {
        // Handle user click logic
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ boxShadow: 0, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Zentratech
                    </Typography>
                </Toolbar>
            </AppBar>
            <Sidebar friends={activeFriends} users={unfriendedUsers} onUserClick={handleUserClick} />
            <Box display={'flex'} flexDirection={'column'} sx={{ height: '100vh', flexGrow: 1 }}>
                <Toolbar />
                <ChatHeader name={currentUser ? currentUser.username : ''} />
                <Messages />
            </Box>
        </Box>
    );
}
