import { Box, Container, Typography, FormControl, TextField, Button, Snackbar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from '../AxiosInstance';
import {
    useState,
} from "react";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const submitUser = (event) => {
        event.preventDefault();
        axiosInstance.post('/token/', { username, password })
            .then((response) => {
                if (response.status === 200) {
                    const { refresh, access } = response.data;
                    localStorage.setItem('jwt-refresh-token', refresh);
                    localStorage.setItem('jwt-access-token', access);
                    setUsername('');
                    setPassword('');
                    navigate('/chat');
                } else {
                    alert('Login failed');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setError(error.response.data.detail)
                // alert('An error occurred while logging in.');
            });
    };

    const handleCloseSnackbar = () => {
        setError(null);
    };

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
            <Box height={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                <form onSubmit={submitUser}>
                    <Box
                        sx={{
                            width: 300,
                            mx: 'auto',
                            my: 4,
                            py: 3,
                            px: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            borderRadius: 'sm',
                            boxShadow: 'md',
                        }}
                        component="div"
                        variant="outlined"
                    >
                        <div>
                            <Typography variant="h4">
                                <b>Welcome!</b>
                            </Typography>
                            <Typography variant="body2">Sign in to continue.</Typography>
                        </div>
                        <FormControl>
                            <TextField
                                label="Username"
                                type="text"
                                variant="outlined"
                                fullWidth
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                sx={{ marginTop: "0.6rem" }}
                                required
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                label="Password"
                                type="password"
                                variant="outlined"
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </FormControl>
                        <Button type="submit" size="large" variant="contained" sx={{ marginTop: "0.6rem" }}>
                            Log in
                        </Button>
                        <Typography fontSize="small" sx={{ marginTop: "0.6rem", alignSelf: 'center' }}>
                            Don't have an account? <Link to={"/register"}>Register</Link>
                        </Typography>
                    </Box>
                </form>
            </Box>
            <Snackbar
                open={Boolean(error)}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={error}
            />
        </Container>
    );
}
