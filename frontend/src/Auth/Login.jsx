import { Box, Container, Typography, FormControl, TextField, Button, Snackbar, Alert } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from '../AxiosInstance';
import { useForm } from "react-hook-form";
import { useState } from "react";
import { jwtDecode } from 'jwt-decode';
import CheckIcon from '@mui/icons-material/Check';

export default function Login() {
    const location = useLocation();

    const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm();
    const [error, setErrorState] = useState(null);
    const navigate = useNavigate();

    const submitUser = (data) => {
        axiosInstance.post('/token/', data)
            .then((response) => {
                if (response.status === 200) {
                    const { refresh, access } = response.data;
                    localStorage.setItem('jwt-refresh-token', refresh);
                    localStorage.setItem('jwt-access-token', access);
                    navigate('/chat', { state: jwtDecode(access) });
                } else {
                    alert('Login failed');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setErrorState(error.response.data.detail);
            });
    };

    const handleCloseSnackbar = () => {
        clearErrors();
        setErrorState(null);
    };

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
            <Box height={'100%'} display={'flex'} flexDirection='column' justifyContent={'center'} alignItems={'center'}>
                {location.state?.message && <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">{location.state?.message}</Alert>}
                <form onSubmit={handleSubmit(submitUser)}>
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
                                {...register('username', { required: 'Username is required' })}
                                sx={{ marginTop: "0.6rem" }}
                                error={Boolean(errors.username)}
                                helperText={errors.username?.message}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                label="Password"
                                type="password"
                                variant="outlined"
                                fullWidth
                                {...register('password', { required: 'Password is required' })}
                                error={Boolean(errors.password)}
                                helperText={errors.password?.message}
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
