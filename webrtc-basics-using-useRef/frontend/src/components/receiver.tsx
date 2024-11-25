import { useEffect, useRef } from "react";

const Receiver = () => {
	const ws = useRef<WebSocket | null>(null);
	const pc = useRef<RTCPeerConnection | null>(null);
	const videoRef = useRef<HTMLVideoElement | null>(null);

	useEffect(() => {
		ws.current = new WebSocket("ws://localhost:8089");
		pc.current = new RTCPeerConnection();

		ws.current.onopen = () => {
			ws.current?.send(JSON.stringify({ type: "identifyReceiver" }));
		};

		// handleReceiveVideo();
		ws.current!.onmessage = async (event) => {
			const { type, offer, candidate } = JSON.parse(event.data);

			if (type === "offer") {
				await pc.current?.setRemoteDescription(offer);
				const answer = await pc.current?.createAnswer();
				await pc.current?.setLocalDescription(answer);

				ws.current?.send(JSON.stringify({ type: "sendAnswer", answer }));
			}
			if (type === "iceCandidate") {
				await pc.current?.addIceCandidate(candidate);
			}
		};

		pc.current!.onicecandidate = (event) => {
			const candidate = event.candidate;

			ws.current?.send(JSON.stringify({ type: "iceCandidate", candidate }));
		};

		createVideoTag();
		const video = document.querySelector("video");
		pc.current!.ontrack = async (event) => {
			video!.srcObject = event.streams[0];

			videoRef.current!.srcObject = event.streams[0];

			console.log(video);

			await videoRef.current?.play();
			await video?.play();
		};
	}, []);

	const handleReceiveVideo = () => {
		console.log("hi");
	};

	const createVideoTag = () => {
		const video = document.createElement("video");
		document.body.append(video);
	};

	return (
		<div>
			<button onClick={handleReceiveVideo}>hi</button>
			<video ref={videoRef} autoPlay />
		</div>
	);
};

export default Receiver;
