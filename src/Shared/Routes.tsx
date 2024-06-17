import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import SelectDirectory from "../pages/GuidedCreate/SelectDirectory";
import TailoredSettings from "../pages/GuidedCreate/TailoredSettings";
import Summary from "../pages/GuidedCreate/Summary";
import AdvSelectDirectory from "../pages/AdvancedCreate/Directory";
import AdvSetupSize from "../pages/AdvancedCreate/Size";
import AdvSetupProving from "../pages/AdvancedCreate/Proving";
import AdvSetupProvider from "../pages/AdvancedCreate/Provider";
import Confirmation from "../components/confirmation";


const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/guided/SelectDirectory" element={<SelectDirectory />} />
      <Route path="/guided/TailoredSettings" element={<TailoredSettings />} />
      <Route path="/guided/Summary" element={<Summary />} />
      <Route path="/advanced/Directory" element={<AdvSelectDirectory/>}/>
      <Route path="/advanced/SetupSize" element={<AdvSetupSize/>}/>
      <Route path="/advanced/Proving" element={<AdvSetupProving/>}/>
      <Route path="/advanced/Provider" element={<AdvSetupProvider/>}/>
      <Route path="/guided/Confirmation" element={<Confirmation/>}/>

    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
