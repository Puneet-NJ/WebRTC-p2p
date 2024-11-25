import { BrowserRouter, Route, Routes } from "react-router-dom";
import Send from "./components/send";
import Receive from "./components/receive";

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/send" element={<Send />}></Route>
					<Route path="/receive" element={<Receive />}></Route>
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
