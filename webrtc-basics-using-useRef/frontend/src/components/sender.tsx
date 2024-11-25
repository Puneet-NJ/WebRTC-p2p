import { useEffect, useRef } from "react";

const Sender = () => {
	const ws = useRef<WebSocket | null>(null);
	const pc = useRef<RTCPeerConnection | null>(null);

	useEffect(() => {
		ws.current = new WebSocket("ws://localhost:8089");
		pc.current = new RTCPeerConnection();

		ws.current.onopen = () => {
			if (!ws.current) return;

			ws.current?.send(JSON.stringify({ type: "identifySender" }));
		};
	}, []);

	const handleSendVideo = async () => {
		const stream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true,
		});

		createVideoTag();
		const video = document.querySelector("video");
		video!.srcObject = stream;
		await video?.play();

		stream.getTracks().map((track) => pc.current?.addTrack(track, stream));

		pc.current!.onnegotiationneeded = async () => {
			const offer = await pc.current?.createOffer();
			await pc.current?.setLocalDescription(offer);

			ws.current?.send(JSON.stringify({ type: "sendOffer", offer }));
		};

		ws.current!.onmessage = (event) => {
			const { type, answer, candidate } = event.data;

			if (type === "answer") {
				pc.current?.setRemoteDescription(answer);
			}
			if (type === "iceCandidate") {
				pc.current?.addIceCandidate(candidate);
			}
		};

		pc.current!.onicecandidate = (event) => {
			const candidate = event.candidate;

			ws.current?.send(JSON.stringify({ type: "iceCandidate", candidate }));
		};
	};

	const createVideoTag = () => {
		const video = document.createElement("video");
		document.body.append(video);
	};

	return (
		<div>
			<button onClick={handleSendVideo}>Send Video</button>
		</div>
	);
};

export default Sender;
