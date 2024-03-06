import React, { useState, useEffect } from "react";

const TimeHistory = ({ audioRef, setTimeHistory, timeHistory }) => {
  const [isUpdated, setIsUpdated] = useState(false);

  function secondsToHMS(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = parseInt(seconds % 60);

    // Format the result as "hh:mm:ss"
    const formattedTime = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
    return formattedTime;
  }
  function playAudio(time) {
    audioRef.current.currentTime = time;
    audioRef.current.play();
  }

  return (
    <div className="py-2 ">
      {timeHistory && Array.isArray(timeHistory) && timeHistory.length > 0 ? (
        timeHistory.map((time) => {
          return (
            <p
              key={time}
              type="button"
              onClick={() => playAudio(time)}
              className="text-s my-2  hover:text-sky-400 border-b mx-4"
            >
              {secondsToHMS(time)}
            </p>
          );
        })
      ) : (
        <p className="text-xs mx-4 py-2">
          Click on a marked timestamp to play the audio.
        </p>
      )}
    </div>
  );
};

export default TimeHistory;
