import React from 'react';
import Home from './components/pages/Home';
import Course from './components/Course';
import { Route, Routes } from "react-router-dom";
import SignUp from './components/SignUp';
import Login from './components/Login';

function App() {
  return (
    <>
     
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Course" element={<Course />} />
      
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Login" element={<Login />} />
        route 
      </Routes>
    </>
  );
}

export default App;