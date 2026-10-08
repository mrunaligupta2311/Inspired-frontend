import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import apiClient from "../api/client";

function ProtectedRoute() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        await apiClient.get("/auth/me");

        if (mounted) {
          setStatus("authenticated");
        }
      } catch {
        if (mounted) {
          setStatus("unauthenticated");
        }
      }
    };

    const handlePageShow = (event) => {
      if (event.persisted) {
        window.location.reload();
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    checkSession();

    return () => {
      mounted = false;
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  if (status === "checking") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f9fc",
          color: "#667085",
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        Checking authentication...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
