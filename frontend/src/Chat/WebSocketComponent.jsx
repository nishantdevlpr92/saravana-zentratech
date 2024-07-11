import React, { useEffect, useRef } from 'react';

export default function WebSocketComponent({ url, onMessage }) {
    const ws = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('jwt-access-token');
        const websocketUrl = `ws://localhost:8000${url}?token=${token}`;
        ws.current = new WebSocket(websocketUrl);

        ws.current.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            onMessage(message);
        };

        ws.current.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
            ws.current.close();
        };
    }, [url, onMessage]);

    return null;
};
