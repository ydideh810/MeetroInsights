import { Buffer } from 'buffer';

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

export function parseFile(buffer: Buffer, filename: string): Promise<string> {
  const extension = filename.toLowerCase().split('.').pop();
  
  switch (extension) {
    case 'txt':
      return parseTextFile(buffer);
    case 'docx':
      return parseDocxFile(buffer);
    case 'srt':
      return parseSrtFile(buffer);
    default:
      throw new Error(`Unsupported file format: ${extension}. Please use .txt, .docx, or .srt files.`);
  }
}
