import { React, Component, useState, useContext } from "react";
import Home from "./routes/Home";
import Search from "./routes/Search";
import Intro from "./routes/Intro";
import SideNav from "./components/SideNav";
import Nav from "./components/Nav";
import { InputGroup, Form, Button, Row, Col, Modal } from "react-bootstrap";
import "./style/app.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

export function App() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  function handleModal() {
    setShowUploadModal(!showUploadModal);
  }

  return (
    <div className="App">
      <Flowbite>
        <div className="h-full flex flex-col">
          <Router>
            <Routes>
              <Route exact path="/" element={<Intro />}></Route>
              <Route exact path="/search"
                element={
                  <Search
                    showUploadModal={showUploadModal}
                    handleModal={() => handleModal()}
                  />
                }
              />
              <Route exact path="/output"
                element={
                  <Home
                    showUploadModal={showUploadModal}
                    handleModal={() => handleModal()}
                  />
                }
              />
            </Routes>
          </Router>
        </div>
      </Flowbite>
    </div>
  );
}

export default App;