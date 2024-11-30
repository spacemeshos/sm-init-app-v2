/* eslint-disable react/react-in-jsx-scope */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import SelectDirectory from "../pages/GuidedCreate/ScreenSelectDirectory";
import TailoredSettings from "../pages/GuidedCreate/ScreenTailoredSettings";
import Summary from "../pages/GuidedCreate/ScreenSummary";
import AdvSelectDirectory from "../pages/AdvancedCreate/ScreenAdvDirectory";
import AdvSetupSize from "../pages/AdvancedCreate/ScreenAdvSize";
import AdvSetupProving from "../pages/AdvancedCreate/ScreenAdvProving";
import AdvSetupProvider from "../pages/AdvancedCreate/ScreenAdvProvider";
import Confirmation from "../components/confirmation";
import Generate from "../pages/Generate";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/generate" element={<Generate />} />
      <Route path="/guided/SelectDirectory" element={<SelectDirectory />} />
      <Route path="/guided/TailoredSettings" element={<TailoredSettings />} />
      <Route path="/guided/Summary" element={<Summary />} />
      <Route path="/advanced/Directory" element={<AdvSelectDirectory />} />
      <Route path="/advanced/SetupSize" element={<AdvSetupSize />} />
      <Route path="/advanced/Proving" element={<AdvSetupProving />} />
      <Route path="/advanced/Provider" element={<AdvSetupProvider />} />
      <Route path="/guided/Confirmation" element={<Confirmation />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
