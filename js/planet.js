import * as T from '../vendor/three.module.js';
const fract = (x) => x - Math.floor(x);
// Cache CPU canvases only; system disposal still releases every GPU texture.
const imageCache = new Map();
const hash = (x, y, seed) =>
  fract(Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453);
function noise(x, y, s) {
  const ix = Math.floor(x),
    iy = Math.floor(y);
  let fx = fract(x),
    fy = fract(y);
  fx = fx * fx * (3 - 2 * fx);
  fy = fy * fy * (3 - 2 * fy);
  return T.MathUtils.lerp(
    T.MathUtils.lerp(hash(ix, iy, s), hash(ix + 1, iy, s), fx),
    T.MathUtils.lerp(hash(ix, iy + 1, s), hash(ix + 1, iy + 1, s), fx),
    fy,
  );
}
function fbm(x, y, s) {
  let n = 0,
    a = 0.5;
  for (let i = 0; i < 5; i++) {
    n += noise(x, y, s) * a;
    x = x * 2.03 + 13;
    y = y * 2.03 + 7;
    a *= 0.5;
  }
  return n;
}
export function textureFor(data) {
  if (imageCache.has(data.id)) {
    const texture = new T.CanvasTexture(imageCache.get(data.id));
    texture.colorSpace = T.SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
  }
  const width = 768,
    height = 384,
    c = document.createElement('canvas');
  c.width = width;
  c.height = height;
  const ctx = c.getContext('2d'),
    img = ctx.createImageData(width, height),
    base = new T.Color(data.color);
  const seed = [...data.id].reduce((s, c) => s + c.charCodeAt(0), 0);
  const gas = data.texture === 'gas' || data.texture === 'cloud';
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const u = x / width,
        v = y / height,
        n = fbm(u * 9, v * 7, seed),
        fine = noise(u * 150, v * 100, seed);
      let r = base.r,
        g = base.g,
        b = base.b;
      if (data.texture === 'earth' || data.texture === 'ocean') {
        const continent = fbm(u * 5 + Math.sin(v * 12) * 0.25, v * 5, seed),
          land = continent > (data.texture === 'ocean' ? 0.64 : 0.51),
          polar = Math.abs(v - 0.5) * 2;
        if (land) {
          const dry = fbm(u * 13, v * 13, seed + 4);
          r = 0.1 + dry * 0.32;
          g = 0.2 + dry * 0.25;
          b = 0.12 + dry * 0.17;
          if (dry > 0.61) {
            r += 0.22;
            g += 0.1;
          }
        } else {
          r = 0.015 + n * 0.025;
          g = 0.08 + n * 0.15;
          b = 0.18 + n * 0.31;
        }
        if (data.id !== 'earth' && land) {
          r = (r + base.r) * 0.55;
          g = (g + base.g) * 0.55;
          b = (b + base.b) * 0.55;
        }
        if (polar > 0.87 + n * 0.08) {
          r = 0.78;
          g = 0.86;
          b = 0.9;
        }
        const cloud = fbm(u * 18 + Math.sin(v * 11) * 2, v * 13, seed + 9);
        if (cloud > 0.58) {
          const a = Math.min(0.85, (cloud - 0.58) * 6);
          r = T.MathUtils.lerp(r, 0.93, a);
          g = T.MathUtils.lerp(g, 0.95, a);
          b = T.MathUtils.lerp(b, 1, a);
        }
      } else if (gas) {
        const wave = Math.sin(v * 110 + noise(u * 8, v * 7, seed) * 3);
        const bands = 0.62 + n * 0.6 + wave * 0.1;
        r *= bands;
        g *= bands;
        b *= bands;
        if (data.id === 'jupiter') {
          const spot = Math.pow((u - 0.68) / 0.065, 2) + Math.pow((v - 0.58) / 0.037, 2);
          if (spot < 1) {
            r = 0.55 + spot * 0.15;
            g = 0.17 + spot * 0.2;
            b = 0.09 + spot * 0.18;
          }
        }
      } else if (data.texture === 'lava') {
        const ridge = Math.abs(fbm(u * 17, v * 14, seed) - 0.48);
        const heat = ridge < 0.023 ? 1 - ridge / 0.023 : 0;
        r = 0.045 + n * 0.08 + heat * 0.93;
        g = 0.025 + n * 0.025 + heat * 0.22;
        b = 0.02 + heat * 0.015;
      } else {
        const shade = 0.4 + n * 1.1 + fine * 0.1;
        r *= shade;
        g *= shade;
        b *= shade;
        if (data.texture === 'ice') {
          const cracks = Math.abs(fbm(u * 25, v * 18, seed) - 0.5) < 0.015;
          if (cracks) {
            r *= 0.4;
            g *= 0.6;
            b *= 0.8;
          }
        }
      }
      const i = (y * width + x) * 4;
      img.data[i] = Math.min(255, Math.pow(Math.max(r, 0), 1 / 2.2) * 255);
      img.data[i + 1] = Math.min(255, Math.pow(Math.max(g, 0), 1 / 2.2) * 255);
      img.data[i + 2] = Math.min(255, Math.pow(Math.max(b, 0), 1 / 2.2) * 255);
      img.data[i + 3] = 255;
    }
  ctx.putImageData(img, 0, 0);
  imageCache.set(data.id, c);
  if (imageCache.size > 8) imageCache.delete(imageCache.keys().next().value);
  const tex = new T.CanvasTexture(c);
  tex.colorSpace = T.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}
