# Application Management – UI/UX + React 前端作業

本專案為一個應用程式與版本管理系統的前端作業，整合 UI/UX 設計（Figma）與 React 前端實作，旨在優化使用者在建立 Application 與 Version 流程上的體驗。

## 🔗 GitHub Repository
https://github.com/yujinhua517/PEGAAI_Application-Management

---

## 🧩 專案功能說明

- 支援 Application 新增、編輯
- 支援多版本 Version 新增（含動態展開動畫）
- 使用雙步驟 Modal 表單（Step 1：Application / Step 2：Version）
- 提供錯誤提示、欄位驗證與 Toast 提示訊息
- 採用深色系 UI 設計，整合 icon 與 hover 動畫
- 使用 SCSS 實作模組化樣式

---

## 🎨 UI/UX 設計（Figma）

設計重點：
- 針對使用者建立 Application 時流程斷點進行優化
- 將 Application / Version 建立操作整合為分步驟引導
- 簡化操作流程並強化欄位引導與互動回饋（如 Toast）

🔗 [Figma 設計連結](https://www.figma.com/design/RfmXN1YsYfF9RpRxmrd1Gr/PEGAAI?node-id=185-1414&t=h56qVDN5MqQApOCX-1)

---


## ⚙️ 安裝與執行方式

```bash
git clone https://github.com/yujinhua517/PEGAAI_Application-Management.git
cd application-ui
npm install
npm start
npm run server

🔗 執行位置說明：
React 前端頁面：
👉 http://localhost:3000

mock API 伺服器（使用 json-server）：
👉 http://localhost:3001/applications