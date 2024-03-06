import React, { useState, useEffect, useRef } from "react";

const RelatedFilesNodeGraph = () => {
  const svgRef = useRef(null);
  const height = 100;
  const width = 100;
  useEffect(() => {
    const svg = d3
      .select(svgRef.current)
      .attr("width", `${width}`)
      .attr("height", height + margin.top + margin.bottom)
      .append("g");
  }, []);
  return (
    <div>
      <svg className="text-center" ref={svgRef}>
        {" "}
      </svg>
    </div>
  );
};

export default RelatedFilesNodeGraph;
