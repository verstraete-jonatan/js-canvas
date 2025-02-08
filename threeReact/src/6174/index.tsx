import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import Main from "./main";

/**
 * Fak me: it exists:
 * https://vaibhavkarve.github.io/6174.html
 */
export default () => (
  <>
    <Canvas camera={{ position: [0, 0, 400] }}>
      <ambientLight intensity={1} />
      <Main />
      <OrbitControls dampingFactor={1} />
    </Canvas>
  </>
);
