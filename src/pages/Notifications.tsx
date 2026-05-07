// import { useState, useRef } from "react";
// import "./Notifications.css";

// interface NotificationsProps {
//   onBack: () => void;
//   onLogout: () => void;
//   onMarkAllRead?: () => void;
// }

// interface UploadedFile {
//   id: string;
//   newsId: string;
//   name: string;
//   size: string;
//   uploadedAt: string;
// }

// export default function Notifications({
//   onBack,
//   onLogout,
//   onMarkAllRead, // ✅ fixed
// }: NotificationsProps) {
//   const [dragOver, setDragOver] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
//   const [uploadError, setUploadError] = useState("");
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const token = localStorage.getItem("admin_token");

//   const formatSize = (bytes: number) => {
//     if (bytes < 1024) return `${bytes} B`;
//     if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
//     return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
//   };

//   const handlePDFUpload = async (file: File) => {
//     if (file.type !== "application/pdf") {
//       setUploadError("Only PDF files are allowed.");
//       return;
//     }

//     const maxBytes = 10 * 1024 * 1024;
//     if (file.size > maxBytes) {
//       setUploadError("File size must be under 10MB.");
//       return;
//     }

//     setUploadError("");
//     setUploading(true);

//     try {
//       const formData = new FormData();
//       formData.append("job_title", file.name.replace(".pdf", ""));
//       formData.append("description", "Uploaded PDF document");
//       formData.append("pdf", file);

//       const res = await fetch("https://api.tornadoes.co.in/api/news", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const data = await res.json();
//       const newsId = data?.data?.id;

//       if (!newsId) {
//         setUploadError("Upload failed.");
//         return;
//       }

//       // ✅ Upload success ആയാൽ onMarkAllRead call ചെയ്യുന്നു
//       onMarkAllRead?.();

//       setUploadedFiles((prev) => [
//         {
//           id: crypto.randomUUID(),
//           newsId: String(newsId),
//           name: file.name,
//           size: formatSize(file.size),
//           uploadedAt: new Date().toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           }),
//         },
//         ...prev,
//       ]);
//     } catch {
//       setUploadError("Upload failed.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const removeFile = (fileId: string) => {
//     setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
//   };

//   const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) handlePDFUpload(file);
//     e.target.value = "";
//   };

//   const onDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setDragOver(false);
//     const file = e.dataTransfer.files?.[0];
//     if (file) handlePDFUpload(file);
//   };

//   return (
//     <div className="notif-page">
//       <nav className="students-nav">
//         <div className="nav-brand">
//           <div className="nav-logo">F</div>
//           <div>
//             <div className="nav-title">Force Admin</div>
//             <div className="nav-sub">Student Management</div>
//           </div>
//         </div>
//         <div className="nav-user">
//           <button className="nav-logout" onClick={onLogout} title="Logout">
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
//               <polyline points="16 17 21 12 16 7" />
//               <line x1="21" y1="12" x2="9" y2="12" />
//             </svg>
//           </button>
//         </div>
//       </nav>

//       <main className="notif-main">
//         <div className="notif-page-header">
//           <button className="back-btn" onClick={onBack}>
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//               <polyline points="15 18 9 12 15 6" />
//             </svg>
//             Back
//           </button>
//           <div>
//             <h1 className="page-title">Upload PDF</h1>
//             <p className="page-desc">Upload and manage PDF documents</p>
//           </div>
//         </div>

//         <div
//           className={`pdf-upload-zone${dragOver ? " drag-over" : ""}${uploading ? " uploading" : ""}`}
//           onClick={() => !uploading && fileInputRef.current?.click()}
//           onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
//           onDragLeave={() => setDragOver(false)}
//           onDrop={onDrop}
//         >
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="application/pdf"
//             style={{ display: "none" }}
//             onChange={onFileChange}
//           />

