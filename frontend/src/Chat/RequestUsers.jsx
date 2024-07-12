import { Avatar, Button, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText } from '@mui/material';
import React, { useState, useEffect } from 'react';
import axiosInstance from '../AxiosInstance';
import { useLocation } from 'react-router-dom';
import Divider from '@mui/material/Divider';

export default function RequestUsers({ notConnectedUsersList, setRequestPendingUsers }) {
    const { state } = useLocation();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setUsers(notConnectedUsersList);
    }, [notConnectedUsersList]);

    const handleRequestClick = async (user) => {
        try {
            const response = await axiosInstance.post('/friend-requests/', {
                from_user: state.user_id,
                to_user: user.id
            });
            console.log("1 ", user, users)
            setUsers(prevUsers => prevUsers.filter(user => user.id !== user.id));
            console.log("2 ",user, users)
            setRequestPendingUsers(prev => [...prev, user]);
            console.log('Friend request:', response.data);
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    return (
        <List>
            {users.map((user, index) => (
                <React.Fragment key={user.id}>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar alt={user.username} src={`/static/images/avatar/s.jpg`} />
                        </ListItemAvatar>
                        <ListItemText primary={user.username} />
                        <ListItemSecondaryAction>
                            <Button variant="contained" size="small" onClick={() => handleRequestClick(user)}>Request</Button>
                        </ListItemSecondaryAction>
                    </ListItem>
                    {index !== users.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
            ))}
        </List>
    );
}
