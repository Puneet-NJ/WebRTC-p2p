import { useEffect } from "react";

const Send = () => {
	let ws: WebSocket;

	useEffect(() => {
		ws = new WebSocket("ws://localhost:8090");

		ws.onopen = () => {
			if (ws) ws.send(JSON.stringify({ type: "identifySender" }));
		};
	}, []);

	const handleSendVideo = async () => {
		const pc = new RTCPeerConnection();

		const stream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true,
		});

		displayVideo(stream);

		stream.getTracks().map((track) => pc.addTrack(track, stream));

		pc.onnegotiationneeded = async () => {
			const offer = await pc.createOffer();
			await pc.setLocalDescription(offer);

			console.log(pc.localDescription);

			ws.send(JSON.stringify({ type: "sendOffer", offer }));
		};

		ws.onmessage = async (event) => {
			const { type, answer, candidate } = JSON.parse(event.data);

			if (type === "answer") {
				await pc.setRemoteDescription(answer);
			}
			if (type === "iceCandidate") {
				await pc.addIceCandidate(candidate);
			}
		};

		pc.onicecandidate = (event) => {
			console.log(event);

			const { candidate } = event;

			ws.send(JSON.stringify({ type: "iceCandidate", candidate }));
		};
	};

	const displayVideo = async (stream: MediaStream) => {
		const video = document.createElement("video");
		video.srcObject = stream;
		document.body.append(video);

		await video.play();
	};

	return (
		<div>
			<button onClick={handleSendVideo}>Send Video</button>
		</div>
	);
};

export default Send;
