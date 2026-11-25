import * as T from '../vendor/three.module.js';

// A single, restrained bright-pass bloom composite. No extra animation loop.
export class SpaceRenderer {
  constructor(renderer) {
    this.renderer = renderer;
    this.target = new T.WebGLRenderTarget(1, 1, {
      type: T.HalfFloatType,
      minFilter: T.LinearFilter,
      magFilter: T.LinearFilter,
    });
    this.scene = new T.Scene();
    this.camera = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.material = new T.ShaderMaterial({
      uniforms: {
        source: { value: this.target.texture },
        texel: { value: new T.Vector2(1, 1) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D source;
        uniform vec2 texel;
        varying vec2 vUv;
        void main() {
          vec3 color = texture2D(source, vUv).rgb;
          vec3 glow = vec3(0.0);
          for (int x = -2; x <= 2; x++) {
            for (int y = -2; y <= 2; y++) {
              vec3 sampleColor = texture2D(source, vUv + vec2(float(x), float(y)) * texel * 3.0).rgb;
              float lightness = max(sampleColor.r, max(sampleColor.g, sampleColor.b));
              glow += sampleColor * smoothstep(0.85, 1.8, lightness) / 25.0;
            }
          }
          gl_FragColor = vec4(color + glow * 0.28, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
      depthTest: false,
      depthWrite: false,
    });
    this.scene.add(new T.Mesh(new T.PlaneGeometry(2, 2), this.material));
    this.size = new T.Vector2();
  }

  render(scene, camera, bloom) {
    const renderer = this.renderer;
    if (!bloom) {
      renderer.render(scene, camera);
      return;
    }
    renderer.getDrawingBufferSize(this.size);
    if (this.target.width !== this.size.x || this.target.height !== this.size.y) {
      this.target.setSize(this.size.x, this.size.y);
      this.material.uniforms.texel.value.set(1 / this.size.x, 1 / this.size.y);
    }
    renderer.setRenderTarget(this.target);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    renderer.render(this.scene, this.camera);
  }
}
