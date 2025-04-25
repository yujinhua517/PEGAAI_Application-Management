// 匯入 React
import React from "react";

// 匯入樣式檔
import "./Navbar.scss";

// 匯入圖示資源
import userIcon from '../assets/person.svg';
import earthIcon from '../assets/earth.svg';

// Navbar 元件定義
const Navbar = () => {
  return (
    <header className="navbar">
      {/* === 頂部工具列區 === */}
      <div className="top-bar">
        <div className="logo">LOGO</div> {/* 左側 Logo 區塊 */}

        {/* 右側圖示區 */}
        <div className="icons">
          {/* ✅ 新增的語言圖示（earth.svg） */}
          <img src={earthIcon} alt="Language" className="icon-img" />

          {/* 使用者圖示 */}
          <img src={userIcon} alt="User" className="user-icon" />
        </div>
      </div>

      {/* === 導覽列區塊（nav menu）=== */}
      <nav className="nav-links">
        {[
          "User", "Auth", "Email", "Virtual Factory",
          "Common", "Session", "Usage Stats", "Application"
        ].map((item) => (
          <a
            key={item}
            href="#"
            className={`nav-item ${item === "Application" ? "active" : ""}`} // "Application" 被預設為高亮狀態
          >
            {item}
          </a>
        ))}
      </nav>
    </header>
  );
};

export default Navbar;
