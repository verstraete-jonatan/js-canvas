import { useCallback, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

import {
  InstancedMesh,
  BufferGeometry,
  BoxGeometry,
  Matrix4,
  Camera,
} from "three";
import { useControls } from "leva";
import { bufferSize, useAudioData } from "./useAudioData";

const totalNrPoints = 50000;
const radius = 200;

const instanceArgs = [new BoxGeometry(1, 1, 1), undefined, totalNrPoints];
const matrix = new Matrix4();
const { sin, tan, cos, cosh, sinh, tanh, PI, acos, asin } = Math;

const goldenRatio = (1 + Math.sqrt(5)) / 2;
const goldenPi2 = 2 * PI * goldenRatio;
let og = 0;

const controls = {
  skew: {
    value: 0,
    min: 0,
    max: 500,
    step: 0.1,
  },
  spreadY: {
    value: 25,
    min: 0,
    max: 50,
    step: 0.1,
  },
  spreadX: {
    value: 40,
    min: 0,
    max: 50,
    step: 0.1,
  },
  dotsDistance: {
    value: 20000,
    min: 1,
    max: 20000,
    step: 1,
  },
  musicEffect: {
    value: 0.015,
    min: 0,
    max: 1,
    step: 0.001,
  },
};

const Main = () => {
  const meshRef = useRef<InstancedMesh<BufferGeometry> | any>();
  const paused = useRef(false);

  const { skew, spreadY, spreadX, dotsDistance, musicEffect } =
    useControls(controls);
  const { frequencyData } = useAudioData("eagle", false);

  const animate = useCallback(
    (i: number) => {
      const audioVal =
        frequencyData[i % (frequencyData.length - 1)] * musicEffect + og;

      // const relI = Math.round((bufferSize / totalNrPoints) * i); // i % (frequencyData.length - 1)
      // const audioVal = frequencyData[relI] * musicEffect + og;

      // const audioVal =
      //   i * tan((i + og) / totalNrPoints) * 1000 * musicEffect + og;

      const phi = acos(1 - (2 * (i + 0.5)) / totalNrPoints) + audioVal;
      const theta = (goldenPi2 * i) / dotsDistance;

      let x = radius * sin(phi) * cos(theta);
      let y = radius * cos(phi);
      let z = radius * sin(phi) * sin(theta);

      const _x = x;
      const _y = y;
      const _z = z;

      y *=
        sinh(((_y + 1) * skew) / totalNrPoints) -
        sin((i / totalNrPoints) * spreadY) +
        cos((i / totalNrPoints) * spreadY);

      x *=
        sinh(((_x + 1) * skew) / totalNrPoints) -
        sin((i / totalNrPoints) * spreadX) +
        cos((i / totalNrPoints) * spreadX);

      z *=
        sinh(((_z + 1) * skew) / totalNrPoints) -
        sin((i / totalNrPoints) * spreadX) +
        cos((i / totalNrPoints) * spreadY);

      /** V5: x stuf. Not sure if its any good tho */
      // x *= tanh((_y * skew) / (_z * spreadX));
      // y *= tanh((_z * skew) / (_x * spreadX));
      // z *= tanh((_x * skew) / (_y * spreadX));

      matrix.makeTranslation(x, y, z);
      meshRef.current.setMatrixAt(i, matrix);
    },
    [
      skew,
      spreadY,
      spreadX,
      dotsDistance,
      musicEffect,
      meshRef.current,
      frequencyData,
    ]
  );

  const updateMesh = useCallback(() => {
    if (meshRef.current) {
      for (let i = 0; i < totalNrPoints; i++) {
        animate(i);
      }

      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [meshRef.current, animate]);

  useFrame(({ camera, clock }) => {
    if (paused.current === false) {
      og += 0.0001;
    }

    if (clock.elapsedTime === 0) {
      camera.position.set(
        27.93771499972516,
        296.7564658994582,
        258.0343295270578
      );
      camera.matrix.set(
        0.9986302147500634,
        2.6020852139652106e-18,
        -0.052322979542857216,
        0,
        -0.014529007841019695,
        0.9606738320457113,
        -0.27729892959361374,
        0,
        0.05026531726148601,
        0.27767929059007684,
        0.9593579152005751,
        0,
        54.77996543127063,
        354.9240327460401,
        620.4445858958193,
        1
      );
    }

    // camera.rotateX(og * 100);
    // camera.rotateY(sin(og) * 10);
    // camera.rotateZ(og * 100);

    (window as any).camera = camera;

    requestAnimationFrame(updateMesh);
  });

  useEffect(() => {
    const ev = ({ key }: KeyboardEvent) => {
      if (key === " ") {
        paused.current = !paused.current;
        console.log({
          skew,
          spreadY,
          spreadX,
          dotsDistance,
          musicEffect,
          camera: (window as any).camera,
        });
      }
    };
    addEventListener("keydown", ev);
    return () => removeEventListener("keydown", ev);
  }, [
    paused.current,
    skew,
    spreadY,
    spreadX,
    dotsDistance,
    musicEffect,
    skew,
    spreadY,
    spreadX,
    dotsDistance,
    musicEffect,
  ]);

  return (
    <instancedMesh ref={meshRef} args={instanceArgs as any}>
      <meshStandardMaterial />
    </instancedMesh>
  );
};

export default Main;
