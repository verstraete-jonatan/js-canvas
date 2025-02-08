import { useCallback, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

import { InstancedMesh, BufferGeometry, BoxGeometry, Matrix4 } from "three";
import { useControls } from "leva";
import { useAudioData } from "./useAudioData";

const totalNrPoints = 50000;
const radius = 200;

const instanceArgs = [new BoxGeometry(1, 1, 1), undefined, totalNrPoints];
const matrix = new Matrix4();
const { sin, tan, cos, cosh, sinh, tanh, PI, acos, asin, atan, atan2, hypot } =
  Math;

const goldenRatio = (1 + Math.sqrt(5)) / 2;
const goldenPi2 = 2 * PI * goldenRatio;
let og = 0;

const controlsCircle = {
  controlA: {
    value: 5,
    min: -500,
    max: 500,
    step: 0.1,
    editable: true,
  },
  controlB: {
    value: 50,
    min: 0,
    max: 50,
    step: 0.1,
    editable: true,
  },
  controlC: {
    value: 50,
    min: 0,
    max: 50,
    step: 0.1,
    editable: true,
  },
  ogInc: {
    value: 1,
    min: 1,
    max: 1000,
    step: 0.001,
    editable: true,
  },
};

const controlPreset = (name?: string) => {
  const obj = JSON.parse(
    JSON.stringify(controlsCircle)
  ) as typeof controlsCircle;

  switch (name) {
    case "cube-left":
      obj.controlA.value = -179.5;
      obj.controlB.value = 50;
      obj.controlC.value = 0.8999999999999986;
      obj.ogInc.value = 1;
      break;
    case "large-shape":
      obj.controlA.value = -183.7;
      obj.controlB.value = 0;
      obj.controlC.value = 0;
      obj.ogInc.value = 1;
      break;
  }
  return obj;
};

class SphereX {
  pts: [number, number, number][] = [];
  ptsCopy: [number, number, number][] = [];

  constructor() {
    const getPts = (i: number): [number, number, number] => {
      const phi = acos(1 - (2 * (i + 0.5)) / totalNrPoints);
      const theta = goldenPi2 * i;
      return [
        radius * sin(phi) * cos(theta),
        radius * cos(phi),
        radius * sin(phi) * sin(theta),
      ];
    };

    for (let i = 0; i < totalNrPoints; i++) {
      this.pts.push(getPts(i));
    }
    this.ptsCopy = JSON.parse(JSON.stringify(this.pts));
  }
  reset() {
    this.pts = JSON.parse(JSON.stringify(this.ptsCopy));
  }
  mutate(
    mesh: InstancedMesh<BufferGeometry>,
    controlA: number,
    controlB: number,
    controlC: number,
    ogInc: number
  ) {
    this.pts.forEach(([x, y, z], id) => {
      const _x = x * sin(x);
      const _y = y * cos(x);
      const _z = z * cos(y);

      const relId = (id / totalNrPoints) * Math.abs(sin(ogInc) * cos(ogInc));
      // y /=
      //   sinh(((_y + 1) * controlA) / totalNrPoints) -
      //   sin(relId * controlB) +
      //   cos(relId * controlB);
      // x /=
      //   sinh(((_x + 1) * controlA) / totalNrPoints) -
      //   sin(relId * controlC) +
      //   cos(relId * controlC);
      // z /=
      //   sinh(((_z + 1) * controlA) / totalNrPoints) -
      //   sin(relId * controlC) +
      //   cos(relId * controlC);

      y +=
        (sinh(((_y + 1) * controlA) / totalNrPoints) -
          sin(relId * controlB) +
          cos(relId * controlB)) *
        sin(y);
      x +=
        (sinh(((_x + 1) * controlB) / totalNrPoints) -
          sin(relId * controlC) +
          cos(relId * controlC)) *
        cos(x);
      z +=
        (sinh(((_z + 1) * controlC) / totalNrPoints) -
          sin(relId * controlA) +
          cos(relId * controlA)) *
        sin(z);

      matrix.makeTranslation(x, y, z);
      mesh.setMatrixAt(id, matrix);
      this.pts[id] = [x, y, z];
    });
  }
}

const sphere = new SphereX();

const Main = () => {
  const meshRef = useRef<InstancedMesh<BufferGeometry>>(null);
  const paused = useRef(false);

  const { controlA, controlB, controlC, ogInc } = useControls(controlPreset());
  const { audioVars } = useAudioData("waves");

  const updateMesh = useCallback(() => {
    if (meshRef.current) {
      const oogg = ogInc * sin(audioVars.low);
      sphere.mutate(meshRef.current, controlA, controlB, controlC, oogg);

      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [meshRef.current, controlA, controlB, controlC, ogInc, audioVars]);

  useFrame(({ camera, clock }) => {
    if (!paused.current) {
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
      key === " " && (paused.current = !paused.current);
      key === "Enter" && sphere.reset();
    };

    addEventListener("keydown", ev);
    return () => removeEventListener("keydown", ev);
  }, []);

  return (
    <instancedMesh ref={meshRef} args={instanceArgs as any}>
      <meshStandardMaterial />
    </instancedMesh>
  );
};

export default Main;
