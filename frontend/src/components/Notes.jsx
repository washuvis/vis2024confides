import React from "react";
import { Dropdown, Textarea, Button } from "flowbite-react";
import {
  HiArrowLeft,
  HiArrowRight,
  HiOutlineBookOpen,
  HiCog,
  HiOutlineQuestionMarkCircle,
  HiDownload,
} from "react-icons/hi";

const Notes = () => {
  return (
    <div>
      {" "}
      <div className="flex mx-4 my-2 justify-between border-b">
        <p className="text-lg font-bold"> Notes </p>
        <Dropdown
          color="black"
          className="self-end	"
          size="sm"
          dismissOnClick={false}
          renderTrigger={() => (
            <Button
              className="hover:bg-sky-400 rounded-md"
              color="white"
              pill
              size="sm"
            >
              {" "}
              <HiDownload />{" "}
            </Button>
          )}
        >
          <Dropdown.Item>Export .docx</Dropdown.Item>
          <Dropdown.Item>Export .json</Dropdown.Item>
        </Dropdown>
      </div>
      <div className="w-full flex flex-col justify-between items-center">
        <Textarea
          id="large"
          sizing="sm"
          type="text"
          className="overflow-y-scroll resize-none px-2 w-11/12 h-full scrollbar-hide"
        />
      </div>
    </div>
  );
};

export default Notes;
