import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Home from "./Home.jsx";
import "./Home.css";
import Header from "./components/header/header.jsx";
import Index from "./components/index/index.jsx";

function App() {
  return (
    <>
      <Header></Header>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/index" element={<Index />}></Route>
          <Route path="/" element={<Home />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
