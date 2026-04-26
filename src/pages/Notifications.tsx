import { useState, useRef } from "react";
import "./Notifications.css";

interface NotificationsProps {
  onBack: () => void;
  onLogout: () => void;
  onMarkAllRead?: () => void;
}

interface UploadedFile {
  id: string;
  newsId: string;
  name: string;
  size: string;
  uploadedAt: string;
}

export default function Notifications({
  onBack,
  onLogout,
  onMarkAllRead, // ✅ fixed
}: NotificationsProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const token = localStorage.getItem("admin_token");

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handlePDFUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      setUploadError("Only PDF files are allowed.");
      return;
    }

    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      setUploadError("File size must be under 10MB.");
      return;
    }

    setUploadError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("job_title", file.name.replace(".pdf", ""));
      formData.append("description", "Uploaded PDF document");
      formData.append("pdf", file);

      const res = await fetch("https://api.tornadoes.co.in/api/news", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      const newsId = data?.data?.id;

      if (!newsId) {
        setUploadError("Upload failed.");
        return;
      }

      // ✅ Upload success ആയാൽ onMarkAllRead call ചെയ്യുന്നു
      onMarkAllRead?.();

      setUploadedFiles((prev) => [
        {
          id: crypto.randomUUID(),
          newsId: String(newsId),
          name: file.name,
          size: formatSize(file.size),
          uploadedAt: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        ...prev,
      ]);
    } catch {
      setUploadError("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
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

  return (
    <div className="notif-page">
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

      <main className="notif-main">
        <div className="notif-page-header">
          <button className="back-btn" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
          <div>
            <h1 className="page-title">Upload PDF</h1>
            <p className="page-desc">Upload and manage PDF documents</p>
          </div>
        </div>

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
              <p className="upload-label">
                {dragOver ? "Drop your PDF here" : "Click to upload PDF"}
              </p>
              <p className="upload-hint">or drag & drop · PDF only · max 10MB</p>
              <span className="upload-btn">Browse File</span>
            </>
          )}
        </div>

        {uploadError && <div className="upload-error">{uploadError}</div>}

        {uploadedFiles.length > 0 && (
          <div className="uploaded-section">
            <p className="uploaded-heading">Uploaded Files</p>
            <div className="uploaded-list">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="uploaded-card">
                  <div className="uploaded-info">
                    <p className="uploaded-name">{file.name}</p>
                    <p className="uploaded-meta">
                      {file.size} · Uploaded at {file.uploadedAt}
                    </p>
                  </div>
                  <button
                    className="uploaded-remove"
                    onClick={() => removeFile(file.id)}
                    title="Remove"
                  >
                    ×
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
