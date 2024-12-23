import { BrowserRouter, Routes, Route } from "react-router-dom";

import Generate from "../pages/Generate";
import Home from "../pages/Home";
import Progress from "../pages/Progress";
import Docs from "../pages/Docs";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/generate" element={<Generate />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/docs" element={<Docs />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
