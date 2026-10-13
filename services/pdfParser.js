import fs from "node:fs/promises";
import pdf from "pdf-parse";

/**
 * Extracts and normalizes the readable text from a PDF file or buffer.
 *
 * @param {string|Buffer} input Absolute path of the PDF or a Buffer containing PDF bytes.
 * @returns {Promise<string>} Cleaned PDF text.
 */
export async function parsePDF(input) {
  // Read into a buffer if a file path string was provided, or use the buffer directly.
  const fileBuffer = Buffer.isBuffer(input) ? input : await fs.readFile(input);
  // Extract the text layer from every page in the document.
  const parsed = await pdf(fileBuffer);
  // Collapse repeated whitespace so chunk boundaries are consistent and useful.
  const cleanedText = parsed.text.replace(/\s+/g, " ").trim();

  if (!cleanedText) {
    throw new Error("No readable text was found in this PDF. It may be image-only or password-protected.");
  }
  return cleanedText;
}
