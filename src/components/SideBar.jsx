import React from "react";
import VoiceRecord from "./VoiceRecord";
import Image from "./Image";
import Text from "./Text";
import AIChat from "./AIChat";
import Website from "./Website";
import Document from "./Document";
import Instagram from "./Instagram";
import Youtube from "./Youtube";
import Tiktok from "./Tiktok";
import Group from "./Group";
import Facebook from "./Facebook";
import { useContext } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import { MODE } from "../constants";
const SideBar = () => {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <div
      className="fixed top-20 bottom-36 left-1 w-[60px] shadow-lg rounded-[10px] flex flex-col items-center justify-around p-4  z-10"
      style={{
        position: "fixed",
        background: darkMode ? MODE.dark.sideBarBg : MODE.light.sideBarBg,
        pointerEvents: "auto",
      }}
    >
      <VoiceRecord />
      <Image />
      <Youtube />
      <Tiktok />
      <Instagram />
      <Facebook />
      <Text />
      <AIChat />
      <Website />
      <Document />
      <Group />
    </div>
  );
};

export default SideBar;
