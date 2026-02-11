import sharp from "sharp";
import { mkdirSync, readFileSync } from "fs";

const IMAGE_PATH = "/vercel/share/v0-project/scripts/speakers-composite.jpg";

const OUTPUT_DIR = "/vercel/share/v0-project/public/speakers";
mkdirSync(OUTPUT_DIR, { recursive: true });

async function main() {
  console.log("Reading composite image from disk...");
  const buffer = readFileSync(IMAGE_PATH);

  const metadata = await sharp(buffer).metadata();
  const W = metadata.width;
  const H = metadata.height;
  console.log(`Image dimensions: ${W}x${H}`);

  // 2 rows, 6 columns
  const cols = 6;
  const rows = 2;
  const cellW = Math.floor(W / cols);
  const cellH = Math.floor(H / rows);

  // Speaker names in order: row 1 left-to-right, then row 2 left-to-right
  const speakers = [
    // Row 1 (top)
    "angelo-benavides",
    "edison-lopez",
    "geovanny-basantes",
    "erika-delgado",
    "luis-valverde",
    "alexa-dominguez",
    // Row 2 (bottom)
    "luis-guerrero",
    "cristian-baraja",
    "luis-martinez",
    "anthony-quiranza",
    "john-cortez",
    "michael-paredes",
  ];

  for (let i = 0; i < speakers.length; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const left = col * cellW;
    const top = row * cellH;

    const outputPath = `${OUTPUT_DIR}/${speakers[i]}.jpg`;
    console.log(
      `Cropping ${speakers[i]}: left=${left}, top=${top}, w=${cellW}, h=${cellH}`
    );

    await sharp(buffer)
      .extract({ left, top, width: cellW, height: cellH })
      .resize(400, 400, { fit: "cover", position: "top" })
      .jpeg({ quality: 90 })
      .toFile(outputPath);

    console.log(`Saved: ${outputPath}`);
  }

  console.log("All speaker photos cropped successfully!");
}

main().catch(console.error);
