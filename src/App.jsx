import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import Dashboard from "./features/dashboard/Dashboard.jsx";

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
