import Alert from '@mui/material/Alert';

export default function MessageSend(props) {
    return (
        <Alert icon={false} variant="filled" sx={{ borderRadius: 5, borderBottomRightRadius: 0, width: 'fit-content', alignSelf: 'flex-end' }} severity="primary">
            {props.message}
        </Alert>
    )
}
