import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import ScrollToTop from "../components/common/ScrollToTop";

function MainLayout({ children }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [location.pathname]);

  return (
    <div className="site-layout" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: "1 0 auto" }}>{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default MainLayout;