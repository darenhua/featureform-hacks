export async function parseResume(base64Data, mimeType) {
  // Convert base64 string to Buffer
  const resumeBuffer = Buffer.from(base64Data, "base64");

  // Basic validation
  if (!resumeBuffer || resumeBuffer.length === 0) {
    throw new Error("Resume buffer is empty after base64 conversion");
  }

  // Route to the correct parser based on mime type
  switch (mimeType) {
    case "application/pdf": {
      // The top-level `pdf-parse` entry tries to run self-tests in ESM environments
      // which crashes with an ENOENT error (it looks for ./test/data/05-versions-space.pdf).
      // Importing the actual library file bypasses that behaviour.
      const pdfParseModule = await import("pdf-parse/lib/pdf-parse.js");
      const pdf = pdfParseModule.default || pdfParseModule;
      const data = await pdf(resumeBuffer);
      if (!data || !data.text) {
        throw new Error("Failed to extract text from PDF resume");
      }
      return data.text.trim();
    }

    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      // DOCX parsing via mammoth
      const { default: mammoth } = await import("mammoth");
      const { value } = await mammoth.extractRawText({ buffer: resumeBuffer });
      if (!value) {
        throw new Error("Failed to extract text from DOCX resume");
      }
      return value.trim();
    }

    default:
      throw new Error(`Unsupported resume mime type: ${mimeType}`);
  }
} 