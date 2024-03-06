import React, { useState, useRef, useEffect } from "react";
import jsonFiles from "../helper/localJSONImporter";
import CardContainer from "../components/CardContainer";
import { useLocation } from "react-router-dom";
import UploadFileModal from "../components/UploadFileModal";
import uploadedItemsModel from "../model/UploadedItemsModel";
import SideNav from "../components/SideNav";

const Search = (props) => {
  let [results, setResults] = useState([]);
  let [fileNames, setFileNames] = useState([]);
  let [querySentences, setQuerySentences] = useState([]);
  let [initalLoad, setInitalLoad] = useState(false);
  let [load, setLoad] = useState(false);
  let [searchQuery, setSearchQuery] = useState("");
  let pagination_key = "pagination";
  const searchRef = useRef(null);
  const [limit, setLimit] = useState(3);
  const resultElem = document.querySelector(".results");
  const [sentences, setSentences] = useState([]);
  const location = useLocation();
  const [totalResults, setTotalResults] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20 * 60 * 1000);
  const timeRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

  function getFiles() {
    uploadedItemsModel.fetchAllItems().then((data) => {
      let names = [];
      data.data.forEach((item) => {
        const fileName = item.Key.split("/")[1].split(".")[0];
        // console.log(fileName);
        if (fileName !== "") {
          names.push(fileName);
        }
      });
      setFileNames((fileNames) => names);
    });
    // console.log(fileNames);
  }

  useEffect(() => {
    getFiles();
    // console.log(fileNames);
    setSentences([]);
    for (let f in jsonFiles) {
      let result = jsonFiles[f].results.segments;
      let sentence = [];
      let words = [];
      let times = [];
      let confidences = [];
      setTotalResults(result.length);

      for (let i in result) {
        let curSegment = result[i].alternatives[0].items;
        for (let j in curSegment) {
          let curWord = curSegment[j].content;
          let startTime = parseFloat(curSegment[j].start_time);
          let endTime = parseFloat(curSegment[j].end_time);
          let conf = parseFloat(curSegment[j].confidence);

          times.push(startTime);
          times.push(endTime);
          sentence.push(curWord);
          words.push(curSegment[j]);

          if (curSegment[j].type == "pronunciation") {
            confidences.push(conf);
          }
        }

        let curSentence = sentence.join(" ");
        let regex = /\s+([.,!?":])/g;
        curSentence = curSentence.replace(regex, "$1");
        times = times.filter(Number);
        times.sort();
        let curTimes = times.slice();
        curTimes.sort();
        let tempConfidences = [...confidences];

        setSentences((sentences) => [
          ...sentences,
          {
            id: parseInt(i),
            name: jsonFiles[f].jobName,
            text: curSentence,
            duration:
              Math.max.apply(null, curTimes) - Math.min.apply(null, curTimes),
            confidence_list: tempConfidences,
          },
        ]);

        sentence = [];
        words = [];
        times = [];
        confidences = [];
      }
    }
  }, []);

  function handleResultState(newResults) {
    setResults(newResults);
  }

  function timesUp() {
    setShowModal(true);
  }

  useEffect(() => {
    if (sentences.length != 0 && initalLoad === false) {
      setQuerySentences((querySentences) => {
        setInitalLoad(true);
        setLoad(true);
        if (!sessionStorage.getItem("remaining_time")) {
          sessionStorage.setItem("remaining_time", timeLeft);
        }
        return sentences;
      });
    }
  }, [sentences]);

  const search = () => {
    let query = searchRef.current.value;
    setSearchQuery(query);
    pagination_key = "pagination_key_" + Math.random();
    if (query === "") {
      setQuerySentences((querySentences) => {
        setLoad(true);
        return sentences;
      });
    } else {
      setResults([]);
      setLoad(false);
      setQuerySentences([]);
      let tempSentences = [];
      for (let i in jsonFiles) {
        setTotalResults(
          jsonFiles[i].results.transcripts[0].transcript.split(query).length - 1
        );
        tempSentences = sentences.filter((str) =>
          str.text.toLowerCase().includes(query.toLowerCase())
        );
        setQuerySentences((querySentences) => {
          setLoad(true);
          return tempSentences;
        });
      }
    }
  };

  return (
    <>
      <div className="h-screen w-screen flex gap-8 relative">
        <div className="w-2/6">
          <UploadFileModal
            showUploadModal={props.showUploadModal}
            handleModal={props.handleModal}
          />
          <SideNav handleModal={props.handleModal} />
        </div>
        <div className="py-8 w-screen">
          <div className="px-0">
            <div className="search-container">
              <h4 className="font-bold text-lg my-4">Search Audio Records</h4>
              <div className="card-deck results flex flex-row gap-4 flex-wrap">
                {fileNames
                  ? fileNames.map((seg) => (
                      <CardContainer
                        className="card-item basis-1/4 md:basis-1/3"
                        key={"card-" + seg + "-" + seg}
                        data={seg}
                        type={sessionStorage.getItem("vis_type")}
                        query={searchQuery}
                        timer_ref={timeRef}
                      />
                    ))
                  : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