//           {uploading ? (
//             <div className="upload-spinner-wrap">
//               <div className="upload-spinner" />
//               <p className="upload-hint">Uploading PDF...</p>
//             </div>
//           ) : (
//             <>
//               <div className="upload-icon-wrap">
//                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
//                   <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//                   <polyline points="14 2 14 8 20 8" />
//                   <line x1="12" y1="18" x2="12" y2="12" />
//                   <polyline points="9 15 12 12 15 15" />
//                 </svg>
//               </div>
//               <p className="upload-label">
//                 {dragOver ? "Drop your PDF here" : "Click to upload PDF"}
//               </p>
//               <p className="upload-hint">or drag & drop · PDF only · max 10MB</p>
//               <span className="upload-btn">Browse File</span>
//             </>
//           )}
//         </div>

//         {uploadError && <div className="upload-error">{uploadError}</div>}

//         {uploadedFiles.length > 0 && (
//           <div className="uploaded-section">
//             <p className="uploaded-heading">Uploaded Files</p>
//             <div className="uploaded-list">
//               {uploadedFiles.map((file) => (
//                 <div key={file.id} className="uploaded-card">
//                   <div className="uploaded-info">
//                     <p className="uploaded-name">{file.name}</p>
//                     <p className="uploaded-meta">
//                       {file.size} · Uploaded at {file.uploadedAt}
//                     </p>
//                   </div>
//                   <button
//                     className="uploaded-remove"
//                     onClick={() => removeFile(file.id)}
//                     title="Remove"
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }



import { useState, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
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

interface NewsPayload {
  job_title: string;
  description: string;
}

interface ApiResponse {
  data: {
    attachments_count: number;
    id: string;
    job_title: string;
  };
  message: string;
  success: boolean;
}

type ResponseState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: ApiResponse }
  | { status: "error"; message: string };

type ActiveTab = "upload" | "create";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const API_URL = "https://api.tornadoes.co.in/api/news";

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

