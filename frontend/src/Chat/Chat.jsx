import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Sidebar from './Sidebar';
import Messages from './Messages';
import axiosInstance from '../AxiosInstance';
import { Button } from '@mui/material';
import { useLocation } from 'react-router-dom';


export default function Chat() {
    const { state } = useLocation();

    const [unfriendedUsers, setUnfriendedUsers] = useState([]);
    const [activeFriends, setActiveFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const wsRef = useRef(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get(`/users/${state.user_id}/`);
                const userData = response.data;
                setActiveFriends(userData.friends);

                const unfriendedResponse = await axiosInstance.get(`/users/?id__not=${userData.friends.join(',')},${state.user_id}`);
                setUnfriendedUsers(unfriendedResponse.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (state.user_id) {
            fetchUserData();
        }
    }, [state.user_id]);


    const getSelectedUser = (user) => {
        setSelectedFriend(user);
    };

    const handleSendMessage = (message) => {
        if (selectedFriend && wsRef.current && message.trim()) {
            wsRef.current.send(JSON.stringify({ message }));
        }
    };


    const handleLogout = () => {
        localStorage.removeItem('jwt-access-token');
        localStorage.removeItem('jwt-refresh-token');
        window.location.href = '/';
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ boxShadow: 0, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Zentratech
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button variant="contained" color="error" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>
            <Sidebar friends={activeFriends} users={unfriendedUsers} onFriendClick={getSelectedUser} />
            <Box display={'flex'} flexDirection={'column'} sx={{ height: '100vh', flexGrow: 1 }}>
                <Toolbar />
                {selectedFriend ? <Messages friend={selectedFriend} /> : <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexGrow: 1 }}><p>Please select a friend</p></Box>}
            </Box>
        </Box>
    );
}
