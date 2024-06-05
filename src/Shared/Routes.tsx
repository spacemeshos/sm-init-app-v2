import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import SelectDirectory from "../pages/GuidedCreate/SelectDirectory";
import TailoredSettings from "../pages/GuidedCreate/TailoredSettings";
import Summary from "../pages/GuidedCreate/Summary";
import {SetupSize, SetupProving} from "../components/setupPOS";
import AdvSelectDirectory from "../pages/AdvancedCreate/Directory";


const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/guided/SelectDirectory" element={<SelectDirectory />} />
      <Route path="/guided/TailoredSettings" element={<TailoredSettings />} />
      <Route path="/guided/Summary" element={<Summary />} />
      <Route path="/advanced/Directory" element={<AdvSelectDirectory/>}/>
      <Route path="/advanced/SetupSize" element={<SetupSize/>}/>
      <Route path="/advanced/Proving" element={<SetupProving/>}/>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
