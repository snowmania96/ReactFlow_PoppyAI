import React from "react";
import { useDispatch } from "react-redux";
import VoiceRecord from "./VoiceRecord";
import Image from "./Image";
import Text from "./Text";
import AIChat from "./AIChat";
import Website from "./Website";
import Document from "./Document";
import Instagram from "./Instagram";
import Youtube from "./Youtube";
import Tiktok from "./Tiktok";
import GroupNode from "./GroupNode";

const SideBar = () => {
  return (
    <div className="fixed left-[10px] top-[10%] w-[50px] bg-gray-200 shadow-lg rounded-xl flex flex-col items-center p-2 pointer-events-auto z-10">
      <VoiceRecord />
      <Image />
      <Youtube />
      <Tiktok />
      <Instagram />
      <Text />
      <AIChat />
      <Website />
      <Document />
      <GroupNode />
    </div>
  );
};

export default SideBar;
