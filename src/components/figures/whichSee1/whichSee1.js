import React from 'react';
import styles from './whichSee1.module.css';

const WhichSee1 = () => {
  return (
    <div className={styles.controlLogContainer}>
      <div className={styles.logItem}>
      <span>[2024.11.14/22:24] Pan</span> <span className={styles.off}>OFF</span>
      </div>
      <div className={styles.logItem}>
      <span>[2024.11.14/20:41] Pan</span> <span className={styles.on}>ON</span>
      </div>
      <div className={styles.logItem}>
      <span>[2024.11.14/15:26] Pan</span> <span className={styles.off}>OFF</span>
      </div>
      <div className={styles.logItem}>
      <span>[2024.11.14/15:26] Pan</span> <span className={styles.off}>OFF</span>
      </div>
    </div>
  );
};

export default WhichSee1;
