import * as T from '../vendor/three.module.js';

const QUALITY_COUNTS = { low: 160, medium: 360, high: 600 };

function randomSequence(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function rockGeometry(variant) {
  const geometry = new T.IcosahedronGeometry(1, 2);
  const positions = geometry.attributes.position;
  const colors = [];
  const impact = new T.Vector3(0.5 + variant * 0.13, 0.8, -0.4).normalize();
  let radius = 0;
  for (let i = 0; i < positions.count; i++) {
    const point = new T.Vector3().fromBufferAttribute(positions, i);
    const normal = point.clone().normalize();
    const broad = Math.sin(normal.x * 4.2 + variant) * Math.cos(normal.y * 3.7 - variant);
    const grain = Math.sin(normal.z * 18 + normal.y * 11 + variant * 4);
    const pit = Math.exp(-Math.pow((1 - normal.dot(impact)) / 0.12, 2));
    point.multiplyScalar(0.93 + broad * 0.14 + grain * 0.025 - pit * 0.15);
    point.x *= 0.84 + variant * 0.12;
    point.y *= 1.13 - variant * 0.11;
    positions.setXYZ(i, point.x, point.y, point.z);
    radius = Math.max(radius, point.length());
    const shade = 0.72 + broad * 0.12 + grain * 0.06 - pit * 0.1;
    colors.push(shade, shade * 0.97, shade * 0.92);
  }
  positions.needsUpdate = true;
  geometry.setAttribute('color', new T.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  geometry.boundingSphere = new T.Sphere(new T.Vector3(), radius);
  return geometry;
}

function rockTexture() {
  const size = 128;
  const pixels = new Uint8Array(size * size * 4);
  const random = randomSequence(8137);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const mineral = Math.sin(x * 0.21 + Math.sin(y * 0.16) * 3) * 13;
      const grain = random() * 32;
      const value = 118 + mineral + grain;
      const offset = (y * size + x) * 4;
      pixels[offset] = value;
      pixels[offset + 1] = value;
      pixels[offset + 2] = value;
      pixels[offset + 3] = 255;
    }
  }
  const texture = new T.DataTexture(pixels, size, size);
  texture.wrapS = texture.wrapT = T.RepeatWrapping;
  texture.minFilter = T.LinearMipmapLinearFilter;
  texture.magFilter = T.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

export class AsteroidBelt {
  constructor(system, planets) {
    this.group = new T.Group();
    this.group.name = 'Asteroid belt';
    this.records = [];
    const seed = [...system.id].reduce(
      (sum, letter) => sum * 31 + letter.charCodeAt(0),
      7,
    );
    const random = randomSequence(seed);
    const texture = rockTexture();
    const material = new T.MeshStandardMaterial({
      color: system.id === 'vulcan' ? '#8e7569' : '#8b8780',
      map: texture,
      bumpMap: texture,
      bumpScale: 0.055,
      vertexColors: true,
      roughness: 0.98,
      metalness: 0.03,
    });
    this.meshes = Array.from({ length: 4 }, (_, variant) => {
      const mesh = new T.InstancedMesh(
        rockGeometry(variant),
        material,
        Math.ceil(QUALITY_COUNTS.high / 4),
      );
      this.group.add(mesh);
      return mesh;
    });
    const dummy = new T.Object3D();
    for (let i = 0; i < QUALITY_COUNTS.high; i++) {
      const variant = i % this.meshes.length;
      const mesh = this.meshes[variant];
      const slot = Math.floor(i / this.meshes.length);
      let position;
      do {
        const angle = random() * Math.PI * 2;
        const orbit = 680 + (random() - random()) * 75;
        position = new T.Vector3(
          Math.cos(angle) * orbit,
          (random() - random()) * 32 + Math.sin(angle * 2.5) * 4,
          Math.sin(angle) * orbit,
        );
      } while (planets.some((p) => position.distanceTo(p.position) < p.data.radius + 75));

      const population = random();
      const size =
        population < 0.7
          ? 0.65 + random() * 0.5
          : population < 0.95
            ? 1.2 + random() * 0.75
            : 2.1 + random() * 0.8;
      dummy.position.copy(position);
      dummy.rotation.set(random() * 6.28, random() * 6.28, random() * 6.28);
      dummy.scale.set(
        size * (0.8 + random() * 0.35),
        size * (0.7 + random() * 0.4),
        size,
      );
      const envelope =
        mesh.geometry.boundingSphere.radius * Math.max(...dummy.scale.toArray());
      dummy.scale.multiplyScalar(Math.min(1, 3.9 / envelope));
      dummy.updateMatrix();
      mesh.setMatrixAt(slot, dummy.matrix);
      const tint = new T.Color().setHSL(
        0.09 + random() * 0.035,
        0.05 + random() * 0.1,
        0.64 + random() * 0.22,
      );
      mesh.setColorAt(slot, tint);
      const visualRadius =
        mesh.geometry.boundingSphere.radius * Math.max(...dummy.scale.toArray());
      this.records.push({
        name: 'asteroid',
        kind: 'asteroid',
        position,
        visualRadius,
        radius: visualRadius + 1.5,
        variant,
        slot,
      });
    }
    this.meshes.forEach((mesh) => {
      mesh.instanceMatrix.needsUpdate = true;
      mesh.instanceColor.needsUpdate = true;
      mesh.computeBoundingSphere();
    });
    this.setQuality('high');
  }

  setQuality(quality) {
    const count = QUALITY_COUNTS[quality] ?? QUALITY_COUNTS.high;
    this.meshes.forEach((mesh, variant) => {
      mesh.count = Math.max(0, Math.ceil((count - variant) / this.meshes.length));
    });
    this.obstacles = this.records.slice(0, count);
  }
}
