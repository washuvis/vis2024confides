import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Button, Modal } from "flowbite-react";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";
import ColorLegend from "../d3Components/colorLegend";

const ConfValVisualizer = ({
  tooltipRef,
  data,
  activeIndex,
  setActiveIndex,
  audioRef,
  confValDivRef,
}) => {
  const svgRef = useRef(null);

  const divRef = useRef(null);
  const player = audioRef.current;
  const [openModal, setOpenModal] = useState(false);
  const opacityScale = d3.scaleLinear().domain([0, 100]).range([0, 1]);

  // Create a color scale with a single color (#0ea5e9) and varying opacity
  const colorScale = d3
    .scaleSequential((d) =>
      d3.interpolate("#0ea5e9", "#0ea5e9")(opacityScale(d))
    )
    .domain([0, 100]);

  useEffect(() => {
    const lineLen = parseInt(data.length / 10) + 2;
    const margin = { top: 20, right: 40, bottom: 30, left: 40 };
    const width =
      confValDivRef.current.offsetWidth - margin.left - margin.right;
    const height = 90 * lineLen - margin.top - margin.bottom;
    const barsPerRow = 10; // Number of bars per row
    const barWidth = 45; // Width of each bar
    const barHeight = 40; // Height of each bar
    const barSpacing = 2; // Spacing between bars
    const numRows = Math.ceil(data.length / barsPerRow);
    const lineInRow = [];
    d3.select("g").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", `${width}`)
      .attr("height", height + margin.top + margin.bottom)
      .append("g");

    const xScale = d3
      .scaleLinear()
      .range([0, d3.max(data, (d) => d.listWords.length)])
      .domain([0, 40]);

    const lineArr = Array.from(Array(lineLen).keys());
    let x = 80;
    let y = 10;
    let index = 0;
    let startIndex = 1;
    for (let i = 0; i < data.length; i++) {
      const segment = data[i];

      segment["x"] = x;
      segment["y"] = y;
      x += xScale(segment.listWords.length) + barSpacing;
      index += 1;
      if (x >= width - 120 || i == data.length - 1) {
        index = 0;
        x = 80;

        const endIndex = i + 1;
        lineInRow.push([startIndex, endIndex, y + 20]);
        startIndex = endIndex + 1;
        y += 60;
      }
    }

    svg.selectAll(".line-number").remove();

    svg
      .selectAll("text")
      .remove()
      .exit()
      .data(lineInRow)
      .enter()
      .append("text")
      .attr("x", "0")
      .attr("y", (d, i) => d[2])
      .text((d) => {
        if (d[0] === d[1]) {
          return `line ${d[0]}`;
        }
        return `line ${d[0]} - ${d[1]}`;
      })
      .attr("class", "lines dark:fill-white fill-gray-600")
      .attr("font-size", "12px");
    svg
      .selectAll("segments")
      .remove()
      .exit()
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "segments")
      .attr("x", (d, i) => d.x)
      .attr("y", (d, i) => d.y + 10)
      .attr("width", (d, i) => xScale(d.listWords.length))
      .attr("height", (d, i) => barWidth)
      .attr("stroke", (d, i) => {
        if (i === activeIndex) {
          return "black";
        }
        return "white";
      })

      .attr("stroke-width", (d, i) => {
        if (i === activeIndex) {
          return "2px";
        }
        return "0px";
      })
      .attr("fill", (d) => {
        return "#0ea5e9";
      })
      .attr("fill-opacity", (d, i) => d3.mean(d.listWords, (w) => w.conf_val))
      .attr("stroke-opacity", 1)
      .on("mouseover", (event, d) => {
        // Show tooltip on mouseover
        const content = (
          <div>
            <p>
              <b>Line Number:</b> {data.indexOf(d) + 1}
            </p>
            <div className="flex">
              <p className="font-bold">Average Confidence Value:</p>
              <div
                className={`bg-sky-500 text-white rounded-sm w-12 mx-2 text-center opacity-${parseInt(
                  d3.mean(d.listWords, (w) => w.conf_val) * 100
                )}`}
              >
                {d3.mean(d.listWords, (w) => w.conf_val).toFixed(2)}
              </div>
            </div>

            <p>
              <span className="font-bold"> Text: </span> {d.text}{" "}
            </p>
          </div>
        );
      })
      .on("click", (event, d) => {
        player.currentTime = data[data.indexOf(d)].startTime;
        player.play();
        setActiveIndex((index) => data.indexOf(d));
      });

    // Create y-axis
  }, [data, activeIndex]);

  return (
    <div className="flex flex-col mx-4 relative overflow-y-auto relative">
      <div className="flex border-b justify-between ">
        <p className="text-lg font-bold dark:text-white">Timeline View</p>

        <Button
          color="white"
          size="sm"
          className="hover:bg-sky-400 rounded-md"
          onClick={() => setOpenModal(true)}
        >
          {" "}
          <HiOutlineQuestionMarkCircle />{" "}
        </Button>
      </div>
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Help</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              The color of the bar represents the average confidence score
              of one line segment determined by AWS. The width of the bar represents how many words are in
              each line segment.
            </p>
            <ColorLegend colorScale={colorScale} />
          </div>
        </Modal.Body>
      </Modal>

      <div
        className="confVal relative overflow-y-scroll"
        ref={divRef}
        style={{ height: "40rem" }}
      >
        <svg className="text-center" ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default ConfValVisualizer;
