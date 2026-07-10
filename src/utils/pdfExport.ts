import jsPDF from 'jspdf';

interface InvoiceData {
  id: string;
  customer: string;
  amount: string;
  issueDate: string;
  dueDate: string;
  status: string;
  items: number;
}

export function exportTableToPDF(
  title: string,
  headers: string[],
  rows: (string | number)[][],
  filename: string
): void {
  const doc = new jsPDF();
  
  // Get company logo from localStorage if set
  const companyLogo = localStorage.getItem('erp_company_logo');
  
  // Page dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  
  let yPosition = margin;
  
  // Company header area
  if (companyLogo) {
    try {
      doc.addImage(companyLogo, 'PNG', margin, yPosition, 30, 30);
      yPosition += 35;
    } catch (e) {
      // If logo fails, continue without it
    }
  }
  
  // Title and export date
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text(title, margin, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Export Date: ${new Date().toLocaleDateString()}`, margin, yPosition);
  yPosition += 15;
  
  // Table header
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPosition, contentWidth, 10, 'F');
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  
  const columnWidth = contentWidth / headers.length;
  headers.forEach((header, index) => {
    doc.text(header, margin + (index * columnWidth) + 2, yPosition + 7);
  });
  
  yPosition += 10;
  
  // Table rows with alternating colors
  doc.setFont('helvetica', 'normal');
  rows.forEach((row, rowIndex) => {
    if (yPosition > pageHeight - 20) {
      doc.addPage();
      yPosition = margin;
    }
    
    if (rowIndex % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, yPosition, contentWidth, 8, 'F');
    }
    
    row.forEach((cell, cellIndex) => {
      doc.text(String(cell), margin + (cellIndex * columnWidth) + 2, yPosition + 6);
    });
    
    yPosition += 8;
  });
  
  // Footer with page numbers
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }
  
  // Total row count
  doc.setPage(totalPages);
  yPosition += 5;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total Records: ${rows.length}`, margin, yPosition);
  
  doc.save(filename);
}

export function exportInvoiceToPDF(invoice: InvoiceData): void {
  const doc = new jsPDF();
  
  const companyLogo = localStorage.getItem('erp_company_logo');
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  
  let yPosition = margin;
  
  // Company header
  if (companyLogo) {
    try {
      doc.addImage(companyLogo, 'PNG', margin, yPosition, 30, 30);
      yPosition += 35;
    } catch (e) {
      // Continue without logo
    }
  }
  
  // Invoice title
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text('INVOICE', margin, yPosition);
  yPosition += 15;
  
  // Invoice details
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Invoice ID: ${invoice.id}`, margin, yPosition);
  yPosition += 8;
  doc.text(`Issue Date: ${invoice.issueDate}`, margin, yPosition);
  yPosition += 8;
  doc.text(`Due Date: ${invoice.dueDate}`, margin, yPosition);
  yPosition += 8;
  doc.text(`Status: ${invoice.status.toUpperCase()}`, margin, yPosition);
  yPosition += 15;
  
  // Customer info
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', margin, yPosition);
  yPosition += 8;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(invoice.customer, margin, yPosition);
  yPosition += 20;
  
  // Amount section
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPosition, pageWidth - (margin * 2), 30, 'F');
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('Total Amount:', margin + 10, yPosition + 15);
  
  doc.setFontSize(16);
  doc.text(invoice.amount, pageWidth - margin - 10, yPosition + 15, { align: 'right' });
  
  yPosition += 40;
  
  // Items count
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text(`Number of Items: ${invoice.items}`, margin, yPosition);
  
  doc.save(`${invoice.id}.pdf`);
}
