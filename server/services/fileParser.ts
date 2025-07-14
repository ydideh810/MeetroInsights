import { Buffer } from 'buffer';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

export async function parseTextFile(buffer: Buffer): Promise<string> {
  return buffer.toString('utf-8');
}

export async function parseDocxFile(buffer: Buffer): Promise<string> {
  // For now, return basic text extraction
  // In production, you'd use a library like mammoth.js
  try {
    const text = buffer.toString('utf-8');
    // Basic extraction - remove XML tags and extract readable text
    return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  } catch (error) {
    throw new Error("Failed to parse DOCX file. Please ensure it's a valid document.");
  }
}

export async function parseSrtFile(buffer: Buffer): Promise<string> {
  try {
    const content = buffer.toString('utf-8');
    // Parse SRT format: extract just the text content
    const lines = content.split('\n');
    const textLines: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      // Skip sequence numbers and timestamps
      if (line && !line.match(/^\d+$/) && !line.includes('-->')) {
        textLines.push(line);
      }
    }
    
    return textLines.join(' ').trim();
  } catch (error) {
    throw new Error("Failed to parse SRT file. Please ensure it's a valid subtitle file.");
  }
}

export async function parsePdfFile(buffer: Buffer): Promise<string> {
  try {
    const pdfData = new Uint8Array(buffer);
    const pdf = await pdfjs.getDocument({ data: pdfData }).promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText.trim();
  } catch (error) {
    throw new Error("Failed to parse PDF file. Please ensure it's a valid PDF document.");
  }
}

export function parseFile(buffer: Buffer, filename: string): Promise<string> {
  const extension = filename.toLowerCase().split('.').pop();
  
  switch (extension) {
    case 'txt':
      return parseTextFile(buffer);
    case 'docx':
      return parseDocxFile(buffer);
    case 'srt':
      return parseSrtFile(buffer);
    case 'pdf':
      return parsePdfFile(buffer);
    default:
      throw new Error(`Unsupported file format: ${extension}. Please use .txt, .docx, .srt, or .pdf files.`);
  }
}
