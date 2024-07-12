import React, { useState, useEffect } from 'react';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import axiosInstance from '../AxiosInstance';
import RequestUsers from './RequestUsers';
import { useLocation } from 'react-router-dom';
import PendingRequestUsers from './PendingRequestUsers';
import Invites from './Invites';


const drawerWidth = 340;


export default function Sidebar({ onFriendClick }) {
    const { state } = useLocation();
    const [friends, setFriends] = useState([]);
    const [notConnectedUsers, setNotConnectedUsers] = useState([]);
    const [requestPendingUsers, setrequestPendingUsers] = useState([]);
    const [invites, setInvites] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get(`/users/${state.user_id}/`);
                const userData = response.data;

                setFriends(userData.friends);
                document.title = `Hi, ${userData.username}`;
                setrequestPendingUsers(userData.fr_from_user);
                setInvites(userData.fr_to_user);

                // not connected user (all users excluding friends and request pending users)
                const unfriendedResponse = await axiosInstance.get(
                    `/users/?id__not=${
                        userData.fr_from_user.map(obj => obj.to_user).join(',')
                    }${
                        userData.fr_from_user.length > 0 ? ',' : ''
                    }${
                        userData.friends.map(obj => obj.id).join(',')
                    }${
                        userData.friends.length > 0 ? ',' : ''
                    }${
                        userData.fr_to_user.map(obj => obj.from_user).join(',')
                    }${
                        userData.fr_to_user.length > 0 ? ',' : ''
                    }${state.user_id}`
                );
                setNotConnectedUsers(unfriendedResponse.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (state.user_id) {
            fetchUserData();
        }
    }, [state.user_id]);

    const handleAcceptInvite = (user) => {
        setInvites((prev) => prev.filter((invite) => invite.from_user !== user.id));
        setFriends((prev) => [...prev, user]);
    };

    const handleDeclineInvite = (user) => {
        setInvites((prev) => prev.filter((invite) => invite.from_user !== user.id));
        setNotConnectedUsers((prev) => [...prev, user]);
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
                <ListSubheader>Friends</ListSubheader>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {friends.map((friend, index) => (
                        <React.Fragment key={friend.id}>
                            <ListItemButton alignItems="flex-start" onClick={() => onFriendClick(friend)}>
                                <ListItemAvatar>
                                    <Avatar alt={friend.username} src="/static/images/avatar/1.jpg" />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={friend.username}
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                color="text.primary"
                                                variant="caption"
                                            >
                                                Start Conversation
                                            </Typography>
                                        </React.Fragment>
                                    }
                                />
                            </ListItemButton>
                            {index === friends.length - 1 ? null : <Divider variant="inset" component="li" />}
                        </React.Fragment>
                    ))}
                </List>
                <Divider />

                <ListSubheader>Accept Invitation</ListSubheader>
                <Invites onAccept={handleAcceptInvite} onDecline={handleDeclineInvite} invitationList={invites} />
                <Divider />

                <ListSubheader>Send Interest</ListSubheader>
                <RequestUsers notConnectedUsersList={notConnectedUsers} setRequestPendingUsers={setrequestPendingUsers}/>
                <Divider />

                <ListSubheader>Pending Requests</ListSubheader>
                <PendingRequestUsers requestPendingUsers={requestPendingUsers} />

            </Box>
        </Drawer>
    );
}
