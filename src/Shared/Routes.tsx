 
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Generate from "../pages/Generate";
import Home from "../pages/Home";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/generate" element={<Generate />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
