import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const TopKWordsBarGraph = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const dataArray = Object.entries(data);

    // Sort the array based on the values in descending order
    dataArray.sort((a, b) => b[1] - a[1]);

    // Take only the top 5 items
    const top5Data = dataArray.slice(0, 5);

    // Convert the array back to an object
    const reducedData = Object.fromEntries(top5Data);
    // Remove existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Set up the SVG container
    const svg = d3.select(svgRef.current);
    const width = 300;
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(Object.keys(reducedData))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(Object.values(reducedData))])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Draw bars
    svg
      .selectAll("rect")
      .data(Object.entries(reducedData))
      .enter()
      .append("rect")
      .attr("x", ([key]) => xScale(key))
      .attr("y", ([, value]) => yScale(value))
      .attr("width", xScale.bandwidth())
      .attr("height", ([, value]) => height - margin.bottom - yScale(value))
      .attr("fill", "#0ea5e9");

    // Draw axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis);

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis);
  }, [data]);

  return (
    <>
      <p className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
        Top 5 Words Within Transcription
      </p>
      <svg
        ref={svgRef}
        width="300"
        height="200"
        style={{ border: "1px solid #ccc" }}
      ></svg>
    </>
  );
};

export default TopKWordsBarGraph;
