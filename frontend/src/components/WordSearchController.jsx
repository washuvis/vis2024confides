import React, { useRef, useState, useEffect } from "react";
import { InputGroup, Form, Row, Col, Modal } from "react-bootstrap";
import {
  HiSearch,
  HiArrowUp,
  HiArrowDown,
} from "react-icons/hi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const WordSearchController = ({
  transcriptionViewerRef,
  setDataLoading,
  searchWord,
  setSearchWord,
  segmentsData,
  searchRef,
  setSearchHistory,
}) => {
  const [transcriptionViewActiveIndex, setTranscriptionViewActiveIndex] =
    useState(0);
  const searchIndicesRef = useRef([]);
  const [searchIndices, setSearchIndices] = useState([]);
  const lastIndexRef = useRef(-1);
  const [lastIndex, setLastIndex] = useState(-1);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const search = () => {
    setDataLoading((dataLoading) => true);

    setSearchWord(
      (searchWord) => searchRef.current.children[0].children[0].value
    );

    let tempSearchIndices = [];
    segmentsData.forEach((segment, index) => {
      if (
        searchRef.current.children[0].children[0].value !== "" &&
        segment.text
          .toLowerCase()
          .includes(
            searchRef.current.children[0].children[0].value.toLowerCase()
          )
      ) {
        tempSearchIndices.push(index);
        segment.highlight = "#FEC946";
      } else {
        segment.highlight = "transparent";
      }
    });
    if (tempSearchIndices.length !== 0) {
      setTranscriptionViewActiveIndex((index) => tempSearchIndices[0]);
      setCurrentIndex((i) => 0);
      setLastIndex(tempSearchIndices.length - 1);
      tempSearchIndices.sort((a, b) => a - b);
      console.log(tempSearchIndices);

      setSearchIndices((indices) => [...tempSearchIndices]);

      const transcriptEl = transcriptionViewerRef.current;

      const activeEl = transcriptEl.children[transcriptionViewActiveIndex];
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "instant",
          block: "start",
          inline: "nearest",
        });
      }
    }
    const history = sessionStorage.getItem("searchHistory");
    if (history === null) {
      sessionStorage.setItem("searchHistory", JSON.stringify([searchWord]));
    } else {
      const newHistory = [...JSON.parse(history), searchWord];
      sessionStorage.setItem("searchHistory", JSON.stringify(newHistory));
    }
    setSearchHistory(JSON.parse(sessionStorage.getItem("searchHistory")));
    setDataLoading(false);
  };

  const up = () => {
    setDataLoading(true);
    const transcriptEl = transcriptionViewerRef.current;
    setCurrentIndex((i) => (i > 0 ? i - 1 : i));

    setTranscriptionViewActiveIndex((index) => searchIndices[currentIndex]);

    const activeEl =
      transcriptEl.children[0].children[1].children[
        transcriptionViewActiveIndex
      ];
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "instant",
        block: "start",
        inline: "nearest",
      });
    }

    setDataLoading(false);
  };

  const down = () => {
    setDataLoading(true);
    setCurrentIndex((i) => (i >= lastIndex ? i : i + 1));
    setTranscriptionViewActiveIndex((index) => searchIndices[currentIndex]);
    const transcriptEl = transcriptionViewerRef.current;
    console.log(transcriptionViewActiveIndex);

    const activeEl =
      transcriptEl.children[0].children[1].children[
        transcriptionViewActiveIndex
      ];
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "instant",
        block: "start",
        inline: "nearest",
      });
    }

    setDataLoading(false);
  };
  useEffect(() => {
    setTranscriptionViewActiveIndex((index) => searchIndices[currentIndex]);

    const transcriptEl = transcriptionViewerRef.current;

    const activeEl = transcriptEl.children[transcriptionViewActiveIndex];
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "instant",
        block: "start",
        inline: "nearest",
      });
    }
    searchRef.current.children[0].value = searchWord;
  }, [currentIndex, searchWord]);

  return (
    <div className="flex h-16  justify-center items-center rounded-xl">
      <InputGroup
        className="dark:fill-white "
        ref={searchRef}
        style={{ textAlign: "center" }}
      >
        <div className="border rounded-lg flex px-2">
          <Form.Control
            className=" text-m bg-gray-100 dark:bg-gray-500 dark:color-white"
            placeholder="Search Target Words"
            aria-label="Search"
            aria-describedby="search-addon"
            style={{ border: "none" }}
          />
          <button
            style={{
              textAlign: "center",
            }}
            onClick={() => search()}
            className="text-center text-s dark:fill-white"
          >
            <HiSearch className="dark:fill-white" />
          </button>
        </div>
        <InputGroup.Text className="text-center text-s dark:text-white  dark:bg-gray-500">
          {currentIndex + 1}/{lastIndex + 1}
        </InputGroup.Text>

        <div className="border rounded-lg flex gap-2 justify-center items-center px-2">
          <button className="text-center text-s  dark:fill-white" onClick={up}>
            <HiArrowUp className="dark:fill-white" />
          </button>

          <button
            className="text-center text-s  dark:fill-white "
            onClick={down}
          >
            <HiArrowDown className="dark:fill-white" />
          </button>
        </div>
      </InputGroup>
    </div>
  );
};

export default WordSearchController;