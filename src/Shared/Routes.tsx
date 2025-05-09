import { BrowserRouter, Routes, Route } from "react-router-dom";

import Docs from "../pages/Docs";
import Generate from "../pages/Generate";
import Home from "../pages/Home";
import Profiler from "../pages/Profiler";
import Progress from "../pages/Progress";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/generate" element={<Generate />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="/profiler" element={<Profiler />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
