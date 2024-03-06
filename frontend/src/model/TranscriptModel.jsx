import axios from "axios";

class TranscriptModel {
  constructor() {
    this.transcriptSegments = [];
  }

  async fetchJson(filename) {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/data?file=${filename}`
      );

      const data = response.data;

      const json = data;
      const segments = processSegments(json);
      this.transcriptSegments = segments;
      return segments;
    } catch (error) {
      console.error(error);
      throw error;
    }

    function processSegments(segments) {
      return Object.entries(segments).map((i, k) => {
        return {
          id: i,
          text: segments[k].text,
          listWords: segments[k].list_words,
          startTime: segments[k].start_time,
          endTime: segments[k].end_time,
          speaker: segments[k].speaker,
          highlight: "none",
        };
      });
    }
  }
}

const transcriptModel = new TranscriptModel();
export default transcriptModel;
