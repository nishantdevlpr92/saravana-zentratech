import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../AxiosInstance';


export default function PendingRequestUsers({ requestPendingUsers }) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchPendingUsers = async () => {
            try {
                const detailsPromises = requestPendingUsers.map(async (request) => {
                    
                    const response = await axiosInstance.get(`/users/${request.to_user}`);
                    return response.data;
                });
                const pendingUsersData = await Promise.all(detailsPromises);
                setUsers(pendingUsersData);
            } catch (error) {
                console.error('Error fetching pending users:', error);
            }
        };

        if (requestPendingUsers.length > 0) {
            fetchPendingUsers();
        }
    }, [requestPendingUsers]);

    return (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {users.map((user, index) => (
                <React.Fragment key={user.id}>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar alt={user.username} src={`/static/images/avatar/s.jpg`} />
                        </ListItemAvatar>
                        <ListItemText primary={user.username} />
                    </ListItem>
                    {index !== users.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
            ))}
        </List>
    );
}
