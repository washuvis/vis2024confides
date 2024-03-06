import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { InputGroup, Form, Row, Col } from "react-bootstrap";
import SideContextWindow from "./SideContextWindow";
import { Button, Modal, Table, Dropdown, Tooltip } from "flowbite-react";
import { config } from "../helper/apiconfig";
import {
  HiArrowLeft,
  HiArrowRight,
  HiOutlineBookOpen,
  HiCog,
  HiOutlineQuestionMarkCircle,
  HiOutlineAdjustments,
} from "react-icons/hi";
const ContextWindowVisualizer = ({
  searchWord,
  setSearchWord,
  searchRef,
  filename,
  setSearchHistory,
  audioRef,
}) => {
  const player = audioRef.current;

  const [context, setContext] = useState({});
  const [currentSearchIndex, setCurrentSearchIndex] = useState(
    JSON.parse(sessionStorage.getItem(`${filename}_searchHistory`))
      ? JSON.parse(sessionStorage.getItem(`${filename}_searchHistory`)).length -
          1
      : 0
  );
  const [openHelpModal, setOpenHelpModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numWords, setNumWords] = useState(5);
  async function handleWordBtnClick(e) {
    e.preventDefault();

    const currentClickedWord = e.target.textContent;

    await fetchWindow(currentClickedWord);

    setSearchWord(currentClickedWord);

    const history = sessionStorage.getItem(`${filename}_searchHistory`);
    if (history === null) {
      sessionStorage.setItem(
        `${filename}_searchHistory`,
        JSON.stringify([[currentClickedWord, Date.now()]])
      );
    } else {
      const newHistory = [
        ...JSON.parse(history),
        [currentClickedWord, Date.now()],
      ];
      sessionStorage.setItem(
        `${filename}_searchHistory`,
        JSON.stringify(newHistory)
      );
    }
    setSearchHistory(
      JSON.parse(sessionStorage.getItem(`${filename}_searchHistory`))
    );
    setCurrentSearchIndex(
      (index) =>
        JSON.parse(sessionStorage.getItem(`${filename}_searchHistory`)).length -
        1
    );
  }
  async function handlePrevious() {
    setLoading(true);
    let searchHistory = JSON.parse(
      sessionStorage.getItem(`${filename}_searchHistory`)
    );
    if (currentSearchIndex < 0) {
      setCurrentSearchIndex((index) => 0);
      setLoading(false);

      return;
    }
    if (currentSearchIndex >= searchHistory.length) {
      setCurrentSearchIndex((index) => index - 1);
      setLoading(false);

      return;
    }

    await fetchWindow(searchHistory[currentSearchIndex][0]);
    setSearchWord(searchHistory[currentSearchIndex][0]);
    setCurrentSearchIndex((index) => index - 1);
    setLoading(false);
  }
  async function handleNext() {
    setLoading(true);
    let searchHistory = JSON.parse(
      sessionStorage.getItem(`${filename}_searchHistory`)
    );
    if (currentSearchIndex < 0) {
      setCurrentSearchIndex((index) => 0);
      setLoading(false);

      return;
    }
    if (currentSearchIndex >= searchHistory.length) {
      setCurrentSearchIndex((index) => index - 1);
      setLoading(false);

      return;
    }

    await fetchWindow(searchHistory[currentSearchIndex][0]);
    setSearchWord(searchHistory[currentSearchIndex][0]);
    setCurrentSearchIndex((index) => index + 1);
    setLoading(false);
  }
  async function fetchWindow(inputValue) {
    const data = {
      filename: filename,
      target_word: inputValue,
      num_words: numWords,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/contextwindow",
        data,
        config
      );
      console.log(response.data);
      setContext((context) => response.data);
    } catch (error) {
      console.error(error);
    }
  }

  function playSelectedLine(e) {
    console.log(e);
  }

  useEffect(() => {
    fetchWindow(searchWord);
    setSearchWord(searchWord);
  }, [searchWord]);

  return (
    <div className=" py-2 my-2">
      <Modal
        dismissible
        show={openSetting}
        onClose={() => setOpenSetting(false)}
      >
        <Modal.Header className="h-12"> Adjust Context Window</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <label for="numberWords">
              Select how many words to see before and after the target word in
              the context window
            </label>

            <select
              name="numberWords"
              id="numberWords"
              onChange={(event) => setNumWords(event.target.value)}
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="dark" onClick={() => setOpenModal(false)}>
            Apply{" "}
          </Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Apply and Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header className="h-12">Search History</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <Table className="h-5/6 min-h-5/6">
              <Table.Head className="m-4">
                <Table.HeadCell>Search Words</Table.HeadCell>
                <Table.HeadCell>Timestamp</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {sessionStorage.getItem(`${filename}_searchHistory`)
                  ? JSON.parse(
                      sessionStorage.getItem(`${filename}_searchHistory`)
                    ).map((word, timestamp) => (
                      <Table.Row
                        key={word}
                        className="bg-white border-2 border-gray-200 dark:bg-gray-800"
                      >
                        <Table.Cell>{word[0]}</Table.Cell>
                        <Table.Cell className="text-xs">
                          {Date(word[1]).toString()}
                        </Table.Cell>
                      </Table.Row>
                    ))
                  : null}
              </Table.Body>
            </Table>
          </div>
        </Modal.Body>
      </Modal>
      <div className="flex my-2 mx-4 gap-4 border-b">
        <p className="text-lg font-bold dark:text-white">Context Window View</p>
        <Button.Group>
          <Tooltip content="Go Back" style="light">
            <Button
              className="hover:bg-sky-400 rounded-md"
              onClick={() => handlePrevious()}
              color="white"
              pill
              disabled={loading}
              size="sm"
            >
              {" "}
              <HiArrowLeft className="dark:fill-white" />{" "}
            </Button>
          </Tooltip>

          <Button
            className="hover:bg-sky-400 rounded-md"
            color="white"
            onClick={() => handleNext()}
            pill
            disabled={loading}
            size="sm"
          >
            {" "}
            <HiArrowRight className="dark:fill-white" />{" "}
          </Button>
          <Button
            className="hover:bg-sky-400 rounded-md"
            color="white"
            pill
            size="sm"
            onClick={() => setOpenModal(true)}
          >
            {" "}
            <HiOutlineBookOpen />{" "}
          </Button>
          <Button
            className="hover:bg-sky-400 rounded-md"
            color="white"
            pill
            size="sm"
            onClick={() => setOpenSetting(true)}
          >
            {" "}
            <HiOutlineAdjustments className="dark:fill-white" />{" "}
          </Button>
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
        </Button.Group>
      </div>
      <Modal
        dismissible
        show={openHelpModal}
        onClose={() => setOpenHelpModal(false)}
      >
        <Modal.Header className="h-12">Help</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              The context window visualization serves to display the context
              around the targeted word, which can be searched with the global
              search bar. The window size is customizable, allowing users to
              choose a size ranging from 1 to 10. Within the window, users can
              click on any neighboring word to initiate another search. Each
              neighboring word in the window is distinguished by a background
              color and opacity that corresponds to its confidence score. The
              context window provides the ability to traverse through search
              history. Users can navigate backward and forward to explore their
              search history. The search history is also displayable, presenting
              users with searched words and their timestamps. This offers a
              comprehensive overview of their interactions with the system.
            </p>
          </div>
        </Modal.Body>
      </Modal>
      <div className="overflow-y-auto">
        <div
          className="flex flex-col justify-center items-center w-11/12 my-2"
          style={{
            paddingBottom: "4rem",
            justifyItem: "space-between",
          }}
        >
          {context["data"] && context["data"].length > 0 ? (
            <div style={{ overflowX: "scroll" }}>
              {context.data.map((item, index) => {
                const searchWordIndex = item.findIndex(
                  (subItem) =>
                    subItem[0].toLowerCase() ===
                    searchRef.current.children[0].value.toLowerCase()
                );
                const leftSide = item.slice(0, searchWordIndex);
                const rightSide = item.slice(searchWordIndex + 1);
                return (
                  <React.Fragment key={index}>
                    <div className="flex my-4 border-b border-solid border-gray-350">
                      <p
                        className="text-xs mx-2"
                        onClick={(e) => playSelectedLine(e)}
                      >
                        line {parseInt(item[0][2]) + 1}{" "}
                      </p>
                      <div className="flex ">
                        <SideContextWindow
                          side={leftSide}
                          handleWordBtnClick={handleWordBtnClick}
                          searchWord={searchRef.current.children[0].value}
                          setSearchHistory={setSearchHistory}
                        />
                        <div
                          className="dark:text-white"
                          style={{
                            fontWeight: "bold",
                            justifySelf: "center",
                            marginTop: "2px",
                          }}
                        >
                          {searchWord}{" "}
                        </div>
                        <SideContextWindow
                          side={rightSide}
                          handleWordBtnClick={handleWordBtnClick}
                          searchWord={searchRef.current.children[0].value}
                          setSearchHistory={setSearchHistory}
                        />
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          ) : (
            <p> Search the target word above to populate this view. </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContextWindowVisualizer;
