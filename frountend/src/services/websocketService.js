import { Client } from "@stomp/stompjs";

const SOCKET_URL = "ws://localhost:8080/ws";

export const connectWebSocket = (destination, onMessage) => {

    const client = new Client({

        brokerURL: SOCKET_URL,

        reconnectDelay: 5000,

        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,

        connectHeaders: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },

        onConnect: () => {

            console.log(`WebSocket connected: ${destination}`);

            client.subscribe(destination, (message) => {

                try {

                    const event = JSON.parse(message.body);

                    console.log("WebSocket Event:", event);

                    onMessage(event);

                } catch (error) {

                    console.error(
                        "Failed to parse WebSocket message:",
                        error
                    );

                }

            });

        },

        onStompError: (frame) => {
            console.error(
                "STOMP error:",
                frame.headers["message"]
            );
        },

        onWebSocketError: (error) => {
            console.error("WebSocket error:", error);
        },

        onWebSocketClose: () => {
            console.log("WebSocket disconnected");
        },

    });

    client.activate();

    return () => {
        client.deactivate();
    };

};