import sharp from "sharp";
import { mkdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";

const BASE = "/vercel/share/v0-project";
const IMAGE_PATH = join(BASE, "scripts", "speakers-composite.jpg");
const OUTPUT_DIR = join(BASE, "public", "speakers");

console.log("Checking file exists:", existsSync(IMAGE_PATH));
mkdirSync(OUTPUT_DIR, { recursive: true });

const speakersOrder = [
  "angelo-benavides",
  "edison-lopez",
  "geovanny-basantes",
  "erika-delgado",
  "luis-valverde",
  "alexa-dominguez",
  "luis-guerrero",
  "cristian-baraja",
  "luis-martinez",
  "anthony-quiranza",
  "john-cortez",
  "michael-paredes",
];

async function main() {
  const buffer = readFileSync(IMAGE_PATH);
  const metadata = await sharp(buffer).metadata();
  const w = metadata.width;
  const h = metadata.height;
  console.log(`Image size: ${w}x${h}`);

  const rowH = Math.floor(h / 2);
  const colW = Math.floor(w / 6);

  for (let idx = 0; idx < speakersOrder.length; idx++) {
    const name = speakersOrder[idx];
    const row = Math.floor(idx / 6);
    const col = idx % 6;

    const left = col * colW;
    const top = row * rowH;
    const cropW = colW;
    const cropH = rowH;

    // Crop the speaker region
    let cropped = sharp(buffer).extract({
      left,
      top,
      width: Math.min(cropW, w - left),
      height: Math.min(cropH, h - top),
    });

    // Get dimensions after crop
    const croppedMeta = await cropped.toBuffer().then((b) => sharp(b).metadata());
    const cw = croppedMeta.width;
    const ch = croppedMeta.height;

    // Make square from top (focus on face)
    const size = Math.min(cw, ch);
    const squareLeft = Math.floor((cw - size) / 2);

    const outputPath = join(OUTPUT_DIR, `${name}.jpg`);
    await sharp(await cropped.toBuffer())
      .extract({ left: squareLeft, top: 0, width: size, height: size })
      .resize(400, 400, { fit: "cover" })
      .jpeg({ quality: 90 })
      .toFile(outputPath);

    console.log(`Saved: ${name}.jpg`);
  }

  console.log("Done! All speakers cropped.");
}

main().catch(console.error);
