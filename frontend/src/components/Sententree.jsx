import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import { config } from "../helper/apiconfig";
import { Chart } from "react-google-charts";

const Sententree = ({
    searchWord,
    setSearchWord,
    searchRef,
    filename,
    setSearchHistory,
    audioRef
}) => {

    const [sentences, setSentences] = useState({});
    const [options, setOptions] = useState({wordtree: {
      format: "implicit",
      type: "double",
      word: "",
    }});

    async function fetchWindow(inputValue) {
        const data = {
          filename: filename,
          target_word: inputValue
        };
    
        try {
          const response = await axios.post(
            "http://127.0.0.1:5000/sententree",
            data,
            config
          );
          setSentences((sentences) => response.data);
        } catch (error) {
          console.error(error);
        }
    }

    useEffect(() => {
        fetchWindow(searchWord);
        setSearchWord(searchWord);
    }, [searchWord]);

    useEffect(() => {
        if (sentences["data"] && sentences["data"].length > 1){
          const temp = {
            maxFontSize: 35,
            wordtree: {
              format: "implicit",
              type: "double",
              word: searchWord,
            },
          };
          setOptions((options) => temp);
        }
    }, [sentences]);


    return (
        <div className="py-2 my-2">
          <div className="flex my-2 mx-4 gap-4 border-b">
          <p className="text-lg font-bold dark:text-white">Word Tree</p>
          </div>
          <div className="overflow-y-auto">
            <div
              className="flex flex-col justify-center items-center w-11/12 my-2"
              style={{
                paddingBottom: "4rem",
                justifyItem: "space-between",
              }}
            >
              {sentences["data"] && sentences["data"].length > 1 ? (
                <Chart chartType="WordTree" width="100%" height="150px" data={sentences["data"]} options={options}/>
              ) : (
                <p> Search the target word above to populate this view. </p>
              )}
            </div>
          </div>
        </div>
      );

};
      
export default Sententree;
      