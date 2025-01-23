import React from "react";
import { FaMicrophone, FaInstagram, FaGlobe, FaFolder } from "react-icons/fa";
import { MdImage, MdTextFields } from "react-icons/md";
import { AiFillYoutube, AiFillInstagram } from "react-icons/ai";
import { SiTiktok } from "react-icons/si";
import { BsChatDotsFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { addNode } from "../utils/flowSlice";
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
  const dispatch = useDispatch();

  return (
    <div className="fixed left-[10px] top-[10%] w-[50px] bg-gray-200 shadow-lg rounded-xl flex flex-col items-center py-4 space-y-1 pointer-events-auto z-10">
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
