import { useMemo, useRef } from 'react'
import { CameraControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { MathUtils } from 'three'

import vertexShader from './vertexShader.glsl.js'
import fragmentShader from './fragmentShader.glsl.js'
import { Depth } from 'lamina'

const SCALE = 2

const Blob = ({ position = [0, 0, 0], intensity = 0.01, time = 0 }) => {
  // This reference will give us direct access to the mesh
  const mesh = useRef()
  const hover = useRef(false)
  const currentTime = useRef(0)

  const uniforms = useMemo(
    () => ({
      u_intensity: {
        value: intensity
      },
      u_time: {
        value: time
      }
    }),
    []
  )

  useFrame(({ clock }) => {
    const _time = clock.getElapsedTime()
    currentTime.current = _time

    const t = _time / 1000

    mesh.current.rotateX(Math.sin(t) / 200)
    mesh.current.rotateY(Math.cos(t) / 200)
    mesh.current.rotateZ(Math.sin(t) / 200)

    mesh.current.material.uniforms.u_time.value = 0.4 * _time
    mesh.current.material.uniforms.u_intensity.value = MathUtils.lerp(mesh.current.material.uniforms.u_intensity.value, hover.current ? 0.65 : 0.05, 0.02)
  })

  return (
    <>
      <mesh ref={mesh} position={position} scale={1} onPointerOver={() => (hover.current = true)} onPointerOut={() => (hover.current = false)}>
        {/* <icosahedronGeometry args={[2, 30]} /> */}
        <torusKnotGeometry args={[1, 0.4, 1500, 50]} />
        {/* <boxBufferGeometry args={[1, 1, 1, 1, 10]} /> */}

        <shaderMaterial fragmentShader={fragmentShader} vertexShader={vertexShader} uniforms={uniforms} wireframe={true} fog={true} />
        <Depth colorA="#f93" colorB="aqua" alpha={1} mode="add" />
      </mesh>
    </>
  )
}

export const App = () => (
  <Canvas camera={{ position: [0, 0, 3] }} shadows={'soft'}>
    <ambientLight intensity={0.01} />
    {/* <directionalLight position={[150, 150, 150]} intensity={0.1} /> */}

    <Blob />
    {/* <Blob position={[6, 0, 0]} time={300} /> */}

    <CameraControls />
  </Canvas>
)
