import * as THREE from 'three'
import { useRef, useMemo, useLayoutEffect, useEffect, useState } from 'react'
import { Canvas, extend } from '@react-three/fiber'
import { shaderMaterial, CameraControls } from '@react-three/drei'
import { DATA } from './data2'

const PI2 = Math.PI * 2
const detail = 150
const SCALE = 0.2
let nrBoxes = 0

const BOX_DATA = (() => {
  const boxData = []

  DATA.split('|').forEach((d, idx) => {
    const dataArr = JSON.parse(`[${d}]`)
    const row = []
    for (let i = 0; i < 1024; i += 3) {
      const value = dataArr[i + 1] / 10
      value && row.push(value)
      nrBoxes++
    }
    boxData.push(row)
  })

  return boxData
})()

const mapNum = (n, minInput, maxInput, minOutput, maxOutput) => ((n - minInput) * (maxOutput - minOutput)) / (maxInput - minInput) + minOutput
const hsl = (i) => `hsl(${mapNum(i, 0, nrBoxes, 50, 150).toFixed()}, 50%, 50%)`

const getColor = (i = 0) => {
  // do any color function here
  return hsl(i)
}

const MeshEdgesMaterial = shaderMaterial(
  {
    // color: new THREE.Color('white'),
    size: new THREE.Vector3(1, 1, 1),
    thickness: 0.01,
    smoothness: 0.2
  },
  /*glsl*/ `varying vec3 vPosition;
  void main() {
    vPosition = position;
    gl_Position = projectionMatrix * viewMatrix * instanceMatrix * vec4(position, 1.0);
  }`,
  /*glsl*/ `varying vec3 vPosition;
  uniform vec3 size;
  uniform vec3 color;
  uniform float thickness;
  uniform float smoothness;
  void main() {
    vec3 d = abs(vPosition) - (size * 0.5);
    float a = smoothstep(thickness, thickness + smoothness, min(min(length(d.xy), length(d.yz)), length(d.xz)));
    gl_FragColor = vec4(color, 1.0 - a);
  }`
)

extend({ MeshEdgesMaterial })
const o = new THREE.Object3D()
const c = new THREE.Color()

const defaultColors = new Float32Array([...Array(nrBoxes)].map((_, i) => c.set(getColor(i)).toArray()).flat())

function Boxes({ size = [0.15, 0.5, 15.15], ...props }) {
  const [colors, setColor] = useState(defaultColors)

  const mesh = useRef()
  const outlines = useRef()

  useEffect(() => {
    if (!mesh.current || !outlines.current) return

    const boxSize = 0.2
    let id = 0

    BOX_DATA.forEach((row, idx1) => {
      const y = idx1 / 1
      row.forEach((value, idx2) => {
        const x = idx2 * 3
        const z = value * 2

        // o.rotation.set(x, y, z)
        o.position.set(x * SCALE * 2, (y * SCALE) / 2, z * SCALE * 2)
        o.scale.set(boxSize, boxSize, boxSize)

        o.updateMatrix()
        mesh.current.setMatrixAt(id++, o.matrix)
      })
    })

    o.position.set(0, 0, 0)
    o.rotation.set(0, 0, 0)

    o.scale.set(10, 1, 5)

    o.updateMatrix()
    mesh.current.setMatrixAt(id++, o.matrix)

    mesh.current.instanceMatrix.needsUpdate = true
    // Re-use geometry + instance matrix
    outlines.current.geometry = mesh.current.geometry
    outlines.current.instanceMatrix = mesh.current.instanceMatrix
  }, [mesh, outlines])

  return (
    <group {...props}>
      <instancedMesh ref={mesh} args={[null, null, nrBoxes]}>
        <boxGeometry args={size}>
          <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
          {/* <meshEdgesMaterial /> */}
        </boxGeometry>
        <meshLambertMaterial vertexColors toneMapped={true} />
      </instancedMesh>
      <instancedMesh ref={outlines} args={[null, null, nrBoxes]}>
        <meshStandardMaterial metalness={0.2} roughness={1} />

        {/* <meshEdgesMaterial
          transparent={true}
          polygonOffset
          polygonOffsetFactor={-10}
          size={size}
          color="white"
          // thickness={0}
          thickness={0.0001}
          smoothness={0}
        /> */}
      </instancedMesh>
    </group>
  )
}

export const App = () => (
  <Canvas
    camera={{ position: [0, 0, 2] }}
    //  shadows={'soft'}
  >
    {/* <ambientLight intensity={0.01} /> */}
    <directionalLight position={[150, 150, 150]} intensity={1} />
    <Boxes />
    <CameraControls />
  </Canvas>
)
