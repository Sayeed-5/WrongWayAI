import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LiveMonitoring from './pages/LiveMonitoring';
import WrongWayDetection from './pages/WrongWayDetection';
import NumberPlateRecognition from './pages/NumberPlateRecognition';
import ViolationReports from './pages/ViolationReports';
import DashboardLayout from './layouts/DashboardLayout';
import SoftBackdrop from './components/SoftBackdrop';
import Footer from './components/Footer';
import LenisScroll from './components/lenis';

function App() {
	return (
		<>
			<SoftBackdrop />
			<LenisScroll />
			<Routes>
				<Route path="/" element={<><Navbar /><Home /><Footer /></>} />
				<Route path="/login" element={<Login />} />
				<Route path="/dashboard" element={<DashboardLayout />}>
					<Route index element={<Dashboard />} />
					<Route path="live" element={<LiveMonitoring />} />
					<Route path="wrong-way" element={<WrongWayDetection />} />
					<Route path="anpr" element={<NumberPlateRecognition />} />
					<Route path="violations" element={<ViolationReports />} />
				</Route>
			</Routes>
		</>
	);
}
export default App;
