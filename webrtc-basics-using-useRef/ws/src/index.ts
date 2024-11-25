import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8089 });

let sender: WebSocket;
let receiver: WebSocket;
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
