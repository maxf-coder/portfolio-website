import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const SOURCE = "app/icon.svg";
const OUT = "public/icons";

await mkdir(OUT, { recursive: true });

for (const size of [192, 512]) {
  await sharp(SOURCE, { density: 384 })
    .resize(size, size)
    .png()
    .toFile(`${OUT}/icon-${size}.png`);
}

// Maskable: Android crops the icon to a circle or squircle. Flattening the
// transparent corners into the logo's own navy keeps the shape clean.
await sharp(SOURCE, { density: 384 })
  .resize(512, 512)
  .flatten({ background: "#010533" })
  .png()
  .toFile(`${OUT}/icon-maskable-512.png`);