import FileUpload from "./FileUpload";
const UploadFileModal = ({ showUploadModal, handleModal }) => {
  if (!showUploadModal) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal fixed top-0 left-0 w-full h-full flex items-center justify-center">
        <div className="fixed inset-0 bg-gray-500 opacity-50"></div>
        <div className="bg-[#fafafa] w-1/4 h-2/5 rounded shadow-md relative">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            onClick={() => handleModal()}
          >
            &#215;
          </button>
          <FileUpload />
        </div>
      </div>
    </div>
  );
};

export default UploadFileModal;