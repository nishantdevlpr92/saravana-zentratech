import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { TextField, Paper, Container, Snackbar } from '@mui/material';
import Stack from '@mui/material/Stack';
import MessageRecieve from './MessageRecieve';
import MessageSend from './MessageSend';
import ChatHeader from './ChatHeader';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../AxiosInstance';


export default function Messages({ friend }) {
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const ws = useRef(null);
    const { state } = useLocation();
    const userId = state.user_id;

    useEffect(() => {
        const fetchMessageHistory = async () => {
            try {
                const response = await axiosInstance.get('/chats/user_chats/', {
                    params: {
                        user1: userId,
                        user2: friend.id,
                    },
                });
                const messageHistory = response.data.map(msg => ({
                    ...msg,
                    type: msg.sender.id === userId ? 'send' : 'received',
                }));
                setMessages(messageHistory);
            } catch (error) {
                console.error('Error fetching message history:', error);
            }
        };

        fetchMessageHistory();
        ws.current = new WebSocket(`ws://localhost:8000/wc/chat/${friend.id}/?token=${localStorage.getItem('jwt-access-token')}`);

        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.errors) {
                setSnackbarMessage(message.errors.join("\n"));
                setSnackbarOpen(true);
            } else {
                if (message.sender === userId) {
                    setMessages((prevMessages) => [...prevMessages, { ...message, type: 'send' }]);
                } else {
                    setMessages((prevMessages) => [...prevMessages, { ...message, type: 'received' }]);
                }
            }
        };

        return () => {
            ws.current.close();
        };

    }, [friend.id, userId]);

    const handleSendMessage = () => {
        if (messageInput.trim()) {
            const message = { type: 'send', message: messageInput, sender: userId };
            ws.current.send(JSON.stringify(message));
            setMessageInput('');
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
        setSnackbarMessage('');
    };

    return (
        <>
            <ChatHeader name={friend.username} />
            <Container sx={{ overflow: 'auto', flexGrow: 1, p: 3 }}>
                <Stack sx={{ width: '100%' }} spacing={2}>
                    {messages.map((msg, index) => (
                        msg.type === 'received' ?
                            <MessageRecieve key={index} message={msg.message} />
                            :
                            <MessageSend key={index} message={msg.message} />
                    ))}
                </Stack>
            </Container>
            <Paper sx={{ p: 1, px: 2, display: 'flex', backgroundColor: 'grey.100', justifyContent: 'center', gap: 1 }} elevation={3}>
                <TextField
                    label="Message"
                    variant="outlined"
                    fullWidth
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                />
                <Button variant="contained" endIcon={<SendIcon />} onClick={handleSendMessage}>
                    Send
                </Button>
            </Paper>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </>
    );
}
