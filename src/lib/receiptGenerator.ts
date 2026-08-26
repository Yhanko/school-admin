import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { numberToWordsPt } from "./extenso";

export interface ReceiptData {
  transactionId: string;
  studentName: string;
  studentCode?: string;
  studentNif?: string;
  studentCourse?: string;
  amount: number;
  paymentDate: string;
  paymentType: string;
  paymentMethod?: string;
  tellerName?: string;
  institutionName?: string;
  institutionSubName?: string;
  institutionNif?: string;
  via?: "1ª VIA" | "2ª VIA";
  phone?: string;
}

const TYPE_LABELS: Record<string, string> = {
  tuition: "Propina",
  enrollment: "Matrícula",
  confirmation: "Confirmação",
  material: "Material Escolar",
  uniform: "Bata / Uniforme",
  exam_sheet: "Folha de Prova",
  activity: "Atividade",
  mensalidade: "Propina",
  matricula: "Matrícula",
  confirmacao: "Confirmação",
  bata: "Bata / Uniforme",
  folha_prova: "Folha de Prova",
};

export function createReceiptDoc(data: ReceiptData): jsPDF {
  const doc = new jsPDF("landscape", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  
  const institutionName = data.institutionName || "Instituição de Ensino";
  const institutionSubName = data.institutionSubName || "";
  const institutionNif = data.institutionNif || "N/D";
  const dateObj = new Date(data.paymentDate || new Date().toISOString());
  const formattedDate = dateObj.toLocaleDateString("pt-PT");
  const weekday = dateObj.toLocaleDateString("pt-PT", { weekday: "long" });

  const labelType = TYPE_LABELS[data.paymentType?.toLowerCase()] || data.paymentType || "Pagamento";

  doc.setFont("courier", "bold");
  doc.setFontSize(14);
  doc.text(institutionName, pageWidth / 2, 20, { align: "center" });
  doc.text(institutionSubName, pageWidth / 2, 27, { align: "center" });

  doc.setFont("courier", "normal");
  doc.setFontSize(10);
  doc.text(`Número de Identificação Fiscal: ${institutionNif}`, 14, 40);

  const rightAlignX = pageWidth - 14;
  doc.text(data.via || "1ª VIA", rightAlignX, 35, { align: "right" });
  doc.setFont("courier", "bold");
  doc.text(`RECIBO Nº ${data.transactionId.substring(0, 15).toUpperCase()}`, rightAlignX, 42, { align: "right" });
  
  doc.setFontSize(11);
  doc.text(`MONTANTE EM Kz   ${data.amount.toLocaleString("pt-AO")}`, rightAlignX, 55, { align: "right" });

  doc.setFontSize(10);
  doc.setFont("courier", "normal");
  doc.text("Recebemos de", 14, 65);
  doc.setFont("courier", "bold");
  doc.text(data.studentName.toUpperCase(), 45, 65);

  doc.setFont("courier", "normal");
  doc.text(`Nº   ${data.studentCode || "—"}`, 14, 75);
  doc.text(`, Contribuinte nº   ${data.studentNif || "Consumidor Final"}`, 60, 75);

  doc.text("do Curso de", 14, 85);
  doc.setFont("courier", "bold");
  doc.text((data.studentCourse || "—").toUpperCase(), 45, 85);

  doc.setFont("courier", "normal");
  doc.text("o montante de:", 14, 95);
  doc.setFont("courier", "bold");
  doc.text(`${numberToWordsPt(data.amount)} kuanzas`.toLowerCase(), 45, 95);

  doc.setFont("courier", "normal");
  doc.text(`Data de pagamento: ${weekday} ${formattedDate}`, rightAlignX, 105, { align: "right" });

  // Tabela 1: Detalhes do Documento
  autoTable(doc, {
    startY: 108,
    margin: { left: 14, right: 14 },
    theme: "plain",
    styles: { font: "courier", fontSize: 9, cellPadding: 1 },
    headStyles: { fillColor: [0, 0, 200], textColor: [255, 255, 255], fontStyle: "bold" },
    bodyStyles: { textColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 40 },
      2: { cellWidth: 35 },
      3: { cellWidth: "auto" },
      4: { cellWidth: 15, halign: "center" },
      5: { cellWidth: 30, halign: "right" },
      6: { cellWidth: 30, halign: "right" },
    },
    head: [["Codigo doc.", "Documento", "Data doc.", "Rubrica", "QT", "Valor unit.", "Valor pago"]],
    body: [
      [
        data.transactionId.substring(0, 12).toUpperCase(),
        "Recibo",
        formattedDate,
        labelType,
        "1",
        data.amount.toLocaleString("pt-AO"),
        data.amount.toLocaleString("pt-AO"),
      ],
    ],
  });

  // Linha vermelha após cabeçalho da tabela (simulação)
  doc.setDrawColor(200, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(14, 114, pageWidth - 14, 114);

  // Tabela 2: Tipo de pagamento e montante
  const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 2;

  autoTable(doc, {
    startY: finalY,
    margin: { left: 14, right: 14 },
    theme: "plain",
    styles: { font: "courier", fontSize: 9, cellPadding: 1 },
    headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], fontStyle: "normal" },
    bodyStyles: { textColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 40, halign: "right" },
      2: { cellWidth: 60, halign: "center" },
      3: { cellWidth: "auto" },
    },
    head: [["Tipo de pagamento", "Montante", "Numero da conta", "Banco / Talão"]],
    body: [
      [
        data.paymentMethod || "Recuperador de Caixa Kz",
        data.amount.toLocaleString("pt-AO", { minimumFractionDigits: 2 }),
        "—",
        "—",
      ],
    ],
  });

  const footerY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;
  const currentFullDate = new Date().toLocaleDateString("pt-PT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  doc.setFont("courier", "normal");
  doc.setFontSize(9);
  doc.text(`Recibo criado em:          Luanda, ${currentFullDate}`, 14, footerY);

  doc.setFont("courier", "bold");
  doc.text("O funcionário", rightAlignX - 35, footerY + 10, { align: "center" });
  
  doc.setDrawColor(0, 0, 0);
  doc.line(rightAlignX - 70, footerY + 25, rightAlignX, footerY + 25);
  doc.setFont("courier", "normal");
  doc.text(data.tellerName || "Admin", rightAlignX - 35, footerY + 30, { align: "center" });

  doc.setFontSize(7);
  doc.setFont("courier", "italic");
  doc.text("Documento processado por computador", 14, footerY + 30);

  return doc;
}

