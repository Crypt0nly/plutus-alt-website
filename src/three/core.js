import * as THREE from 'three';

// The agent "core" — rebuilt from the ground up as a shader-driven energy form
// rather than a plain ball. A noise-displaced surface (organic, liquid), a
// fresnel atmosphere shell, and a swirling particle aura. Its shape (noise
// amplitude/detail), colour and spread MORPH as you scroll through the beats.

const SNOISE = `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const lerp = THREE.MathUtils.lerp;

export function createCore() {
  const group = new THREE.Group();

  // ---- displaced energy surface -----------------------------------------
  const surfMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uAmp: { value: 0.18 },
      uFreq: { value: 1.5 },
      uBright: { value: 1.0 },
      uColorA: { value: new THREE.Color('#7c5cff') },
      uColorB: { value: new THREE.Color('#36e0e0') },
      uMix: { value: 0.3 },
    },
    vertexShader: `
      ${SNOISE}
      uniform float uTime,uAmp,uFreq;
      varying vec3 vView; varying vec3 vNorm; varying vec3 vWorld; varying float vDisp;
      void main(){
        float n = snoise(position*uFreq + uTime*0.18);
        float n2 = snoise(position*uFreq*2.1 - uTime*0.13)*0.5;
        float disp = (n + n2)*uAmp;
        vDisp = n;
        vec3 p = position + normal*disp;
        vec4 wp = modelMatrix*vec4(p,1.0);
        vWorld = wp.xyz;
        vec4 mv = modelViewMatrix*vec4(p,1.0);
        vView = mv.xyz;
        vNorm = normalMatrix*normal;
        gl_Position = projectionMatrix*mv;
      }`,
    fragmentShader: `
      ${SNOISE}
      uniform float uTime,uBright,uMix; uniform vec3 uColorA,uColorB;
      varying vec3 vView; varying vec3 vNorm; varying vec3 vWorld; varying float vDisp;
      void main(){
        vec3 N = normalize(vNorm);
        vec3 V = normalize(-vView);
        float fres = pow(1.0 - clamp(dot(V,N),0.0,1.0), 2.2);
        float flow = snoise(vWorld*1.6 + uTime*0.3);
        float band = 0.5 + 0.5*sin(flow*3.0 + vDisp*4.0 + uTime*0.6);
        vec3 col = mix(uColorA, uColorB, clamp(uMix + flow*0.35, 0.0, 1.0));
        float energy = fres*1.25 + 0.1 + band*0.32;
        gl_FragColor = vec4(col*energy*uBright, 1.0);
      }`,
  });
  const surface = new THREE.Mesh(new THREE.IcosahedronGeometry(1.05, 5), surfMat);
  group.add(surface);

  // ---- fresnel atmosphere shell -----------------------------------------
  const atmoMat = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color('#7c5cff') },
      uOpacity: { value: 0.8 },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.FrontSide,
    vertexShader: `
      varying vec3 vView; varying vec3 vNorm;
      void main(){
        vec4 mv = modelViewMatrix*vec4(position,1.0);
        vView = mv.xyz; vNorm = normalMatrix*normal;
        gl_Position = projectionMatrix*mv;
      }`,
    fragmentShader: `
      uniform vec3 uColor; uniform float uOpacity;
      varying vec3 vView; varying vec3 vNorm;
      void main(){
        float fres = pow(1.0 - clamp(dot(normalize(-vView),normalize(vNorm)),0.0,1.0), 3.2);
        gl_FragColor = vec4(uColor*fres*1.5, fres*uOpacity);
      }`,
  });
  const atmosphere = new THREE.Mesh(new THREE.IcosahedronGeometry(1.55, 3), atmoMat);
  group.add(atmosphere);

  // ---- particle aura -----------------------------------------------------
  const COUNT = 1600;
  const pgeo = new THREE.BufferGeometry();
  const pos = new Float32Array(COUNT * 3);
  const rnd = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    const r = 1.25 + Math.random() * 1.0;
    const a = Math.random() * Math.PI * 2;
    const b = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(b) * Math.cos(a);
    pos[i * 3 + 1] = r * Math.cos(b);
    pos[i * 3 + 2] = r * Math.sin(b) * Math.sin(a);
    rnd[i] = Math.random();
  }
  pgeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  pgeo.setAttribute('aRand', new THREE.BufferAttribute(rnd, 1));
  const auraMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uSpread: { value: 1.0 },
      uSize: { value: 9.0 },
      uColor: { value: new THREE.Color('#8fa0ff') },
      uOpacity: { value: 0.8 },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    vertexShader: `
      uniform float uTime,uSpread,uSize; attribute float aRand;
      varying float vR;
      void main(){
        vR = aRand;
        float ang = uTime*(0.15 + aRand*0.25);
        mat2 R = mat2(cos(ang),-sin(ang),sin(ang),cos(ang));
        vec3 p = position;
        p.xz = R*p.xz;
        p *= uSpread*(0.9 + 0.2*sin(uTime*0.5 + aRand*6.28));
        vec4 mv = modelViewMatrix*vec4(p,1.0);
        gl_PointSize = uSize*(1.0+aRand)*(20.0/-mv.z);
        gl_Position = projectionMatrix*mv;
      }`,
    fragmentShader: `
      uniform vec3 uColor; uniform float uOpacity; varying float vR;
      void main(){
        float d = length(gl_PointCoord - 0.5);
        if(d>0.5) discard;
        float a = smoothstep(0.5,0.0,d)*uOpacity*(0.4+0.6*vR);
        gl_FragColor = vec4(uColor, a);
      }`,
  });
  const aura = new THREE.Points(pgeo, auraMat);
  group.add(aura);

  // ---- morph targets per beat state -------------------------------------
  const C = (h) => new THREE.Color(h);
  const PAL = {
    idle: { amp: 0.13, freq: 1.4, spread: 1.0, bright: 0.85, a: '#7c5cff', b: '#36e0e0', mix: 0.3, aura: '#8fa0ff' },
    prompt: { amp: 0.16, freq: 1.6, spread: 1.05, bright: 0.92, a: '#7c5cff', b: '#5b8cff', mix: 0.4, aura: '#a9b6ff' },
    plan: { amp: 0.09, freq: 2.6, spread: 1.05, bright: 0.9, a: '#36e0e0', b: '#7c5cff', mix: 0.3, aura: '#8fe6ff' },
    context: { amp: 0.2, freq: 1.8, spread: 1.18, bright: 0.95, a: '#36e0e0', b: '#7c5cff', mix: 0.45, aura: '#8fe6ff' },
    tools: { amp: 0.15, freq: 1.6, spread: 1.12, bright: 1.0, a: '#36e0e0', b: '#7c5cff', mix: 0.5, aura: '#bfe9ff' },
    approve: { amp: 0.08, freq: 2.0, spread: 0.95, bright: 0.9, a: '#ff5cae', b: '#7c5cff', mix: 0.35, aura: '#ffa9d6' },
    work: { amp: 0.18, freq: 1.7, spread: 1.1, bright: 1.0, a: '#ffb054', b: '#ff5cae', mix: 0.45, aura: '#ffd0a0' },
    report: { amp: 0.09, freq: 1.5, spread: 1.05, bright: 0.85, a: '#36e0e0', b: '#5b8cff', mix: 0.35, aura: '#bfe9ff' },
    team: { amp: 0.14, freq: 1.5, spread: 1.2, bright: 0.92, a: '#7c5cff', b: '#ff5cae', mix: 0.4, aura: '#c6b4ff' },
    deploy: { amp: 0.12, freq: 1.9, spread: 1.1, bright: 0.9, a: '#36e0e0', b: '#7c5cff', mix: 0.35, aura: '#9fe6ff' },
  };

  // current smoothed uniform values
  const cur = { amp: 0.16, freq: 1.4, spread: 1.0, bright: 1.0, mix: 0.3 };
  const colA = C('#7c5cff'), colB = C('#36e0e0'), colAura = C('#8fa0ff'), colAtmo = C('#7c5cff');
  const tA = C('#7c5cff'), tB = C('#36e0e0'), tAura = C('#8fa0ff');

  function update(dt, t, ctx) {
    const state = (ctx && ctx.state) || 'idle';
    const energy = ctx ? ctx.energy : 0.6;
    const p = PAL[state] || PAL.idle;
    const k = 1 - Math.exp(-2.6 * dt); // smooth morphs

    cur.amp = lerp(cur.amp, p.amp * (0.7 + energy * 0.4), k);
    cur.freq = lerp(cur.freq, p.freq, k);
    cur.spread = lerp(cur.spread, p.spread, k);
    cur.bright = lerp(cur.bright, p.bright * (0.62 + energy * 0.32), k);
    cur.mix = lerp(cur.mix, p.mix, k);
    tA.set(p.a); tB.set(p.b); tAura.set(p.aura);
    colA.lerp(tA, k); colB.lerp(tB, k); colAura.lerp(tAura, k); colAtmo.lerp(tA, k);

    surfMat.uniforms.uTime.value = t;
    surfMat.uniforms.uAmp.value = cur.amp;
    surfMat.uniforms.uFreq.value = cur.freq;
    surfMat.uniforms.uBright.value = cur.bright;
    surfMat.uniforms.uMix.value = cur.mix;
    surfMat.uniforms.uColorA.value.copy(colA);
    surfMat.uniforms.uColorB.value.copy(colB);

    atmoMat.uniforms.uColor.value.copy(colAtmo);
    atmoMat.uniforms.uOpacity.value = 0.3 + energy * 0.35;

    auraMat.uniforms.uTime.value = t;
    auraMat.uniforms.uSpread.value = cur.spread;
    auraMat.uniforms.uColor.value.copy(colAura);
    auraMat.uniforms.uOpacity.value = 0.28 + energy * 0.32;

    surface.rotation.y += dt * 0.12;
    surface.rotation.x += dt * 0.05;
    atmosphere.rotation.y -= dt * 0.06;
  }

  return { group, update };
}
