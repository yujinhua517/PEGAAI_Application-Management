// 引入 React 相關功能與樣式
import React, { useState } from "react";
import "./AddApplicationModal.scss"; // 共用 Modal 樣式

// === 新增版本的彈窗元件 ===
const AddVersionModal = ({ app, onClose, onSave }) => {
  // 初始化表單狀態
  const [form, setForm] = useState({
    version: "",       // 版本號
    versionDesc: "",   // 版本描述
    image: ""          // 上傳的檔案預覽連結
  });

  const [errors, setErrors] = useState({}); // 錯誤訊息儲存

  // 處理欄位輸入變化
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // 移除即時輸入錯誤提示
  };

  // 驗證輸入欄位
  const validate = () => {
    const newErrors = {};
    if (!form.version.trim()) newErrors.version = "Version is required";
    if (!form.versionDesc.trim()) newErrors.versionDesc = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // 若無錯誤則回傳 true
  };

  // 產生格式化日期時間字串
  const formatDateTime = () => {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    return `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
  };

  // 儲存按鈕的點擊處理邏輯
  const handleSubmit = () => {
    if (!validate()) return; // 驗證不通過就中止

    const payload = {
      ...form,
      user: "Jing Wu",           // 固定使用者名稱
      date: formatDateTime()     // 加入建立時間
    };

    onSave(payload); // 將結果傳給父元件
    onClose();       // 關閉 modal
  };

  // 統一欄位渲染樣式的函式
  const renderInputRow = (label, name, value, error, placeholder, onChange) => (
    <>
      <div className="form-row">
        <label>{label}</label>
        <input
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className={error ? "error" : ""}
        />
      </div>
      {error && <div className="error-text">{error}</div>}
    </>
  );

  // === 渲染區塊 ===
  return (
    <div className="modal-backdrop">
      <div className="modal">
        {/* 關閉按鈕（右上角 ✕） */}
        <button className="close-btn" onClick={onClose}>✕</button>

        {/* Modal 標題與描述 */}
        <h3>Add Version to: {app.appName}</h3>
        <p className="desc">Enter version information and click save.</p>

        {/* 表單開始 */}
        <form>
          {/* 版本號輸入 */}
          {renderInputRow("Version", "version", form.version, errors.version, "e.g., 1.0.1", handleChange)}

          {/* 圖片 / 附件上傳 */}
          <div className="form-row">
            <label>Image</label>
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.pdf,.zip"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const url = URL.createObjectURL(file); // 建立臨時預覽 URL
                  setForm({ ...form, image: url });
                }
              }}
            />
          </div>

          {/* 預覽連結顯示 */}
          {form.image && (
            <div className="file-preview">
              <a href={form.image} target="_blank" rel="noopener noreferrer">
                {form.image.split("/").pop()} {/* 顯示檔案名稱 */}
              </a>
            </div>
          )}

          {/* 版本描述輸入 */}
          {renderInputRow("Version Description", "versionDesc", form.versionDesc, errors.versionDesc, "Description", handleChange)}

          {/* 底部儲存按鈕 */}
          <div className="modal-footer">
            <button type="button" className="button" onClick={handleSubmit}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVersionModal;
