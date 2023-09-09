import {
  CameraControls,
  useTexture,
  Environment,
  MeshPortalMaterial,
  RoundedBox,
  Text,
  useCursor,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Fish } from "./Fish";
import { Cactoro } from "./Cactoro";
import { Dragon } from "./Dragon_Evolved";
import { useState, useRef, useEffect } from "react";

import { easing } from "maath";

export const Experience = () => {
  const cameraControlsRef = useRef();
  const [active, setActive] = useState(null);
  const [hovered, setHovered] = useState(null);
  useCursor(hovered);

  const scene = useThree((state) => state.scene);

  useEffect(() => {
    if (active) {
      const targetPosition = new THREE.Vector3();
      console.log(active, scene);
      console.log(scene.getObjectByName(active));

      scene.getObjectByName(active).getWorldPosition(targetPosition);
      cameraControlsRef.current &&
        cameraControlsRef.current.setLookAt(
          0,
          0,
          5,
          targetPosition.x,
          targetPosition.y,
          targetPosition.z,
          true
        );
    } else {
      cameraControlsRef.current &&
        cameraControlsRef.current.setLookAt(0, 0, 5, 0, 0, 0, true);
    }
  }, [active]);

  return (
    <>
      <CameraControls
        ref={cameraControlsRef}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 6}
      />
      <ambientLight intensity={0.5} />
      <Environment preset="sunset" background />
      <MonsterStage
        position-x={4}
        rotation-y={-Math.PI / 8}
        color={"blue"}
        name="Fish"
        url={"/textures/anime_art_style_a_water_based_pokemon_like_environ.jpg"}
        active={active}
        hovered={hovered}
        setHovered={setHovered}
        setActive={setActive}
      >
        <Fish scale={0.6} position-y={-1} hovered={hovered === "Fish"} />
      </MonsterStage>
      <MonsterStage
        name="Cactoro"
        active={active}
        setActive={setActive}
        hovered={hovered}
        setHovered={setHovered}
        color={"green"}
        url={"/textures/anime_art_style_cactus_forest.jpg"}
      >
        <Cactoro scale={0.6} position-y={-1} hovered={hovered === "Cactoro"} />
      </MonsterStage>
      <MonsterStage
        name="Dragon"
        active={active}
        setActive={setActive}
        hovered={hovered}
        setHovered={setHovered}
        color={"red"}
        rotation-y={Math.PI / 8}
        position-x={-4}
        url={"/textures/anime_art_style_lava_world.jpg"}
      >
        <Dragon scale={0.6} position-y={-1} hovered={hovered === "Dragon"} />
      </MonsterStage>
    </>
  );
};

const MonsterStage = ({
  children,
  url,
  color,
  name,
  active,
  setActive,
  hovered,
  setHovered,
  ...props
}) => {
  const ref = useRef();
  const map = useTexture(url);
  useFrame((state, delta) => {
    const worldOpen = active === name;
    easing.damp(ref.current, "blend", worldOpen ? 1 : 0, 0.2, delta);
  });
  return (
    <>
      <group {...props}>
        <Text
          font="/fonts/Caprasimo-Regular.ttf"
          fontSize={0.3}
          position={[0, -1.3, 0.05]}
          anchorY="bottom"
        >
          {name}
          <meshBasicMaterial color={color} toneMapped={false} />
        </Text>
        <RoundedBox
          ref={ref}
          name={name}
          args={[2, 3, 0.1]}
          onDoubleClick={() => setActive(active === name ? null : name)}
          onPointerEnter={() => setHovered(name)}
          onPointerLeave={() => setHovered(null)}
        >
          <MeshPortalMaterial
            side={THREE.DoubleSide}
            blend={active === name ? 1 : 0}
          >
            <ambientLight intensity={1} />
            <Environment preset="sunset" />
            {children}
            <mesh>
              <sphereGeometry args={[5, 64, 64]} />
              <meshStandardMaterial map={map} side={THREE.BackSide} />
            </mesh>
          </MeshPortalMaterial>
        </RoundedBox>
      </group>
    </>
  );
};
