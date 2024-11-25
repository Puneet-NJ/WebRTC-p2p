import { BrowserRouter, Route, Routes } from "react-router-dom";
import Sender from "./components/sender";
import Receiver from "./components/receiver";

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/send" element={<Sender />}></Route>
					<Route path="/receive" element={<Receiver />}></Route>
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
