export const downloadBase64File = (base64Data: string, fileName: string, mimeType: string) => {
  const linkSource = `data:${mimeType};base64,${base64Data}`;
  const downloadLink = document.createElement("a");
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
};

export const downloadBlob = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
};

export const downloadTextFile = (text: string, fileName: string) => {
  const blob = new Blob([text], { type: 'text/plain' });
  downloadBlob(blob, fileName);
};

export const downloadPdfFile = (content: string, fileName: string) => {
  // Simple PDF generation fallback using text
  const blob = new Blob([content], { type: 'application/pdf' });
  downloadBlob(blob, fileName);
};

export const generateSRT = (segments: { start: string, end: string, text: string }[]) => {
  return segments.map((s, i) => `${i + 1}\n${s.start} --> ${s.end}\n${s.text}\n`).join('\n');
};

