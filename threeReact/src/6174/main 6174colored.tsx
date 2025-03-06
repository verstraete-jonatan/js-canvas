import { useCallback, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

import {
  InstancedMesh,
  BufferGeometry,
  BoxGeometry,
  Matrix4,
  Camera,
  Color,
  Vector3,
} from "three";

const all = [] as { iterations: number; value: number }[];

const getNext = (n: number) => {
  let current = n;
  let g = 0;
  while (current !== 6174) {
    const arr = String(current).split("").map(Number);
    const high = Number(
      arr
        .slice()
        .sort((a, b) => b - a)
        .join("")
    );
    const low = Number(arr.slice().sort().join(""));

    current = high - low;
    g++;

    if (g > 7) {
      // will be nums like 1111
      all.push({
        iterations: -1,
        value: n,
      });
      return -1;
    }
  }

  all.push({
    iterations: g,
    value: n,
  });
};

for (let i = 0; i < 100000; i++) {
  const n = 1000 + i;
  if (String(n).length === 4) {
    getNext(n);
  }
}

const totalNrPoints = all.length;

const instanceArgs = [new BoxGeometry(1, 1, 1), undefined, totalNrPoints];
const matrix = new Matrix4();

// @ts-ignore
window.all = all;

export default function Main() {
  const meshRef = useRef<InstancedMesh<BufferGeometry> | any>();
  const updateMesh = useCallback(() => {
    if (meshRef.current) {
      const nextLine = 100;
      let nextLines = 0;
      all.forEach(({ value, iterations }, i) => {
        if (i % nextLine === 0) {
          nextLines++;
        }
        const x = i % nextLine;
        const y = nextLines * 1;
        const z = 1;

        const hslCol = Math.round((360 / 7) * iterations);

        meshRef.current.setColorAt(
          i,
          new Color(`hsl(${hslCol}, ${iterations === -1 ? 0 : "80%"}, 50%)`)
        );
        meshRef.current.setMatrixAt(i, matrix.makeTranslation(x, y, z));
      });

      meshRef.current.instanceMatrix.needsUpdate = true;
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [meshRef.current]);

  //   useFrame(({ camera, clock }) => {
  //     requestAnimationFrame(updateMesh);
  //   });

  useEffect(() => {
    updateMesh();
  }, []);

  return (
    <instancedMesh ref={meshRef} args={instanceArgs as any}>
      <meshStandardMaterial />
    </instancedMesh>
  );
}
