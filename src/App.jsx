import "./App.css";
import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import Dashboard from "./components/dashboard/Dashboard";

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
