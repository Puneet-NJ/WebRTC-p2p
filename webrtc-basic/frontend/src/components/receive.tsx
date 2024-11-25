import { useEffect, useRef } from "react";

const Receive = () => {
	let ws: WebSocket;
	const videoRef = useRef<HTMLVideoElement | null>(null);

	useEffect(() => {
		ws = new WebSocket("ws://localhost:8090");
		const pc = new RTCPeerConnection();

		ws.onopen = () => {
			ws.send(JSON.stringify({ type: "identifyReceiver" }));

			ws.onmessage = async (event) => {
				const { type, offer } = JSON.parse(event.data);

				if (type === "offer") {
					await pc.setRemoteDescription(offer);
					const answer = await pc.createAnswer();
					await pc.setLocalDescription(answer);

					ws.send(JSON.stringify({ type: "sendAnswer", answer }));
				}
			};
		};

		pc.onicecandidate = (event) => {
			const candidate = event.candidate;

			ws.send(JSON.stringify({ type: "iceCandidate", candidate }));
		};

		createVideoTag();

		// const video = document.querySelector("video");
		pc.ontrack = async (event) => {
			// video!.srcObject = event.streams[0];
			// await video?.play();

			videoRef.current!.srcObject = event.streams[0];
			await videoRef.current?.play();
		};
	}, []);

	const createVideoTag = () => {
		// const video = document.createElement("video");
		// document.body.appendChild(video);
	};

	return (
		<div style={{ display: "flex " }}>
			<video
				ref={videoRef}
				style={{ width: "500px", border: "1px solid white", padding: "10px" }}
			/>
		</div>
	);
};

export default Receive;
