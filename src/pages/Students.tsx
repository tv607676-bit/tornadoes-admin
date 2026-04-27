import { useState, useEffect } from "react";
import "./Students.css";

interface Student {
  id: string;
  student_id: string;
  name: string;
  mail_id: string;
  mobile_number: string;
  parent: string;
  status: "Active" | "Inactive";
  created_at: string;
}

interface StudentsProps {
  onLogout: () => void;
  onAddStudent: () => void;
  onEnquiry: () => void;
  onNotifications: () => void;
  notificationCount?: number;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}

const PAGE_SIZE_OPTIONS = [4, 8, 12];

export default function Students({ onLogout, onAddStudent, onEnquiry, onNotifications, onView, onEdit }: StudentsProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

  const fetchStudents = async (searchVal = "", page = currentPage, size = pageSize) => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL("https://api.tornadoes.co.in/api/candidate");
      url.searchParams.set("page", String(page));
      url.searchParams.set("limit", String(size));
      url.searchParams.set("search", searchVal);
      url.searchParams.set("gender", "");
      url.searchParams.set("place", "");

      const token = localStorage.getItem("admin_token") ?? "";

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || `Request failed with status ${response.status}`);
      }

      const json = await response.json();

      // ✅ API returns { count, data, success }
      const raw: Student[] = Array.isArray(json.data) ? json.data : [];
      setTotalCount(json.count ?? raw.length);

      setStudents(
        raw
          .filter((s) => s && typeof s === "object")
          .map((s) => ({
            ...s,
            status: (String(s.status ?? "").toLowerCase() === "active"
              ? "Active"
              : "Inactive") as "Active" | "Inactive",
          }))
      );
    } catch (err: any) {
      setError(err.message || "Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(search, currentPage, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchStudents(search, 1, pageSize);
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Reset page on filter/pageSize change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, pageSize]);

  // ✅ Status filter client-side
  const filtered = students.filter((s) => {
    if (statusFilter === "All Status") return true;
    return (s.status ?? "").toLowerCase() === statusFilter.toLowerCase();
  });

  // ✅ Use API count for total pages
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      const token = localStorage.getItem("admin_token") ?? "";
      const response = await fetch(`https://api.tornadoes.co.in/api/candidate/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Delete failed.");
      // ✅ Refresh list after delete
      fetchStudents(search, currentPage, pageSize);
    } catch (err: any) {
      alert(err.message || "Delete failed.");
    }
  };

  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem("admin_token") ?? "";
      const url = new URL("https://api.tornadoes.co.in/api/candidate/export");
      url.searchParams.set("search", search);
      url.searchParams.set("gender", "");
      url.searchParams.set("place", "");

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Export failed.");

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = "candidates.xlsx";
      link.click();
      URL.revokeObjectURL(objectUrl);
    } catch (err: any) {
      alert(err.message || "Export failed. Please try again.");
    }
  };

  const getInitial = (name: string) => name.charAt(0).toUpperCase();
  const avatarColors = ["#3b4cff", "#7c3de8", "#e83b9b", "#3be8a0", "#e8a03b", "#3bb4e8", "#e83b3b", "#3be860"];
  const getColor = (id: string) => avatarColors[id.charCodeAt(0) % avatarColors.length];

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="students-page">
      {/* NAVBAR */}
      <nav className="students-nav">
        <div className="nav-brand">
          <div className="nav-logo">T</div>
          <div>
            <div className="nav-title">Tornadoes Academy</div>
            <div className="nav-sub">Student Management</div>
          </div>
        </div>
        <div className="nav-user">
          <button className="nav-bell" onClick={onNotifications} title="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
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

      <main className="students-main">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Students</h1>
            <p className="page-desc">Manage all student records and information</p>
          </div>
          <div className="header-actions">
            <button className="btn-export" onClick={handleExportCSV}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export CSV
            </button>
            <button className="btn-enquiry" onClick={onEnquiry}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Enquiry
            </button>
            <button className="btn-add" onClick={onAddStudent}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
              Add New Student
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-card">
          <div className="filter-group">
            <label className="filter-label">Search</label>
            <div className="search-wrap">
              <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="filter-input"
                placeholder="Search by name, email, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="filter-group">
            <label className="filter-label">Filter by Status</label>
            <div className="select-wrap">
              <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                {["All Status", "Active", "Inactive"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Count + per-page */}
        <div className="results-bar">
          <p className="results-count">
            {loading ? "Loading..." : (
              <>
                Showing <strong>{Math.min((currentPage - 1) * pageSize + 1, totalCount)}</strong>–
                <strong>{Math.min(currentPage * pageSize, totalCount)}</strong> of{" "}
                <strong>{totalCount}</strong> students
              </>
            )}
          </p>
          <div className="per-page">
            <span className="per-page-label">Per page:</span>
            {PAGE_SIZE_OPTIONS.map((n) => (
              <button
                key={n}
                className={`per-page-btn${pageSize === n ? " active" : ""}`}
                onClick={() => setPageSize(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ margin: "0 0 16px", padding: "12px 16px", borderRadius: "10px", background: "#fff0f0", border: "1.5px solid #fca5a5", color: "#dc2626", fontFamily: "'Sora', sans-serif", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
            <button
              onClick={() => fetchStudents(search, currentPage, pageSize)}
              style={{ marginLeft: "auto", background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontFamily: "inherit", fontSize: "13px", fontWeight: 600 }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="students-list">
            {Array.from({ length: pageSize }).map((_, i) => (
              <div className="student-card" key={i} style={{ opacity: 0.5, pointerEvents: "none" }}>
                <div className="student-left">
                  <div className="student-avatar" style={{ background: "#e0e0f0" }} />
                  <div className="student-info">
                    <div style={{ height: 14, width: 160, background: "#e8e8f4", borderRadius: 6, marginBottom: 8 }} />
                    <div style={{ height: 12, width: 220, background: "#f0f0f8", borderRadius: 6 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Student Cards */}
        {!loading && (
          <div className="students-list">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c0c0d0" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
                <p>No students found</p>
              </div>
            ) : (
              filtered.map((student) => (
                <div className="student-card" key={student.id}>
                  <div className="student-left">
                    <div className="student-avatar" style={{ background: getColor(student.id ?? "0") }}>
                      {getInitial(student.name ?? "?")}
                    </div>
                    <div className="student-info">
                      <div className="student-name-row">
                        <span className="student-name">{student.name}</span>
                        <span className={`status-badge ${(student.status ?? "").toLowerCase()}`}>
                          {student.status ?? "—"}
                        </span>
                      </div>
                      <div className="student-meta">
                        <span style={{ fontSize: "12px", color: "#6b6b8a", fontFamily: "'Sora', sans-serif", fontWeight: 500 }}>
                          ID: {student.student_id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="student-right">
                    <div className="student-contact">
                      <span>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        {student.mobile_number}
                      </span>
                      {student.parent && (
                        <span className="parent-info">Parent: <strong>{student.parent}</strong></span>
                      )}
                    </div>
                    <div className="student-actions">
                      <button className="btn-action view" onClick={() => onView(student.id)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        View
                      </button>
                      <button className="btn-action edit" onClick={() => onEdit(student.id)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit
                      </button>
                      <button className="btn-action delete" onClick={() => handleDelete(student.id)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="pagination">
            <button
              className="page-btn nav-btn"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {getPageNumbers().map((page, idx) =>
              page === "..." ? (
                <span key={`ellipsis-${idx}`} className="page-ellipsis">…</span>
              ) : (
                <button
                  key={page}
                  className={`page-btn${currentPage === page ? " active" : ""}`}
                  onClick={() => setCurrentPage(page as number)}
                >
                  {page}
                </button>
              )
            )}

            <button
              className="page-btn nav-btn"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
