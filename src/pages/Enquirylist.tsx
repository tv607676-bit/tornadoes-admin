import { useState } from "react";
interface Enquiry {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  message: string;
}

interface EnquiryListProps {
  onBack: () => void;
  onLogout: () => void;
}

const ENQUIRIES: Enquiry[] = [
  {
    id: 1,
    fullName: "Aarav Sharma",
    phone: "+91 9876543210",
    email: "aarav.sharma@email.com",
    message:
      "I am interested in enrolling my son for the upcoming academic year. Could you please share the fee structure and admission process?",
  },
  {
    id: 2,
    fullName: "Priya Nair",
    phone: "+91 9876543211",
    email: "priya.nair@email.com",
    message:
      "We would like to know more about the science stream subjects offered and whether there are any scholarship opportunities available.",
  },
  {
    id: 3,
    fullName: "Rohan Mehta",
    phone: "+91 9876543212",
    email: "rohan.mehta@email.com",
    message:
      "Hi, I wanted to inquire about the transport facility and hostel accommodation options for students coming from outside the city.",
  },
  {
    id: 4,
    fullName: "Sneha Pillai",
    phone: "+91 9876543213",
    email: "sneha.pillai@email.com",
    message:
      "Can you tell me about the extracurricular activities available at your institution? My daughter is very interested in music and sports.",
  },
];

const avatarColors = [
  "#3b4cff", "#7c3de8", "#e83b9b", "#3be8a0",
  "#e8a03b", "#3bb4e8", "#e83b3b", "#3be860",
];

const getColor = (id: number) => avatarColors[id % avatarColors.length];
const getInitial = (name: string) => name.charAt(0).toUpperCase();

