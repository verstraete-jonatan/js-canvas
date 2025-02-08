import { useCallback, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

import {
  InstancedMesh,
  BufferGeometry,
  BoxGeometry,
  Matrix4,
  Color,
} from "three";
import { useControls } from "leva";

const totalNrPoints = 50000;
const radius = 200;

const instanceArgs = [new BoxGeometry(1, 1, 1), undefined, totalNrPoints];
const matrix = new Matrix4();
const { sin, tan, cos, cosh, sinh, tanh, PI, acos, asin } = Math;

const goldenRatio = (1 + Math.sqrt(5)) / 2;
const goldenPi2 = 2 * PI * goldenRatio;

let og = 0;
const Main = () => {
  const meshRef = useRef<InstancedMesh<BufferGeometry> | any>();

  const { controlA, controlB, controlC, ogInc, paused } = useControls({
    controlA: {
      value: 25,
      min: -500,
      max: 500,
      step: 0.1,
    },
    controlB: {
      value: 50,
      min: 0,
      max: 50,
      step: 0.1,
    },
    controlC: {
      value: 50,
      min: 0,
      max: 50,
      step: 0.1,
    },
    ogInc: {
      value: 1,
      min: 1,
      max: 1000,
      step: 0.001,
    },
    paused: false,
  });

  const animate = useCallback(
    (i: number) => {
      const phi = acos(1 - (2 * (i + 0.5)) / totalNrPoints);
      const theta = goldenPi2 * i * og;

      let x = radius * sin(phi) * cos(theta);
      let y = radius * cos(phi);
      let z = radius * sin(phi) * sin(theta);

      const _x = x;
      const _y = y;
      const _z = z;

      y /=
        sinh(((_y + 1) * controlA) / totalNrPoints) -
        sin((i / totalNrPoints) * controlB) +
        cos((i / totalNrPoints) * controlB);

      x /=
        sinh(((_y + 1) * controlA) / totalNrPoints) -
        sin((i / totalNrPoints) * controlC) +
        cos((i / totalNrPoints) * controlC);

      z /=
        sinh(((_y + 1) * controlA) / totalNrPoints) -
        sin((i / totalNrPoints) * controlC) +
        cos((i / totalNrPoints) * controlC);

      meshRef.current.setColorAt(
        i,
        new Color(
          `hsl(${Math.abs(Math.sin(_x / _y / _z / og)) * 360}, 80%, 50%)`
        )
      );

      /** V5: x stuf. Not sure if its any good tho */
      // x *= tanh((_y * coneWidth) / (_z * coneTopDepth));
      // y *= tanh((_z * coneWidth) / (_x * coneTopDepth));
      // z *= tanh((_x * coneWidth) / (_y * coneTopDepth));

      matrix.makeTranslation(x, y, z);
      meshRef.current.setMatrixAt(i, matrix);
    },
    [controlA, controlB, controlC, ogInc, meshRef.current]
  );

  const updateMesh = useCallback(() => {
    if (meshRef.current) {
      for (let i = 0; i < totalNrPoints; i++) {
        animate(i);
      }

      meshRef.current.instanceMatrix.needsUpdate = true;
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [meshRef.current, animate]);

  useFrame(({ camera, clock }) => {
    if (!paused) {
      // og += 0.0001;
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

  // useEffect(() => {
  //   const ev = ({ key }: KeyboardEvent) => {
  //     if (key === " ") {
  //       console.log(controlA, controlB, controlC);
  //     }
  //   };

  //   document.addEventListener("keydown", ev);

  //   return () => document.removeEventListener("keydown", ev);
  // }, [controlA, controlB, controlC]);

  return (
    <instancedMesh ref={meshRef} args={instanceArgs as any}>
      <meshStandardMaterial />
    </instancedMesh>
  );
};

export default Main;
