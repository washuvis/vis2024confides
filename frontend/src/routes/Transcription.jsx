import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import AudioPlayer from "../components/AudioPlayer";
import TranscriptionViewer from "../components/TranscriptionViewer";
import { useLocation } from "react-router-dom";
import transcriptModel from "../model/TranscriptModel";
import WordSearchController from "../components/WordSearchController";
import ContextWindowVisualizer from "../components/ContextWindowVisualizer";
import ConfValVisualizer from "../components/ConfValVisualizer";
import SideNav from "../components/SideNav";
import UploadFileModal from "../components/UploadFileModal";
import {waitForElement,} from "../controller/ElementTimeOutController";
import Sententree from "../components/Sententree";

const Transcription = ({ showUploadModal, handleModal }) => {
  const queryParameters = new URLSearchParams(window.location.search);
  const filename = queryParameters.get("file");
  const [time, setTime] = useState(new Date());
  const [prompt, setPrompt] = useState("");
  const [confidenceRange, setConfidenceRange] = useState(0.5);
  const [confidenceOn, setConfidenceOn] = useState(false);
  const audioRef = useRef(null);
  const transcriptionViewerRef = useRef(null);
  const [searchWord, setSearchWord] = useState("");
  const [segmentsData, setSegmentsData] = useState([]);
  const [basicModal, setBasicModal] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const location = useLocation();
  const [initalLoad, setInitalLoad] = useState(true);
  const timeRef = useRef(null);
  const searchRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [activeVisualizer, setActiveVisualizer] = useState(null);
  const [hideCol, setHideCol] = useState(false);
  const [sideBarWidth, setSideBarWidth] = useState("0px");
  const [activeIndex, setActiveIndex] = useState(0);
  const confValDivRef = useRef(800);
  const [timeHistory, setTimeHistory] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  const toggleShow = () => setBasicModal(!basicModal);

  function fetchFile() {
    setDataLoading((dataLoading) => true);
    if(segmentsData.length === 0){
      transcriptModel.fetchJson(filename).then((data) => {
        setSegmentsData((segments) => data);
      });
    }
  }

  const hideColumn = () => {
    setHideCol((c) => !c);
  };
  function openNav() {
    setSideBarWidth("250px");
  }

  /* Set the width of the side navigation to 0 */
  function closeNav() {
    // document.getElementById("mySidenav").style.width = "0";
    setSideBarWidth("0px");
  }
  useEffect(() => {
    fetchFile();
  }, []);
  useEffect(() => {
    // setSegmentsData((segments) => []);

    setDataLoading((dataLoading) => false);

    waitForElement(transcriptionViewerRef, function () {
      if (transcriptionViewerRef.current != null) {
        if (location.state && location.state.i) {
          const activeEl =
            transcriptionViewerRef.current.children[location.state.i];
          if (activeEl && initalLoad) {
            activeEl.scrollIntoView({
              behavior: "instant",
              block: "start",
              inline: "nearest",
            });
            setInitalLoad(false);
          }
        }
      }
    });
  }, []);
  useEffect(() => {}, [searchWord]);

  return (
    <div className="w-screen h-dvh flex ">
      <SideNav handleModal={handleModal} />
      <div className="flex flex-col items-center gap-2 bg-gray-100 dark:bg-gray-900 w-full">
        <UploadFileModal
          showUploadModal={showUploadModal}
          handleModal={handleModal}
        />
        <div className="w-full">
          <AudioPlayer
              filename={filename}
              src={"../../storage/" + filename + ".ogg"}
              audioRef={audioRef}
              activeIndex={activeIndex}
              setTimeHistory={setTimeHistory}
              transcriptionViewerRef={transcriptionViewerRef}
              setDataLoading={setDataLoading}
              searchWord={searchWord}
              setSearchWord={setSearchWord}
              segmentsData={segmentsData}
              searchRef={searchRef}
              setSearchHistory={setSearchHistory}
          />
        </div>
        <div className="w-full h-5/6 grid grid-rows-6 grid-cols-8 gap-2 py-4 px-2 auto-cols-max">
        <div ref={confValDivRef} className="view-container bg-gray-50 dark:bg-gray-800 dark:text-white py-4 row-span-3 col-start-1 overflow-y-hidden col-span-3 ">
            <ConfValVisualizer
              data={segmentsData}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              audioRef={audioRef}
              confValDivRef={confValDivRef}
            />
          </div>
          <div className="view-container dark:text-white bg-gray-50 dark:bg-gray-800 row-span-3 col-start-1 col-span-3 overflow-y-hidden">
            <Sententree
              searchWord={searchWord}
              setSearchWord={setSearchWord}
              searchRef={searchRef}
              filename={filename}
              setSearchHistory={setSearchHistory}
              searchHistory={searchHistory}
              audioRef={audioRef}
            />
          </div>

          {/* Right Column */}
          <div className="view-container bg-gray-50 dark:text-white dark:bg-gray-800 row-start-1 row-span-6 col-start-4 col-span-5 py-4 px-4 relative">
            <div ref={transcriptionViewerRef}>
              {segmentsData.length > 0 ? (
                <TranscriptionViewer
                  transcriptionViewerRef={transcriptionViewerRef}
                  confidenceOn={confidenceOn}
                  setSegmentsData={setSegmentsData}
                  data={segmentsData}
                  confidenceRange={confidenceRange}
                  audioRef={audioRef}
                  searchRef={searchRef}
                  searchWord={searchWord}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transcription;
