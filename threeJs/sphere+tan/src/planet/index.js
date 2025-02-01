import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { LayerMaterial, Depth, Fresnel } from 'lamina'
import { useMemo, useRef } from 'react'

import { CustomLayer } from './customLayer'

extend({ CustomLayer })

const Planet = () => {
  const materialRef = useRef()

  useFrame((state) => {
    const { clock } = state
    materialRef.current.time = clock.getElapsedTime()
  })

  return (
    <mesh position={[0, 0, 0]} rotation={[0, Math.PI, 0]} scale={1.2}>
      <icosahedronGeometry args={[2, 11]} />
      <LayerMaterial lighting="lambert">
        {/* First layer is our own custom layer that's based of the FBM shader */}
        {/* 
          Notice how we can use *any* uniforms as prop here 👇
          You can tweak the colors by adding a colorA or colorB prop!
        */}
        <customLayer ref={materialRef} time={0.0} lacunarity={2.3} />
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
      <Planet />
      <OrbitControls />
    </Canvas>
  )
}

export { Scene, Planet }
