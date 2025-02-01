import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { LayerMaterial, Depth, Fresnel } from 'lamina'
import { useMemo, useRef } from 'react'

import { CustomLayer } from './customLayer-blobbed'
import { fragmentShader, vertexShader } from './shaders'
import { MathUtils } from 'three'

extend({ CustomLayer })

const Planet2 = () => {
  const mesh = useRef()
  const hover = useRef(false)
  const currentTime = useRef(0)

  const uniforms = useMemo(
    () => ({
      u_intensity: {
        value: 0.01
      },
      u_time: {
        value: 0
      },
      u_colorA: { value: '#124dd8' },
      u_colorB: { value: '#2bffe7' },
      u_cloudTint: { value: '#001741' },
      u_gain: { value: 0.5 },
      u_lacunarity: { value: 2.0 }
    }),
    []
  )

  // useFrame(({ clock }) => {
  //   const time = clock.getElapsedTime()
  //   currentTime.current = time

  //   const t = time / 1000

  //   mesh.current.rotateX(Math.sin(t) / 200)
  //   mesh.current.rotateY(Math.cos(t) / 200)
  //   mesh.current.rotateZ(Math.sin(t) / 200)

  //   mesh.current.material.uniforms.u_time.value = 0.4 * time
  //   mesh.current.material.uniforms.u_intensity.value = MathUtils.lerp(mesh.current.material.uniforms.u_intensity.value, hover.current ? 0.65 : 0.05, 0.02)
  // })

  return (
    <mesh ref={mesh} position={[0, 0, 0]} scale={1} onPointerOver={() => (hover.current = true)} onPointerOut={() => (hover.current = false)}>
      {/* <icosahedronGeometry args={[2, 30]} /> */}
      {/* <torusKnotGeometry args={[1, 0.4, 150, 5]} /> */}
      <boxBufferGeometry args={[1, 1, 1, 1, 10]} />

      <shaderMaterial fragmentShader={fragmentShader} vertexShader={vertexShader} uniforms={uniforms} wireframe={false} />
      <Depth colorA="#f93" colorB="aqua" alpha={1} mode="add" />
    </mesh>
  )
}

const Planet = () => {
  const materialRef = useRef()

  useFrame((state) => {
    const { clock } = state
    materialRef.current.time = clock.getElapsedTime()
  })

  return (
    <mesh position={[0, 0, 0]} rotation={[0, Math.PI, 0]} scale={1.2}>
      <icosahedronGeometry args={[2, 11]} />
      {/* <circleBufferGeometry args={[2, 11]} /> */}
      <LayerMaterial lighting="lambert">
        {/* First layer is our own custom layer that's based of the FBM shader */}
        {/* 
          Notice how we can use *any* uniforms as prop here 👇
          You can tweak the colors by adding a colorA or colorB prop!
        */}
        <customLayer ref={materialRef} time={0.0} lacunarity={2.3} wireframe={true} />
        {/* Second layer is a depth based gradient that we "add" on top of our custom layer*/}
        <Depth colorA="blue" colorB="aqua" alpha={0.9} mode="add" />

        {/* Third Layer is a Fresnel shading effect that we add on*/}
        <Fresnel color="#FEB3D9" mode="add" />
      </LayerMaterial>
    </mesh>
  )
}

const Scene = () => {
  return (
    <Canvas camera={{ position: [0.0, 0.0, 8.0] }}>
      <ambientLight intensity={0.09} />
      <directionalLight position={[0.3, 0.05, 0.3]} intensity={1.5} />
      {/* <Planet /> */}
      <Planet2 />

      <OrbitControls />
    </Canvas>
  )
}

export { Scene, Planet }
