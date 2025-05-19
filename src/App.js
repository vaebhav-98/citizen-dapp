
import CitizenList from './components/CitizenList';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddCitizenForm from './pages/AddCitizenForm';

export default function App() {

  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/citizens" element={<CitizenList />} />
          <Route path="/add" element={<AddCitizenForm />} />
          <Route path="*" element={<CitizenList />} />
        </Routes>
      </Router>
    </>
  );
}
