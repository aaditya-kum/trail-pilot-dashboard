import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import Dashboard from "./features/dashboard/Dashboard.jsx";
import Leads from "./features/leads/Leads.jsx";
import Packages from "./features/packages/Packages.jsx";
import Team from "./features/team/Team.jsx";
import NotFound from "./features/not-found/NotFound.jsx";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/team" element={<Team />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
