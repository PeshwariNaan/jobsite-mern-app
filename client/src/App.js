import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage, RegisterPage, ErrorPage } from './pages';
import {
  AddJobPage,
  AllJobsPage,
  ProfilePage,
  StatsPage,
  SharedLayout,
} from './pages/dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Some shit here</div>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
