import { Route, Routes } from "react-router-dom";
import AdventureGenerator from "../pages/AdventureGenerator";
import Info from "../pages/Info";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<AdventureGenerator />} />
      <Route path="/info" element={<Info />} />
    </Routes>
  );
}

export default Router;
