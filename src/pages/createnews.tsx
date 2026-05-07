import { useState } from "react";
import "./CreateNews.css";

interface CreateNewsProps {
  onBack: () => void;
  onLogout: () => void;
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

const API_URL = "https://api.tornadoes.co.in/api/news";

function syntaxHighlight(json: string): string {
  return json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = "num";
        if (/^"/.test(match)) {
          cls = /:$/.test(match) ? "key" : "str";
        } else if (/true|false/.test(match)) {
          cls = "bool";
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
}

export default function CreateNews({ onBack, onLogout }: CreateNewsProps) {
  const [form, setForm] = useState<NewsPayload>({
    job_title: "",
    description: "",
  });
  const [response, setResponse] = useState<ResponseState>({ status: "idle" });

  const isLoading = response.status === "loading";
  const isDisabled = isLoading || !form.job_title.trim() || !form.description.trim();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setResponse({ status: "loading" });
    try {
      const token = localStorage.getItem("admin_token") ?? "";
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Request failed");
      }

      setResponse({ status: "success", data });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setResponse({ status: "error", message });
    }
  };

  return (
    <div className="page-wrapper">
      {/* NAVBAR */}
      <nav className="students-nav">
        <div className="nav-brand">
          <div className="nav-logo">T</div>
          <div>
            <div className="nav-title">Tornadoes Academy</div>
            <div className="nav-sub">Create News</div>
          </div>
        </div>
        <div className="nav-user">
          <button className="nav-bell" onClick={onBack} title="Back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button className="nav-logout" onClick={onLogout} title="Logout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </nav>

      <div className="create-news-content">
        {/* Header */}
        <div className="form-header">
          <button className="back-btn" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
          <div className="form-tag">API Interface</div>
          <h1 className="form-title">
            Create <span>News</span>
          </h1>
          <p className="form-subtitle">
            POST a new job listing to the Tornadoes news feed
          </p>
        </div>

        {/* Card */}
        <div className="form-card">
          {/* Endpoint pill */}
          <div className="endpoint-pill">
            <span className="method-badge">POST</span>
            <span className="endpoint-url">{API_URL}</span>
          </div>

          {/* Fields */}
          <div className="field-group">
            <div className="field">
              <label className="field-label">
                Job Title <span className="required">*</span>
              </label>
              <input
                className="field-input"
                type="text"
                name="job_title"
                placeholder="e.g. Software Developer"
                value={form.job_title}
                onChange={handleChange}
                disabled={isLoading}
                autoComplete="off"
              />
            </div>

            <div className="field">
              <label className="field-label">
                Description <span className="required">*</span>
              </label>
              <textarea
                className="field-textarea"
                name="description"
                placeholder="e.g. Hiring for a software developer role."
                value={form.description}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-divider" />

          {/* Submit */}
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={isDisabled}
          >
            {isLoading ? (
              <>
                <span className="spinner" />
                Submitting…
              </>
            ) : (
              <>
                Publish News
                <span className="btn-icon">→</span>
              </>
            )}
          </button>

          {/* Response */}
          {response.status === "success" && (
            <div className="response-box success">
              <div className="response-header">
                <span className="response-dot" />
                201 · {response.data.message}
              </div>
              <div className="response-body">
                <pre
                  dangerouslySetInnerHTML={{
                    __html: syntaxHighlight(
                      JSON.stringify(response.data, null, 2)
                    ),
                  }}
                />
              </div>
            </div>
          )}

          {response.status === "error" && (
            <div className="response-box error">
              <div className="response-header">
                <span className="response-dot" />
                Error
              </div>
              <div className="response-body">
                <pre>{response.message}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}