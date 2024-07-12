import { Box, Typography, FormControl, Container, TextField, Button, Snackbar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from '../AxiosInstance';
import { useForm } from "react-hook-form";
import { useState } from "react";


function Register() {
    const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm();
    const [error, setErrorState] = useState(null);
    const navigate = useNavigate();

    const handleRegister = (data) => {
        axiosInstance.post('/register/', data)
            .then((response) => {
                if (response.status === 201) {
                    navigate('/', { state: { message: "Registration successful. Please login." } });
                } else {
                    alert('Registration failed');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                const errorMessages = Object.values(error.response.data)
                    .flat()
                    .join(', ');
                setErrorState(errorMessages || 'An error occurred while registering.');
            });
    };

    const handleCloseSnackbar = () => {
        clearErrors();
        setErrorState(null);
    };

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
            <Box height={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                <form onSubmit={handleSubmit(handleRegister)}>
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
                            <Typography variant="body2">Register Your Account.</Typography>
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
                            Register
                        </Button>
                        <Typography
                            fontSize="small"
                            sx={{ marginTop: "0.6rem", alignSelf: 'center' }}
                        >
                            Already have an account? <Link to={"/"}>Login</Link>
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

export default Register;
