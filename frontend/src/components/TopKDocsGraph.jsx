import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const TopKDocsGraph = ({ data, k, relatedFilesName }) => {
  const svgRef = useRef();

  useEffect(() => {
    const dataArray = Object.entries(data);

    // Sort the array based on the values in descending order
    dataArray.sort((a, b) => d3.descending(a[1].norm_score, b[1].norm_score));

    // Take only the top 5 items
    const topKData = dataArray.slice(0, k);

    // Convert the array back to an object
    const reducedData = Object.fromEntries(topKData);

    // Remove existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();
    const normScores = Object.entries(reducedData).map(
      ([key, value]) => value.norm_score
    );

    // Set up the SVG container
    const svg = d3.select(svgRef.current);
    const width = 150;
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    console.log(Object.keys(reducedData));
    const result = Object.entries(reducedData).map((item) =>
      Array.isArray(item) ? item[0] : item
    );

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(result)
      .range([margin.left, width - margin.right])
      .padding(0.1);
    const xAxis = d3.axisBottom(xScale).tickFormat((d) => relatedFilesName[d]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(normScores)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg
      .selectAll("rect")
      .data(Object.entries(reducedData))
      .enter()
      .append("rect")
      .attr("x", ([key, value]) => xScale(key))
      .attr("y", ([key, value]) => yScale(parseFloat(value.norm_score)))
      .attr("width", xScale.bandwidth())
      .attr("class", ([k, v]) => console.log(yScale(v.norm_score)))
      .attr(
        "height",
        ([, value]) =>
          height - margin.bottom - yScale(parseFloat(value.norm_score))
      )
      .attr("fill", "#0ea5e9");

    // Draw axes

    const yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis);

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis);
    svg
      .append("text")
      .attr("class", "x-axis-title")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom + 28)
      .style("font-size", "10px") // Adjust the y position as needed
      .text("docs");

    // Assuming you already have yScale and yAxis defined

    // Append y-axis title
    svg
      .append("text")
      .attr("class", "y-axis-title")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("x", 0 - height / 2) // Adjust the x position as needed
      .attr("y", margin.left - 30)
      .style("font-size", "10px") // Adjust the y position as needed
      .text("similarity score");
  }, [data]);

  return (
    <svg
      ref={svgRef}
      width="150"
      height="250"
      style={{ border: "1px solid #ccc" }}
    ></svg>
  );
};

export default TopKDocsGraph;
