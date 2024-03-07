import React, { useState, useEffect, useRef } from "react";
import Segment from "./Segment";
import { Button, Modal, Table } from "flowbite-react";
import {
  HiArrowLeft,
  HiArrowRight,
  HiOutlineBookOpen,
  HiCog,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi";
const TranscriptionViewer = ({
  transcriptionViewerRef,
  confidenceOn,
  data,
  confidenceRange,
  audioRef,
  searchRef,
  searchWord,
  activeIndex,
  setActiveIndex,
}) => {
  const player = audioRef.current;
  const [openHelpModal, setOpenHelpModal] = useState(false);


  const handleClick = (i) => {
    player.currentTime = data[i].startTime;
    // player.play();
    setActiveIndex(i);
  };

  const handleTimeUpdate = (currentTime) => {
    if (
      data[activeIndex] !== null &&
      activeIndex >= 0 &&
      currentTime >= data[activeIndex].startTime &&
      currentTime < data[activeIndex].endTime
    ) {
      return;
    }
    for (let i = 0; i < data.length; i++) {
      if (currentTime >= data[i].startTime && currentTime < data[i].endTime) {
        setActiveIndex((index) => i);
        break;
      }
    }

    // Scroll the active segment into view
    if (transcriptionViewerRef.current && activeIndex !== -1) {
      const activeEl = transcriptionViewerRef.current.children[activeIndex];

      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "instant",
          block: "start",
          inline: "nearest",
        });
      }
    }
  };

  if (player && !(player.paused)) {
    player.ontimeupdate = (event) => {
      const currentTime = player.currentTime;

      handleTimeUpdate(currentTime);
    };
  }

  useEffect(() => {
    if (transcriptionViewerRef.current && activeIndex !== -1) {
      const activeEl =
        transcriptionViewerRef.current.children[0].children[1].children[
          activeIndex
        ];

      if (activeEl && !(player.paused)) {
        activeEl.scrollIntoView({
          behavior: "instant",
          block: "start",
          inline: "nearest",
        });
      }
    }
  }, [activeIndex]);
  return (
    <div className=" h-full absolute">
      <Modal
        dismissible
        show={openHelpModal}
        onClose={() => setOpenHelpModal(false)}
      >
        <Modal.Header>Help</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              The line currently playing is bolded, providing users with a clear
              indication of the line they are currently listening to.
              Additionally, the system displays the current speaker for the
              line, utilizing color coding to distinguish between speakers.
            </p>
          </div>
        </Modal.Body>
      </Modal>
      <div className="border-b flex justify-between">
        <p className="text-lg font-bold">Transcription</p>
        <Button
          className="hover:bg-sky-400 rounded-md"
          color="white"
          pill
          size="sm"
          onClick={() => setOpenHelpModal(true)}
        >
          {" "}
          <HiOutlineQuestionMarkCircle />{" "}
        </Button>
      </div>
      <div className="relative overflow-y-scroll h-5/6">
        {data
          ? data.map((item, i) => (
              <React.Fragment key={Math.random() + "frag"}>
                <div onClick={() => handleClick(i)}>
                  <Segment
                    confidenceOn={confidenceOn}
                    confidenceRange={confidenceRange}
                    isCurrentSegmentPlaying={
                      i === activeIndex ? "bold" : "normal"
                    }
                    currentSegment={item}
                    currentLine={i}
                  />
                </div>
              </React.Fragment>
            ))
          : null}
      </div>
    </div>
  );
};

export default TranscriptionViewer;
