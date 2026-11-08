import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import BouncingLoader from "./components/BouncingLoader/BouncingLoader.jsx";

const Dashboard = lazy(() => import("./features/dashboard/Dashboard.jsx"));
const Leads = lazy(() => import("./features/leads/Leads.jsx"));
const Packages = lazy(() => import("./features/packages/Packages.jsx"));
const NotFound = lazy(() => import("./components/not-found/NotFound.jsx"));

function App() {
  return (
    <Suspense fallback={<BouncingLoader />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/packages" element={<Packages />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
