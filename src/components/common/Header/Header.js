import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  const navigate = useNavigate();

  // 날짜와 시각 상태 추가
  const [dateTime, setDateTime] = useState(new Date());

  // 1초마다 시각 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  const GoToRoot = () => {
    navigate("/");
    window.location.reload();
  };

  // 날짜와 시각 포맷 함수
  const formatDateTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className={styles.all}> {/* 전체 높이 설정 */}
      <header className={styles.header}>
        <img
          src={require("../../../assets/images/logo.png")}
          alt="logo"
          className={styles.logo}
          style={{ cursor: "pointer" }}
          onClick={GoToRoot}
        />
        {/* 오른쪽 상단에 날짜와 시각 표시 */}
        <div className={styles.dateTime}>
          {formatDateTime(dateTime)}
        </div>
      </header>
      <hr className={styles.separator} />
    </div>
  );
};

export default Header;
