import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import PDFDocument from "pdfkit";
import { createWriteStream, promises as fsPromises, readdir, stat, access, constants } from "fs";
import { randomUUID } from "crypto";
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

console.log('Views directory:', join(__dirname, 'views'));

app.use(express.static(join(__dirname, 'pdfs')));

const geminiApiKey = process.env.GEMINI_API_KEY;
const googleAI = new GoogleGenerativeAI(geminiApiKey);

const geminiConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
};

const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-pro",
  geminiConfig,
});

app.post("/api/generate-pdf", async (req, res) => {
  const { text } = req.body;

  const cleanText = text.replace(/[\r\n]+/g, '\n').trim();

  try {
    const result = await geminiModel.generateContent(cleanText);
    const response = result.response;
    const relevantContent = response.text();

    const uuid = randomUUID();
    const filePath = join(__dirname, 'pdfs', `${uuid}.pdf`);
    const writeStream = createWriteStream(filePath);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${uuid}.pdf`);

    const doc = new PDFDocument({
      autoFirstPage: false,
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    doc.addPage()
       .font('Helvetica')
       .fontSize(12)
       .text(relevantContent, {
         align: 'left',
         indent: 20
       });

    doc.pipe(writeStream);
    doc.end();

    writeStream.on("close", async () => {
      try {
        const fileContent = await fsPromises.readFile(filePath);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=${uuid}.pdf`);
        res.send(fileContent);
      } catch (err) {
        console.error("Error reading PDF file:", err);
        res.status(500).send("Error generating PDF");
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating PDF");
  }
});

app.get('/', async (req, res) => {
  try {
    const files = await fsPromises.readdir(join(__dirname, 'pdfs'));
    const pdfs = await Promise.all(files.map(async file => {
      const filePath = join(__dirname, 'pdfs', file);
      const stats = await fsPromises.stat(filePath);
      return {
        name: file,
        createdAt: stats.birthtime
      };
    }));

    // Sort the pdfs array by createdAt in descending order
    pdfs.sort((a, b) => b.createdAt - a.createdAt);

    res.render('allpdfs', { pdfs });
  } catch (err) {
    console.error('Error reading PDF directory:', err);
    res.status(500).send('Error reading PDF directory');
  }
});

app.get('/pdfs/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = join(__dirname, 'pdfs', filename);
  access(filePath, constants.R_OK, (err) => {
    if (err) {
      console.error('Error accessing PDF file:', err);
      return res.status(404).send('PDF not found');
    }
    res.sendFile(filePath);
  });
});



app.delete("/api/delete-pdf/:uuid", async (req, res) => {
  const { uuid } = req.params;
  const filePath = join(__dirname, 'pdfs', `${uuid}.pdf`);

  try {
      await fsPromises.unlink(filePath); // Remove the PDF file
      res.sendStatus(204); // No content, successful deletion
  } catch (err) {
      console.error("Error deleting PDF file:", err);
      res.status(500).send("Error deleting PDF");
  }
});

app.listen(PORT, () =>
 console.log(`Server running on http://localhost:${PORT}`)
);