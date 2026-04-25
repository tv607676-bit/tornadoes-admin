import { useState } from "react";
import Login from "./pages/Login";
import Students from "./pages/Students";
import AddStudent from "./pages/Addstudent";
import EnquiryList from "./pages/Enquirylist";
import Notifications from "./pages/Notifications";

type Page = "login" | "students" | "add-student" | "enquiry" | "notifications";

function App() {
  const [page, setPage] = useState<Page>("login");
  const [notificationCount, setNotificationCount] = useState(3); // initial unread count

  if (page === "login") {
    return <Login onLogin={() => setPage("students")} />;
  }

  if (page === "add-student") {
    return (
      <AddStudent
        onBack={() => setPage("students")}
        onLogout={() => setPage("login")}
      />
    );
  }

  if (page === "enquiry") {
    return (
      <EnquiryList
        onBack={() => setPage("students")}
        onLogout={() => setPage("login")}
      />
    );
  }

  if (page === "notifications") {
    return (
      <Notifications
        onBack={() => setPage("students")}
        onLogout={() => setPage("login")}
        onMarkAllRead={() => setNotificationCount(0)}
      />
    );
  }

  return (
    <Students
      onLogout={() => setPage("login")}
      onAddStudent={() => setPage("add-student")}
      onEnquiry={() => setPage("enquiry")}
      onNotifications={() => setPage("notifications")}
      notificationCount={notificationCount}
    />
  );
}

export default App;