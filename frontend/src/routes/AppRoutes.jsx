import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Courses from "../pages/Courses/Courses";
import Results from "../pages/Results/Results";
import Faculty from "../pages/Faculty/Faculty";
import Gallery from "../pages/Gallery/Gallery";
import Contact from "../pages/Contact/Contact";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/results" element={<Results />} />
      <Route path="/faculty" element={<Faculty />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}

export default AppRoutes;