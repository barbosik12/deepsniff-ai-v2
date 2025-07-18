"use client";

import { useEffect, useRef, useState } from 'react';

interface RipplePoint {
  x: number;
  y: number;
  time: number;
  intensity: number;
}

export function WaterRippleEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const ripplesRef = useRef<RipplePoint[]>([]);
  const animationRef = useRef<number>();
  const [isMobile, setIsMobile] = useState(false);
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);

  // Vertex shader - simple geometry for fullscreen quad
  const vertexShaderSource = `
    attribute vec2 a_position;
    varying vec2 v_texCoord;
    
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
      v_texCoord = (a_position + 1.0) * 0.5;
    }
  `;

  // Fragment shader - creates water effect with ripples
  const fragmentShaderSource = `
    precision mediump float;
    
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_ripples[10];
    uniform float u_ripple_times[10];
    uniform float u_ripple_intensities[10];
    uniform int u_ripple_count;
    
    varying vec2 v_texCoord;
    
    // Function to create cosmic background
    vec3 cosmicBackground(vec2 uv) {
      // Base gradient
      vec3 color1 = vec3(0.05, 0.05, 0.1);   // Dark blue
      vec3 color2 = vec3(0.1, 0.1, 0.18);    // Graphite
      vec3 color3 = vec3(0.09, 0.13, 0.24);  // Lunar blue
      
      float gradient = smoothstep(0.0, 1.0, uv.y);
      vec3 baseColor = mix(color1, color2, gradient);
      baseColor = mix(baseColor, color3, sin(uv.x * 3.14159) * 0.3);
      
      // Add stars
      float stars = 0.0;
      for(int i = 0; i < 5; i++) {
        vec2 starPos = fract(uv * (10.0 + float(i) * 5.0) + float(i) * 123.456);
        float star = smoothstep(0.98, 1.0, 1.0 - length(starPos - 0.5) * 2.0);
        stars += star * 0.3;
      }
      
      return baseColor + stars * vec3(0.49, 0.83, 0.99); // Lunar blue for stars
    }
    
    // Function to create ripples
    float ripple(vec2 uv, vec2 center, float time, float intensity) {
      float dist = length(uv - center);
      float rippleTime = time * 3.0;
      
      // Create wave that spreads from center
      float wave = sin(dist * 30.0 - rippleTime) * exp(-dist * 8.0);
      
      // Add time-based fade
      float fade = exp(-time * 2.0);
      
      return wave * intensity * fade;
    }
    
    void main() {
      vec2 uv = v_texCoord;
      
      // Get base cosmic background
      vec3 color = cosmicBackground(uv);
      
      // Apply distortions from all active ripples
      vec2 distortion = vec2(0.0);
      float totalRipple = 0.0;
      
      for(int i = 0; i < 10; i++) {
        if(i >= u_ripple_count) break;
        
        vec2 rippleCenter = u_ripples[i];
        float rippleTime = u_time - u_ripple_times[i];
        float intensity = u_ripple_intensities[i];
        
        if(rippleTime > 0.0 && rippleTime < 2.0) {
          float rippleValue = ripple(uv, rippleCenter, rippleTime, intensity);
          totalRipple += rippleValue;
          
          // Create distortion for water effect
          vec2 rippleDir = normalize(uv - rippleCenter);
          distortion += rippleDir * rippleValue * 0.02;
        }
      }
      
      // Apply distortion to coordinates for color sampling
      vec2 distortedUV = uv + distortion;
      color = cosmicBackground(distortedUV);
      
      // Add highlights from ripples
      float highlight = abs(totalRipple) * 0.5;
      color += highlight * vec3(0.49, 0.83, 0.99); // Lunar blue highlight
      
      // Add light glow
      float glow = smoothstep(0.1, 0.0, abs(totalRipple)) * 0.3;
      color += glow * vec3(0.62, 0.62, 1.0); // Light purple
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize WebGL
    const gl = canvas.getContext('webgl');
    if (!gl) {
      setIsWebGLSupported(false);
      return;
    }

    glRef.current = gl;

    // Create shaders
    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) {
      setIsWebGLSupported(false);
      return;
    }

    // Create program
    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      setIsWebGLSupported(false);
      return;
    }

    programRef.current = program;

    // Create geometry (fullscreen quad)
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // Get uniform locations
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const ripplesLocation = gl.getUniformLocation(program, 'u_ripples');
    const rippleTimesLocation = gl.getUniformLocation(program, 'u_ripple_times');
    const rippleIntensitiesLocation = gl.getUniformLocation(program, 'u_ripple_intensities');
    const rippleCountLocation = gl.getUniformLocation(program, 'u_ripple_count');

    // Render function
    const render = (time: number) => {
      if (!gl || !program) return;

      // Update canvas size
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      
      gl.viewport(0, 0, canvas.width, canvas.height);

      // Clear and use program
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);

      // Set uniforms
      gl.uniform1f(timeLocation, time * 0.001);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

      // Clear old ripples
      const currentTime = time * 0.001;
      ripplesRef.current = ripplesRef.current.filter(ripple => 
        currentTime - ripple.time < 2.0
      );

      // Pass ripple data
      const maxRipples = 10;
      const rippleData = new Float32Array(maxRipples * 2);
      const rippleTimeData = new Float32Array(maxRipples);
      const rippleIntensityData = new Float32Array(maxRipples);

      for (let i = 0; i < Math.min(ripplesRef.current.length, maxRipples); i++) {
        const ripple = ripplesRef.current[i];
        rippleData[i * 2] = ripple.x;
        rippleData[i * 2 + 1] = ripple.y;
        rippleTimeData[i] = ripple.time;
        rippleIntensityData[i] = ripple.intensity;
      }

      gl.uniform2fv(ripplesLocation, rippleData);
      gl.uniform1fv(rippleTimesLocation, rippleTimeData);
      gl.uniform1fv(rippleIntensitiesLocation, rippleIntensityData);
      gl.uniform1i(rippleCountLocation, Math.min(ripplesRef.current.length, maxRipples));

      // Setup attributes
      const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

      // Render
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationRef.current = requestAnimationFrame(render);
    };

    // Mouse move handler
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1.0 - (event.clientY - rect.top) / rect.height; // Invert Y

      // Add new ripple
      ripplesRef.current.push({
        x,
        y,
        time: performance.now() * 0.001,
        intensity: 0.8 + Math.random() * 0.4 // Random intensity
      });

      // Limit number of ripples
      if (ripplesRef.current.length > 10) {
        ripplesRef.current.shift();
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // Start animation
    animationRef.current = requestAnimationFrame(render);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
      }
    };
  }, [isMobile]);

  if (isMobile || !isWebGLSupported) {
    return null; // Return to normal background
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}