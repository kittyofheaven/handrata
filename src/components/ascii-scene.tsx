"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { AsciiEffect } from "three/addons/effects/AsciiEffect.js";

/*
 * The Figma file renders its artwork as pasted ASCII text, with a canvas note
 * reading "SEMUA ASCIINYA NANTI DIBENTUK 3D ASCII ANIMATION". This component is
 * that end state: a real Three.js scene rendered through AsciiEffect, which
 * maps rendered luminance onto the same ' .:-=+*#%@' ramp the mockup uses.
 *
 * Three variants:
 *  - "terrain" — the hero mountain, displaced out of the design's own photo.
 *  - "figure"  — the About page's bust.
 *  - "lattice" — a cube grid for Projects, echoing the dot/plus grids that sit
 *    behind the project card artwork.
 *
 * Nothing here responds to the pointer; every scene moves on its own.
 *
 * The terrain is orthographic and never rotates. It is layered over the same
 * photo it was built from, and under a perspective camera any rotation or Z
 * displacement shifts points radially — so the glyphs drift off the image
 * beneath them. Orthographic projection keeps screen position fixed while depth
 * still drives shading, so the two layers stay locked together. Its motion
 * therefore comes from a light orbiting the relief, not a turning mesh.
 */

const CHARS = " .:-=+*#%@";

/** Source photo aspect, after its empty sky was cropped away (1600x758). */
const TERRAIN_ASPECT = 1600 / 758;

/** Heightmap/texture sampling grid, matching that aspect. */
const TEX_W = 1024;
const TEX_H = Math.round(TEX_W / TERRAIN_ASPECT);
/** Plane subdivisions — one vertex per ~2.5 source pixels. */
const SEG_X = 400;
const SEG_Y = 190;

/** World-space plane size for the terrain, same aspect again. */
const PLANE_W = 32;
const PLANE_H = PLANE_W / TERRAIN_ASPECT;
/** Peak displacement toward the camera, in world units. */
const RELIEF = 6;

/*
 * AsciiEffect emits `width * resolution` characters across, so a higher value
 * means finer glyphs. The terrain runs denser than the solid scenes because it
 * carries photographic detail; to pay for that it renders at 30fps instead of
 * 60, which is invisible on motion this slow.
 */
const RESOLUTION = {
  terrain: { wide: 0.19, narrow: 0.13 },
  figure: { wide: 0.13, narrow: 0.1 },
  lattice: { wide: 0.13, narrow: 0.1 },
} as const;

const TERRAIN_FRAME_MS = 1000 / 30;

export type AsciiVariant = "terrain" | "figure" | "lattice";

type Props = {
  variant: AsciiVariant;
  /** Source image for the terrain heightmap. Ignored by the other variants. */
  src?: string;
  className?: string;
};

/**
 * Samples an image into separate luminance and alpha fields.
 *
 * Kept separate on purpose. AsciiEffect maps dark to the *densest* glyph
 * (`iCharIdx = round((1 - brightness) * maxIdx)`), so painting the sky black
 * fills it with '@' — the opposite of empty. It also short-circuits fully
 * transparent pixels to a blank (`if (iAlpha == 0) fBrightness = 1`). So the
 * sky is left transparent and discarded by alphaTest rather than coloured, and
 * the mountain keeps its own luminance: dark rock reads dense, lit snow sparse.
 */
async function loadHeightField(src: string) {
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.src = src;
  await image.decode();

  const canvas = document.createElement("canvas");
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.drawImage(image, 0, 0, TEX_W, TEX_H);
  const { data } = ctx.getImageData(0, 0, TEX_W, TEX_H);

  const count = TEX_W * TEX_H;
  const lum = new Float32Array(count);
  const alpha = new Uint8Array(count);
  for (let i = 0; i < count; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    lum[i] = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    alpha[i] = data[i * 4 + 3];
  }
  return { lum, alpha };
}

/** Greyscale texture carrying the photo's own alpha, row-flipped for plane UVs. */
function fieldToTexture(lum: Float32Array, alpha: Uint8Array) {
  const pixels = new Uint8Array(TEX_W * TEX_H * 4);
  for (let row = 0; row < TEX_H; row++) {
    const source = (TEX_H - 1 - row) * TEX_W;
    for (let col = 0; col < TEX_W; col++) {
      const from = source + col;
      const value = Math.round(lum[from] * 255);
      const at = (row * TEX_W + col) * 4;
      pixels[at] = value;
      pixels[at + 1] = value;
      pixels[at + 2] = value;
      pixels[at + 3] = alpha[from];
    }
  }
  const texture = new THREE.DataTexture(pixels, TEX_W, TEX_H);
  texture.needsUpdate = true;
  return texture;
}

