import './App.css';
import LoginComponent from './Components/Login/LoginComponent';
import SignupComponent from './Components/SignUp/SignupComponent';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/login' element={<LoginComponent />}></Route>
          <Route path='/signUp' element={<SignupComponent />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
