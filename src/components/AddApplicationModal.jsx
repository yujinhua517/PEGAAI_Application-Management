// 匯入 React 相關 hook 與樣式
import React, { useState, useEffect, useRef } from "react";
import "./AddApplicationModal.scss";

// 空白表單的初始值
const emptyForm = {
  appId: "",
  appName: "",
  appDesc: "",
  tags: "",
  version: "",
  versionDesc: "",
  image: ""
};

// 主元件：新增或編輯 Application 的 modal（雙步驟表單）
const AddApplicationModal = ({ onClose, onSave, editingItem, existingAppIds = [] }) => {
  const isEditMode = Boolean(editingItem); // 判斷是否為編輯模式
  const [step, setStep] = useState(1); // 控制目前是第幾步（1：Application；2：Version）
  const [form, setForm] = useState(emptyForm); // 表單資料
  const [errors, setErrors] = useState({}); // 錯誤提示
  const [editStep1Saved, setEditStep1Saved] = useState(false); // 編輯模式下是否已儲存 Step1

  // 各欄位的參考 ref，用於錯誤時自動聚焦
  const inputRefs = {
    appId: useRef(null),
    appName: useRef(null),
    appDesc: useRef(null),
    tags: useRef(null),
    version: useRef(null),
    versionDesc: useRef(null),
  };

  // 若是編輯模式，載入原有資料
  useEffect(() => {
    if (editingItem) setForm(editingItem);
  }, [editingItem]);

  // 處理欄位變動
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // 驗證 Step 1（Application）
  const validateStep1 = () => {
    const newErrors = {};
    if (!form.appId.trim()) {
      newErrors.appId = "App ID is required";
    } else if (!isEditMode && existingAppIds.includes(form.appId)) {
      newErrors.appId = "App ID already exists";
    }
    if (!form.appName.trim()) newErrors.appName = "App Name is required";
    if (!form.appDesc.trim()) newErrors.appDesc = "App Description is required";
    if (!form.tags.trim()) newErrors.tags = "Tags are required";
    setErrors(newErrors);

    // 自動聚焦第一個錯誤欄位
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      inputRefs[firstErrorField]?.current?.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  // 驗證 Step 2（Version）
  const validateStep2 = () => {
    const newErrors = {};
    if (!form.version.trim()) newErrors.version = "Version is required";
    if (!form.versionDesc.trim()) newErrors.versionDesc = "Version Description is required";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      inputRefs[firstErrorField]?.current?.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  // 格式化目前時間（dd-mm-yyyy hh-mm-ss）
  const formatDateTime = () => {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    return `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
  };

  // 下一步按鈕動作
  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  // 編輯模式下 Step1 儲存按鈕動作
  const handleSaveStep1Edit = () => {
    if (validateStep1()) {
      setEditStep1Saved(true);
    }
  };

  // 完成所有欄位後，送出表單
  const handleFinalSave = () => {
    if (!validateStep2()) return; // 若驗證沒過就中止

    const payload = {
      ...form,
      user: "Jing Wu",
      date: formatDateTime()
    };

    // 呼叫父元件的 onSave 函數
    onSave(payload);

    // 清空表單與狀態
    setForm(emptyForm);
    setStep(1);
    setEditStep1Saved(false);
    onClose();
  };

  // 決定 step1 出現哪個按鈕（Next 或 Save）
  const renderStep1Buttons = () => {
    const nextBtn = <button className="static-button" onClick={() => setStep(2)}>Next</button>;
    const saveBtn = <button className="button" onClick={handleSaveStep1Edit}>Save</button>;
    return isEditMode ? (editStep1Saved ? nextBtn : saveBtn) : (
      <button className="button" onClick={handleNext}>Next</button>
    );
  };

  // 渲染每一行欄位輸入區（含錯誤提示）
  const renderInputRow = (label, name, value, onChange, placeholder, error, readOnly = false) => (
    <>
      <div className="form-row">
        <label>{label}</label>
        <input
          ref={inputRefs[name]}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={error ? "error" : ""}
          readOnly={readOnly}
        />
      </div>
      {error && <div className="error-text">{error}</div>}
    </>
  );

  // ===== 主視覺渲染區域 =====
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>✕</button>

        {/* 頁面上的步驟指示條 */}
        <div className="step-container">
          <span className="step-label">Step {step}</span>
          <div className="step-bar">
            <div className={step >= 1 ? "step active" : "step"} />
            <div className={step >= 2 ? "step active" : "step"} />
          </div>
        </div>

        <h3>{step === 1 ? (isEditMode ? "Edit application" : "Add application") : "Add version"}</h3>
        <p className="desc">
          {step === 1
            ? (isEditMode ? "Edit application here. Click save when you're done." : "Create application here. Click next when you're done.")
            : "Create version here. Click save when you're done."}
        </p>

        {/* 表單內容區 */}
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Step 1：應用程式基本資料 */}
          {step === 1 && (
            <>
              {renderInputRow("App ID", "appId", form.appId, handleChange, "App ID", errors.appId, isEditMode)}
              {renderInputRow("App Name", "appName", form.appName, handleChange, "App Name", errors.appName)}
              {renderInputRow("App Description", "appDesc", form.appDesc, handleChange, "App Description", errors.appDesc)}
              {renderInputRow("Tags", "tags", form.tags, handleChange, "Tags", errors.tags)}
            </>
          )}

          {/* Step 2：版本資料 */}
          {step === 2 && (
            <>
              {renderInputRow("Version", "version", form.version, handleChange, "Version", errors.version)}
              
              {/* 圖片／檔案上傳 */}
              <div className="form-row">
                <label>Image</label>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf,.zip,.docx"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const allowedTypes = [
                        "image/png", "image/jpeg",
                        "application/pdf", "application/zip",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      ];
                      if (!allowedTypes.includes(file.type)) {
                        alert("Unsupported file type.");
                        return;
                      }
                      const url = URL.createObjectURL(file);
                      setForm({ ...form, image: url });
                    }
                  }}
                />
              </div>

              {/* 檔案連結預覽 */}
              {form.image && (
                <div className="file-preview">
                  <a href={form.image} target="_blank" rel="noopener noreferrer">
                    {form.image.split("/").pop()}
                  </a>
                </div>
              )}

              {renderInputRow("Version Description", "versionDesc", form.versionDesc, handleChange, "Description", errors.versionDesc)}
            </>
          )}

          {/* 按鈕列（Next / Save） */}
          <div className="modal-footer">
            {step === 1 ? renderStep1Buttons() : (
              <button type="button" className="button" onClick={handleFinalSave}>Save</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddApplicationModal;
