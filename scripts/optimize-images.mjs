import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("images");

async function writeWebp(input, output, opts) {
  await mkdir(path.dirname(output), { recursive: true });
  const info = await sharp(input)
    .rotate()
    .resize(opts.width, opts.height, {
      fit: opts.fit || "cover",
      withoutEnlargement: true,
    })
    .webp({ quality: opts.quality ?? 78, effort: 6 })
    .toFile(output);
  console.log(
    `${path.relative(process.cwd(), output)}  ${Math.round(info.size / 1024)}KB  ${info.width}x${info.height}`
  );
}

async function writePng(input, output, opts) {
  await mkdir(path.dirname(output), { recursive: true });
  const info = await sharp(input)
    .rotate()
    .resize(opts.width, opts.height, {
      fit: opts.fit || "cover",
      withoutEnlargement: true,
    })
    .png({ compressionLevel: 9, palette: opts.palette !== false, quality: opts.quality ?? 80 })
    .toFile(output);
  console.log(
    `${path.relative(process.cwd(), output)}  ${Math.round(info.size / 1024)}KB  ${info.width}x${info.height}`
  );
}

const jobs = [
  // Rail logos display at 44px — ship 128px retina WebP + PNG fallback
  writeWebp(path.join(root, "mainlogo1.png"), path.join(root, "opt", "mainlogo1.webp"), {
    width: 128,
    height: 128,
    quality: 82,
  }),
  writeWebp(path.join(root, "mainlogo2.png"), path.join(root, "opt", "mainlogo2.webp"), {
    width: 128,
    height: 128,
    quality: 82,
  }),
  writePng(path.join(root, "mainlogo1.png"), path.join(root, "opt", "mainlogo1.png"), {
    width: 128,
    height: 128,
    quality: 80,
  }),
  writePng(path.join(root, "mainlogo2.png"), path.join(root, "opt", "mainlogo2.png"), {
    width: 128,
    height: 128,
    quality: 80,
  }),

  // Character cards + home portrait (~280–420px display)
  writeWebp(path.join(root, "logo", "profile1.png"), path.join(root, "opt", "profile1.webp"), {
    width: 640,
    height: 800,
    quality: 78,
  }),
  writeWebp(path.join(root, "logo", "profile2.png"), path.join(root, "opt", "profile2.webp"), {
    width: 640,
    height: 800,
    quality: 78,
  }),
  writePng(path.join(root, "logo", "profile1.png"), path.join(root, "opt", "profile1.png"), {
    width: 640,
    height: 800,
    quality: 78,
  }),
  writePng(path.join(root, "logo", "profile2.png"), path.join(root, "opt", "profile2.png"), {
    width: 640,
    height: 800,
    quality: 78,
  }),

  // Hero backgrounds — cover width ~1600 enough for most screens
  writeWebp(path.join(root, "bg4.png"), path.join(root, "opt", "bg4.webp"), {
    width: 1600,
    height: 1200,
    fit: "inside",
    quality: 72,
  }),
  writeWebp(path.join(root, "bg5.png"), path.join(root, "opt", "bg5.webp"), {
    width: 1600,
    height: 1200,
    fit: "inside",
    quality: 72,
  }),
  writePng(path.join(root, "bg4.png"), path.join(root, "opt", "bg4.png"), {
    width: 1600,
    height: 1200,
    fit: "inside",
    quality: 70,
  }),
  writePng(path.join(root, "bg5.png"), path.join(root, "opt", "bg5.png"), {
    width: 1600,
    height: 1200,
    fit: "inside",
    quality: 70,
  }),
];

await Promise.all(jobs);
console.log("done");
