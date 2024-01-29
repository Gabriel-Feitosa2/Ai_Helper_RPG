import React, { useState } from "react";
import HelpIcon from "@mui/icons-material/Help";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link } from "react-router-dom";
import ConfigModal from "../configModal";
import QuizIcon from "@mui/icons-material/Quiz";
import Book from "../../assets/book-cover.png";
import { IconButton } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState(false);

  return (
    <>
      <ConfigModal openModal={modal} onClose={() => setModal(false)} />
      <button
        data-drawer-target="separator-sidebar"
        data-drawer-toggle="separator-sidebar"
        aria-controls="separator-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clip-rule="evenodd"
            fill-rule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <div
        id="separator-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-neutral-800 dark:bg-gray-800">
          <div className="h-full flex flex-col">
            <div className="justify-start">
              <ul className="space-y-2 font-medium">
                <li>
                  <Link
                    to="/"
                    className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-neutral-600 dark:hover:bg-gray-700 group"
                  >
                    <HomeIcon />
                    <span className="ms-3 text-white">Adventure Generator</span>
                  </Link>
                </li>
              </ul>
              <ul className="space-y-2 font-medium">
                <li>
                  <Link
                    to="/AiHelper"
                    className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-neutral-600 dark:hover:bg-gray-700 group"
                  >
                    <QuizIcon />
                    <span className="ms-3 text-white">AI DM Helper</span>
                  </Link>
                </li>
              </ul>
              <ul className="space-y-2 font-medium">
                <li>
                  <Link
                    to="/ChooseYourOwnHistory"
                    className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-neutral-600 dark:hover:bg-gray-700 group"
                  >
                    <img src={Book} alt="" className="w-6 h-6" />
                    <span className="ms-3 text-white">
                      Choose Your Own History
                    </span>
                  </Link>
                </li>
              </ul>
              <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
                <li>
                  <Link
                    to="/info"
                    className="flex items-center p-2 text-whiterounded-lg rounded-md dark:text-white hover:bg-neutral-600 dark:hover:bg-gray-700 group"
                  >
                    <HelpIcon />
                    <span className="flex-1 ms-3 whitespace-nowrap text-white">
                      infos
                    </span>
                  </Link>
                </li>
                <li>
                  <div
                    className="w-full cursor-pointer p-2 text-whiterounded-lg rounded-md dark:text-white hover:bg-neutral-600 dark:hover:bg-gray-700 group"
                    onClick={() => setModal(true)}
                  >
                    <SettingsIcon />
                    <span className="flex-1 ms-3 whitespace-nowrap text-white">
                      Configs
                    </span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="flex justify-end h-full flex-col">
              <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
                <a
                  href="https://github.com/Gabriel-Feitosa2/Ai_Helper_RPG"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconButton aria-label="GitHub">
                    <GitHubIcon sx={{ color: "white" }} />
                  </IconButton>
                </a>
                <a
                  href="https://www.linkedin.com/in/gabriel-feitosa-b02b70186"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconButton aria-label="GitHub">
                    <LinkedInIcon sx={{ color: "white" }} />
                  </IconButton>
                </a>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {children}
    </>
  );
}
