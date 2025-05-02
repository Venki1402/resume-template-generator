declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number;
    filename?: string;
    html2canvas?: {
      scale?: number;
    };
    jsPDF?: {
      unit?: string;
      format?: string;
      orientation?: string;
    };
  }

  interface Html2Pdf {
    set: (options: Html2PdfOptions) => Html2Pdf;
    from: (element: HTMLElement) => Html2Pdf;
    outputPdf: (type: string) => Promise<Blob>;
  }

  function html2pdf(): Html2Pdf;
  export = html2pdf;
} 