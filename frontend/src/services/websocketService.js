import { Client } from "@stomp/stompjs";
import { API_BASE_URL } from "../config/api";

let stompClient = null;

const wsBaseUrl = API_BASE_URL
    ?.replace(/^http/, "ws")
    .replace(/\/$/, "");

export const connectWebSocket = (
    token,
    onNotification
) => {

    console.log("Starting websocket connection");

    stompClient = new Client({

        brokerURL: `${wsBaseUrl}/ws`,

        connectHeaders: {
            Authorization: `Bearer ${token}`
        },

        reconnectDelay: 5000,

        debug: (str) => {
            console.log("[STOMP]", str);
        }
    });

    stompClient.onConnect = () => {

        console.log("WebSocket Connected");

        stompClient.subscribe(
            "/user/queue/notifications",
            (message) => {

                const payload =
                    JSON.parse(message.body);

                onNotification(payload);
            }
        );

        console.log(
            "Subscribed to notifications"
        );
    };

    stompClient.onWebSocketError = (
        error
    ) => {
        console.error(
            "WebSocket Error",
            error
        );
    };

    stompClient.onWebSocketClose = (
        event
    ) => {
        console.error(
            "WebSocket Closed",
            event
        );
    };

    stompClient.onStompError = (
        frame
    ) => {
        console.error(
            "Broker Error",
            frame
        );
    };

    stompClient.activate();
};

export const disconnectWebSocket = () => {

    if (stompClient) {
        stompClient.deactivate();
    }
};