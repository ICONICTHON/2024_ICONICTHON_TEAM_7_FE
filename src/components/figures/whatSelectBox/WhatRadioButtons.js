import React from 'react';
import styles from './WhatRadioButtons.module.css';

const options = [
  { value: 'temperature', label: '온도' },
  { value: 'humidity', label: '습도' },
  { value: 'TVOC', label: 'TVOC' },
  { value: 'PM2.5', label: 'PM2_5' }, // 여기에서 value 수정
  { value: 'noise', label: '소음' },
];

const colors = [
  '#96C0E8', // 온도
  '#F1B5FB', // 습도
  '#19E6A0', // TVOC
  '#FFDC82', // PM 2.5
  '#FF8484'  // 소음
];

const WhatCheckBoxes = ({ selectedValues, onSelect, borderColor = '#A5A5A5', borderWidth = '1px', width = '100%' }) => {
  const handleChange = (value, index) => {
    if (selectedValues.includes(value)) {
      onSelect(selectedValues.filter(v => v !== value), null); // 인덱스는 null로 설정
    } else {
      onSelect([...selectedValues, value], index); // 새로 선택된 항목의 인덱스를 전달
    }
  };

  return (
    <div 
      className={styles.checkboxGroup} 
      style={{ borderColor, borderWidth }} // width 추가
    >
      {options.map((option, index) => (
        <label 
          key={option.value} 
          className={styles.checkboxLabel} 
          style={{ '--checkbox-color': colors[index] }} // CSS 변수 설정
        >
          <input
            type="checkbox"
            name="attribute"
            value={option.value}
            checked={selectedValues.includes(option.value)}
            onChange={() => handleChange(option.value, index)} // 인덱스 추가
            className={styles.checkboxInput}
          />
          <span className={styles.checkboxText}>{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default WhatCheckBoxes;
