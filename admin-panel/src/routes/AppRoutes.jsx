import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/login/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Courses from "../pages/courses/Courses";
import Faculty from "../pages/faculty/Faculty";
import Results from "../pages/results/Results";
import Gallery from "../pages/gallery/Gallery";
import Enquiries from "../pages/enquiries/Enquiries";
import Institute from "../pages/institute/Institute";
import Administration from "../pages/administration/Administration";

function NotFoundPage() {
  return (
    <div className="page-placeholder">
      <h2>Page Not Found</h2>
      <p>
        The page you are looking for does not exist.
      </p>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/results" element={<Results />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/enquiries" element={<Enquiries />} />
          <Route path="/institute" element={<Institute />} />
          <Route path="/administration" element={<Administration />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
