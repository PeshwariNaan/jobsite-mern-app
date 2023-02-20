import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage, RegisterPage, DashboardPage, ErrorPage } from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
