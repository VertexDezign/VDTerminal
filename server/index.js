const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const chokidar = require("chokidar");
const { XMLParser } = require("fast-xml-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const AdmZip = require("adm-zip");
const sharp = require("sharp");
const ddsParser = require("dds-parser");
const dxt = require("dxt-js");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3001;
const GAME_DIR = path.join(
  process.env.USERPROFILE,
  "Documents",
  "My Games",
  "FarmingSimulator2025",
);
const XML_FILE_PATH = path.join(GAME_DIR, "gameGlassInterface.xml");

app.get("/map-image", async (req, res) => {
  try {
    if (!fs.existsSync(XML_FILE_PATH)) {
      return res.status(404).send("XML file not found");
    }

    const xmlData = fs.readFileSync(XML_FILE_PATH, "utf8");
    const jsonObj = parser.parse(xmlData);
    const filename = jsonObj?.GGI?.environment?.pda?.filename;
    const pdaWidth = jsonObj?.GGI?.environment?.pda?.width;
    const pdaHeight = jsonObj?.GGI?.environment?.pda?.height;

    if (!filename) {
      return res.status(404).send("Filename not found in XML");
    }

    let imageBuffer;
    let resolvedPath = filename;

    // Handle relative paths or paths with mods/
    if (!path.isAbsolute(resolvedPath)) {
      resolvedPath = path.join(GAME_DIR, filename);
    }
    console.log("Resolved path:", resolvedPath);

    if (resolvedPath.includes("mods/")) {
      const parts = resolvedPath.split(/mods[\\\/]/);
      const modPart = parts[1];
      const modName = modPart.split(/[\\\/]/)[0];
      const restOfPath = modPart.substring(modName.length + 1);

      const modsDir = path.join(GAME_DIR, "mods");
      const zipPath = path.join(modsDir, modName + ".zip");
      const folderPath = path.join(modsDir, modName);

      if (fs.existsSync(zipPath)) {
        const zip = new AdmZip(zipPath);
        const entry = zip.getEntry(restOfPath.replace(/\\/g, "/"));
        if (entry) {
          imageBuffer = entry.getData();
        }
      } else if (fs.existsSync(folderPath)) {
        const fullPath = path.join(folderPath, restOfPath);
        if (fs.existsSync(fullPath)) {
          imageBuffer = fs.readFileSync(fullPath);
        }
      }
    } else {
      if (fs.existsSync(resolvedPath)) {
        imageBuffer = fs.readFileSync(resolvedPath);
      }
    }

    if (!imageBuffer) {
      return res.status(404).send("Image file not found: " + resolvedPath);
    }

    if (filename.toLowerCase().endsWith(".dds")) {
      try {
        // Convert Buffer to ArrayBuffer for dds-parser
        const arrayBuffer = imageBuffer.buffer.slice(
          imageBuffer.byteOffset,
          imageBuffer.byteOffset + imageBuffer.byteLength,
        );
        const ddsData = ddsParser.parseHeaders(arrayBuffer);
        const width = ddsData.shape.width;
        const height = ddsData.shape.height;
        const format = ddsData.format; // e.g., "dxt1", "dxt5", "rgba8"

        let rgbaData;
        const firstImage = ddsData.images[0];
        const mainMip = imageBuffer.slice(
          firstImage.offset,
          firstImage.offset + firstImage.length,
        );

        if (format === "dxt1") {
          rgbaData = dxt.decompress(mainMip, width, height, dxt.flags.DXT1);
        } else if (format === "dxt3") {
          rgbaData = dxt.decompress(mainMip, width, height, dxt.flags.DXT3);
        } else if (format === "dxt5") {
          rgbaData = dxt.decompress(mainMip, width, height, dxt.flags.DXT5);
        } else if (format === "rgba8") {
          rgbaData = mainMip;
        } else {
          throw new Error("Unsupported DDS format: " + format);
        }

        let pipeline = sharp(rgbaData, {
          raw: {
            width: width,
            height: height,
            channels: 4,
          },
        });

        // Crop if pdaWidth/pdaHeight are provided and smaller than image
        if (pdaWidth && pdaHeight) {
          const targetWidth = parseInt(pdaWidth);
          const targetHeight = parseInt(pdaHeight);

          if (targetWidth < width || targetHeight < height) {
            const extractWidth = Math.min(targetWidth, width);
            const extractHeight = Math.min(targetHeight, height);
            const left = Math.floor((width - extractWidth) / 2);
            const top = Math.floor((height - extractHeight) / 2);

            pipeline = pipeline.extract({
              left,
              top,
              width: extractWidth,
              height: extractHeight,
            });
          }
        }

        const pngBuffer = await pipeline.png().toBuffer();

        res.set("Content-Type", "image/png");
        return res.send(pngBuffer);
      } catch (err) {
        console.error("DDS conversion failed:", err);
        return res
          .status(500)
          .send("Failed to convert DDS image: " + err.message);
      }
    }

    const ext = path.extname(filename).toLowerCase();
    const contentType =
      ext === ".png"
        ? "image/png"
        : ext === ".jpg" || ext === ".jpeg"
          ? "image/jpeg"
          : "application/octet-stream";
    res.set("Content-Type", contentType);

    // Crop if pdaWidth/pdaHeight are provided and smaller than image
    if (pdaWidth && pdaHeight) {
      try {
        const metadata = await sharp(imageBuffer).metadata();
        const width = metadata.width;
        const height = metadata.height;
        const targetWidth = parseInt(pdaWidth);
        const targetHeight = parseInt(pdaHeight);

        if (targetWidth < width || targetHeight < height) {
          const extractWidth = Math.min(targetWidth, width);
          const extractHeight = Math.min(targetHeight, height);
          const left = Math.floor((width - extractWidth) / 2);
          const top = Math.floor((height - extractHeight) / 2);

          const croppedBuffer = await sharp(imageBuffer)
            .extract({
              left,
              top,
              width: extractWidth,
              height: extractHeight,
            })
            .toBuffer();
          return res.send(croppedBuffer);
        }
      } catch (err) {
        console.error("Error cropping standard image:", err);
        // Fallback to sending original image if cropping fails
      }
    }

    res.send(imageBuffer);
  } catch (error) {
    console.error("Error serving map image:", error);
    res.status(500).send("Internal Server Error");
  }
});

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
});

function parseAndEmit(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const xmlData = fs.readFileSync(filePath, "utf8");
      const jsonObj = parser.parse(xmlData);
      io.emit("ggi-data", jsonObj);
      console.log("Emitted GGI data at", new Date().toLocaleTimeString());
    } else {
      console.error("File not found:", filePath);
    }
  } catch (error) {
    console.error("Error parsing XML:", error);
  }
}

// Watch for changes
const watcher = chokidar.watch(XML_FILE_PATH, {
  persistent: true,
});

watcher.on("change", (path) => {
  console.log(`File ${path} has been changed`);
  parseAndEmit(path);
});

watcher.on("add", (path) => {
  console.log(`File ${path} has been added`);
  parseAndEmit(path);
});

io.on("connection", (socket) => {
  console.log("a user connected");
  // Send initial data
  parseAndEmit(XML_FILE_PATH);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Watching file: ${XML_FILE_PATH}`);
});
