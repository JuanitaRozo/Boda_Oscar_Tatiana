import { jsPDF } from 'jspdf';
import { WeddingWish } from '../types';

export function exportWishesToPDF(wishes: WeddingWish[]) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  let y = margin;

  const drawPageBorderAndHeader = (pageNum: number, totalPagesPlaceholder = false) => {
    // Outer decorative border in deep emerald
    doc.setDrawColor(18, 43, 30);
    doc.setLineWidth(0.8);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Inner subtle gold border
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.3);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // Header banner on page 1
    if (pageNum === 1) {
      // Emerald header fill
      doc.setFillColor(18, 43, 30);
      doc.roundedRect(margin, y, contentWidth, 34, 3, 3, 'F');

      // Gold accent line in header
      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(0.6);
      doc.line(margin + 6, y + 26, margin + contentWidth - 6, y + 26);

      // Header text
      doc.setTextColor(244, 237, 224); // Cream
      doc.setFont('times', 'bold');
      doc.setFontSize(18);
      doc.text('NUESTRA BODA', pageWidth / 2, y + 11, { align: 'center' });

      doc.setFont('times', 'italic');
      doc.setFontSize(14);
      doc.setTextColor(212, 175, 55); // Gold
      doc.text('Oscar Londoño & Tatiana Giraldo', pageWidth / 2, y + 18, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(230, 225, 215);
      doc.text(
        '19 de Diciembre de 2026 · Parroquia San Francisco de Asís · San Francisco, Antioquia',
        pageWidth / 2,
        y + 31,
        { align: 'center' }
      );

      y += 42;

      // Section title
      doc.setFont('times', 'bold');
      doc.setFontSize(15);
      doc.setTextColor(18, 43, 30);
      doc.text('Libro de Buenos Deseos de Familiares y Amigos', pageWidth / 2, y, { align: 'center' });

      doc.setFont('times', 'italic');
      doc.setFontSize(9.5);
      doc.setTextColor(100, 110, 105);
      doc.text(
        `Total de mensajes recopilados: ${wishes.length} deseos llenos de bendiciones`,
        pageWidth / 2,
        y + 5,
        { align: 'center' }
      );

      y += 12;
    } else {
      // Simple running top header for subsequent pages
      doc.setFont('times', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(18, 43, 30);
      doc.text('Nuestra Boda · Oscar Londoño & Tatiana Giraldo — Libro de Deseos', margin, 17);

      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(0.2);
      doc.line(margin, 19, pageWidth - margin, 19);

      y = 26;
    }

    // Footer
    doc.setFont('times', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text('Celebración del Sacramento del Matrimonio · 19 de Diciembre de 2026', margin, pageHeight - 14);

    if (!totalPagesPlaceholder) {
      doc.text(`Página ${pageNum}`, pageWidth - margin, pageHeight - 14, { align: 'right' });
    }
  };

  let currentPage = 1;
  drawPageBorderAndHeader(currentPage);

  if (wishes.length === 0) {
    doc.setFont('times', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text('Aún no se han registrado mensajes en el libro de deseos.', pageWidth / 2, y + 20, {
      align: 'center',
    });
  } else {
    wishes.forEach((wish, index) => {
      // Estimate card height
      const splitMessage = doc.splitTextToSize(`"${wish.message}"`, contentWidth - 14);
      const messageLineCount = splitMessage.length;
      const cardHeight = 18 + messageLineCount * 5;

      // Check if card fits on current page
      if (y + cardHeight > pageHeight - 24) {
        doc.addPage();
        currentPage++;
        drawPageBorderAndHeader(currentPage);
      }

      // Draw wish container box (warm cream background with subtle border)
      doc.setFillColor(250, 247, 240); // Soft cream
      doc.setDrawColor(210, 205, 195);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, contentWidth, cardHeight, 2, 2, 'FD');

      // Left decorative green accent bar
      doc.setFillColor(18, 43, 30);
      doc.rect(margin, y, 2.5, cardHeight, 'F');

      // Author name & relationship
      doc.setFont('times', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(18, 43, 30);
      doc.text(`${wish.author}`, margin + 6, y + 6);

      if (wish.relationship) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(120, 110, 95);
        doc.text(`· ${wish.relationship}`, margin + 6 + doc.getTextWidth(wish.author) + 2, y + 6);
      }

      // Date formatted
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(140, 135, 125);
      doc.text(`${wish.createdAt || '19 Dic 2026'}`, margin + contentWidth - 6, y + 6, { align: 'right' });

      // Subtle horizontal divider line inside card
      doc.setDrawColor(230, 225, 215);
      doc.setLineWidth(0.2);
      doc.line(margin + 6, y + 9, margin + contentWidth - 6, y + 9);

      // Wish message
      doc.setFont('times', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(45, 55, 48);
      doc.text(splitMessage, margin + 6, y + 14);

      y += cardHeight + 4;
    });
  }

  // Save the PDF
  const filename = `Libro_de_Deseos_Boda_Oscar_y_Tatiana_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