export function generateReceiptPDF(data: ReceiptData) {
  const doc = createReceiptDoc(data);
  doc.save(`Recibo_${data.transactionId.substring(0, 8)}.pdf`);
}

export async function shareReceiptPDF(data: ReceiptData) {
  const doc = createReceiptDoc(data);
  const blob = doc.output("blob");
  const file = new File([blob], `Recibo_${data.transactionId.substring(0, 8)}.pdf`, { type: "application/pdf" });
  const textMessage = `*Recibo de Pagamento*\nInstituição: ${data.institutionName || "Instituição de Ensino"}\nEstudante: ${data.studentName}\nValor: ${data.amount} Kz\nReferência: ${data.transactionId}\nData: ${new Date(data.paymentDate).toLocaleDateString('pt-PT')}`;

  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'Recibo de Pagamento',
        text: textMessage,
      });
      return;
    } catch (err) {
      console.error("Erro ao partilhar ficheiro:", err);
    }
  }

  // Fallback to WhatsApp Web
  const formattedPhone = data.phone ? data.phone.replace(/\D/g, '') : '';
  let url = '';
  if (formattedPhone) {
    url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(textMessage)}`;
  } else {
    url = `https://wa.me/?text=${encodeURIComponent(textMessage)}`;
  }
  window.open(url, '_blank');
}
