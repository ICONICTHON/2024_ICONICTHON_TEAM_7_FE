import React, { useState } from 'react';
import styles from './alarmBox.module.css';

function AlarmBox({ title }) {
  const [isFanOn, setIsFanOn] = useState(false);

  const toggleFan = () => {
    setIsFanOn((prevState) => !prevState);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <div className={styles.box} onClick={toggleFan}>
        <img
          src={isFanOn ? 'https://usagif.com/wp-content/uploads/2022/fzk5d/fan-gif-74-minimalistic-blue-fan.gif' : require('../../../assets/images/fanoff.jpg')}
          alt="Fan Status"
          className={styles.fanImage}
        />
        <div className={styles.statusText}>
          <span className={isFanOn ? styles.onText : styles.offText}>ON</span>
          <span className={!isFanOn ? styles.onText : styles.offText}>OFF</span>
        </div>
      </div>
    </div>
  );
}

export default AlarmBox;
