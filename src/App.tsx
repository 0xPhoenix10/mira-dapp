import Layout from "components/layout";
import DashboardPage from "pages/dashboard";
import OurTokenPage from "pages/ourtoken";
import ProfilePage from "pages/profile";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path={""} element={<DashboardPage />} />
          <Route path={"profile"} element={<ProfilePage />} />
          <Route path={"ourtokens"} element={<OurTokenPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
