import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './App.scss';
import InventoryList from './components/inventory/InventoryList';
import InventoryAddEdit from './components/inventory/InventoryAddEdit';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<InventoryList />} />
          <Route path="/add" element={<InventoryAddEdit />} />
          <Route path="/edit/:id" element={<InventoryAddEdit />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
