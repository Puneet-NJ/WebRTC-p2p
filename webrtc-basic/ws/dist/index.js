"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8090 });
let sender;
let receiver;
wss.on("connection", (socket) => {
    socket.on("message", (data) => {
        const { type } = JSON.parse(data.toString());
        if (type === "identifySender") {
            sender = socket;
        }
        if (type === "identifyReceiver") {
            receiver = socket;
        }
        if (type === "sendOffer") {
            const { offer } = JSON.parse(data.toString());
            console.log(JSON.stringify({ type: "offer", offer }));
            receiver.send(JSON.stringify({ type: "offer", offer }));
        }
        if (type === "sendAnswer") {
            const { answer } = JSON.parse(data.toString());
            sender.send(JSON.stringify({ type: "answer", answer }));
        }
        if (type === "iceCandidate") {
            const { candidate } = JSON.parse(data.toString());
            if (socket === sender) {
                receiver.send(JSON.stringify({ type: "iceCandidate", candidate }));
            }
            if (socket === receiver) {
                sender.send(JSON.stringify({ type: "iceCandidate", candidate }));
            }
        }
    });
});
