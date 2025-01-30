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
import Facebook from "./Facebook";

const SideBar = () => {
  return (
    <div
      className="fixed top-20 bottom-32 left-10 w-[80px] bg-neutral-600 shadow-lg rounded-xl flex flex-col items-center justify-around p-3  z-10"
      style={{ position: "fixed" }}
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
      <GroupNode />
    </div>
  );
};

export default SideBar;