function syntaxHighlight(json: string): string {
  return json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = "num";
        if (/^"/.test(match)) cls = /:$/.test(match) ? "key" : "str";
        else if (/true|false/.test(match)) cls = "bool";
        return `<span class="${cls}">${match}</span>`;
      }
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function NewsManager({ onBack, onLogout, onMarkAllRead }: Props) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("upload");

  // PDF Upload state
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create News state
  const [form, setForm] = useState<NewsPayload>({ job_title: "", description: "" });
  const [response, setResponse] = useState<ResponseState>({ status: "idle" });

  const token = localStorage.getItem("admin_token");

  // ── PDF Upload handlers ──────────────────────────────────────────────────────

  const handlePDFUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      setUploadError("Only PDF files are allowed.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
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

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      const newsId = data?.data?.id;

      if (!newsId) {
        setUploadError("Upload failed.");
        return;
      }

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

  const removeFile = (fileId: string) =>
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));

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

  // ── Create News handlers ─────────────────────────────────────────────────────

  const isLoading = response.status === "loading";
  const isDisabled = isLoading || !form.job_title.trim() || !form.description.trim();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setResponse({ status: "loading" });
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok || !data.success) throw new Error(data.message || "Request failed");

      onMarkAllRead?.();
      setResponse({ status: "success", data });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setResponse({ status: "error", message });
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg, #f8fafc)" }}>

      {/* Navbar */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: "60px",
        background: "#fff", borderBottom: "1px solid #e5e7eb",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: "16px",
          }}>T</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "15px", color: "#111827" }}>Tornadoes Academy</div>
            {/* <div style={{ fontSize: "11px", color: "#6b7280" }}>News Manager</div> */}
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={onBack} title="Back" style={navBtnStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button onClick={onLogout} title="Logout" style={navBtnStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Page content */}
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 16px" }}>

        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <button onClick={onBack} style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "none", border: "none", cursor: "pointer",
            color: "#6b7280", fontSize: "13px", marginBottom: "12px", padding: 0,
          }}>
            {/* <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg> */}
            {/* Back */}
          </button>
          {/* <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#111827", margin: 0 }}>
            News Manager
          </h1>
          <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>
            Upload a PDF or create a news post manually
          </p> */}
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: "4px", background: "#f3f4f6",
          borderRadius: "10px", padding: "4px", marginBottom: "28px",
        }}>
          {(["upload", "create"] as ActiveTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1, padding: "9px 0", border: "none", borderRadius: "8px",
                fontWeight: 600, fontSize: "13px", cursor: "pointer",
                transition: "all 0.2s",
                background: activeTab === tab ? "#fff" : "transparent",
                color: activeTab === tab ? "#6366f1" : "#6b7280",
                boxShadow: activeTab === tab ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
              }}
            >
              {tab === "upload" ? " Upload PDF" : " Create News"}
            </button>
          ))}
        </div>

        {/* ── TAB: Upload PDF ── */}
        {activeTab === "upload" && (
          <div>
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              style={{
                border: `2px dashed ${dragOver ? "#6366f1" : "#d1d5db"}`,
                borderRadius: "14px",
                padding: "48px 24px",
                textAlign: "center",
                cursor: uploading ? "not-allowed" : "pointer",
                background: dragOver ? "#f0f0ff" : "#fff",
                transition: "all 0.2s",
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                style={{ display: "none" }}
                onChange={onFileChange}
              />

              {uploading ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                  <div style={spinnerStyle} />
                  <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>Uploading PDF...</p>
                </div>
              ) : (
                <>
                  <div style={{
                    width: "56px", height: "56px", borderRadius: "14px",
                    background: "#f0f0ff", display: "flex", alignItems: "center",
                    justifyContent: "center", margin: "0 auto 16px",
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.8">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="12" y1="18" x2="12" y2="12" />
                      <polyline points="9 15 12 12 15 15" />
                    </svg>
                  </div>
                  <p style={{ fontWeight: 600, color: "#111827", margin: "0 0 6px", fontSize: "15px" }}>
                    {dragOver ? "Drop your PDF here" : "Click to upload PDF"}
                  </p>
                  <p style={{ color: "#9ca3af", fontSize: "13px", margin: "0 0 16px" }}>
                    or drag & drop · PDF only · max 10MB
                  </p>
                  <span style={{
                    display: "inline-block", padding: "8px 20px",
                    background: "#6366f1", color: "#fff",
                    borderRadius: "8px", fontSize: "13px", fontWeight: 600,
                  }}>
                    Browse File
                  </span>
                </>
              )}
            </div>

            {uploadError && (
              <div style={{
                marginTop: "12px", padding: "10px 14px",
                background: "#fef2f2", border: "1px solid #fca5a5",
                borderRadius: "8px", color: "#991b1b", fontSize: "13px",
              }}>
                {uploadError}
              </div>
            )}

            {uploadedFiles.length > 0 && (
              <div style={{ marginTop: "28px" }}>
                <p style={{ fontWeight: 600, color: "#374151", fontSize: "14px", marginBottom: "12px" }}>
                  Uploaded Files
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {uploadedFiles.map((file) => (
                    <div key={file.id} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "14px 16px", background: "#fff",
                      border: "1px solid #e5e7eb", borderRadius: "10px",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                          width: "36px", height: "36px", borderRadius: "8px",
                          background: "#fef2f2", display: "flex",
                          alignItems: "center", justifyContent: "center",
                        }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: "13px", color: "#111827", margin: 0 }}>{file.name}</p>
                          <p style={{ fontSize: "11px", color: "#9ca3af", margin: "2px 0 0" }}>
                            {file.size} · {file.uploadedAt}
                          </p>
                        </div>
                      </div>
                      <button onClick={() => removeFile(file.id)} style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: "#9ca3af", fontSize: "20px", lineHeight: 1,
                        padding: "4px 8px",
                      }}>×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: Create News ── */}
        {activeTab === "create" && (
          <div style={{
            background: "#fff", borderRadius: "14px",
            border: "1px solid #e5e7eb", padding: "24px",
          }}>
            {/* Endpoint pill */}
            {/* <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "#f3f4f6", borderRadius: "8px",
              padding: "6px 12px", marginBottom: "24px",
            }}>
              <span style={{
                background: "#6366f1", color: "#fff",
                borderRadius: "5px", padding: "2px 7px",
                fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px",
              }}>POST</span>
              <span style={{ fontSize: "12px", color: "#6b7280", fontFamily: "monospace" }}>
                {API_URL}
              </span>
            </div> */}

            {/* Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginBottom: "24px" }}>
              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: "13px", color: "#374151", marginBottom: "6px" }}>
                   Title <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  name="job_title"
                  placeholder="e.g. Software Developer"
                  value={form.job_title}
                  onChange={handleChange}
                  disabled={isLoading}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: "13px", color: "#374151", marginBottom: "6px" }}>
                  Description <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <textarea
                  name="description"
                  placeholder="e.g. Hiring for a software developer role."
                  value={form.description}
                  onChange={handleChange}
                  disabled={isLoading}
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
                />
              </div>
            </div>

            <div style={{ borderTop: "1px solid #f3f4f6", marginBottom: "20px" }} />

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isDisabled}
              style={{
                width: "100%", padding: "12px",
                background: isDisabled ? "#e5e7eb" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color: isDisabled ? "#9ca3af" : "#fff",
                border: "none", borderRadius: "10px",
                fontWeight: 700, fontSize: "14px", cursor: isDisabled ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "all 0.2s",
              }}
            >
              {isLoading ? (
                <>
                  <div style={{ ...spinnerStyle, borderTopColor: "#fff", width: "16px", height: "16px" }} />
                  Submitting…
                </>
              ) : (
                <>Publish News <span>→</span></>
              )}
            </button>

            {/* Response */}
            {response.status === "success" && (
              <div style={{
                marginTop: "20px", borderRadius: "10px",
                border: "1px solid #6ee7b7", background: "#ecfdf5", overflow: "hidden",
              }}>
                <div style={{
                  padding: "10px 14px", display: "flex", alignItems: "center", gap: "8px",
                  fontSize: "13px", fontWeight: 600, color: "#065f46",
                  borderBottom: "1px solid #6ee7b7",
                }}>
                  <span style={{
                    width: "8px", height: "8px", borderRadius: "50%",
                    background: "#10b981", display: "inline-block",
                  }} />
                  201 · {response.data.message}
                </div>
                <div style={{ padding: "14px", overflowX: "auto" }}>
                  <pre
                    style={{ margin: 0, fontSize: "12px", fontFamily: "monospace", color: "#065f46" }}
                    dangerouslySetInnerHTML={{
                      __html: syntaxHighlight(JSON.stringify(response.data, null, 2)),
                    }}
                  />
                </div>
              </div>
            )}

            {response.status === "error" && (
              <div style={{
                marginTop: "20px", borderRadius: "10px",
                border: "1px solid #fca5a5", background: "#fef2f2", overflow: "hidden",
              }}>
                <div style={{
                  padding: "10px 14px", display: "flex", alignItems: "center", gap: "8px",
                  fontSize: "13px", fontWeight: 600, color: "#991b1b",
                  borderBottom: "1px solid #fca5a5",
                }}>
                  <span style={{
                    width: "8px", height: "8px", borderRadius: "50%",
                    background: "#ef4444", display: "inline-block",
                  }} />
                  Error
                </div>
                <div style={{ padding: "14px" }}>
                  <pre style={{ margin: 0, fontSize: "12px", fontFamily: "monospace", color: "#991b1b" }}>
                    {response.message}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Shared inline styles ─────────────────────────────────────────────────────

const navBtnStyle: React.CSSProperties = {
  background: "none", border: "1px solid #e5e7eb",
  borderRadius: "8px", padding: "7px 10px",
  cursor: "pointer", color: "#6b7280",
  display: "flex", alignItems: "center",
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px",
  border: "1px solid #e5e7eb", borderRadius: "8px",
  fontSize: "14px", color: "#111827",
  outline: "none", boxSizing: "border-box",
  background: "#fafafa",
};

const spinnerStyle: React.CSSProperties = {
  width: "22px", height: "22px",
  border: "2px solid #e5e7eb",
  borderTop: "2px solid #6366f1",
  borderRadius: "50%",
  animation: "spin 0.7s linear infinite",
};
