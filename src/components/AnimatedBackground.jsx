import React, { useEffect, useRef, useState } from "react";
import "../styles/AnimatedBackground.css";

// Helper function to get primary color based on theme
function getPrimaryColor(isDark) {
  // Light mode: pitch black lines
  // Dark mode: bright blue-white lines for clear visibility
  return isDark ? "140, 150, 220" : "0, 0, 0";
}

// Helper function to get blend mode based on theme
function getBlendMode(isDark) {
  // Light mode: multiply blends dark lines nicely
  // Dark mode: normal so lines draw directly on dark background
  return isDark ? "normal" : "multiply";
}

/**
 * AnimatedBackground Component
 * Exact port of neural-background.tsx from teebs339's repository.
 * Fully scrollable, mouse-reactive, and theme-aware Plexus canvas.
 */
function AnimatedBackground({ theme }) {
  const canvasRef = useRef(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const pointsRef = useRef([]);
  const animationFrameRef = useRef(null);
  const [blendMode, setBlendMode] = useState("screen");
  const [opacity, setOpacity] = useState(0.8);

  const isDark = theme === "dark";

  useEffect(() => {
    // Update blend mode and opacity dynamically when theme props change
    setBlendMode(getBlendMode(isDark));
    setOpacity(1.0);
  }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Measure exact content height based on main + footer to prevent infinite expansion
    const getContentHeight = () => {
      const main = document.querySelector("main");
      const footer = document.querySelector("footer");
      const mainH = main ? main.offsetHeight : 0;
      const footerH = footer ? footer.offsetHeight : 0;
      return Math.max(mainH + footerH, window.innerHeight);
    };

    // Set canvas size matching content height
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      const newHeight = getContentHeight();
      canvas.height = newHeight;
      canvas.style.height = `${newHeight}px`;

      // Distribute points based on screen area, evenly using a grid with jitter to prevent clustering
      const gridSpacing = 125;
      const cols = Math.ceil(canvas.width / gridSpacing);
      const rows = Math.ceil(canvas.height / gridSpacing);
      const points = [];
      
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          points.push({
            x: (c + Math.random()) * (canvas.width / cols),
            y: (r + Math.random()) * (canvas.height / rows),
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
          });
        }
      }
      pointsRef.current = points;
    };
    resizeCanvas();

    // Update canvas height dynamically on layout changes
    const updateCanvasHeight = () => {
      const newHeight = getContentHeight();
      if (Math.abs(canvas.height - newHeight) > 30) {
        canvas.height = newHeight;
        canvas.style.height = `${newHeight}px`;

        const gridSpacing = 125;
        const cols = Math.ceil(canvas.width / gridSpacing);
        const rows = Math.ceil(canvas.height / gridSpacing);
        const points = [];
        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            points.push({
              x: (c + Math.random()) * (canvas.width / cols),
              y: (r + Math.random()) * (canvas.height / rows),
              vx: (Math.random() - 0.5) * 0.4,
              vy: (Math.random() - 0.5) * 0.4,
            });
          }
        }
        pointsRef.current = points;
      }
    };

    window.addEventListener("resize", resizeCanvas);

    // Watch for DOM layout changes inside main (without observing body attributes to avoid loop)
    const mainEl = document.querySelector("main");
    let observer = null;
    if (mainEl) {
      observer = new MutationObserver(updateCanvasHeight);
      observer.observe(mainEl, {
        childList: true,
        subtree: true,
      });
    }

    // Mouse tracking coordinate map
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top + window.scrollY,
      };
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Main animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const points = pointsRef.current;
      const mousePos = mousePosRef.current;
      const maxDistance = 150;
      // Detect theme from body class (light-mode = light, otherwise dark)
      const isLightMode = document.body.classList.contains("light-mode");
      const currentIsDark = !isLightMode;
      const primaryColor = getPrimaryColor(currentIsDark);
      // Higher opacity multipliers for both dark and light modes for maximum visibility
      const lineOpacityMul = currentIsDark ? 0.7 : 0.95;
      const mouseOpacityMul = currentIsDark ? 0.8 : 0.95;
      const dotOpacity = currentIsDark ? 0.6 : 0.9;
      const dotRadius = currentIsDark ? 1.8 : 1.7;

      // Find all content containers across the portfolio to exclude them from background line drawing
      const selectors = [
        ".hero__blob-container",
        ".hero__content",
        ".about__content",
        ".experience__list",
        ".experience__animation",
        ".skills__grid",
        ".projects__grid",
        ".featured-card",
        ".spotlight-card",
        ".standard-project-card",
        ".contact__content"
      ];
      
      const exclusionRects = [];
      for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el) {
          const rect = el.getBoundingClientRect();
          exclusionRects.push({
            left: rect.left,
            right: rect.right,
            top: rect.top + window.scrollY,
            bottom: rect.bottom + window.scrollY,
          });
        }
      }

      const isInsideExclusionZone = (x, y) => {
        for (const rect of exclusionRects) {
          const pad = 10; // Padding to keep lines clear of card/text boundaries
          if (
            x >= rect.left - pad &&
            x <= rect.right + pad &&
            y >= rect.top - pad &&
            y <= rect.bottom + pad
          ) {
            return true;
          }
        }
        return false;
      };

      // Verify canvas size matches scroll boundaries dynamically
      const currentHeight = Math.max(
        document.documentElement.scrollHeight,
        document.documentElement.clientHeight,
        window.innerHeight
      );
      if (canvas.height !== currentHeight) {
        canvas.height = currentHeight;
        canvas.style.height = `${currentHeight}px`;
      }
      if (canvas.width !== window.innerWidth) {
        canvas.width = window.innerWidth;
        canvas.style.width = `${window.innerWidth}px`;
      }

      // Update positions
      for (let i = 0; i < points.length; i++) {
        const point = points[i];

        // Random organic drifting forces
        const randomForce = 0.02;
        point.vx += (Math.random() - 0.5) * randomForce;
        point.vy += (Math.random() - 0.5) * randomForce;

        if (Math.random() < 0.1) {
          point.vx += (Math.random() - 0.5) * 0.3;
          point.vy += (Math.random() - 0.5) * 0.3;
        }

        point.x += point.vx;
        point.y += point.vy;

        // Wrap around boundaries
        if (point.x < 0) {
          point.x = canvas.width;
        } else if (point.x > canvas.width) {
          point.x = 0;
        }
        if (point.y < 0) {
          point.y = canvas.height;
        } else if (point.y > canvas.height) {
          point.y = 0;
        }

        // Friction dampening
        point.vx *= 0.99;
        point.vy *= 0.99;

        const maxVel = 2;
        point.vx = Math.max(-maxVel, Math.min(maxVel, point.vx));
        point.vy = Math.max(-maxVel, Math.min(maxVel, point.vy));
      }

      // Draw lines between points
      ctx.lineWidth = currentIsDark ? 0.8 : 0.8;
      for (let i = 0; i < points.length; i++) {
        let pointConnections = 0;
        for (let j = i + 1; j < points.length; j++) {
          // Limit connection lines to 2 per point to keep line density uniform and light everywhere
          if (pointConnections >= 2) break;

          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            // Skip lines that pass inside the profile image zone or text content zone to keep layout clean
            if (isInsideExclusionZone(points[i].x, points[i].y) || isInsideExclusionZone(points[j].x, points[j].y)) {
              continue;
            }
            const opacityVal = (1 - distance / maxDistance) * lineOpacityMul;
            ctx.strokeStyle = `rgba(${primaryColor}, ${opacityVal})`;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
            pointConnections++;
          }
        }
      }

      // Draw connection lines to mouse pointer
      if (mousePos.x > 0 && mousePos.y > 0) {
        ctx.lineWidth = 0.8;
        for (let i = 0; i < points.length; i++) {
          const dx = mousePos.x - points[i].x;
          const dy = mousePos.y - points[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const mouseConnectionDistance = 200;

          if (distance < mouseConnectionDistance) {
            // Skip drawing line connections if either the mouse or point is inside an exclusion zone
            if (isInsideExclusionZone(points[i].x, points[i].y) || isInsideExclusionZone(mousePos.x, mousePos.y)) {
              continue;
            }
            const opacityVal = (1 - distance / mouseConnectionDistance) * mouseOpacityMul;
            ctx.strokeStyle = `rgba(${primaryColor}, ${opacityVal})`;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(mousePos.x, mousePos.y);
            ctx.stroke();
          }
        }
        ctx.lineWidth = 0.5;
      }

      // Draw points
      ctx.fillStyle = `rgba(${primaryColor}, ${dotOpacity})`;
      for (const point of points) {
        if (isInsideExclusionZone(point.x, point.y)) {
          continue; // Skip drawing points inside exclusion zones (photo & text content)
        }
        ctx.beginPath();
        ctx.arc(point.x, point.y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      if (observer) {
        observer.disconnect();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="animated-background"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        pointerEvents: "none",
        zIndex: 0,
        mixBlendMode: blendMode,
        opacity: opacity,
      }}
    />
  );
}

export default AnimatedBackground;
