import React, { useState } from 'react';
import styles from './ControlBox.module.css';
import ToggleButton from '../ControlBox.js/ToggleButton/ToggleButton';
import { IoMdSettings } from "react-icons/io";

function ControlBox({ color }) {
  // 여러 개의 ToggleButton 상태를 배열로 관리
  const [toggleStates, setToggleStates] = useState([false, false, false]);

  // 각 ToggleButton에 대한 이름을 배열로 저장
  const deviceNames = ['Air conditioner', 'Ventilator', 'Air cleaner'];

  // Toggle 상태가 변경될 때 호출되는 함수
  const handleToggleChange = (index, newState) => {
    // 상태 배열을 복사하여 변경
    const updatedStates = [...toggleStates];
    updatedStates[index] = newState;
    setToggleStates(updatedStates);
    console.log(`Toggle ${index} state changed:`, newState);
  };

  return (
    <div className={styles.box} style={{ border: '1.5px solid'+ color }} >
      <div className={styles.top}>
        <IoMdSettings className={styles.topImg} style={{ color: color }} /> {/* color 속성 직접 적용 */}
      </div>

      <div className={styles.table}>
        {toggleStates.map((state, index) => (
          <div key={index} className={styles.tableRow}>
            {deviceNames[index]} 

            <div className={`${styles.tableCell} `}>
              <ToggleButton
                isToggled={state}
                onToggleChange={(newState) => handleToggleChange(index, newState)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ControlBox;
