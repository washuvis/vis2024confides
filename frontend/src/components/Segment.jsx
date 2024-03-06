import React, { useState, useEffect } from "react";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { schemeTableau10 } from "https://cdn.skypack.dev/d3-scale-chromatic@3";
import EditableElement from "./EditableElement";
// import 'bootstrap/dist/css/bootstrap.min.css';


const Segment = (props) => {
  let speakerColors = {
    spk_0: schemeTableau10[0],
    spk_1: schemeTableau10[1],
    spk_2: schemeTableau10[2],
    spk_3: schemeTableau10[3],
    spk_4: schemeTableau10[4],
    spk_5: schemeTableau10[5],
    spk_6: schemeTableau10[6],
    spk_7: schemeTableau10[7],
    spk_8: schemeTableau10[8],
    spk_9: schemeTableau10[9],
  };

  function fancyTimeFormat(duration) {
    const hrs = ~~(duration / 3600);
    const mins = ~~((duration % 3600) / 60);
    const secs = ~~duration % 60;

    let ret = "";

    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;

    return ret;
  }

  useEffect(() => {}, [props.confidenceRange]);

  function style(word) {
    const type = word.type;
    const confidence = word.confidence;
    if (type != "punctuation") {
      let confValue = 1 * confidence;
      return "rgba(0,0,0," + confValue + ")";
    }
    return "rgba(0,0,0," + 1 + ")";
  }

  return (
    <>
      <div className="flex" style={{height: "100%", marginBottom: "12px" }}>
        <div style={{ width: "40px", marginRight: "1rem" }}>
          <div
            className="dark:text-white text-xs
            "
          >
            line {props.currentLine + 1}{" "}
          </div>
          <div
            className=" text-xs"
            style={{
              color: speakerColors[props.currentSegment.speaker],
            }}
          >
            {props.currentSegment.speaker + "  "}{" "}
          </div>
        </div>
        <div
          id={"sentence-" + props.currentSegment.id}
          key={props.currentSegment.text + Math.random()}
          style={{ zIndex: 1, textAlign: "left" }}
        >
          <div
            className=" text-xs"
            style={{
              color: speakerColors[props.currentSegment.speaker],
            }}
          >
            [
            {fancyTimeFormat(props.currentSegment.startTime) +
              "-" +
              fancyTimeFormat(props.currentSegment.endTime)}
            ]
          </div>
            <div 
              id={'sentence-' + props.currentSegment.id + '-text'} 
              contentEditable="true"
              suppressContentEditableWarning="true"
            >
            {props.currentSegment
              ? props.currentSegment.listWords.map((word) => {
                  if (word) {
                    var transformedConfVal =
                      parseFloat(word.conf_val) >= 1.0
                        ? ""
                        : word.conf_val.toFixed(2).replace(/^0+/, "");

                    return (
                      <OverlayTrigger
                        key={Math.random() + "overlayTrigger"}
                        placement="bottom"
                        overlay={
                          <Popover id="popover-positioned-bottom" className="tooltip">
                              {"Confidence Score: " +
                                Math.round(word.conf_val * 100) +
                                "%"}</Popover>
                        }
                      >
                        <span
                          className={` text-xs dark:text-white`}
                          style={{
                            background: props.currentSegment.highlight,
                            fontWeight: `${props.isCurrentSegmentPlaying}`,
                            color: style(word),
                            textDecoration: "underline",
                            textDecorationColor: `rgb(14,165,233, ${word.conf_val})`,
                            textUnderlineOffset: "4px",
                            textDecorationThickness: "4px",
                          }}
                          key={word.content + Math.random()}
                        >
                          {word.word + " "}
                        </span>
                      </OverlayTrigger>
                    );
                  }
                })
              : null}
            </div>
        </div>
      </div>
    </>
  );
};

export default Segment;
