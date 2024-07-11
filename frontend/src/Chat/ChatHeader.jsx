import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Divider, IconButton } from '@mui/material';

export default function ChatHeader(props) {
    return (
        <>
            <AppBar sx={{ color: 'black', backgroundColor: 'grey.100', boxShadow: 0 }} position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    >
                        {props.name}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Divider />
        </>
    )
}
