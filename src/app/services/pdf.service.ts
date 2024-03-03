import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas'; // Note the import change here
import * as jspdf from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class PdfService {


  generatePDF(htmlContent: HTMLElement, filename: string) {

    html2canvas(htmlContent).then(canvas => {
      // Convert the canvas to a data URL
      const imgData = canvas.toDataURL('image/png');

      // Prepare PDF
      const pdf = new jspdf.jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Save PDF
    pdf.save(filename + '.pdf');
    });
  }
}
