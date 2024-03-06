import React from "react";

const SideContextWindow = ({
  side,
  handleWordBtnClick,
  searchWord,
  setSearchHistory,
}) => {
  return (
    <div className="" style={{ display: "flex" }}>
      {side.map((subItem, subIndex) => (
        <button
          className="context-window-btn text-xs hover:bg-blue-700"
          onClick={handleWordBtnClick}
          style={{
            border: subItem[0] !== searchWord ? "solid 1px" : "none",
            borderRadius: "12px",
            textDecoration: subItem[0] !== searchWord ? "none" : "underline",
            backgroundColor:
              subItem[0] !== searchWord ? "#0ea5e9" : "transparent",
            color: subItem[0] !== searchWord ? "white" : "black",
            opacity: subItem[0] !== searchWord ? subItem[1] : 1,
            padding: "4px",
            transition: "background-color 0.3s ease-in-out", // Optional: Add transition for smooth effect
            ":hover": {
              backgroundColor:
                subItem[0] !== searchWord ? "#0c87b8" : "transparent", // Change color on hover
              color: subItem[0] !== searchWord ? "white" : "black", // Change text color on hover
            },
          }}
          key={subIndex}
        >
          {subItem[0]}
        </button>
      ))}
    </div>
  );
};

export default SideContextWindow;
