import React, { useState } from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Sidebar from './Sidebar';
import Messages from './Messages';
import { Button } from '@mui/material';


export default function Chat() {
    const [selectedFriend, setSelectedFriend] = useState(null);

    const getSelectedUser = (user) => {
        setSelectedFriend(user);
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
            <Sidebar onFriendClick={getSelectedUser} />
            <Box display={'flex'} flexDirection={'column'} sx={{ height: '100vh', flexGrow: 1 }}>
                <Toolbar />
                {selectedFriend ? <Messages friend={selectedFriend} /> : <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexGrow: 1 }}><p>Please select a friend</p></Box>}
            </Box>
        </Box>
    );
}
