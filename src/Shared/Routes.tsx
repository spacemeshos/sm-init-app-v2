import { BrowserRouter, Routes, Route } from "react-router-dom";

import Generate from "../pages/Generate";
import Home from "../pages/Home";
import Progress from "../pages/Progress";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/generate" element={<Generate />} />
      <Route path="/progress" element={<Progress />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
