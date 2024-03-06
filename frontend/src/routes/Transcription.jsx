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

const Transcription = ({ showUploadModal, handleModal }) => {
  const tooltipRef = useRef(null);
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
    transcriptModel.fetchJson(filename).then((data) => {
      setSegmentsData((segments) => data);
    });
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
    setSegmentsData((segments) => []);

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
    <div className=" w-screen h-dvh flex ">
      <SideNav handleModal={handleModal} />
      <div className="flex flex-col items-center gap-2 bg-gray-100 dark:bg-gray-900 w-full">
        {/* <Nav /> */}
        <UploadFileModal
          showUploadModal={showUploadModal}
          handleModal={handleModal}
        />
        <div className=" flex justify-center items-center w-full pt-8 gap-8">
          <p className="text-lg font-bold dark:text-white">
            Currently playing:{filename}
            .mp3
          </p>{" "}
          <WordSearchController
            transcriptionViewerRef={transcriptionViewerRef}
            setDataLoading={setDataLoading}
            searchWord={searchWord}
            setSearchWord={setSearchWord}
            segmentsData={segmentsData}
            searchRef={searchRef}
            setSearchHistory={setSearchHistory}
          />
          <AudioPlayer
            filename={filename}
            src={"../../storage/" + filename + ".ogg"}
            audioRef={audioRef}
            data={segmentsData}
            activeIndex={activeIndex}
            setTimeHistory={setTimeHistory}
          />
        </div>
        <div className="w-full grid grid-rows-6 grid-cols-8 gap-2 py-4 px-2 auto-cols-max">
          {/* Middle Column with More Space */}
          <div className="view-container dark:text-white bg-gray-50 dark:bg-gray-800 row-start-5 row-span-2 col-start-1 col-span-3 ">
            <ContextWindowVisualizer
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
            {" "}
            <div ref={transcriptionViewerRef}>
              {segmentsData.length > 0 ? (
                <TranscriptionViewer
                  transcriptionViewerRef={transcriptionViewerRef}
                  confidenceOn={confidenceOn}
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

          {/* Second Row */}
          <div
            ref={confValDivRef}
            className="view-container bg-gray-50 dark:bg-gray-800 dark:text-white py-4 row-start-1 row-span-4 col-start-1 overflow-y-hidden col-span-3 "
          >
            {" "}
            <ConfValVisualizer
              tooltipRef={tooltipRef}
              data={segmentsData}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              audioRef={audioRef}
              confValDivRef={confValDivRef}
            />
          </div>
          {/* <div className=" row-start-1 row-span-2 col-start-6 col-span-2  grid  grid-rows-2 gap-2  ">
            <div className="view-container px-4 py-4 bg-gray-50 dark:text-white dark:bg-gray-800 row-start-1 row-span-1 relative">
              <div className="border-b">
                <p className="font-bold text-lg"> Line Detailed View </p>
              </div>
              {tooltipContent && (
                <div
                  className=" my-2 text-xs dark:text-white overflow-y-scroll relative h-4/5 scrollbar-hide"
                  ref={tooltipRef}
                >
                  {tooltipContent}
                </div>
              )}
            </div>
            <div className="view-container bg-gray-50 dark:text-white dark:bg-gray-800 row-start-2 row-span-1">
              <Notes />
            </div>
          </div> */}
          {/* <div className=" row-start-3 row-span-2 col-start-6 col-span-2  grid  grid-cols-2 gap-2  ">
            <div className="view-container px-4 py-4 bg-gray-50 text-sm dark:text-white dark:bg-gray-800 col-start-1 col-span-1">
              <div className="border-b justify-center items-center ">
                <p className="font-bold text-lg "> Marked Times </p>
              </div>

              <TimeHistory
                audioRef={audioRef}
                setTimeHistory={setTimeHistory}
                timeHistory={timeHistory}
              />
            </div>
            <div className="view-container px-4 py-4 bg-gray-50 dark:text-white dark:bg-gray-800 text-sm col-start-2 col-span-1">
              <RelatedFilesVisualizer filename={filename} />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Transcription;
