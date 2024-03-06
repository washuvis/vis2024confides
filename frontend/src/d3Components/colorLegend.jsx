import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const ColorLegend = ({
  colorScale,
  width = 400,
  height = 40,
  tickTextOffset = 40,
}) => {
  const containerRef = useRef();

  useEffect(() => {
    const svg = d3.select(containerRef.current);

    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "color-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    // Add color stops to the gradient with varying opacity
    gradient
      .selectAll("stop")
      .data(colorScale.domain())
      .enter()
      .append("stop")
      .attr(
        "offset",
        (d) => d / colorScale.domain()[colorScale.domain().length - 1]
      )
      .attr("stop-color", "#0ea5e9")
      .attr("stop-opacity", (d) => d / 100);

    // Add the gradient rect
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "url(#color-gradient)");

    // Add text labels
    const ticks = colorScale.domain();
    svg
      .selectAll("text")
      .data(ticks)
      .enter()
      .append("text")
      .attr(
        "x",
        (d) => (d / colorScale.domain()[colorScale.domain().length - 1]) * width
      )
      .attr("y", tickTextOffset)
      .text((d) => d);
  }, [colorScale, width, height, tickTextOffset]);

  return (
    <div className="flex flex-col justify-center items-center gap-4 m-8">
      {" "}
      <p>Color Legend </p> <svg ref={containerRef}></svg>{" "}
    </div>
  );
};
export default ColorLegend;
