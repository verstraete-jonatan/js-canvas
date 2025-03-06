import { useCallback, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

import {
  InstancedMesh,
  BufferGeometry,
  BoxGeometry,
  Matrix4,
  Color,
} from "three";

const totalNrPoints = 20000;

const instanceArgs = [new BoxGeometry(1, 1, 1), undefined, totalNrPoints];
const matrix = new Matrix4();
const nextLine = 200;
let frames = 0;

const arrFromTo = (from: number, to: number) => {
  let c = 0;
  const res: number[] = [];
  for (let i = from; i < to + 1; i++) {
    if (i % 2 !== from - to) {
      res.push(i);
    }
  }
  return res;
};

export default function Main() {
  const meshRef = useRef<InstancedMesh<BufferGeometry> | any>();
  const updateMesh = useCallback(() => {
    if (meshRef.current) {
      let nextLines = 0;
      for (let i = 0; i < totalNrPoints; i++) {
        if (i % nextLine === 0) {
          nextLines++;
        }
        // const c = (i % 3) * Math.sin((i % 5) + frames);
        // const c = (i % 15) * (i % 30) * (i % 70) + frames * 10;

        // const ri = (100 / totalNrPoints) * i;
        // const c = (ri % 15) * (ri % 30) * (ri % 70) + frames * 10;

        // const c =
        //   // (ri % 15) *
        //   // (ri % 16) *
        //   // (ri % 17) *
        //   // (ri % 18) *
        //   (ri % 19) * (ri % 20) * (ri % 21) * (ri % 22) * (ri % 23) +
        //   frames * 10;

        const ri = (100 / totalNrPoints) * (i + 1000);
        let c = 1;
        const carr = arrFromTo(19, 28);
        for (const n of carr) {
          c *= ri % n;
        }
        c += frames * 10;

        const x = i % nextLine;
        const y = nextLines;
        const z = 1;

        const hslCol = c % 360;

        meshRef.current.setColorAt(i, new Color(`hsl(${hslCol},50%, 50%)`));
        meshRef.current.setMatrixAt(i, matrix.makeTranslation(x, y, z));
      }

      meshRef.current.instanceMatrix.needsUpdate = true;
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [meshRef.current]);

  useFrame(({ camera, clock }) => {
    frames += 0.1;
    requestAnimationFrame(updateMesh);
  });

  useEffect(() => {
    updateMesh();
  }, []);

  return (
    <instancedMesh ref={meshRef} args={instanceArgs as any}>
      <meshStandardMaterial />
    </instancedMesh>
  );
}