/* ── Row sub-component with hover state ── */
function EnqRow({ enq, onView }: { enq: Enquiry; onView: () => void }) {
  const [rowHover, setRowHover] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setRowHover(true)}
      onMouseLeave={() => setRowHover(false)}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "1rem",
        background: "#ffffff",
        border: `1px solid ${rowHover ? "#c8c6be" : "#e8e6df"}`,
        borderRadius: "14px",
        padding: "1rem 1.25rem",
        boxShadow: rowHover ? "0 3px 14px rgba(35, 38, 197, 0.07)" : "none",
        transform: rowHover ? "translateY(-1px)" : "translateY(0)",
        transition: "all 0.18s ease",
        boxSizing: "border-box",
      }}
    >
      {/* Avatar */}
      <div style={{
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        background: getColor(enq.id),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: "1rem",
        color: "#ffffff",
        flexShrink: 0,
        textShadow: "0 1px 3px rgba(0,0,0,0.22)",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {getInitial(enq.fullName)}
      </div>

      {/* Name + Phone */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        gap: "0.15rem",
        minWidth: 0,
        overflow: "hidden",
        textAlign: "left",
      }}>
        <span style={{
          fontSize: "0.9375rem",
          fontWeight: 600,
          color: "#111110",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "100%",
          display: "block",
          textAlign: "left",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {enq.fullName}
        </span>
        <span style={{
          fontSize: "0.8125rem",
          color: "#7a7870",
          display: "block",
          textAlign: "left",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {enq.phone}
        </span>
      </div>

      {/* View Button */}
      <button
        onClick={onView}
        onMouseEnter={() => setBtnHover(true)}
        onMouseLeave={() => setBtnHover(false)}
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.8125rem",
          fontWeight: 500,
          color: btnHover ? "#f8f7f4" : "#444440",
          background: btnHover ? "#111110" : "#f4f2ed",
          border: `1px solid ${btnHover ? "#111110" : "#dddbd4"}`,
          borderRadius: "9px",
          padding: "0.42rem 0.85rem",
          cursor: "pointer",
          flexShrink: 0,
          transform: btnHover ? "scale(0.97)" : "scale(1)",
          transition: "all 0.15s",
          whiteSpace: "nowrap",
        }}
      >
        View
      </button>
    </div>
  );
}

/* ── Main Component ── */
export default function EnquiryList({ onBack, onLogout }: EnquiryListProps) {
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [backHover, setBackHover] = useState(false);
  const [logoutHover, setLogoutHover] = useState(false);

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: "#f4f3f0",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      textAlign: "left",
    }}>

      {/* ══ NAVBAR ══ */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        width: "100%",
        background: "#ffffff",
        borderBottom: "1px solid #e4e2db",
        height: "60px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
        boxSizing: "border-box",
        flexShrink: 0,
      }}>

        {/* Left: Brand */}
        <div style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "0.75rem",
        }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "9px",
            background: "#111110",
            color: "#f8f7f4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'DM Mono', monospace",
            fontWeight: 500,
            fontSize: "1rem",
            flexShrink: 0,
          }}>
            F
          </div>
          <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
            <span style={{
              fontSize: "0.9375rem",
              fontWeight: 600,
              color: "#111110",
              lineHeight: 1.2,
              display: "block",
              textAlign: "left",
            }}>
              Force Admin
            </span>
            <span style={{
              fontSize: "0.72rem",
              color: "#8a8880",
              lineHeight: 1.2,
              display: "block",
              textAlign: "left",
            }}>
              Student Management
            </span>
          </div>
        </div>

        {/* Right: Buttons */}
        <div style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "0.5rem",
        }}>
          <button
            onClick={onBack}
            onMouseEnter={() => setBackHover(true)}
            onMouseLeave={() => setBackHover(false)}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: backHover ? "#f8f7f4" : "#444440",
              background: backHover ? "#111110" : "#f2f0eb",
              border: `1px solid ${backHover ? "#111110" : "#dddbd4"}`,
              borderRadius: "8px",
              padding: "0.45rem 0.9rem",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            ← Back to Students
          </button>

          <button
            onClick={onLogout}
            onMouseEnter={() => setLogoutHover(true)}
            onMouseLeave={() => setLogoutHover(false)}
            title="Logout"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              border: `1px solid ${logoutHover ? "#f5c6c6" : "#e4e2db"}`,
              background: logoutHover ? "#fff0f0" : "transparent",
              color: logoutHover ? "#c0392b" : "#7a7870",
              cursor: "pointer",
              flexShrink: 0,
              transition: "all 0.15s",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* ══ MAIN CONTENT ══ */}
      <main style={{
        flex: 1,
        width: "100%",
        maxWidth: "900px",
        margin: "0 auto",
        padding: "2rem 2rem 4rem",
        boxSizing: "border-box",
        textAlign: "left",
      }}>

        {/* Page Header */}
        <div style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.75rem",
          paddingBottom: "1.25rem",
          borderBottom: "1.5px solid #e4e2db",
          width: "100%",
        }}>
          <div style={{ textAlign: "left" }}>
            <h1 style={{
              fontSize: "1.6rem",
              fontWeight: 600,
              letterSpacing: "-0.025em",
              color: "#111110",
              margin: "0 0 0.2rem",
              lineHeight: 1.1,
              fontFamily: "'DM Sans', sans-serif",
              textAlign: "left",
            }}>
              Enquiries
            </h1>
            <p style={{
              fontSize: "0.875rem",
              color: "#7a7870",
              margin: 0,
              fontFamily: "'DM Sans', sans-serif",
              textAlign: "left",
            }}>
              Manage and respond to student enquiries
            </p>
          </div>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.73rem",
            fontWeight: 500,
            background: "#111110",
            color: "#f8f7f4",
            padding: "0.32rem 0.8rem",
            borderRadius: "999px",
            letterSpacing: "0.05em",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}>
            {ENQUIRIES.length} Total
          </span>
        </div>

        {/* Enquiry List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {ENQUIRIES.map((enq) => (
            <EnqRow key={enq.id} enq={enq} onView={() => setSelected(enq)} />
          ))}
        </div>
      </main>

      {/* ══ MODAL ══ */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(18,18,16,0.52)",
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              width: "100%",
              maxWidth: "500px",
              border: "1px solid #e0ded8",
              overflow: "hidden",
              textAlign: "left",
            }}
          >
            {/* Modal Header */}
            <div style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "1rem",
              padding: "1.25rem 1.25rem 1rem",
              borderBottom: "1px solid #f0eee8",
            }}>
              <div style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: getColor(selected.id),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "1.2rem",
                color: "#ffffff",
                flexShrink: 0,
              }}>
                {getInitial(selected.fullName)}
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <h2 style={{
                  fontSize: "1.0625rem",
                  fontWeight: 600,
                  color: "#111110",
                  margin: 0,
                  fontFamily: "'DM Sans', sans-serif",
                  textAlign: "left",
                }}>
                  {selected.fullName}
                </h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  border: "1px solid #e4e2db",
                  background: "transparent",
                  color: "#7a7870",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  flexShrink: 0,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            {/* Contact Meta */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.5rem",
              padding: "1rem 1.25rem",
              borderBottom: "1px solid #f0eee8",
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.8125rem",
                color: "#4a4a47",
                background: "#f8f7f4",
                borderRadius: "8px",
                padding: "0.48rem 0.7rem",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                fontFamily: "'DM Sans', sans-serif",
              }}>
                📱 {selected.phone}
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.8125rem",
                color: "#4a4a47",
                background: "#f8f7f4",
                borderRadius: "8px",
                padding: "0.48rem 0.7rem",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                fontFamily: "'DM Sans', sans-serif",
              }}>
                ✉️ {selected.email}
              </div>
            </div>

            {/* Message */}
            <div style={{
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              color: "#aaa9a3",
              padding: "1rem 1.25rem 0.4rem",
              fontFamily: "'DM Sans', sans-serif",
              textAlign: "left",
            }}>
              Message
            </div>
            <div style={{
              margin: "0 1.25rem 1.25rem",
              background: "#f6f4ef",
              borderRadius: "12px",
              border: "1px solid #ede9e2",
              padding: "0.9rem 1rem",
            }}>
              <p style={{
                fontSize: "0.875rem",
                lineHeight: 1.65,
                color: "#2e2e2c",
                margin: 0,
                fontFamily: "'DM Sans', sans-serif",
                textAlign: "left",
              }}>
                {selected.message}
              </p>
            </div>

            {/* Actions */}
            <div style={{
              display: "flex",
              flexDirection: "row",
              gap: "0.5rem",
              padding: "0 1.25rem 1.25rem",
            }}>
              <a
                href={`tel:${selected.phone}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  padding: "0.55rem 1.1rem",
                  borderRadius: "9px",
                  cursor: "pointer",
                  textDecoration: "none",
                  border: "none",
                  background: "#1a9c50",
                  color: "#ffffff",
                }}
              >
                📞 Call
              </a>
              <a
                href={`mailto:${selected.email}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  padding: "0.55rem 1.1rem",
                  borderRadius: "9px",
                  cursor: "pointer",
                  textDecoration: "none",
                  border: "none",
                  background: "#1a65c4",
                  color: "#ffffff",
                }}
              >
                ✉️ Email
              </a>
              <button
                onClick={() => setSelected(null)}
                style={{
                  marginLeft: "auto",
                  display: "inline-flex",
                  alignItems: "center",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  padding: "0.55rem 1.1rem",
                  borderRadius: "9px",
                  cursor: "pointer",
                  border: "1px solid #dddbd4",
                  background: "#f2f0eb",
                  color: "#444440",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}