import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import SelectDirectory from '../pages/GuidedCreate/SelectDirectory';
import React from 'react';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/guided/SelectDirectory" element={<SelectDirectory />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
