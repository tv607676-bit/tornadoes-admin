import { useState } from "react";
import Login from "./pages/Login";
import Students from "./pages/Students";
import AddStudent from "./pages/Addstudent";
import EnquiryList from "./pages/Enquirylist";
import Notifications from "./pages/Notifications";

type Page = "login" | "students" | "add-student" | "view-student" | "edit-student" | "enquiry" | "notifications";

function App() {
  const [page, setPage] = useState<Page>("login");
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | undefined>(undefined);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_email");
    localStorage.removeItem("admin_id");
    localStorage.removeItem("admin_role");
    setPage("login");
  };

  const handleMarkAllRead = () => {
    // Mark all notifications as read logic here
    console.log("All notifications marked as read");
  };

  if (page === "login") {
    return <Login onLogin={() => setPage("students")} />;
  }

  if (page === "add-student") {
    return (
      <AddStudent
        onBack={() => setPage("students")}
        onLogout={handleLogout}
      />
    );
  }

  if (page === "view-student") {
    return (
      <AddStudent
        candidateId={selectedCandidateId}
        viewOnly={true}
        onBack={() => setPage("students")}
        onLogout={handleLogout}
      />
    );
  }

  if (page === "edit-student") {
    return (
      <AddStudent
        candidateId={selectedCandidateId}
        viewOnly={false}
        onBack={() => setPage("students")}
        onLogout={handleLogout}
      />
    );
  }

  if (page === "enquiry") {
    return (
      <EnquiryList
        onBack={() => setPage("students")}
        onLogout={handleLogout}
      />
    );
  }

  if (page === "notifications") {
    return (
      <Notifications
        onBack={() => setPage("students")}
        onLogout={handleLogout}
        onMarkAllRead={handleMarkAllRead} // ✅ Fixed - added missing prop
      />
    );
  }

  return (
    <Students
      onLogout={handleLogout}
      onAddStudent={() => setPage("add-student")}
      onEnquiry={() => setPage("enquiry")}
      onNotifications={() => setPage("notifications")}
      notificationCount={0}
      onView={(id) => {
        setSelectedCandidateId(id);
        setPage("view-student");
      }}
      onEdit={(id) => {
        setSelectedCandidateId(id);
        setPage("edit-student");
      }}
    />
  );
}

export default App;