export function atmosphere(radius, color) {
  return new T.Mesh(
    new T.SphereGeometry(radius * 1.045, 48, 32),
    new T.ShaderMaterial({
      uniforms: { glowColor: { value: new T.Color(color) }, power: { value: 4.6 } },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec4 p = modelViewMatrix * vec4(position, 1.0);
          vPosition = p.xyz;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * p;
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float power;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          float rim = pow(
            1.0 - abs(dot(normalize(vNormal), normalize(-vPosition))),
            power
          );
          gl_FragColor = vec4(glowColor, rim * 0.45);
        }
      `,
      transparent: true,
      blending: T.AdditiveBlending,
      depthWrite: false,
      side: T.FrontSide,
    }),
  );
}
export class Planet {
  constructor(data, texture) {
    this.data = data;
    this.angle = data.phase;
    this.group = new T.Group();
    this.surface = new T.Mesh(
      new T.SphereGeometry(data.radius, 64, 40),
      new T.MeshStandardMaterial({
        map: texture,
        roughness: 0.94,
        metalness: 0,
        emissive: data.texture === 'lava' ? data.color : '#000000',
        emissiveIntensity: data.texture === 'lava' ? 0.16 : 0,
      }),
    );
    this.surface.rotation.z = data.id === 'uranus' ? 1.5 : 0.08;
    this.group.add(this.surface);
    if (data.atmosphere !== 'Trace exosphere')
      this.group.add(
        atmosphere(data.radius, data.texture === 'lava' ? '#ef6c31' : data.color),
      );
    if (data.rings) {
      const ringGeo = new T.RingGeometry(data.radius * 1.35, data.radius * 2.1, 160, 12),
        pos = ringGeo.attributes.position,
        colors = [];
      for (let i = 0; i < pos.count; i++) {
        const rr = Math.hypot(pos.getX(i), pos.getY(i)) / data.radius;
        const band = 0.55 + 0.22 * Math.sin(rr * 190) + 0.13 * Math.sin(rr * 66);
        colors.push(band, band * 0.91, band * 0.74);
      }
      ringGeo.setAttribute('color', new T.Float32BufferAttribute(colors, 3));
      const ring = new T.Mesh(
        ringGeo,
        new T.MeshStandardMaterial({
          color: '#e4d6b6',
          vertexColors: true,
          side: T.DoubleSide,
          transparent: true,
          opacity: 0.75,
          roughness: 1,
        }),
      );
      ring.rotation.x = Math.PI * 0.43;
      ring.rotation.y = 0.2;
      this.group.add(ring);
    }
    this.moons = [];
    for (let i = 0; i < Math.min(data.moons, 4); i++) {
      const radius = data.id === 'earth' ? 4.6 : Math.max(1.8, data.radius * 0.075);
      const moon = new T.Mesh(
        new T.IcosahedronGeometry(radius, 3),
        new T.MeshStandardMaterial({
          color: '#969698',
          roughness: 1,
          map: data.texture === 'rock' ? texture : null,
        }),
      );
      this.group.add(moon);
      this.moons.push({
        mesh: moon,
        angle: i * 2.1 + 0.8,
        radius: radius,
        orbit: data.radius * (2.8 + i * 0.5),
      });
    }
    const points = [];
    for (let i = 0; i <= 200; i++) {
      const a = (i / 200) * Math.PI * 2;
      points.push(
        new T.Vector3(
          Math.cos(a) * data.orbitDistance,
          0,
          Math.sin(a) * data.orbitDistance,
        ),
      );
    }
    this.orbit = new T.Line(
      new T.BufferGeometry().setFromPoints(points),
      new T.LineBasicMaterial({ color: '#57748f', transparent: true, opacity: 0.13 }),
    );
    this.update(0);
  }
  get position() {
    return this.group.position;
  }
  update(dt) {
    this.angle += this.data.orbitSpeed * dt;
    this.position.set(
      Math.cos(this.angle) * this.data.orbitDistance,
      0,
      Math.sin(this.angle) * this.data.orbitDistance,
    );
    this.surface.rotation.y += this.data.rotationSpeed * dt;
    for (const m of this.moons) {
      m.angle += dt * 0.025;
      m.mesh.position.set(
        Math.cos(m.angle) * m.orbit,
        Math.sin(m.angle) * m.orbit * 0.18,
        Math.sin(m.angle) * m.orbit,
      );
    }
  }
  obstacles() {
    return [
      {
        name: this.data.name,
        position: this.position,
        radius: this.data.radius * 1.09 + 4,
      },
      ...this.moons.map((m) => ({
        position: m.mesh.getWorldPosition(new T.Vector3()),
        radius: m.radius + 4,
        name: `${this.data.name} moon`,
      })),
    ];
  }
}
