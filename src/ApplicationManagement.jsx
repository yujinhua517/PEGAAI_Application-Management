// 引入必要的 React 模組與樣式
import React, { useState, useEffect } from "react";
import "./ApplicationManagement.scss";

// 引入兩個 modal 元件：用來新增/編輯 Application 與新增 Version
import AddApplicationModal from "./components/AddApplicationModal";
import AddVersionModal from "./components/AddVersionModal";

// 引入 icon 圖示（hover 效果）
import addIcon from "./assets/icon.svg";
import addIconHover from "./assets/duplicate.svg";

const ApplicationManagement = () => {
  // 狀態變數區塊
  const [applications, setApplications] = useState([]); // 儲存所有應用程式資料
  const [expandedAppId, setExpandedAppId] = useState(null); // 控制哪個 app 被展開顯示版本
  const [showModal, setShowModal] = useState(false); // 控制 Application Modal 是否顯示
  const [editingItem, setEditingItem] = useState(null); // 要編輯的應用程式資料
  const [isHovered, setIsHovered] = useState(false); // 控制 hover 狀態切換圖示
  const [showVersionModal, setShowVersionModal] = useState(false); // 控制版本 Modal 是否顯示
  const [selectedAppForVersion, setSelectedAppForVersion] = useState(null); // 正在新增版本的應用程式
  const [toast, setToast] = useState({ show: false, message: "", type: "" }); // 提示訊息

  // 初次載入頁面時向後端取得應用資料
  useEffect(() => {
    fetch("http://localhost:3001/applications")
      .then((res) => res.json())
      .then(setApplications)
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // 顯示 toast 提示訊息 3 秒後自動關閉
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: "", type: "" });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // 點擊應用列時，展開/收合該列版本資訊
  const handleRowClick = (appId) => {
    setExpandedAppId(expandedAppId === appId ? null : appId);
  };

  // 儲存 Application（新增或編輯）
  const handleSave = async (form) => {
    if (!form || !form.appId) {
      setToast({ show: true, message: "Missing required fields", type: "error" });
      throw new Error("Invalid form");
    }

    const isEdit = !!editingItem;
    const method = isEdit ? "PUT" : "POST"; // 決定 API 使用 PUT 還是 POST
    const url = `http://localhost:3001/applications${isEdit ? `/${editingItem.id}` : ""}`;

    try {
      const formData = {
        ...form,
        versions: !isEdit && form.version ? [{
          version: form.version,
          versionDesc: form.versionDesc,
          image: form.image || "",
          user: "Jing Wu",
          date: form.date
        }] : (form.versions || [])
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("API response not ok");

      const result = await res.json();

      // 更新應用列表：編輯時替換原資料，新增時加進列表
      setApplications((prev) =>
        isEdit
          ? prev.map((app) => (app.appId === editingItem.appId ? result : app))
          : [...prev, { ...result, versions: result.versions || [] }]
      );

      // 成功提示 + 關閉 modal
      setToast({ show: true, message: "Save application successful!", type: "success" });
      setShowModal(false);
      setEditingItem(null);
    } catch (err) {
      setToast({ show: true, message: "Failed to save application", type: "error" });
      throw err;
    }
  };

  // 儲存版本資料並加入對應的應用程式
  const handleAddVersion = (versionData) => {
    try {
      setApplications((prev) =>
        prev.map((app) => {
          if (app.appId === selectedAppForVersion.appId) {
            return {
              ...app,
              versions: [...(app.versions || []), versionData]
            };
          }
          return app;
        })
      );

      // 為了重新渲染展開的行，先收起再展開
      if (expandedAppId === selectedAppForVersion.appId) {
        setExpandedAppId(null);
        setTimeout(() => {
          setExpandedAppId(selectedAppForVersion.appId);
        }, 10);
      }

      setShowVersionModal(false);
      setSelectedAppForVersion(null);
      setToast({ show: true, message: "Save version successful!", type: "success" });
    } catch (err) {
      console.error("Error adding version:", err);
      setToast({ show: true, message: "Failed to save version", type: "error" });
    }
  };

  return (
    <div className="application-management">
      {/* 顯示提示訊息 */}
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* 頁面標題與新增按鈕 */}
      <div className="header-row">
        <h1 className="title">Application Management</h1>
        <button
          className="icon-button"
          onClick={() => {
            setEditingItem(null);
            setShowModal(true);
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          title="Add Application"
        >
          <img src={isHovered ? addIconHover : addIcon} alt="Add" />
        </button>
      </div>

      {/* 主表格區 */}
      <div className="table-container">
        <table className="app-table">
          <thead>
            <tr>
              <th>App ID</th>
              <th>App Name</th>
              <th>App Description</th>
              <th>Tags</th>
              <th>Created User</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            {applications.length > 0 ? (
              applications.map((app) => (
                <React.Fragment key={app.appId}>
                  {/* 應用程式主資料列 */}
                  <tr onClick={() => handleRowClick(app.appId)} className="clickable-row">
                    <td>{app.appId}</td>
                    <td>{app.appName}</td>
                    <td>{app.appDesc}</td>
                    <td>{app.tags}</td>
                    <td>{app.user}</td>
                    <td>{app.date}</td>
                  </tr>

                  {/* 展開後的版本資料列 */}
                  {expandedAppId === app.appId && (
                    <tr className="expanded-row">
                      <td colSpan={6}>
                        <div className="expanded-content">
                          <table className="version-table">
                            <thead>
                              <tr>
                                <th>Version</th>
                                <th>Image</th>
                                <th>Version Description</th>
                                <th>Created User</th>
                                <th>Created Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {app.versions && app.versions.length > 0 ? (
                                app.versions.map((v, i) => (
                                  <tr key={i}>
                                    <td>{v.version}</td>
                                    <td>{v.image}</td>
                                    <td>{v.versionDesc}</td>
                                    <td>{v.user}</td>
                                    <td>{v.date}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={5} style={{ textAlign: 'center' }}>
                                    No versions available
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>

                          {/* 新增版本按鈕 */}
                          <div className="add-version-row">
                            <button
                              className="add-version-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedAppForVersion(app);
                                setShowVersionModal(true);
                              }}
                            >
                              Add Version
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr className="no-data-row">
                <td colSpan={6}>No applications found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Application Modal 元件 */}
      {showModal && (
        <AddApplicationModal
          onClose={() => {
            setShowModal(false);
            setEditingItem(null);
          }}
          onSave={handleSave}
          editingItem={editingItem}
          existingAppIds={applications.map(app => app.appId)}
        />
      )}

      {/* Version Modal 元件 */}
      {showVersionModal && selectedAppForVersion && (
        <AddVersionModal
          app={selectedAppForVersion}
          onClose={() => {
            setShowVersionModal(false);
            setSelectedAppForVersion(null);
          }}
          onSave={handleAddVersion}
        />
      )}
    </div>
  );
};

export default ApplicationManagement;
