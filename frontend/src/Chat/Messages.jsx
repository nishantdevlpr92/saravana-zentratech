import React from 'react'
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { TextField, Paper, Container } from '@mui/material';
import Stack from '@mui/material/Stack';
import MessageRecieve from './MessageRecieve';
import MessageSend from './MessageSend';

/**
 * Render the Messages component.
 *
 * @return {JSX.Element} The rendered Messages component.
 */
export default function Messages() {
    return (
        <>
            <Container sx={{ flexGrow: 1, p: 3 }}>
                <Stack sx={{ width: '100%' }} spacing={2}>
                    <MessageRecieve message="message 1"/>
                    <MessageRecieve message="message 2"/>
                    <MessageSend message="message 3"/>
                    <MessageRecieve message="message 4"/>
                </Stack>
            </Container>
            <Paper sx={{ p: 1, px: 2, display: 'flex', backgroundColor: 'grey.100', justifyContent: 'center', gap: 1 }} elevation={3}>
                <TextField label="Message" variant="outlined" fullWidth />
                <Button variant="contained" endIcon={<SendIcon />}>
                    Send
                </Button>
            </Paper>
        </>
    )
}
