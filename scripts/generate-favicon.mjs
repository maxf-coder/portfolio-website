import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const SIZES = [16, 32, 48];
const SOURCE = "app/icon.svg";
const OUT = "app/favicon.ico";

const pngs = [];
for (const size of SIZES) {
  const png = await sharp(SOURCE, { density: 384 })
    .resize(size, size)
    .png()
    .toBuffer();
  pngs.push({ size, png });
}

// ICO container with PNG entries (Vista+ format, supported by all modern browsers)
const headerSize = 6;
const entrySize = 16;

const header = Buffer.alloc(headerSize);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(pngs.length, 4); // count

const entries = [];
let offset = headerSize + entrySize * pngs.length;
for (const { size, png } of pngs) {
  const entry = Buffer.alloc(entrySize);
  entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
  entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
  entry.writeUInt8(0, 2); // palette colors
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8); // bytes in resource
  entry.writeUInt32LE(offset, 12); // offset in file
  entries.push(entry);
  offset += png.length;
}

await writeFile(OUT, Buffer.concat([header, ...entries, ...pngs.map((p) => p.png)]));
console.log(`Wrote ${OUT} (${pngs.length} sizes: ${pngs.map((p) => p.size).join(", ")})`);