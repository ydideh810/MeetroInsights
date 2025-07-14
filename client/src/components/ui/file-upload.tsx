import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isUploading: boolean;
}

export default function FileUpload({ onFileUpload, isUploading }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    const allowedTypes = ['text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'];
    const allowedExtensions = ['.txt', '.docx', '.srt', '.pdf'];
    const hasValidExtension = allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!hasValidExtension) {
      alert('Please upload a .txt, .docx, .srt, or .pdf file');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }
    
    onFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-cyber-cyan' : 'border-cyber-orange'
        } hover:border-cyber-cyan`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="text-4xl mb-4">📄</div>
        <div className="text-sm text-cyber-cyan mb-2">
          {isUploading ? "UPLOADING..." : "DRAG & DROP FILES"}
        </div>
        <div className="text-xs text-gray-400">Support: .txt, .docx, .srt, .pdf</div>
        <Button
          type="button"
          disabled={isUploading}
          className="mt-4 bg-cyber-orange text-black px-4 py-2 rounded font-bold hover:bg-cyber-red transition-colors"
        >
          {isUploading ? "UPLOADING..." : "SELECT FILES"}
        </Button>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.docx,.srt,.pdf"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
}
