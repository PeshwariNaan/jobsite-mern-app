import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage, RegisterPage, ErrorPage } from './pages';
import {
  AddJobPage,
  AllJobsPage,
  ProfilePage,
  StatsPage,
  SharedLayout,
  ProtectedRoute,
} from './pages/dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StatsPage />} />
          <Route path="all-jobs" element={<AllJobsPage />} />
          <Route path="add-job" element={<AddJobPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
