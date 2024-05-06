import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import SelectDirectory from '../pages/GuidedCreate/SelectDirectory';
import TailoredSettings from '../pages/GuidedCreate/TailoredSettings';
import Summary from '../pages/GuidedCreate/Summary';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/guided/SelectDirectory" element={<SelectDirectory />} />
      <Route path="/guided/TailoredSettings" element={<TailoredSettings />} />
      <Route path="/guided/Summary" element={<Summary />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
