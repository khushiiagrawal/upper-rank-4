"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

// Vertex Shader
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment Shader
const fragmentShader = `
  uniform float time;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  // Improved noise function
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  // 2D noise
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  // FBM (Fractal Brownian Motion)
  float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(st * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    // Create a realistic Earth-like appearance with green theme
    vec3 oceanColor = vec3(0.0, 0.3, 0.4);
    vec3 landColor = vec3(0.1, 0.6, 0.3);
    vec3 desertColor = vec3(0.6, 0.5, 0.2);
    vec3 forestColor = vec3(0.0, 0.5, 0.2);
    vec3 mountainColor = vec3(0.5, 0.5, 0.5);
    
    // Create continents using FBM
    float continentNoise = fbm(vUv * 3.0);
    float continentMask = smoothstep(0.4, 0.6, continentNoise);
    
    // Add more detail with multiple noise layers
    float detailNoise = fbm(vUv * 8.0);
    float detailMask = smoothstep(0.4, 0.6, detailNoise);
    
    // Create a realistic color based on position
    vec3 baseColor = mix(oceanColor, landColor, continentMask);
    
    // Add terrain variation
    float terrainNoise = fbm(vUv * 5.0 + time * 0.05);
    float terrainMask = smoothstep(0.5, 0.7, terrainNoise);
    baseColor = mix(baseColor, forestColor, terrainMask * continentMask);
    
    // Add mountains
    float mountainNoise = fbm(vUv * 6.0 + time * 0.02);
    float mountainMask = smoothstep(0.7, 0.9, mountainNoise) * continentMask;
    baseColor = mix(baseColor, mountainColor, mountainMask);
    
    // Add deserts
    float desertNoise = fbm(vUv * 4.0 - time * 0.03);
    float desertMask = smoothstep(0.6, 0.8, desertNoise) * continentMask;
    baseColor = mix(baseColor, desertColor, desertMask);
    
    // Add polar ice caps
    float latitude = abs(vUv.y - 0.5) * 2.0;
    float iceCapMask = smoothstep(0.8, 0.9, latitude);
    baseColor = mix(baseColor, vec3(0.9, 0.9, 1.0), iceCapMask);
    
    // Lighting
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diff = max(dot(vNormal, lightDir), 0.0);
    
    // Add specular highlight
    float spec = pow(max(dot(reflect(-lightDir, vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 32.0);
    
    // Add clouds with animation
    float cloudNoise = fbm(vUv * 10.0 + time * 0.05);
    float cloudMask = smoothstep(0.6, 0.7, cloudNoise);
    
    // Combine effects
    vec3 color = baseColor * (0.3 + 0.7 * diff) + vec3(1.0) * spec * 0.5;
    color = mix(color, vec3(1.0), cloudMask * 0.5);
    
    // Add atmospheric glow
    float glow = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    color += vec3(0.1, 0.3, 0.2) * glow * 0.5;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

const Earth3D = ({ scale = 1 }: { scale?: number }) => {
  const earthRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { mouse } = useThree();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const mouseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [responsiveScale, setResponsiveScale] = useState(scale);

  // Smoothed rotation state
  const targetRotation = useRef({ x: 0, y: 0 });
  const defaultRotationSpeed = useRef(0.02); // Significantly increased default rotation speed

  // Handle responsive scaling
  useEffect(() => {
    const handleResize = () => {
      // Check if we're on a mobile device based on screen width
      if (window.innerWidth < 768) {
        // Mobile devices - reduce the scale by 40%
        setResponsiveScale(scale * 0.6);
      } else if (window.innerWidth < 1024) {
        // Tablets - reduce the scale by 20%
        setResponsiveScale(scale * 0.8);
      } else {
        // Desktop - use the original scale
        setResponsiveScale(scale);
      }
    };

    // Set initial scale
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [scale]);

  useEffect(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y = Math.PI / 2;
    }

    // Add mouse move event listener for more responsive rotation
    const handleMouseMove = (e: MouseEvent) => {
      setIsMouseMoving(true);

      // Clear any existing timeout
      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current);
      }

      // Set a timeout to detect when mouse stops moving
      mouseTimeoutRef.current = setTimeout(() => {
        setIsMouseMoving(false);
      }, 100);

      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current);
      }
    };
  }, []);

  useFrame((state) => {
    if (!earthRef.current || !materialRef.current) return;

    // Use both mouse from useThree and our state for better responsiveness
    const mouseX = (mouse.x + mousePosition.x) * 0.5;
    const mouseY = (mouse.y + mousePosition.y) * 0.5;

    if (isMouseMoving) {
      // Target rotation based on mouse movement
      targetRotation.current.y = mouseX * Math.PI * 0.5;
      targetRotation.current.x = mouseY * Math.PI * 0.25;

      // Smooth interpolation
      earthRef.current.rotation.y +=
        (targetRotation.current.y - earthRef.current.rotation.y) * 0.05;
      earthRef.current.rotation.x +=
        (targetRotation.current.x - earthRef.current.rotation.x) * 0.05;
    } else {
      // Default rotation when mouse is not moving - always rotate
      earthRef.current.rotation.y += defaultRotationSpeed.current;
    }

    // Update shader time uniform
    materialRef.current.uniforms.time.value = state.clock.elapsedTime;
  });

  return (
    <Sphere ref={earthRef} args={[2, 128, 128]} scale={responsiveScale}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          time: { value: 0 },
        }}
      />
    </Sphere>
  );
};

export default Earth3D;
