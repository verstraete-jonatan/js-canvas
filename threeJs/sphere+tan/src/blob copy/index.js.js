import { useEffect, useMemo, useRef } from 'react'
import { CameraControls, OrbitControls } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MathUtils } from 'three'

import vertexShader from './vertexShader.glsl.js'
import fragmentShader from './fragmentShader.glsl.js'

const SCALE = 3

const Blob = () => {
  // This reference will give us direct access to the mesh
  const mesh = useRef()
  const hover = useRef(false)

  const uniforms = useMemo(
    () => ({
      u_intensity: {
        value: 0.3
      },
      u_time: {
        value: 0.0
      }
    }),
    []
  )

  // useThree(({ camera }) => {
  //   camera.rotation.set(THREE.MathUtils.degToRad(Math.sin(time / 100) * SCALE * 3), 0, 0)
  // })

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()

    mesh.current.material.uniforms.u_time.value = 0.4 * time
    mesh.current.material.uniforms.u_intensity.value = MathUtils.lerp(mesh.current.material.uniforms.u_intensity.value, hover.current ? 0.85 : 0.15, 0.02)
  })

  return (
    <>
      <mesh ref={mesh} position={[0, 0, 0]} scale={SCALE} onPointerOver={() => (hover.current = true)} onPointerOut={() => (hover.current = false)}>
        <icosahedronGeometry args={[2, 20]} />
        <shaderMaterial fragmentShader={fragmentShader} vertexShader={vertexShader} uniforms={uniforms} wireframe={false} />
      </mesh>
    </>
  )
}

export const App = () => (
  <Canvas
    camera={{ position: [0, 0, 3 * SCALE] }}
    //  shadows={'soft'}
  >
    {/* <ambientLight intensity={0.01} /> */}
    <directionalLight position={[150, 150, 150]} intensity={1} />
    <Blob />
    <CameraControls />
  </Canvas>
)
