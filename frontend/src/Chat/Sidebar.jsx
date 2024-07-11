import React, { useState, useEffect } from 'react';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import { Button, ListItemSecondaryAction } from '@mui/material';
import axiosInstance from '../AxiosInstance';

const drawerWidth = 340;

export default function Sidebar(props) {
    const [friendDetails, setFriendDetails] = useState([]);

    useEffect(() => {
        const fetchFriendDetails = async () => {
            try {
                const detailsPromises = props.friends.map(async (friend) => {
                    const response = await axiosInstance.get(`/users/${friend}`);
                    return response.data;
                });
                const friendDetailsData = await Promise.all(detailsPromises);
                setFriendDetails(friendDetailsData);
            } catch (error) {
                console.error('Error fetching friend details:', error);
            }
        };

        if (props.friends.length > 0) {
            fetchFriendDetails();
        }
    }, [props.friends]);

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
                <ListSubheader>
                    Friends
                </ListSubheader>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {friendDetails.map((friend, index) => (
                <React.Fragment key={friend.id}>
                    <ListItemButton alignItems="flex-start">
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
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {friend.username}
                                    </Typography>
                                    {` — ${friend.additional_info}`}
                                </React.Fragment>
                            }
                        />
                    </ListItemButton>
                    {index === friendDetails.length - 1 ? null : <Divider variant="inset" component="li" />}
                </React.Fragment>
            ))}
                </List>
                <Divider />
                <ListSubheader>
                    Send Interest
                </ListSubheader>
                <List>
                    {!props.users ? [] : props.users.map((user) => (
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemAvatar>
                                    <Avatar
                                        alt={user.username}
                                        src={`/static/images/avatar/s.jpg`}
                                    />
                                </ListItemAvatar>
                                <ListItemText primary={user.username} />
                            </ListItemButton>
                            <ListItemSecondaryAction>
                                <Button variant="contained" size="small">Request</Button>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    )
}
