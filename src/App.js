import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "../src/pages/main/main";
import { SensorDataProvider } from "../src/API/SensorDataContext";

function App() {
  return (
    <Router>
      <SensorDataProvider>
        <Routes>
          {/* 기본 페이지들 */}
          <Route path="/" element={<Main />} />
          
        </Routes>
      </SensorDataProvider>
    </Router>
  );
}

export default App;
