import React, { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import { config } from "../helper/apiconfig";
import * as d3 from "d3";
import { Table, Card, Tooltip, Button } from "flowbite-react";
import TopKWordsBarGraph from "./TopKWordsBarGraph";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";

const RelatedFilesHeatMap = ({ data, fileNames }) => {
  console.log(fileNames);
  const MARGIN = { top: 10, right: 10, bottom: 30, left: 50 };
  const [sentiments, setSentiments] = useState(null);
  const [conf, setConf] = useState(null);
  const [topKWords, setTopKWords] = useState(null);
  const width = 500;
  const height = 500;
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;
  const allYGroups = useMemo(() => [...new Set(data.map((d) => d.y))], [data]);
  const allXGroups = useMemo(() => [...new Set(data.map((d) => d.x))], [data]);
  const [curClickedRect, setClickedRect] = useState(null);
  const rectGroupRef = useRef(null);

  useEffect(() => {
    fetchSentimentScores();
    fetchConfVal();
    fetchTFIDF();
  }, []);

  async function fetchSentimentScores() {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/sentimentScores`,
        config
      );

      setSentiments(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchTFIDF() {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/tfidf`, config);

      setTopKWords(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchConfVal() {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/averageConfVal`,
        config
      );

      setConf(response.data);
    } catch (error) {
      console.error(error);
    }
  }
  function handleMouseOver(e, d) {
    e.target.attributes.opacity.value = 1.0;
  }
  function handleMouseOut(e, d) {
    e.target.attributes.opacity.value = 0.8;
  }
  function handleOnClick(e, d) {
    setClickedRect(d);
    d3.selectAll(".heatmapRect").attr("stroke-width", 0);

    e.target.attributes["stroke-width"].value = "4";
  }
  const xScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([0, boundsWidth])
      .domain(allXGroups)
      .padding(0.01);
  }, [data, width]);

  const yScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([0, boundsHeight])
      .domain(allYGroups)
      .padding(0.01);
  }, [data, width]);
  const colorScale = d3
    .scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([0, 1]);

  const xLabels = allXGroups.map((name, i) => {
    const xPos = xScale(name) ?? 0;
    return (
      <text
        key={i}
        x={xPos + xScale.bandwidth() / 2}
        y={boundsHeight + 10}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={10}
      >
        {fileNames[name]}
      </text>
    );
  });

  const yLabels = allYGroups.map((name, i) => {
    const yPos = yScale(name) ?? 0;
    return (
      <text
        key={i}
        x={-5}
        y={yPos + yScale.bandwidth() / 2}
        textAnchor="end"
        dominantBaseline="middle"
        fontSize={10}
      >
        {fileNames[name]}
      </text>
    );
  });

  return (
    <div className="flex w-full h-full flex-evenly">
      <div className="basis-2/4">
        <svg width={width} height={height}>
          <g
            width={boundsWidth}
            height={boundsHeight}
            transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
            ref={rectGroupRef}
          >
            {data ? (
              data.map((d, i) => {
                if (d.value === null) {
                  return;
                }
                return (
                  <g key={i + "group"}>
                    <rect
                      key={i + "rect"}
                      x={xScale(d.x)}
                      y={yScale(d.y)}
                      className="heatmapRect"
                      width={xScale.bandwidth()}
                      height={yScale.bandwidth()}
                      fill={colorScale(d.norm_score)}
                      onClick={(e) => handleOnClick(e, d)}
                      opacity={0.8}
                      onMouseOver={(e, d) => handleMouseOver(e, d)}
                      onMouseOut={(e, d) => handleMouseOut(e, d)}
                      stroke={"black"}
                      strokeWidth={0}
                    />
                    <text
                      key={i + "text"}
                      x={xScale(d.x) + xScale.bandwidth() / 2} // Adjust x position
                      y={yScale(d.y) + yScale.bandwidth() / 2} // Adjust y position
                      textAnchor="middle" // Center the text
                      dy=".35em"
                    >
                      {d.norm_score.toFixed(2)}
                    </text>
                  </g>
                );
              })
            ) : (
              <p> Click on the square </p>
            )}

            {xLabels}
            {yLabels}
          </g>
        </svg>
      </div>
      <div className="basis-2/4 text-center">
        {" "}
        {curClickedRect ? (
          <div>
            <div className="flex justify-center">
              <p className="text-xl my-4 font-bold text-center ">
                Comparison Between "{curClickedRect.documents[0]}" and "
                {curClickedRect.documents[1]}" Audio Files
              </p>
              <Tooltip
                content={
                  <div style={{ textAlign: "left" }}>
                    <strong>Sentiment Score:</strong> a numerical representation
                    of feeling or emotion in the text; computed by summing the
                    valence scores of each word in the lexicon, adjusted
                    according to the rules, and then normalized to be between -1
                    (most extreme negative) and +1 (most extreme positive)
                    <br />
                    <strong>Confidence Score:</strong> the score of posterior
                    probabilities associated with words in hypothesized
                    transcriptions
                  </div>
                }
                style="light"
                className="flex w-4/5"
              >
                <Button
                  color="white"
                  size="sm"
                  className="hover:bg-sky-400 my-4 rounded-md"
                >
                  {" "}
                  <HiOutlineQuestionMarkCircle />{" "}
                </Button>
              </Tooltip>
            </div>
            <p className="text-center font-semibold">
              {" "}
              Similarity Score: {curClickedRect.norm_score.toFixed(2)}
            </p>
            <div className="flex">
              <Card>
                {" "}
                <h5 className="text-lg font-bold leading-none text-gray-900 dark:text-white">
                  {" "}
                  {curClickedRect.documents[0]}{" "}
                </h5>{" "}
                <p className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  Avg Conf Score:{" "}
                  <span className="font-normal">
                    {" "}
                    {conf && conf.hasOwnProperty(curClickedRect.documents[0])
                      ? conf[curClickedRect.documents[0]].toFixed(2)
                      : null}{" "}
                  </span>
                </p>
                <p className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  Sentiment Score:{" "}
                  <span className="font-normal">
                    {" "}
                    {sentiments &&
                    sentiments.hasOwnProperty(curClickedRect.documents[0])
                      ? sentiments[curClickedRect.documents[0]][
                          "compound"
                        ].toFixed(2)
                      : null}
                  </span>
                </p>
                {topKWords &&
                topKWords.hasOwnProperty(curClickedRect.documents[0]) ? (
                  <TopKWordsBarGraph
                    data={
                      topKWords &&
                      topKWords.hasOwnProperty(curClickedRect.documents[0])
                        ? topKWords[curClickedRect.documents[0]]
                        : null
                    }
                  />
                ) : null}
              </Card>

              <Card>
                {" "}
                <h5 className="text-lg font-bold leading-none text-gray-900 dark:text-white">
                  {" "}
                  {curClickedRect.documents[1]}{" "}
                </h5>{" "}
                <p className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  Avg Conf Score:{" "}
                  <span className="font-normal">
                    {" "}
                    {conf && conf.hasOwnProperty(curClickedRect.documents[1])
                      ? conf[curClickedRect.documents[1]].toFixed(2)
                      : null}{" "}
                  </span>
                </p>
                <p className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  Sentiment Score:{" "}
                  <span className="font-normal ">
                    {" "}
                    {sentiments &&
                    sentiments.hasOwnProperty(curClickedRect.documents[1])
                      ? sentiments[curClickedRect.documents[1]][
                          "compound"
                        ].toFixed(2)
                      : null}
                  </span>
                </p>
                {topKWords &&
                topKWords.hasOwnProperty(curClickedRect.documents[1]) ? (
                  <TopKWordsBarGraph
                    data={
                      topKWords &&
                      topKWords.hasOwnProperty(curClickedRect.documents[1])
                        ? topKWords[curClickedRect.documents[1]]
                        : null
                    }
                  />
                ) : null}
              </Card>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RelatedFilesHeatMap;
