import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { IndicatorDetails } from './pages/IndicatorDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/indicator/:id" element={<IndicatorDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;