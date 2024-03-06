import { React, useState} from "react";
import Intro from "./routes/Intro";
import Search from "./routes/Search";
import Transcription from "./routes/Transcription";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DarkThemeToggle, Flowbite } from "flowbite-react";
import "./App.css";


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
                  <Transcription
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