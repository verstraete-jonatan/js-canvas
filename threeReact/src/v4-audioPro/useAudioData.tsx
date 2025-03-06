import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const FREQUENCY_DIVISIONS = 512 * 4;
export const MAX_HEIGHT = 20;

export const bufferSize = FREQUENCY_DIVISIONS / 2;

let analyzer: AnalyserNode | null,
  dataArray: Float32Array,
  audioCtx: AudioContext | null;

type FileNames =
  | "andrez"
  | "blaze"
  | "buka-slow"
  | "eagle"
  | "phase50"
  | "phase500"
  | "phonk"
  | "sketch7"
  | "track13"
  | "waves";

export const useAudioData = (
  fileName: FileNames | `${FileNames}.${"mp3" | "flac"}`,
  // never set pause initially to true
  paused = false
) => {
  const [frequencyData, setFrequencyData] = useState<number[]>([]);

  useFrame(() => {
    if (analyzer && dataArray) {
      analyzer.getFloatFrequencyData(dataArray);
      const audioData = Array.from(dataArray);
      if (audioData[0] !== -Infinity) {
        setFrequencyData(audioData);
      }
    }
  });

  useEffect(() => {
    if (audioCtx) {
      audioCtx[paused ? "suspend" : "resume"]();
      // paused? audioCtx.suspend() : audioCtx.resume();
    }
  }, [paused]);

  useEffect(() => {
    if (!analyzer) {
      audioCtx?.close();
      audioCtx = new AudioContext();
      const audioElm = new Audio();
      audioElm.src = fileName.includes(".")
        ? `./${fileName}`
        : `./${fileName}.mp3`;
      audioElm.autoplay = true;
      audioElm.preload = "auto";
      const audioSourceNode = audioCtx.createMediaElementSource(audioElm);

      analyzer = audioCtx.createAnalyser();

      analyzer.smoothingTimeConstant = 0.9;
      analyzer.channelCountMode = "max";

      analyzer.fftSize = FREQUENCY_DIVISIONS;
      dataArray = new Float32Array(analyzer.frequencyBinCount);

      audioSourceNode.connect(analyzer);
      analyzer.connect(audioCtx.destination);
    }
  }, []);

  const audioVars = { low: [] };
  // const audioVars = useMemo(() => {
  //   const getRange = (a: number, b: number) =>
  //     Math.round(frequencyData.slice(a, b).reduce((i, t) => t + i, 0) / 200);

  //   return {
  //     low: getRange(0, FREQUENCY_DIVISIONS * 0.1),
  //     med: getRange(FREQUENCY_DIVISIONS * 0.2, FREQUENCY_DIVISIONS * 0.5),
  //   };
  // }, [frequencyData]);

  return { audioCtx, frequencyData, analyzer, audioVars };
};
