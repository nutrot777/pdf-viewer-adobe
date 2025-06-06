import React, { useState, useEffect } from 'react';
import mammoth from 'mammoth';
import './App.css';

// --- List of recommendations and files in public/ ---
const RECOMMENDATIONS = [
  {
    label: 'Read pages 13-20 on Marketing Chains',
    file: "/Chapter_3_customer_relationship_management.pdf",
    type: 'pdf',
    pageRange: [13, 20],
  },
  {
    label: 'Read pages 30-40 on Customer Relationships',
    file: "/chapter11.pdf",
    type: 'pdf',
    pageRange: [30, 40],
  },
  {
    label: 'Testing for Doc file',
    file: '/dag Batch 6.docx',
    type: 'docx',
  },
  {
    label: 'Testing for PowerPoint file',
    file: 'https://view.officeapps.live.com/op/embed.aspx?src=https://yourdomain.com/path/to/your.pptx',
    type: 'pptx',
  },
];

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRec, setSelectedRec] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [docxHtml, setDocxHtml] = useState('');
  // PDF tuning states
  const [pdfScale, setPdfScale] = useState(1.45);
  const [renderTextLayer, setRenderTextLayer] = useState(false);
  const [renderAnnotationLayer, setRenderAnnotationLayer] = useState(false);

  // Open modal with selected recommendation
  const openModal = async (rec) => {
    setSelectedRec(rec);
    setDocxHtml('');
    setModalOpen(true);
    if (rec.type === 'docx') {
      // Fetch docx from public folder
      const response = await fetch(rec.file);
      const arrayBuffer = await response.arrayBuffer();
      mammoth.convertToHtml({ arrayBuffer }).then(result => {
        setDocxHtml(result.value);
      });
    }
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedRec(null);
    setNumPages(null);
    setDocxHtml('');
    setPdfScale(1.0);
    setRenderTextLayer(true);
    setRenderAnnotationLayer(true);
  };

  // Render modal content based on file type
  const renderModalContent = () => {
    if (!selectedRec) return null;
    if (selectedRec.type === 'pdf') {
      return (
        <div style={{ width: '100%', height: '80vh', position: 'relative' }}>
          {selectedRec.pageRange && (
            <div style={{
              position: 'absolute',
              top: 10,
              left: 10,
              zIndex: 10,
              background: 'rgba(255,255,200,0.95)',
              padding: '0.5em 1em',
              borderRadius: '8px',
              fontWeight: 500,
              color: '#333',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <span>Recommended: Focus on pages {selectedRec.pageRange[0]} - {selectedRec.pageRange[1]}</span>
            </div>
          )}
          <div id="adobe-dc-view" style={{ width: '100%', height: '100%' }}></div>
          <div style={{fontSize:'0.9em',color:'#888',marginTop:'0.5em'}}>Powered by Adobe PDF Embed API</div>
        </div>
      );
    }
    if (selectedRec.type === 'docx') {
      return docxHtml ? (
        <div className="docx-html" dangerouslySetInnerHTML={{ __html: docxHtml }} />
      ) : (
        <div>Loading DOCX...</div>
      );
    }
    if (selectedRec.type === 'pptx') {
      return (
        <iframe
          src={selectedRec.file}
          title="PPTX Viewer"
          width="100%"
          height="600px"
          frameBorder="0"
          allowFullScreen
        />
      );
    }
    return null;
  };

  // Adobe PDF Embed API initialization effect
  useEffect(() => {
    if (modalOpen && selectedRec && selectedRec.type === 'pdf') {
      if (!window.AdobeDC || !selectedRec.file) return;
      // Clean up previous viewer
      const container = document.getElementById('adobe-dc-view');
      if (container) container.innerHTML = '';
      const adobeDCView = new window.AdobeDC.View({ clientId: 'ae8351ee527c427bbbe75de271f02425', divId: 'adobe-dc-view' });
      const viewConfig = {
        embedMode: 'SIZED_CONTAINER',
        showDownloadPDF: false,
        showPrintPDF: false,
        showAnnotationTools: true,
        showLeftHandPanel: false
      };
      adobeDCView.previewFile({
        content: { location: { url: selectedRec.file } },
        metaData: { fileName: selectedRec.file.split('/').pop() }
      }, viewConfig).then(() => {
        // Jump to the first page in the range if specified
        if (selectedRec.pageRange && window.AdobeDC && window.AdobeDC.ViewMode) {
          const [start] = selectedRec.pageRange;
          // Use the goToLocation API if available
          if (window.AdobeDC.ViewMode.goToLocation) {
            window.AdobeDC.ViewMode.goToLocation({ pageNumber: start });
          }
        }
      });
    }
  }, [modalOpen, selectedRec]);

  return (
    <div className="App app-fullscreen">
      <h1 style={{ textAlign: 'center', marginTop: '2rem' }}>Recommendations</h1>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        {RECOMMENDATIONS.map((rec, idx) => (
          <div key={idx}>
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                openModal(rec);
              }}
              style={{ fontSize: '1.5rem', color: '#2563eb', textDecoration: 'underline', display: 'block', margin: '0.5rem 0' }}
            >
              {rec.label}
            </a>
          </div>
        ))}
      </div>
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>&times;</button>
            {renderModalContent()}
          </div>
        </div>
      )}
    </div>
  );
}
