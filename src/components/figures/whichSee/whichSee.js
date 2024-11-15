import React, { useEffect, useState } from 'react';
import styles from './whichSee.module.css';

const WhichSee = ({ selectedClassroom }) => {
  const [logData, setLogData] = useState({
    time: "",
    airConditioner: "OFF",
    ventilator: "OFF",
    airCleaner: "OFF",
  });

  const fetchData = async () => {
    try {
      const response = await fetch('https://donggukseoul.com/api/control/classroom-status');
      const data = await response.json();

      const classroomData = data.find(item => item.classroom === Number(selectedClassroom));
      if (classroomData) {
        const { time, abnormalValues } = classroomData;

        // API에서 받은 시간을 기반으로 1시간 추가, 로컬 시간으로 변환하여 출력
        const currentTime = new Date(time);
        currentTime.setHours(currentTime.getHours() + 1);

        // 로컬 시간 포맷 설정
        const adjustedTime = currentTime.toLocaleString("ko-KR", {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });

        const airConditionerStatus = abnormalValues.includes("온도") || abnormalValues.includes("습도") ? "ON" : "OFF";
        const ventilatorStatus = abnormalValues.includes("PM2.5") || abnormalValues.includes("TVOC") ? "ON" : "OFF";
        const airCleanerStatus = abnormalValues.includes("PM2.5") || abnormalValues.includes("TVOC") ? "ON" : "OFF";

        setLogData({
          time: adjustedTime,
          airConditioner: airConditionerStatus,
          ventilator: ventilatorStatus,
          airCleaner: airCleanerStatus,
        });
      }
    } catch (error) {
      console.error("Failed to fetch classroom status:", error);
    }
  };

  useEffect(() => {
    if (selectedClassroom) {
      fetchData();
    }
  }, [selectedClassroom]);

  return (
    <div className={styles.controlLogContainer}>
      <div className={styles.logTimestamp}>At {logData.time}</div>
      <div className={styles.logItem}>
        <span>Air conditioner</span> <span className={logData.airConditioner === "ON" ? styles.on : styles.off}>{logData.airConditioner}</span>
      </div>
      <div className={styles.logItem}>
        <span>Ventilator</span> <span className={logData.ventilator === "ON" ? styles.on : styles.off}>{logData.ventilator}</span>
      </div>
      <div className={styles.logItem}>
        <span>Air cleaner</span> <span className={logData.airCleaner === "ON" ? styles.on : styles.off}>{logData.airCleaner}</span>
      </div>
    </div>
  );
};

export default WhichSee;
