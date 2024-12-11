 
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Confirmation from "../components/confirmation";
import Generate from "../pages/Generate";
import Home from "../pages/Home";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/generate" element={<Generate />} />
      <Route path="/guided/Confirmation" element={<Confirmation />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
