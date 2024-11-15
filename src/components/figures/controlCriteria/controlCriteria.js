import React from 'react';
import styles from './controlCriteria.module.css';

const controlCriteria = ({ title }) => {
  return (
    <div className={styles.Container}>
      <div className={styles.title}>{title}</div>
      <div className={styles.criteriaBox}>
        <div style={{width:'100%'}}>
        <div className={styles.criteriaHeader}>Over than</div>
        <div className={styles.criteriaItem}>
          <span>temperature</span>
          <span>25℃</span>
        </div>
        <div className={styles.criteriaItem}>
          <span>humidity</span>
          <span>30% 이하, 70% 이상</span>
        </div>
        <div className={styles.criteriaItem}>
          <span>TVOC</span>
          <span>1000㎍/m³</span>
        </div>
        <div className={styles.criteriaItem}>
          <span>PM2.5</span>
          <span>41㎍/m³</span>
        </div>
        <div className={styles.criteriaItem}>
          <span>Noise</span>
          <span>60db</span>
        </div>
        </div>
      </div>
    </div>
  );
};

export default controlCriteria;
