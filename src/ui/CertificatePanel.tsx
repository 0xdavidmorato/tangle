"use client";

import { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import type { CertificateDetails } from "../certificate";
import { trapFocus } from "./focus";

interface CertificatePanelProps { readonly detailsFor: (participantName: string) => CertificateDetails; readonly onClose: () => void; }

function downloadCertificate(details: CertificateDetails) {
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const date = new Intl.DateTimeFormat("pt-PT", { dateStyle: "long" }).format(details.issuedAt);
  pdf.setFillColor(3, 17, 32); pdf.rect(0, 0, 297, 210, "F");
  pdf.setDrawColor(76, 225, 239); pdf.setLineWidth(1.3); pdf.rect(12, 12, 273, 186);
  pdf.setTextColor(103, 235, 244); pdf.setFontSize(13); pdf.text("TANGLE · TUDO ESTA LIGADO", 148.5, 43, { align: "center" });
  pdf.setTextColor(238, 253, 255); pdf.setFontSize(30); pdf.text("Certificado Pedagogico", 148.5, 66, { align: "center" });
  pdf.setTextColor(161, 194, 202); pdf.setFontSize(12); pdf.text("Certifica-se que", 148.5, 88, { align: "center" });
  pdf.setTextColor(255, 255, 255); pdf.setFontSize(25); pdf.text(details.participantName, 148.5, 106, { align: "center", maxWidth: 230 });
  pdf.setTextColor(161, 194, 202); pdf.setFontSize(12); pdf.text(`concluiu os ${details.completedQuizCount} quizzes da formacao TANGLE`, 148.5, 126, { align: "center" }); pdf.text(`com media final de ${details.overallScore.toFixed(1)} valores em 10.`, 148.5, 135, { align: "center" });
  pdf.setTextColor(103, 235, 244); pdf.setFontSize(10); pdf.text(`Emitido em ${date}`, 148.5, 169, { align: "center" });
  pdf.setTextColor(110, 145, 153); pdf.setFontSize(8); pdf.text("Certificado pedagogico emitido localmente · nao verificavel externamente", 148.5, 184, { align: "center" });
  const safeName = details.participantName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase();
  pdf.save(`certificado-tangle-${safeName}.pdf`);
}

export function CertificatePanel({ detailsFor, onClose }: CertificatePanelProps) {
  const [participantName, setParticipantName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => closeButtonRef.current?.focus(), []);
  function issue() { try { downloadCertificate(detailsFor(participantName)); setError(null); } catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível emitir o certificado."); } }
  return <aside className="certificate-panel" role="dialog" aria-modal="true" aria-labelledby="certificate-title" onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); onClose(); return; } trapFocus(event, event.currentTarget); }}>
    <div className="panel-topline"><span className="eyebrow">Formação concluída</span><button ref={closeButtonRef} className="icon-button" type="button" onClick={onClose}><span aria-hidden="true">×</span><span className="sr-only">Fechar certificado</span></button></div>
    <div className="certificate-mark" aria-hidden="true">✦</div><h2 id="certificate-title">O seu certificado está pronto</h2><p>Concluiu todos os quizzes. Indique o nome que deve constar no certificado pedagógico.</p>
    <label className="certificate-name">Nome do participante<input value={participantName} onChange={(event) => setParticipantName(event.target.value)} placeholder="O seu nome completo" autoComplete="name" /></label>
    {error ? <p className="certificate-error" role="alert">{error}</p> : null}<button className="complete-button" type="button" onClick={issue}>Descarregar certificado PDF <span aria-hidden="true">↓</span></button><small>Este certificado é pedagógico, local e não verificável externamente.</small>
  </aside>;
}
