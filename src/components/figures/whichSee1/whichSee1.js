import React from 'react';
import styles from './whichSee1.module.css';

const WhichSee1 = () => {
  return (
    <div className={styles.controlLogContainer}>
      <div className={styles.logItem}>
      <span>[2024.11.15/11:50] Pan</span> <span className={styles.off}>OFF</span>
      </div>
      <div className={styles.logItem}>
      <span>[2024.11.15/11:41] Pan</span> <span className={styles.on}>ON</span>
      </div>
      <div className={styles.logItem}>
      <span>[2024.11.15/10:42] Pan</span> <span className={styles.off}>OFF</span>
      </div>
      <div className={styles.logItem}>
      <span>[2024.11.15/10:26] Pan</span> <span className={styles.off}>ON</span>
      </div>
    </div>
  );
};

export default WhichSee1;
