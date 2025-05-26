import Navbar_admin from "../header_admin";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../auth/AuthContext.jsx";
import Sidebar from "../Sidebar.jsx";
import { EnvelopeIcon, EnvelopeOpenIcon, TrashIcon } from '@heroicons/react/24/outline';
import Notification_View from "../notification_view.jsx";

const Inbox = () => {
  const { authAxios, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [isNotificationViewVisible, setIsNotificationViewVisible] = useState(false);
  const [currentNotificationForView, setCurrentNotificationForView] = useState(null);
    
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await authAxios.get('/notifications/all');
      setNotifications(response.data || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setNotifications([]);
    }
  }, [authAxios]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleNotificationItemClick = (notificationItem) => {
    setCurrentNotificationForView(notificationItem);
    setIsNotificationViewVisible(true);
    if (notificationItem.status === 'unread') {
      handleMarkAsRead(notificationItem._id);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await authAxios.patch(`/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId
            ? { ...notif, status: 'read', isRead: true, ...response.data, announcement: notif.announcement }
            : notif
        )
      );
      if (currentNotificationForView && currentNotificationForView._id === notificationId) {
        setCurrentNotificationForView((prev) => ({
          ...prev,
          status: 'read',
          isRead: true,
          announcement: prev.announcement,
        }));
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleMarkAsUnread = async (notificationId) => { 
    console.log("Mark as unread not implemented");
  };

  const handleDeleteNotification = async (notificationId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        await authAxios.delete(`/notifications/${notificationId}`);
        setNotifications((prev) => prev.filter((notif) => notif._id !== notificationId));
        if (currentNotificationForView && currentNotificationForView._id === notificationId) {
          setIsNotificationViewVisible(false);
          setCurrentNotificationForView(null);
        }
      } catch (err) {
        console.error("Failed to delete notification:", err);
        alert(err.response?.data?.message || "Could not delete notification.");
      }
    }
  };

  // Filter notifications by announcement title or content or sender
  const filteredNotifications = notifications.filter((notif) => {
    const title = notif.announcement?.title || "";
    const content = notif.announcement?.content || "";
    const sender = notif.sender || ""; 
    const q = search.toLowerCase();
    return title.toLowerCase().includes(q) || content.toLowerCase().includes(q) || sender.toLowerCase().includes(q);
  });

  return (
    <>
      <div className="w-screen">
        <Navbar_admin toggleSidebar={toggleSidebar} />
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 z-40 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* Notification Detail Modal */}
      {isNotificationViewVisible && currentNotificationForView && (
        <Notification_View
          notification_info={currentNotificationForView}
          setNotification_view={setIsNotificationViewVisible}
        />
      )}

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
        <div className="p-6 bg-white min-h-screen">
          <h2 className="text-2xl font-semibold mb-4">Inbox</h2>

          {/* Search bar */}
          <div className="mb-4 flex items-center gap-6">
            <span className="text-emerald-800 font-semibold">Search Inbox:</span>
            <input
              type="text"
              placeholder="Search notifications..."
              className="px-4 py-2 border rounded w-full sm:w-1/3"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600 table-fixed">
              <thead className="bg-emerald-800 text-white">
                <tr>
                  <th className="w-1/4 px-4 py-3">Subject</th>
                  <th className="w-1/4 px-4 py-3">Sender</th>
                  <th className="w-30 px-4 py-3">Content</th>
                  <th className="w-20 px-4 py-3">Date</th>
                  <th className="w-5 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notif) => (
                    <tr
                      key={notif._id}
                      onClick={() => handleNotificationItemClick(notif)}
                      className={`group cursor-pointer text-lg ${
                        notif.status === "read" ? "font-normal bg-gray-100 hover:bg-gray-200" : "font-extrabold bg-white hover:bg-emerald-50 shadow-sm"
                      }`}
                    >
                      <td className="px-4 py-3">{notif.announcement?.title || "Notification"}</td>
                      <td className="px-4 py-3">{notif.sender || "System"}</td>
                      <td className="truncate max-w-sm overflow-hidden whitespace-nowrap font-normal px-4 py-3">
                        {notif.announcement?.content || "No content available."}
                      </td>
                      <td className="px-4 py-3 font-normal">
                        {new Date(notif.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-4 items-center invisible group-hover:visible">
                          {notif.status === "read" ? (
                            <EnvelopeIcon
                              className="h-5 w-5 text-gray-500 hover:text-emerald-600 cursor-pointer"
                              title="Mark as unread"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsUnread(notif._id);
                              }}
                            />
                          ) : (
                            <EnvelopeOpenIcon
                              className="h-5 w-5 text-gray-500 hover:text-emerald-600 cursor-pointer"
                              title="Mark as read"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notif._id);
                              }}
                            />
                          )}

                          <TrashIcon
                            className="h-5 w-5 text-gray-500 hover:text-red-500 cursor-pointer"
                            title="Delete"
                            onClick={(e) => handleDeleteNotification(notif._id, e)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-400">
                      No notifications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Inbox;
