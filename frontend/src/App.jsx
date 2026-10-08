 import { BrowserRouter } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AppRoutes from "./routes/AppRoutes";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </div>
    </BrowserRouter>
  );
}

export default App;