import { Box } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import Chat from "../Chat/Chat";
import PrivateRoute from "../Auth/PrivateRoute";

/**
 * Renders the main Body component containing different Routes for Login, Register, and Chat components.
 *
 * @return {JSX.Element} The rendered Body component
 */
export default function Body() {
    return (
        <Box sx={{ flexGrow: 1, flexShrink: 1, width: '100%' }}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/chat"
                    element={
                        <PrivateRoute>
                            <Chat />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
        </Box>
    );
}
