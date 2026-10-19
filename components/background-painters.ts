export type Pointer = { x: number; y: number; active: boolean };

export type Painter = {
  opaque: boolean;
  resize: (width: number, height: number) => void;
  paint: (ctx: CanvasRenderingContext2D, dt: number, pointer: Pointer) => void;
  onPointerDown?: (x: number, y: number) => void;
};

type Orb = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
  baseAlpha: number;
  phase: number;
  phaseSpeed: number;
  wobbleX: number;
  wobbleY: number;
  wobbleFreqX: number;
  wobbleFreqY: number;
};

type Ripple = { x: number; y: number; age: number };

const HUES = [200, 210, 190, 45, 175];
const GLOW_DISTANCE = 200;
const CREAM = "252, 241, 208";
const RIPPLE_ALPHA = 0.15;
const RIPPLE_DURATION = 1.8;
const RIPPLE_SPEED = 180;

export function createAurora(): Painter {
  let width = 0;
  let height = 0;
  let orbs: Orb[] = [];
  let ripples: Ripple[] = [];
  let mouseX = -1;
  let mouseY = -1;

  const resize = (nextWidth: number, nextHeight: number) => {
    if (nextWidth === width && nextHeight === height && orbs.length > 0) return;
    width = nextWidth;
    height = nextHeight;

    orbs = HUES.map((hue, i) => {
      const angle = (i / HUES.length) * Math.PI * 2 + Math.random() * 0.8;
      const speed = 21 + Math.random() * 15; // pixels per second

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.max(width, height) * (0.2 + Math.random() * 0.25),
        hue,
        baseAlpha: 0.12 + Math.random() * 0.1,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.12 + Math.random() * 0.18, // radians per second
        wobbleX: 12 + Math.random() * 30, // pixels per second
        wobbleY: 12 + Math.random() * 30,
        wobbleFreqX: 0.5 + Math.random() * 1.5,
        wobbleFreqY: 0.5 + Math.random() * 1.5,
      };
    });
  };

  const onPointerDown = (x: number, y: number) => {
    ripples.push({ x, y, age: 0 });
  };

  const paint = (ctx: CanvasRenderingContext2D, dt: number, pointer: Pointer) => {
    const seconds = dt / 1000;
    const ease = 1 - Math.pow(0.96, seconds * 60); // Bolt's 0.04 per frame, per second

    if (pointer.active) {
      if (mouseX < 0) {
        mouseX = pointer.x; // first move: jump, don't glide in from the corner
        mouseY = pointer.y;
      }
      mouseX += (pointer.x - mouseX) * ease;
      mouseY += (pointer.y - mouseY) * ease;
    }

    for (const orb of orbs) {
      orb.phase += orb.phaseSpeed * seconds;
      orb.x += (orb.vx + Math.sin(orb.phase * orb.wobbleFreqX) * orb.wobbleX) * seconds;
      orb.y += (orb.vy + Math.cos(orb.phase * orb.wobbleFreqY) * orb.wobbleY) * seconds;

      if (orb.x < -orb.radius) orb.x = width + orb.radius;
      if (orb.x > width + orb.radius) orb.x = -orb.radius;
      if (orb.y < -orb.radius) orb.y = height + orb.radius;
      if (orb.y > height + orb.radius) orb.y = -orb.radius;

      // the whole field leans toward the cursor by a few pixels
      const parallax = pointer.active ? Math.min(18, orb.radius * 0.025) : 0;
      const renderX = orb.x + ((mouseX - width / 2) * parallax) / width;
      const renderY = orb.y + ((mouseY - height / 2) * parallax) / height;

      const alpha = orb.baseAlpha + Math.sin(orb.phase) * 0.03;
      const radius = orb.radius * (1 + Math.sin(orb.phase) * 0.08);

      const gradient = ctx.createRadialGradient(renderX, renderY, 0, renderX, renderY, radius);
      gradient.addColorStop(0, `hsla(${orb.hue}, 75%, 58%, ${alpha})`);
      gradient.addColorStop(0.35, `hsla(${orb.hue}, 70%, 48%, ${alpha * 0.6})`);
      gradient.addColorStop(1, `hsla(${orb.hue}, 60%, 35%, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(renderX, renderY, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ripples = ripples.filter((ripple) => ripple.age < RIPPLE_DURATION);

    for (const ripple of ripples) {
      ripple.age += seconds;

      const progress = ripple.age / RIPPLE_DURATION;
      if (progress >= 1) continue;

      const radius = RIPPLE_SPEED * ripple.age;
      const alpha = RIPPLE_ALPHA * (1 - progress) ** 2;

      const gradient = ctx.createRadialGradient(
        ripple.x,
        ripple.y,
        radius * 0.7,
        ripple.x,
        ripple.y,
        radius,
      );
      gradient.addColorStop(0, `rgba(${CREAM}, 0)`);
      gradient.addColorStop(0.8, `rgba(${CREAM}, ${alpha})`);
      gradient.addColorStop(1, `rgba(${CREAM}, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    if (pointer.active) {
      const glow = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, GLOW_DISTANCE);
      glow.addColorStop(0, `rgba(${CREAM}, 0.08)`);
      glow.addColorStop(0.5, `rgba(${CREAM}, 0.02)`);
      glow.addColorStop(1, `rgba(${CREAM}, 0)`);

      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, GLOW_DISTANCE, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  return { opaque: true, resize, paint, onPointerDown };
}

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  pulse: number;
  pulseSpeed: number;
};

const PARTICLE_COUNT = 45;
const LINK_DISTANCE = 130;
const CURSOR_DISTANCE = 160;
const PUSH_DISTANCE = 120;

export function createParticles(): Painter {
  let width = 0;
  let height = 0;
  let particles: Particle[] = [];

  const resize = (nextWidth: number, nextHeight: number) => {
    if (nextWidth === width && nextHeight === height && particles.length > 0) return;
    width = nextWidth;
    height = nextHeight;

    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 15,
      vy: (Math.random() - 0.5) * 15,
      radius: Math.random() * 1.6 + 0.4,
      alpha: Math.random() * 0.4 + 0.15,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.2 + Math.random() * 0.6,
    }));
  };

  const paint = (ctx: CanvasRenderingContext2D, dt: number, pointer: Pointer) => {
    const seconds = dt / 1000;

    for (const particle of particles) {
      particle.x += particle.vx * seconds;
      particle.y += particle.vy * seconds;
      particle.pulse += particle.pulseSpeed * seconds;

      if (particle.x < -10) particle.x = width + 10;
      if (particle.x > width + 10) particle.x = -10;
      if (particle.y < -10) particle.y = height + 10;
      if (particle.y > height + 10) particle.y = -10;

      if (pointer.active) {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy);

        if (distance < PUSH_DISTANCE && distance > 0) {
          const push = ((PUSH_DISTANCE - distance) / PUSH_DISTANCE) * 90 * seconds;
          particle.x += (dx / distance) * push;
          particle.y += (dy / distance) * push;
        }
      }

      const alpha = Math.max(0, particle.alpha + Math.sin(particle.pulse) * 0.15);
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CREAM}, ${alpha})`;
      ctx.fill();
    }

    ctx.lineWidth = 0.5;

    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];

      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance > LINK_DISTANCE) continue;

        ctx.strokeStyle = `rgba(${CREAM}, ${(1 - distance / LINK_DISTANCE) * 0.12})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      if (pointer.active) {
        const toCursor = Math.hypot(a.x - pointer.x, a.y - pointer.y);

        if (toCursor < CURSOR_DISTANCE) {
          ctx.strokeStyle = `rgba(${CREAM}, ${(1 - toCursor / CURSOR_DISTANCE) * 0.2})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }
    }
  };

  return { opaque: false, resize, paint };
}

let auroraPainter: Painter | null = null;
let particlesPainter: Painter | null = null;

export function getPainter(variant: "aurora" | "particles"): Painter {
  if (variant === "particles") {
    particlesPainter ??= createParticles();
    return particlesPainter;
  }

  auroraPainter ??= createAurora();
  return auroraPainter;
}