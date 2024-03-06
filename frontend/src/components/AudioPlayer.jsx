import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { timePattern } from "../helper/regex";
import { Button } from "flowbite-react";

const AudioPlayer = (props) => {
  const [audioURL, setAudioURL] = useState("");
  const timeInputRef = useRef(null);

  function handleTimeInputFieldChange() {
    if (timeInputRef.current === null || timeInputRef.current.value === null) {
      return;
    }
    if (!timePattern.test(timeInputRef.current.value)) {
      return;
    }
    const splitedTimeArr = timeInputRef.current.value
      .split(":")
      .map((timeComponent) => timeComponent);

    if (splitedTimeArr.length === 3) {
      const hours = splitedTimeArr[0];
      const minutes = splitedTimeArr[1];
      const seconds = splitedTimeArr[2];
      const currentTime = hours * 3600 + minutes * 60 + seconds;

      props.audioRef.current.currentTime = currentTime;
    }
  }

  function storeCurrentTimeToTimeHistory() {
    const history = JSON.parse(
      sessionStorage.getItem(`${props.filename}-timeHistory`)
    );
    if (
      props.audioRef.current === null ||
      props.audioRef.current.currentTime === null
    ) {
      return;
    }
    if (history === null) {
      const newHistory = JSON.stringify([
        props.audioRef.current.currentTime,
      ]);

      sessionStorage.setItem(`${props.filename}-timeHistory`, newHistory);
    } else {
      if (history.includes(props.audioRef.current.currentTime)) {
        return;
      }
      const newHistory = [
        ...history,
        props.audioRef.current.currentTime,
      ];
      sessionStorage.setItem(
        `${props.filename}-timeHistory`,
        JSON.stringify(newHistory)
      );
    }
    props.setTimeHistory(
      JSON.parse(sessionStorage.getItem(`${props.filename}-timeHistory`))
    );
  }

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/audio?file=${props.filename}.mp3`)
      .then((response) => {
        console.log(response);
        return response.data;
      })
      .then((url) => setAudioURL(url))
      .catch((error) => console.error("Error fetching audio URL:", error));
  }, []);

  return (
    <div className="w-2/5">
      <div className="flex gap-2">
        <audio
          className="h-6 w-4/5 color-white"
          src={audioURL}
          type="audio/mpeg"
          controls
          ref={props.audioRef}
        />

        {/* <Button
          color="dark"
          className="text-xs"
          size="xs"
          pill
          onClick={() => storeCurrentTimeToTimeHistory()}
        >
          {" "}
          Mark Time{" "}
        </Button> */}
      </div>
    </div>
  );
};
export default AudioPlayer;
