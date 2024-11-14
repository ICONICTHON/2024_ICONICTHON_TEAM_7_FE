import React from 'react';
import styles from './TopBox.module.css';

function NEBDropdown({ image, value, unit, name }) {
  return (
    <div className={styles.container}>
        <div className={styles.box}>
            {/*<div className={styles.dot3}>...</div>*/}
            <div className={styles.inline}>
                <div className={styles.IconCircle}>
                    <img
                    src={require(`../../../assets/images/TopIcons/`+image)}
                    alt="building"
                    className={styles.IconImg}
                    />
                </div>
                <div className={styles.text}>
                    <div style={{display:'flex'}}>
                        {value}
                        <div className={styles.unit}>{unit}</div>
                    </div>
                    <div className={styles.name}>{name}</div>
                </div>
            </div>        
        {/*<div className={styles.dot3}>...</div>*/}
        </div>
    </div>
  );
}

export default NEBDropdown;
