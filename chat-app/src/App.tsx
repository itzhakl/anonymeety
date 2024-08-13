import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Loading from './components/Loading';

const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const Chat = lazy(() => import('./components/Chat/Chat'));

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
