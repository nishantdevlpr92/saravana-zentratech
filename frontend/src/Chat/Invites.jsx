import { Avatar, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../AxiosInstance';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

export default function Invites({ invitationList }) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchPendingUsers = async () => {
            try {
                const detailsPromises = invitationList.map(async (invite) => {
                    const response = await axiosInstance.get(`/users/${invite.from_user}/`);
                    return response.data;
                });
                const pendingUsersData = await Promise.all(detailsPromises);
                setUsers(pendingUsersData);
                console.log('Invitation user:', pendingUsersData);
            } catch (error) {
                console.error('Error fetching Invitation user:', error);
            }
        };

        if (invitationList.length > 0) {
            fetchPendingUsers();
        }
    }, [invitationList]);

    return (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {users.map((user, index) => (
                <React.Fragment key={user.id}>
                    <ListItem secondaryAction={
                        <>
                            <IconButton color="primary" aria-label="comment" sx={{ marginRight: 1 }}>
                                <CheckIcon />
                            </IconButton>
                            <IconButton color="error" aria-label="comment">
                                <ClearIcon />
                            </IconButton>
                        </>
                    }>
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
