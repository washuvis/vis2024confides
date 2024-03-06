import React, { useRef } from "react";
import { Card, Button } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";

const CardContainer = (props) => {
  
  const navigate = useNavigate();
  const toAudio = () => {
    navigate("/output/?file=" + props.data);
  };
  return (
    <Card style={{ width: "15rem" }}>
      <h5 className="font-bold">{props.data}</h5>

      <Button color="dark" size="sm" onClick={toAudio}>
        Load Transcription
      </Button>
    </Card>
  );
};

export default CardContainer;
