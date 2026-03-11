import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./authentication/Login.jsx";
import Register from "./authentication/Register.jsx";
import Home from "./Home.jsx";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/home" element={<Home />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;