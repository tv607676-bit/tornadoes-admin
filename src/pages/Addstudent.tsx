import { useState, useEffect } from "react";
import "./Addstudent.css";

interface AddStudentProps {
  onBack: () => void;
  onLogout: () => void;
  candidateId?: string;
  viewOnly?: boolean;
}

export default function AddStudent({ onBack, onLogout, candidateId, viewOnly = false }: AddStudentProps) {
  const [form, setForm] = useState({
    fullName: "",
    address: "",
    dob: "",
    age: "",
    gender: "",
    bloodGroup: "",
    mobile: "",
    qualification: "",
    height: "",
    weight: "",
    eyesight: "",
    flatFoot: "",
    knee: "",
    enrollmentDate: new Date().toISOString().split("T")[0],
    status: "Active",
    trainingCenter: "",
    parentName: "",
    parentRelation: "",
    parentMobile: "",
    parentEmail: "",
    parentAddress: "",
    paymentStatus: "paid",
    totalFee: "",
    paidAmount: "",
    balanceAmount: "",
    paymentMethod: "",
    paymentNote: "",
    paymentDueDate: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ id: string; name: string } | null>(null);
  const [fetchLoading, setFetchLoading] = useState(!!candidateId);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const TRAINING_CENTERS = [
    "Kannur",
    "Cheemeni",
    "Mathamangalam",
    "Kunjimangalam",
    "Azhikkal",
    "Chembilode",
    "Koothuparamba",
    "Iritty",
  ];

  const cleanMobile = (val: string) =>
    val.replace(/^\+91/, "").replace(/\D/g, "").slice(-10);

  const handleDelete = async () => {
    if (!candidateId) return;
    setDeleting(true);
    setError(null);
    try {
      const token = localStorage.getItem("admin_token") ?? "";
      const res = await fetch(`https://api.tornadoes.co.in/api/candidate/${candidateId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) throw new Error(json?.message || "Failed to delete candidate.");
      setTimeout(() => onBack(), 1200);
    } catch (err: any) {
      setError(err.message || "Delete failed. Please try again.");
      setDeleting(false);
      setDeleteConfirm(false);
    }
  };

  useEffect(() => {
    if (!candidateId) return;
    const load = async () => {
      setFetchLoading(true);
      try {
        const token = localStorage.getItem("admin_token") ?? "";
        const res = await fetch(`https://api.tornadoes.co.in/api/candidate/${candidateId}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        const json = await res.json().catch(() => null);
        if (!res.ok || !json?.success) throw new Error(json?.message || "Failed to load candidate.");

        const d = json.data;

        const amountPaid   = d.amount_paid ?? 0;
        const totalFee     = d.total_fee ?? 0;
        const isUnpaidMode = amountPaid < totalFee;

        setForm({
          fullName:       d.name ?? "",
          address:        d.place ?? "",
          dob:            d.dob ? d.dob.split("T")[0] : "",
          age:            String(d.age ?? ""),
          gender:         d.gender ?? "",
          bloodGroup:     d.blood_group ?? "",
          mobile:         d.mobile_number ?? "",
          qualification:  d.qualification ?? "",
          height:         d.height != null ? String(d.height) : "",
          weight:         d.weight != null ? String(d.weight) : "",
          eyesight:       d.eye_sight ?? "",
          flatFoot:       d.flat_foot === true ? "Yes" : d.flat_foot === false ? "No" : "",
          knee:           d.knee_issue === true ? "Yes" : d.knee_issue === false ? "No" : "",
          enrollmentDate: d.enrollment_date ? d.enrollment_date.split("T")[0] : new Date().toISOString().split("T")[0],
          status:         d.status ?? "Active",
          // ✅ GET: training_center അല്ലെങ്കിൽ trainingcenter രണ്ടും handle ചെയ്യുന്നു
          trainingCenter: d.training_center ?? d.trainingcenter ?? "",
          parentName:     d.father_name ?? "",
          parentRelation: d.parent_relation ?? "",
          parentMobile:   d.parent_mobile ?? "",
          parentEmail:    d.mail_id ?? "",
          parentAddress:  d.parent_address ?? "",
          paymentStatus:  isUnpaidMode ? "unpaid" : "paid",
          totalFee:       totalFee ? String(totalFee) : "",
          paidAmount:     amountPaid ? String(amountPaid) : "",
          balanceAmount:  d.balance_amount != null ? String(d.balance_amount) : "0",
          paymentMethod:  d.payment_method ?? "",
          paymentNote:    d.payment_note ?? "",
          paymentDueDate: d.due_date ? d.due_date.split("T")[0] : "",
        });
      } catch (err: any) {
        setError(err.message || "Failed to load candidate details.");
      } finally {
        setFetchLoading(false);
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidateId]);

  const handle = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "totalFee" || name === "paidAmount") {
        const total = parseFloat(name === "totalFee" ? value : prev.totalFee) || 0;
        const paid  = parseFloat(name === "paidAmount" ? value : prev.paidAmount) || 0;
        updated.balanceAmount = total - paid > 0 ? String(total - paid) : "0";
      }
      if (name === "paymentStatus" && value === "paid") {
        updated.paidAmount    = updated.totalFee;
        updated.balanceAmount = "0";
      }
      return updated;
    });
  };

  const buildPayload = () => {
    const isUnpaid = form.paymentStatus === "unpaid";

    const paymentDetails = isUnpaid ? {
      total_fee:      form.totalFee ? Number(form.totalFee) : 0,
      payment_method: form.paymentMethod || null,
      payment_note:   form.paymentNote   || null,
      amount_paid:    form.paidAmount ? Number(form.paidAmount) : 0,
      balance_amount: form.balanceAmount ? Number(form.balanceAmount) : 0,
      due_date:       form.paymentDueDate || null,
    } : {
      total_fee:      form.totalFee ? Number(form.totalFee) : 0,
      payment_method: form.paymentMethod || null,
      payment_note:   form.paymentNote   || null,
    };

    // ✅ CREATE — POST
    if (!candidateId) {
      return {
        full_name:      form.fullName,
        mobile_no:      cleanMobile(form.mobile),
        address:        form.address,
        date_of_birth:  form.dob,
        age:            Number(form.age),
        gender:         form.gender,
        blood_group:    form.bloodGroup,
        qualification:  form.qualification,
        trainingcenter: form.trainingCenter?.toLowerCase() || null, // ✅ no underscore, lowercase
        physical_information: {
          height:     form.height ? Number(form.height) : null,
          weight:     form.weight ? Number(form.weight) : null,
          eyesight:   form.eyesight || null,
          flat_foot:  form.flatFoot === "Yes" ? true : form.flatFoot === "No" ? false : null,
          knee_issue: form.knee === "Yes" ? true : form.knee === "No" ? false : null,
        },
        enrollment_details: {
          enrollment_date: form.enrollmentDate,
          status:          form.status,
        },
        payment_details: paymentDetails,
        parent_guardian_information: {
          name:     form.parentName,
          relation: form.parentRelation,
          mobile:   cleanMobile(form.parentMobile),
          email:    form.parentEmail   || null,
          address:  form.parentAddress || null,
        },
      };
    }

    // ✅ UPDATE — PUT (flat format)
    return {
      full_name:       form.fullName,
      mobile_no:       cleanMobile(form.mobile),
      address:         form.address,
      date_of_birth:   form.dob,
      age:             Number(form.age),
      gender:          form.gender,
      blood_group:     form.bloodGroup,
      qualification:   form.qualification,
      height:          form.height ? Number(form.height) : null,
      weight:          form.weight ? Number(form.weight) : null,
      eyesight:        form.eyesight || null,
      flat_foot:       form.flatFoot === "Yes" ? true : form.flatFoot === "No" ? false : null,
      knee_issue:      form.knee === "Yes" ? true : form.knee === "No" ? false : null,
      enrollment_date: form.enrollmentDate,
      status:          form.status,
      training_center: form.trainingCenter || null, // PUT-ൽ underscore
      ...paymentDetails,
      parent_name:     form.parentName,
      parent_relation: form.parentRelation,
      parent_mobile:   cleanMobile(form.parentMobile),
      parent_email:    form.parentEmail   || null,
      parent_address:  form.parentAddress || null,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setError(null);
    setSuccessData(null);

    try {
      const token = localStorage.getItem("admin_token") ?? "";
      const url = candidateId
        ? `https://api.tornadoes.co.in/api/candidate/${candidateId}`
        : "https://api.tornadoes.co.in/api/candidate";
      const method = candidateId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(buildPayload()),
      });

      const json = await response.json().catch(() => null);

      if (!response.ok || !json?.success) {
        throw new Error(json?.message || `Request failed with status ${response.status}`);
      }

      setSuccessData({
        id:   candidateId ?? json.data?.id ?? "",
        name: json.data?.name ?? form.fullName,
      });
      setTimeout(() => {
        setSubmitted(false);
        onBack();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setSubmitted(false);
    }
  };

  const isUnpaid = form.paymentStatus === "unpaid";

  return (
    <div className="add-student-page">
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
          <button className="nav-logout" onClick={onLogout} title="Logout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </nav>

      <main className="add-main">
        <button className="back-btn" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Students
        </button>

        <div className="add-header">
          <h1 className="add-title">
            {viewOnly ? "View Student" : candidateId ? "Edit Student" : "Add New Student"}
          </h1>
          <p className="add-desc">
            {viewOnly
              ? "Viewing student information"
              : candidateId
              ? "Update student information"
              : "Enter student information to create a new record"}
          </p>
        </div>

        {fetchLoading && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "20px 0", color: "#9a9ab0", fontFamily: "'Sora', sans-serif", fontSize: "14px" }}>
            <span className="spinner-sm" style={{ borderColor: "#e0e0f0", borderTopColor: "#7c3de8" }} />
            Loading candidate details...
          </div>
        )}

        {successData && (
          <div style={{ marginBottom: "16px", padding: "12px 16px", borderRadius: "10px", background: "#e6f9f0", border: "1.5px solid #6ee7b7", color: "#065f46", fontFamily: "'Sora', sans-serif", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>
              {candidateId ? "Candidate updated successfully!" : "Candidate created successfully!"}&nbsp;
              <span style={{ opacity: 0.6, fontSize: "12px" }}>
                {successData.id && `ID: ${successData.id} · `}{successData.name}
              </span>
            </span>
          </div>
        )}

        {error && !deleteConfirm && (
          <div style={{ marginBottom: "16px", padding: "12px 16px", borderRadius: "10px", background: "#fff0f0", border: "1.5px solid #fca5a5", color: "#dc2626", fontFamily: "'Sora', sans-serif", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {!fetchLoading && (
          <form onSubmit={viewOnly ? (e) => e.preventDefault() : handleSubmit} className="add-form" style={viewOnly ? { pointerEvents: "none", opacity: 0.85 } : {}}>

            {/* SECTION 1: Personal Information */}
            <div className="form-section">
              <div className="section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Personal Information
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Full Name <span className="req">*</span></label>
                  <input name="fullName" value={form.fullName} onChange={handle} placeholder="Enter full name" required />
                </div>
                <div className="form-group">
                  <label>Mobile Number <span className="req">*</span></label>
                  <input name="mobile" value={form.mobile} onChange={handle} placeholder="9876543210" required />
                </div>
              </div>
              <div className="form-group full">
                <label>Address <span className="req">*</span></label>
                <textarea name="address" value={form.address} onChange={handle} placeholder="Enter full address" rows={3} required />
              </div>
              <div className="form-grid-3">
                <div className="form-group">
                  <label>Date of Birth <span className="req">*</span></label>
                  <input type="date" name="dob" value={form.dob} onChange={handle} required />
                </div>
                <div className="form-group">
                  <label>Age <span className="req">*</span></label>
                  <input name="age" value={form.age} onChange={handle} placeholder="e.g. 17" type="number" min="1" max="100" required />
                </div>
                <div className="form-group">
                  <label>Gender <span className="req">*</span></label>
                  <select name="gender" value={form.gender} onChange={handle} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Blood Group <span className="req">*</span></label>
                  <select name="bloodGroup" value={form.bloodGroup} onChange={handle} required>
                    <option value="">Select Blood Group</option>
                    <option>A+</option><option>A-</option>
                    <option>B+</option><option>B-</option>
                    <option>AB+</option><option>AB-</option>
                    <option>O+</option><option>O-</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Qualification</label>
                  <input name="qualification" value={form.qualification} onChange={handle} placeholder="e.g. Grade 12 / SSLC" />
                </div>
              </div>
            </div>

            {/* SECTION 2: Physical Information */}
            <div className="form-section">
              <div className="section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" />
                  <path d="M12 8v4l3 3" />
                </svg>
                Physical Information
              </div>
              <div className="form-grid-3">
                <div className="form-group">
                  <label>Height (cm)</label>
                  <input name="height" value={form.height} onChange={handle} placeholder="e.g. 170" type="number" />
                </div>
                <div className="form-group">
                  <label>Weight (kg)</label>
                  <input name="weight" value={form.weight} onChange={handle} placeholder="e.g. 65" type="number" />
                </div>
                <div className="form-group">
                  <label>Eyesight</label>
                  <select name="eyesight" value={form.eyesight} onChange={handle}>
                    <option value="">Select</option>
                    <option value="6/6">6/6 (Normal)</option>
                    <option value="6/9">6/9</option>
                    <option value="6/12">6/12</option>
                    <option value="6/18">6/18</option>
                    <option value="6/24">6/24</option>
                    <option value="6/36">6/36</option>
                    <option value="6/60">6/60</option>
                  </select>
                </div>
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Flat Foot</label>
                  <select name="flatFoot" value={form.flatFoot} onChange={handle}>
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Knee Issue</label>
                  <select name="knee" value={form.knee} onChange={handle}>
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 3: Enrollment Details */}
            <div className="form-section">
              <div className="section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Enrollment Details
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Enrollment Date <span className="req">*</span></label>
                  <input type="date" name="enrollmentDate" value={form.enrollmentDate} onChange={handle} required />
                </div>
                <div className="form-group">
                  <label>Status <span className="req">*</span></label>
                  <select name="status" value={form.status} onChange={handle} required>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="form-group full">
                <label>Training Center <span className="req">*</span></label>
                <select name="trainingCenter" value={form.trainingCenter} onChange={handle} required>
                  <option value="">Select Training Center</option>
                  {TRAINING_CENTERS.map((center) => (
                    <option key={center} value={center}>{center}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* SECTION 4: Payment Details */}
            <div className="form-section">
              <div className="section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                Payment Details
              </div>

              <div style={{ display: "inline-flex", border: "1.5px solid #e8e8f0", borderRadius: "10px", overflow: "hidden", userSelect: "none" as const }}>
                <div
                  role="button"
                  onClick={() => setForm(prev => ({ ...prev, paymentStatus: "paid", paidAmount: prev.totalFee, balanceAmount: "0" }))}
                  style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 28px", fontFamily: "'Sora', sans-serif", fontSize: "13px", fontWeight: 600, cursor: "pointer", borderRight: "1.5px solid #e8e8f0", background: form.paymentStatus === "paid" ? "#e6f9f0" : "#f5f6fa", color: form.paymentStatus === "paid" ? "#1a9e5c" : "#9a9ab0", whiteSpace: "nowrap" as const }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={form.paymentStatus === "paid" ? "#1a9e5c" : "#9a9ab0"} strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Paid
                </div>
                <div
                  role="button"
                  onClick={() => setForm(prev => ({ ...prev, paymentStatus: "unpaid", paidAmount: "", balanceAmount: "" }))}
                  style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 28px", fontFamily: "'Sora', sans-serif", fontSize: "13px", fontWeight: 600, cursor: "pointer", background: form.paymentStatus === "unpaid" ? "#fff4e5" : "#f5f6fa", color: form.paymentStatus === "unpaid" ? "#d97706" : "#9a9ab0", whiteSpace: "nowrap" as const }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={form.paymentStatus === "unpaid" ? "#d97706" : "#9a9ab0"} strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Unpaid
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Total Fee (₹) <span className="req">*</span></label>
                  <div className="input-prefix-wrap">
                    <span className="input-prefix">₹</span>
                    <input name="totalFee" value={form.totalFee} onChange={handle} placeholder="0.00" type="number" min="0" step="0.01" required className="with-prefix" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Payment Method</label>
                  <select name="paymentMethod" value={form.paymentMethod} onChange={handle}>
                    <option value="">Select Method</option>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Card">Card</option>
                  </select>
                </div>
              </div>

              {isUnpaid && (
                <div className="unpaid-fields">
                  <div className="form-grid-3">
                    <div className="form-group">
                      <label>Amount Paid (₹) <span className="req">*</span></label>
                      <div className="input-prefix-wrap">
                        <span className="input-prefix">₹</span>
                        <input name="paidAmount" value={form.paidAmount} onChange={handle} placeholder="0.00" type="number" min="0" step="0.01" required={isUnpaid} className="with-prefix" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Balance Amount (₹)</label>
                      <div className="input-prefix-wrap">
                        <span className="input-prefix">₹</span>
                        <input name="balanceAmount" value={form.balanceAmount} readOnly placeholder="Auto-calculated" className={`with-prefix balance-field ${parseFloat(form.balanceAmount) > 0 ? "has-balance" : ""}`} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Due Date</label>
                      <input type="date" name="paymentDueDate" value={form.paymentDueDate} onChange={handle} />
                    </div>
                  </div>
                </div>
              )}

              <div className="form-group full">
                <label>Payment Note</label>
                <textarea name="paymentNote" value={form.paymentNote} onChange={handle} placeholder="Any additional payment notes..." rows={2} />
              </div>
            </div>

            {/* SECTION 5: Parent / Guardian */}
            <div className="form-section">
              <div className="section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Parent / Guardian Information
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Parent / Guardian Name <span className="req">*</span></label>
                  <input name="parentName" value={form.parentName} onChange={handle} placeholder="Enter parent name" required />
                </div>
                <div className="form-group">
                  <label>Relation <span className="req">*</span></label>
                  <select name="parentRelation" value={form.parentRelation} onChange={handle} required>
                    <option value="">Select Relation</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Parent Mobile <span className="req">*</span></label>
                  <input name="parentMobile" value={form.parentMobile} onChange={handle} placeholder="9876543210" required />
                </div>
                <div className="form-group">
                  <label>Parent Email</label>
                  <input type="email" name="parentEmail" value={form.parentEmail} onChange={handle} placeholder="parent@email.com" />
                </div>
              </div>
              <div className="form-group full">
                <label>Parent Address</label>
                <textarea name="parentAddress" value={form.parentAddress} onChange={handle} placeholder="Enter parent address (if different)" rows={2} />
              </div>
            </div>

            {/* ACTIONS */}
            <div className="form-actions">
              {candidateId && !viewOnly && (
                <button
                  type="button"
                  className="btn-delete"
                  onClick={() => setDeleteConfirm(true)}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4h6v2" />
                  </svg>
                  Delete Student
                </button>
              )}
              <button type="button" className="btn-cancel" onClick={onBack}>
                {viewOnly ? "Close" : "Cancel"}
              </button>
              {!viewOnly && (
                <button type="submit" className="btn-submit" disabled={submitted}>
                  {submitted ? (
                    <><span className="spinner-sm" /> Saving...</>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {candidateId ? "Update Student" : "Save Student"}
                    </>
                  )}
                </button>
              )}
            </div>

          </form>
        )}
      </main>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirm && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(10,10,30,0.45)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "16px"
        }}>
          <div style={{
            background: "#fff", borderRadius: "16px", padding: "32px 28px",
            maxWidth: "420px", width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            fontFamily: "'Sora', sans-serif", textAlign: "center"
          }}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "50%",
              background: "#fff0f0", display: "flex", alignItems: "center",
              justifyContent: "center", margin: "0 auto 16px"
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: "17px", fontWeight: 700, color: "#1a1a2e" }}>
              Delete Student?
            </h3>
            <p style={{ margin: "0 0 24px", fontSize: "13px", color: "#6b7280", lineHeight: 1.6 }}>
              Are you sure you want to delete{" "}
              <strong style={{ color: "#1a1a2e" }}>{form.fullName || "this student"}</strong>?
              This action <strong>cannot be undone</strong>.
            </p>
            {error && (
              <div style={{
                marginBottom: "16px", padding: "10px 14px", borderRadius: "8px",
                background: "#fff0f0", border: "1.5px solid #fca5a5",
                color: "#dc2626", fontSize: "12px", textAlign: "left"
              }}>
                {error}
              </div>
            )}
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={() => { setDeleteConfirm(false); setError(null); }}
                disabled={deleting}
                style={{
                  padding: "10px 24px", borderRadius: "8px", border: "1.5px solid #e8e8f0",
                  background: "#f5f6fa", color: "#6b7280", fontFamily: "'Sora', sans-serif",
                  fontSize: "13px", fontWeight: 600, cursor: deleting ? "not-allowed" : "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  padding: "10px 24px", borderRadius: "8px", border: "none",
                  background: deleting ? "#f87171" : "#dc2626", color: "#fff",
                  fontFamily: "'Sora', sans-serif", fontSize: "13px", fontWeight: 600,
                  cursor: deleting ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", gap: "8px"
                }}
              >
                {deleting ? (
                  <><span className="spinner-sm" style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#fff" }} /> Deleting...</>
                ) : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
