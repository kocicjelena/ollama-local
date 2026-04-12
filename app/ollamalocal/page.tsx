"use client";
import { useEffect, useRef, useCallback } from "react";
import Layout from "../layout";
import LayoutUI from "@/components/ui/LayoutUI";
//import TestingOllamaRestAPI2 from "@/components/local/TestOllama2";
import ChatForm from "@/components/ChatForm";

export default function Index() {

  return (
    <>
    {/* <TestingOllamaRestAPI2 /> */}
    <ChatForm />
    </>
  );
}
