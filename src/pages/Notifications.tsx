import { useState, useRef } from "react";
import "./Notifications.css";

interface NotificationsProps {
  onBack: () => void;
  onLogout: () => void;
  onMarkAllRead: () => void;
}

interface UploadedFile {
  id: number;
  name: string;
  size: string;
  uploadedAt: string;
}

export default function Notifications({ onBack, onLogout }: NotificationsProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handlePDFUpload = (file: File) => {
    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploadedFiles((prev) => [
        {
          id: Date.now(),
          name: file.name,
          size: formatSize(file.size),
          uploadedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
        ...prev,
      ]);
    }, 1200);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handlePDFUpload(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handlePDFUpload(file);
  };

  const removeFile = (id: number) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="notif-page">

      {/* ── NAVBAR — identical to Students page ── */}
      <nav className="students-nav">
        <div className="nav-brand">
          <div className="nav-logo">F</div>
          <div>
            <div className="nav-title">Force Admin</div>
            <div className="nav-sub">Student Management</div>
          </div>
        </div>
        <div className="nav-user">
          <button className="nav-logout" onClick={onLogout} title="Logout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <main className="notif-main">

        {/* Back + page title */}
        <div className="notif-page-header">
          <button className="back-btn" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Students
          </button>
          <div>
            <h1 className="page-title">Upload PDF</h1>
            <p className="page-desc">Upload and manage PDF documents</p>
          </div>
        </div>

        {/* ── PDF UPLOAD ZONE ── */}
        <div
          className={`pdf-upload-zone${dragOver ? " drag-over" : ""}${uploading ? " uploading" : ""}`}
          onClick={() => !uploading && fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            style={{ display: "none" }}
            onChange={onFileChange}
          />

          {uploading ? (
            <div className="upload-spinner-wrap">
              <div className="upload-spinner" />
              <p className="upload-hint">Uploading PDF...</p>
            </div>
          ) : (
            <>
              <div className="upload-icon-wrap">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <polyline points="9 15 12 12 15 15" />
                </svg>
              </div>
              <p className="upload-label">{dragOver ? "Drop your PDF here" : "Click to upload PDF"}</p>
              <p className="upload-hint">or drag & drop · PDF files only</p>
              <span className="upload-btn">Browse File</span>
            </>
          )}
        </div>

        {/* ── UPLOADED FILES LIST ── */}
        {uploadedFiles.length > 0 && (
          <div className="uploaded-section">
            <p className="uploaded-heading">Uploaded Files</p>
            <div className="uploaded-list">
              {uploadedFiles.map((f) => (
                <div key={f.id} className="uploaded-card">
                  <div className="uploaded-pdf-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div className="uploaded-info">
                    <p className="uploaded-name">{f.name}</p>
                    <p className="uploaded-meta">{f.size} · Uploaded at {f.uploadedAt}</p>
                  </div>
                  <button className="uploaded-remove" onClick={() => removeFile(f.id)} title="Remove">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}