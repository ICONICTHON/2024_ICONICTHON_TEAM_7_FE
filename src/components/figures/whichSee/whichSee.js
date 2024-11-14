import React from 'react';
import styles from './whichSee.module.css';

const WhichSee = () => {
  return (
    <div className={styles.controlLogContainer}>
      <div className={styles.logTimestamp}>At 2024.12.23 13:59:23</div>
      <div className={styles.logItem}>
        <span>Air conditioner</span> <span className={styles.on}>ON</span>
      </div>
      <div className={styles.logItem}>
        <span>Ventilator</span> <span className={styles.off}>OFF</span>
      </div>
      <div className={styles.logItem}>
        <span>Air cleaner</span> <span className={styles.off}>OFF</span>
      </div>
    </div>
  );
};

export default WhichSee;
