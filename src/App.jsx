import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import Dashboard from "./features/dashboard/Dashboard.jsx";
import Analytics from "./features/analytics/Analytics.jsx";
import Projects from "./features/projects/Projects.jsx";
import Team from "./features/team/Team.jsx";
import NotFound from "./features/not-found/NotFound.jsx";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/team" element={<Team />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
