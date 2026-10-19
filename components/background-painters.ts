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

type Star = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  pulse: number;
  pulseSpeed: number;
  hue: number;
  depth: number;
  trailX: number[];
  trailY: number[];
};

type ParticleRipple = { x: number; y: number; radius: number; alpha: number };

const TRAIL_LENGTH = 5;
const LINK_DISTANCE = 120;
const CURSOR_DISTANCE = 160;
const PUSH_DISTANCE = 130;
const MAX_STARS = 60;
const AREA_PER_STAR = 16000;
const STAR_HUES = [45, 210, 200, 50, 190];

export function createParticles(): Painter {
  let width = 0;
  let height = 0;
  let stars: Star[] = [];
  let ripples: ParticleRipple[] = [];

  const resize = (nextWidth: number, nextHeight: number) => {
    if (nextWidth === width && nextHeight === height && stars.length > 0) return;
    width = nextWidth;
    height = nextHeight;
    ripples = [];

    const count = Math.min(Math.floor((width * height) / AREA_PER_STAR), MAX_STARS);

    stars = Array.from({ length: count }, () => {
      const depth = Math.random();
      const speed = (0.15 + depth * 0.3) * 60;

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        radius: 0.3 + depth * 2.2,
        baseAlpha: 0.1 + depth * 0.5,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.003 + Math.random() * 0.012,
        hue: STAR_HUES[Math.floor(Math.random() * STAR_HUES.length)],
        depth,
        trailX: [],
        trailY: [],
      };
    });
  };

  const onPointerDown = (x: number, y: number) => {
    ripples.push({ x, y, radius: 0, alpha: 0.12 });
  };

  const paint = (ctx: CanvasRenderingContext2D, dt: number, pointer: Pointer) => {
    const seconds = Math.min(dt, 50) / 1000;
    const step = seconds * 60;

    for (const star of stars) {
      star.pulse += star.pulseSpeed * step;

      if (pointer.active) {
        const dx = star.x - pointer.x;
        const dy = star.y - pointer.y;
        const distance = Math.hypot(dx, dy);

        if (distance < PUSH_DISTANCE && distance > 0.1) {
          const force = (PUSH_DISTANCE - distance) / PUSH_DISTANCE;
          star.x += (dx / distance) * force * 1.8 * (0.5 + star.depth) * step;
          star.y += (dy / distance) * force * 1.8 * (0.5 + star.depth) * step;
        }
      }

      star.x += star.vx * seconds;
      star.y += star.vy * seconds;

      let wrapped = false;

      if (star.x < -15) {
        star.x = width + 15;
        wrapped = true;
      }
      if (star.x > width + 15) {
        star.x = -15;
        wrapped = true;
      }
      if (star.y < -15) {
        star.y = height + 15;
        wrapped = true;
      }
      if (star.y > height + 15) {
        star.y = -15;
        wrapped = true;
      }

      if (wrapped) {
        star.trailX.length = 0;
        star.trailY.length = 0;
      }
      if (star.depth > 0.55) {
        star.trailX.push(star.x);
        star.trailY.push(star.y);

        if (star.trailX.length > TRAIL_LENGTH) {
          star.trailX.shift();
          star.trailY.shift();
        }

        ctx.lineWidth = star.radius * 0.6;
        for (let t = 0; t < star.trailX.length - 1; t++) {
          const alpha = (t / star.trailX.length) * star.baseAlpha * 0.4;
          ctx.beginPath();
          ctx.moveTo(star.trailX[t], star.trailY[t]);
          ctx.lineTo(star.trailX[t + 1], star.trailY[t + 1]);
          ctx.strokeStyle = `hsla(${star.hue}, 70%, 65%, ${alpha})`;
          ctx.stroke();
        }
      } else {
        star.trailX.length = 0;
        star.trailY.length = 0;
      }

      const alpha = Math.max(0, star.baseAlpha + Math.sin(star.pulse) * 0.25);

      if (star.depth > 0.4) {
        const glowRadius = star.radius * 3.5;
        const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, glowRadius);
        glow.addColorStop(0, `hsla(${star.hue}, 75%, 70%, ${alpha * 0.6})`);
        glow.addColorStop(1, `hsla(${star.hue}, 70%, 50%, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(star.x, star.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${star.hue}, 80%, 75%, ${alpha})`;
      ctx.fill();
    }

    const cols = Math.ceil(width / LINK_DISTANCE) + 1;
    const rows = Math.ceil(height / LINK_DISTANCE) + 1;
    const grid: Star[][] = new Array(cols * rows);

    for (const star of stars) {
      const index = Math.floor(star.y / LINK_DISTANCE) * cols + Math.floor(star.x / LINK_DISTANCE);
      (grid[index] ??= []).push(star);
    }

    ctx.lineWidth = 0.5;

    for (const a of stars) {
      const cellX = Math.floor(a.x / LINK_DISTANCE);
      const cellY = Math.floor(a.y / LINK_DISTANCE);

      for (let dx = 0; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy < 0) continue;

          const cell = grid[(cellY + dy) * cols + (cellX + dx)];
          if (!cell) continue;

          for (const b of cell) {
            if (b === a) continue;

            const distance = Math.hypot(a.x - b.x, a.y - b.y);
            if (distance >= LINK_DISTANCE) continue;

            const alpha = (1 - distance / LINK_DISTANCE) * 0.1 * Math.min(a.depth + b.depth, 1);
            ctx.strokeStyle = `hsla(${(a.hue + b.hue) / 2}, 65%, 60%, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      if (pointer.active) {
        const toCursor = Math.hypot(a.x - pointer.x, a.y - pointer.y);

        if (toCursor < CURSOR_DISTANCE) {
          ctx.strokeStyle = `hsla(${a.hue}, 75%, 65%, ${(1 - toCursor / CURSOR_DISTANCE) * 0.2})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }
    }

    ripples = ripples.filter((ripple) => ripple.alpha > 0.005);

    for (const ripple of ripples) {
      ripple.radius += 3 * step;
      ripple.alpha *= Math.pow(0.95, step);

      const glow = ctx.createRadialGradient(
        ripple.x,
        ripple.y,
        ripple.radius * 0.65,
        ripple.x,
        ripple.y,
        ripple.radius,
      );
      glow.addColorStop(0, "rgba(252, 241, 208, 0)");
      glow.addColorStop(0.8, `rgba(252, 241, 208, ${ripple.alpha})`);
      glow.addColorStop(1, "rgba(252, 241, 208, 0)");

      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  return { opaque: false, resize, paint, onPointerDown };
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