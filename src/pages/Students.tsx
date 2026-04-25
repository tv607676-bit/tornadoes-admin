import { useState, useEffect } from "react";
import "./Students.css";

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  grade: string;
  parent: string;
  subjects: string[];
  status: "active" | "inactive";
}

interface StudentsProps {
  onLogout: () => void;
  onAddStudent: () => void;
  onEnquiry: () => void;
  onNotifications: () => void;       // ← new: redirects to notifications page
  notificationCount?: number;        // ← new: controls the red badge count
}

const INITIAL_STUDENTS: Student[] = [
  { id: 1, name: "Aarav Sharma", email: "aarav.sharma@email.com", phone: "+91 9876543210", grade: "Grade 12", parent: "Rajesh Sharma", subjects: ["Mathematics", "Physics", "Chemistry"], status: "active" },
  { id: 2, name: "Priya Nair", email: "priya.nair@email.com", phone: "+91 9876543211", grade: "Grade 11", parent: "Suresh Nair", subjects: ["Biology", "Chemistry"], status: "active" },
  { id: 3, name: "Rohan Mehta", email: "rohan.mehta@email.com", phone: "+91 9876543212", grade: "Grade 10", parent: "Vikram Mehta", subjects: ["Mathematics", "Science"], status: "inactive" },
  { id: 4, name: "Sneha Pillai", email: "sneha.pillai@email.com", phone: "+91 9876543213", grade: "Grade 12", parent: "Anand Pillai", subjects: ["Physics", "Mathematics"], status: "active" },
  { id: 5, name: "Arjun Krishnan", email: "arjun.krishnan@email.com", phone: "+91 9876543214", grade: "Grade 11", parent: "Mohan Krishnan", subjects: ["Chemistry", "Biology", "Mathematics"], status: "active" },
  { id: 6, name: "Divya Menon", email: "divya.menon@email.com", phone: "+91 9876543215", grade: "Grade 10", parent: "Ravi Menon", subjects: ["Science", "Mathematics"], status: "inactive" },
  { id: 7, name: "Karan Verma", email: "karan.verma@email.com", phone: "+91 9876543216", grade: "Grade 12", parent: "Sunil Verma", subjects: ["Mathematics", "Physics"], status: "active" },
  { id: 8, name: "Meera Iyer", email: "meera.iyer@email.com", phone: "+91 9876543217", grade: "Grade 11", parent: "Ramesh Iyer", subjects: ["Biology", "Chemistry", "Physics"], status: "active" },
  { id: 9, name: "Aditya Joshi", email: "aditya.joshi@email.com", phone: "+91 9876543218", grade: "Grade 10", parent: "Prakash Joshi", subjects: ["Science", "Mathematics"], status: "inactive" },
  { id: 10, name: "Nisha Patel", email: "nisha.patel@email.com", phone: "+91 9876543219", grade: "Grade 12", parent: "Hitesh Patel", subjects: ["Chemistry", "Biology"], status: "active" },
  { id: 11, name: "Rahul Gupta", email: "rahul.gupta@email.com", phone: "+91 9876543220", grade: "Grade 11", parent: "Vijay Gupta", subjects: ["Mathematics", "Physics", "Chemistry"], status: "active" },
  { id: 12, name: "Ananya Das", email: "ananya.das@email.com", phone: "+91 9876543221", grade: "Grade 10", parent: "Subhash Das", subjects: ["Science", "Biology"], status: "inactive" },
];

const STATUSES = ["All Status", "active", "inactive"];
const PAGE_SIZE_OPTIONS = [4, 8, 12];

export default function Students({ onLogout, onAddStudent, onEnquiry, onNotifications }: StudentsProps) {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

  const filtered = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search);
    const matchStatus = statusFilter === "All Status" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, pageSize]);

  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this student?")) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Email", "Phone", "Grade", "Parent", "Subjects", "Status"];
    const rows = filtered.map((s) => [s.id, s.name, s.email, s.phone, s.grade, s.parent, s.subjects.join("; "), s.status]);
    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "students.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const getInitial = (name: string) => name.charAt(0).toUpperCase();
  const avatarColors = ["#3b4cff", "#7c3de8", "#e83b9b", "#3be8a0", "#e8a03b", "#3bb4e8", "#e83b3b", "#3be860"];
  const getColor = (id: number) => avatarColors[id % avatarColors.length];

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
      {/* ── NAVBAR ── */}
      <nav className="students-nav">
        <div className="nav-brand">
          <div className="nav-logo">F</div>
          <div>
            <div className="nav-title">Force Admin</div>
            <div className="nav-sub">Student Management</div>
          </div>
        </div>

        <div className="nav-user">
          {/* ── NOTIFICATION BELL ── */}
          <button
            className="nav-bell"
            onClick={onNotifications}
            title="Notifications"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {/* {notificationCount > 0 && (
              <span className="nav-bell-badge">
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            )} */}
          </button>

          {/* ── LOGOUT ── */}
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
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Count + per-page */}
        <div className="results-bar">
          <p className="results-count">
            Showing <strong>{Math.min((currentPage - 1) * pageSize + 1, filtered.length)}</strong>–<strong>{Math.min(currentPage * pageSize, filtered.length)}</strong> of <strong>{filtered.length}</strong> students
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

        {/* Student Cards */}
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
            paginated.map((student) => (
              <div className="student-card" key={student.id}>
                <div className="student-left">
                  <div className="student-avatar" style={{ background: getColor(student.id) }}>
                    {getInitial(student.name)}
                  </div>
                  <div className="student-info">
                    <div className="student-name-row">
                      <span className="student-name">{student.name}</span>
                      <span className={`status-badge ${student.status}`}>{student.status}</span>
                    </div>
                    <div className="student-meta">
                      <span>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="4" width="20" height="16" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        {student.email}
                      </span>
                      <span>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                        {student.grade}
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
                      {student.phone}
                    </span>
                    <span className="parent-info">Parent: <strong>{student.parent}</strong></span>
                  </div>
                  <div className="student-actions">
                    <button className="btn-action view">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      View
                    </button>
                    <button className="btn-action edit">
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

        {/* ── PAGINATION ── */}
        {totalPages > 1 && (
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