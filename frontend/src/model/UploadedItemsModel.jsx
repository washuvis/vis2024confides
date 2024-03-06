import axios from "axios";

class UploadedItemsModel {
  constructor() {
    this.items = {};
  }

  async fetchAllItems() {
    const config = {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };

    try {
      const response = await axios.get("http://127.0.0.1:5000/files");
      this.items = response;
      //console.log(response);
      return response;
    } catch (error) {
      console.error(error);
    }
  }
}

const uploadedItemsModel = new UploadedItemsModel();
export default uploadedItemsModel;
