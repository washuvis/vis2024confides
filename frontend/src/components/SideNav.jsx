import { Sidebar, TextInput } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DarkThemeToggle, Flowbite } from "flowbite-react";
import logo from "../assets/logo.png"; // Adjust the path accordingly

import {
  HiInformationCircle,
  HiSearch,
  HiOutlineMenu,
  HiUpload,
} from "react-icons/hi";

const SideNav = ({ handleModal }) => {
  const [collapse, setCollapse] = useState(false);
  const navigate = useNavigate();
  const toSearch = () => {
    navigate("/search", {});
  };

  return (
    <>
      <Sidebar
        className={`Sidebar relative duration-300 border-solid ${
          collapse ? "w-16" : "w-40"
        }`}
      >
        <div className={`flex  flex-col  ${collapse ? "items-start" : ""}  `}>
          {collapse ? null : (
            <Sidebar.Logo
              href="/"
              img={logo}
              imgAlt="logo"
              className="text-md flex justify-center items-center"
            >
              ConFides
            </Sidebar.Logo>
          )}
          <div>
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <Sidebar.Item
                  onClick={() => setCollapse(!collapse)}
                  icon={HiOutlineMenu}
                ></Sidebar.Item>
              </Sidebar.ItemGroup>
              <Sidebar.ItemGroup>
                <Sidebar.Item icon={HiUpload} onClick={handleModal}>
                  {collapse ? "" : "Upload"}
                </Sidebar.Item>
                <Sidebar.Item onClick={toSearch} icon={HiSearch}>
                  {collapse ? "" : "Browse"}
                </Sidebar.Item>
                {/* <Sidebar.Item
                  href="https://github.com/themesberg/flowbite-react/issues"
                  icon={HiInformationCircle}
                >
                  {collapse ? "" : "Help"}
                </Sidebar.Item> */}
                <DarkThemeToggle/>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </div>
        </div>
      </Sidebar>
    </>
  );
};

export default SideNav;
