import React from 'react';
import styles from './controlCriteria.module.css';

const controlCriteria = ({ title }) => {
  return (
    <div className={styles.Container}>
      <div className={styles.title}>{title}</div>
      <div className={styles.criteriaBox}>
        <div className={styles.criteriaHeader}>Over than</div>
        <div className={styles.criteriaItem}>
          <span>temperature</span>
          <span>25℃</span>
        </div>
        <div className={styles.criteriaItem}>
          <span>humidity</span>
          <span>55%</span>
        </div>
        <div className={styles.criteriaItem}>
          <span>TVOC</span>
          <span>100</span>
        </div>
        <div className={styles.criteriaItem}>
          <span>PM2.5</span>
          <span>100</span>
        </div>
        <div className={styles.criteriaItem}>
          <span>Noise</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
};

export default controlCriteria;
