import Alert from '@mui/material/Alert';

export default function MessageRecieve(props) {
    return (
        <Alert icon={false} variant="outlined" sx={{ borderRadius: 5, borderBottomLeftRadius: 0, width: 'fit-content', alignSelf: 'flex-start' }} severity="primary">
            {props.message}
        </Alert>
    )
}
