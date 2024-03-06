import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { config } from "../helper/apiconfig";
import * as d3 from "d3";
import RelatedFilesHeatMap from "./RelatedFilesHeatMap";
import { Button, Modal, Table } from "flowbite-react";
import TopKDocsGraph from "./TopKDocsGraph";
import {
  HiArrowLeft,
  HiArrowRight,
  HiOutlineBookOpen,
  HiCog,
  HiOutlineQuestionMarkCircle,
  HiArrowsExpand,
} from "react-icons/hi";

const RelatedFilesVisualizer = ({ filename }) => {
  const [relatedFiles, setRelatedFiles] = useState([]);
  const [relatedKFiles, setRelatedKFiles] = useState([]);
  const [relatedFilesName, setRelatedFilesName] = useState([]);
  const [openHelpModal, setOpenHelpModal] = useState(false);
  const [k, setK] = useState(3);
  async function fetchDoc2VecScores(filename) {
    console.log(filename);
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/relatedFiles?file=${filename}`,
        config
      );
      const data = Object.values(response.data).sort((a, b) => {
        // First, compare by x
        if (a.x !== b.x) {
          return a.x - b.x;
        }

        // If x values are equal, then compare by y
        return a.y - b.y;
      });
      const fileNames = [];
      data.map((item) => {
        if (item.x === item.y) {
          fileNames.push(item.documents[0]);
        }
      });
      setRelatedFiles(data);
      setRelatedFilesName(fileNames);

      const index = fileNames.indexOf(filename);

      if (index !== -1) {
        const result = data.filter(
          (item) => item.x === index && item.x !== item.y
        );

        setRelatedKFiles(result);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchDoc2VecScores(filename);
  }, []);

  return (
    <div>
      <Modal
        dismissible
        show={openHelpModal}
        onClose={() => setOpenHelpModal(false)}
        className="w-full h-full"
        size="7xl"
      >
        <Modal.Header className="w-full h-full">
          Heatmap of Audio Transcription Similarity
        </Modal.Header>
        <Modal.Body className="w-full h-full flex justify-center items-center">
          <RelatedFilesHeatMap
            data={relatedFiles}
            fileNames={relatedFilesName}
          />
        </Modal.Body>
      </Modal>
      <div className="border-b flex items-center justify-between">
        <p className="font-bold text-md"> Related Files </p>
        <Button
          className="hover:bg-sky-400 rounded-md"
          color="white"
          pill
          size="xs"
          onClick={() => setOpenHelpModal(true)}
        >
          {" "}
          <HiArrowsExpand className="dark:fill-white" />{" "}
        </Button>
      </div>

      <TopKDocsGraph
        data={relatedKFiles}
        k={2}
        relatedFilesName={relatedFilesName}
      />
    </div>
  );
};

export default RelatedFilesVisualizer;