export default function AsciiScene({ variant, src, className }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Guard against WebGL being unavailable (older devices, blocked contexts).
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    } catch {
      return;
    }

    const isTerrain = variant === "terrain";
    const disposables: { dispose(): void }[] = [];
    const scene = new THREE.Scene();
    const camera = isTerrain
      ? new THREE.OrthographicCamera(
          -PLANE_W / 2,
          PLANE_W / 2,
          PLANE_H / 2,
          -PLANE_H / 2,
          0.1,
          400
        )
      : new THREE.PerspectiveCamera(45, 1, 0.1, 1000);

    const isNarrow = window.innerWidth < 768;
    const effect = new AsciiEffect(renderer, CHARS, {
      resolution: isNarrow
        ? RESOLUTION[variant].narrow
        : RESOLUTION[variant].wide,
    });
    effect.domElement.style.color = "#fcfcfc";
    effect.domElement.style.backgroundColor = "transparent";
    effect.domElement.style.pointerEvents = "none";
    host.appendChild(effect.domElement);

    const group = new THREE.Group();
    scene.add(group);

    let sun: THREE.DirectionalLight | null = null;
    // Assigned once the render closure exists; lets the async texture trigger a
    // redraw instead of leaving the reduced-motion path racing a timer.
    let redraw: (() => void) | null = null;

    const addLights = (intensity: number) => {
      scene.add(new THREE.AmbientLight(0xffffff, 0.3));
      const key = new THREE.DirectionalLight(0xffffff, intensity);
      key.position.set(-5, 7, 9);
      scene.add(key);
    };

    if (variant === "figure") {
      camera.position.set(0, 0, 24);
      addLights(2.6);

      const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
      disposables.push(material);

      // A bust: head above, shoulders below — the two stacked shapes the
      // About page artwork resolves into.
      const head = new THREE.SphereGeometry(3, 44, 30);
      disposables.push(head);
      const headMesh = new THREE.Mesh(head, material);
      headMesh.position.y = 5.7;
      headMesh.scale.set(1, 1.12, 1);
      group.add(headMesh);

      const neck = new THREE.CylinderGeometry(1.1, 1.4, 2.2, 24);
      disposables.push(neck);
      const neckMesh = new THREE.Mesh(neck, material);
      neckMesh.position.y = 2.2;
      group.add(neckMesh);

      const torso = new THREE.CapsuleGeometry(3.6, 3.4, 10, 36);
      disposables.push(torso);
      const torsoMesh = new THREE.Mesh(torso, material);
      torsoMesh.position.y = -3.4;
      torsoMesh.scale.set(1.4, 1, 0.85);
      group.add(torsoMesh);
    } else if (variant === "lattice") {
      camera.position.set(0, 0, 30);
      addLights(2.8);

      const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
      const box = new THREE.BoxGeometry(2.4, 2.4, 2.4);
      disposables.push(material, box);

      // 3x3x3 of cubes with air between them — modules, assembled.
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            const cube = new THREE.Mesh(box, material);
            cube.position.set(x * 4.6, y * 4.6, z * 4.6);
            group.add(cube);
          }
        }
      }
    } else {
      camera.position.set(0, 0, 80);

      /*
       * Lambert rather than Basic: the photo texture supplies the base
       * luminance, so the glyphs read as the mountain, while the orbiting light
       * modulates it against the displaced relief. That modulation is the
       * animation — the geometry never moves.
       */
      scene.add(new THREE.AmbientLight(0xffffff, 0.82));
      sun = new THREE.DirectionalLight(0xffffff, 1.4);
      sun.position.set(-18, 14, 22);
      scene.add(sun);

      /*
       * alphaTest discards the transparent sky outright, leaving those pixels
       * unwritten. AsciiEffect reads alpha 0 there and emits a blank, so the
       * sky stays genuinely empty and the photo shows through untouched.
       */
      const material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        alphaTest: 0.5,
      });
      disposables.push(material);
      const geometry = new THREE.PlaneGeometry(PLANE_W, PLANE_H, SEG_X, SEG_Y);
      disposables.push(geometry);
      group.add(new THREE.Mesh(geometry, material));

      // Until the texture lands the material has no map, so alphaTest passes
      // everywhere and the plane would render as a solid slab. Start it hidden.
      material.visible = false;

      if (src) {
        void loadHeightField(src).then((sampled) => {
          if (!sampled) return;
          const { lum, alpha } = sampled;
          const texture = fieldToTexture(lum, alpha);
          disposables.push(texture);
          material.map = texture;
          material.visible = true;
          material.needsUpdate = true;

          const position = geometry.attributes.position;
          for (let i = 0; i < position.count; i++) {
            const col = i % (SEG_X + 1);
            const row = Math.floor(i / (SEG_X + 1));
            const sx = Math.round((col / SEG_X) * (TEX_W - 1));
            const sy = Math.round((row / SEG_Y) * (TEX_H - 1));
            const at = sy * TEX_W + sx;
            // Snow is the high ground; transparent sky stays flat.
            position.setZ(i, lum[at] * (alpha[at] / 255) * RELIEF);
          }
          position.needsUpdate = true;
          geometry.computeVertexNormals();
          redraw?.();
        });
      }
    }

    /*
     * Framing. The terrain mirrors the CSS `object-cover` of the photo beneath
     * it, so the two stay registered at any container shape. The spinning
     * scenes are fitted by bounding *sphere*, which is invariant under rotation
     * and therefore cannot clip at any angle.
     */
    const bounds = new THREE.Box3();
    const sphere = new THREE.Sphere();

    const frame = (aspect: number) => {
      if (camera instanceof THREE.OrthographicCamera) {
        let halfW: number;
        let halfH: number;
        if (aspect > TERRAIN_ASPECT) {
          halfW = PLANE_W / 2;
          halfH = halfW / aspect;
        } else {
          halfH = PLANE_H / 2;
          halfW = halfH * aspect;
        }
        camera.left = -halfW;
        camera.right = halfW;
        camera.top = halfH;
        camera.bottom = -halfH;
        camera.updateProjectionMatrix();
        return;
      }

      bounds.setFromObject(group);
      if (bounds.isEmpty()) return;
      bounds.getBoundingSphere(sphere);
      const halfFov = THREE.MathUtils.degToRad(camera.fov) / 2;
      const distV = sphere.radius / Math.tan(halfFov);
      const distH = sphere.radius / (Math.tan(halfFov) * aspect);
      camera.position.z = Math.max(distV, distH) * 1.06;
      camera.updateProjectionMatrix();
    };

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      if (!w || !h) return;
      if (camera instanceof THREE.PerspectiveCamera) camera.aspect = w / h;
      frame(w / h);
      effect.setSize(w, h);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    // Only animate while on screen — AsciiEffect rebuilds a large DOM string
    // every frame, which is far too costly to run for offscreen sections.
    let visible = true;
    const visibility = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: "120px" }
    );
    visibility.observe(host);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let raf = 0;
    let lastDraw = 0;
    const clock = new THREE.Clock();
    const renderFrame = () => effect.render(scene, camera);
    redraw = renderFrame;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;

      const now = performance.now();
      if (isTerrain && now - lastDraw < TERRAIN_FRAME_MS) return;
      lastDraw = now;

      const t = clock.getElapsedTime();
      if (variant === "figure") {
        group.rotation.y = t * 0.45;
        group.rotation.x = Math.sin(t * 0.3) * 0.08;
      } else if (variant === "lattice") {
        group.rotation.y = t * 0.32;
        group.rotation.x = t * 0.16;
      } else if (sun) {
        // Light sweeps across the relief; the mesh itself stays put.
        sun.position.set(Math.cos(t * 0.32) * 26, 14, Math.sin(t * 0.32) * 14 + 20);
      }
      renderFrame();
    };

    const teardown = () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibility.disconnect();
      effect.domElement.remove();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };

    if (reduceMotion) {
      // Still show the artwork, just hold it on a single frame. The texture
      // redraws itself through `redraw` once it has loaded.
      renderFrame();
      return teardown;
    }

    tick();
    return teardown;
  }, [variant, src]);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}
