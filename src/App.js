import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "../src/pages/main/main";
import { SensorDataProvider } from "../src/API/SensorDataContext";
import Figures from "../src/pages/Figures/Figures";

function App() {
  return (
    <Router>
      <SensorDataProvider>
        <Routes>
          {/* 기본 페이지들 */}
          <Route path="/" element={<Main />} />
          <Route path="/figures" element={<Figures />} />
          <Route path="/figures/:roomNumber" element={<Figures />} /> {/* roomNumber 파라미터 추가 */}
        </Routes>
      </SensorDataProvider>
    </Router>
  );
}

export default App;
