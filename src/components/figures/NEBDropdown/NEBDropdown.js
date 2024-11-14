import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import styles from './NEBDropdown.module.css';

const CustomDropdown = ({ onSelect, borderColor = '#A5A5A5', borderWidth = '1px', width = '100%', defaultValue }) => {
  const [options, setOptions] = useState([
    { value: 3115, label: '3115' },
    { value: 3173, label: '3173' },
    { value: 4147, label: '4147' },
    { value: 5145, label: '5145' },
    { value: 5147, label: '5147' },
    { value: 6119, label: '6119' },
    { value: 6144, label: '6144' },
  ]);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: width,
      borderRadius: '10px',
      borderColor: borderColor,
      borderWidth: borderWidth,
      borderStyle: 'solid',
      fontSize: 'clamp(10px, 1.6vw, 32px)',
      fontWeight: 'bold',
      textAlign: 'center',
      margin: '0',
      padding: '0',
    }),
    placeholder: (provided) => ({
      ...provided,
      fontWeight: 'normal',
      fontSize: 'clamp(5px, 0.8vw, 24px)',
      color: '#999'
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: 'clamp(10px, 1.6vw, 32px)',
      textAlign: 'center'
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '10px',
      fontWeight: 'bold',
      borderColor: borderColor,
      borderWidth: borderWidth,
      borderStyle: 'solid'
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      paddingRight: '8px',
      paddingLeft: 0,
      fontSize: 'clamp(5px, 1.4vw, 32px)',
      svg: {
        width: 'clamp(5px, 1.4vw, 32px)',
        height: 'clamp(5px, 1.4vw, 32px)'
      }
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
  };

  // defaultValue에 해당하는 옵션을 찾기
  const selectedOption = options.find(option => option.value === Number(defaultValue));

  return (
    <Select 
      options={options}
      onChange={option => onSelect(option.value)}  // 선택된 강의실 값만 전달
      styles={customStyles}
      placeholder={<span className={styles.customPlaceholder}>강의실 선택</span>}
      className={styles.NEBDropdown}
      classNamePrefix="custom-select"
      defaultValue={selectedOption}  // 초기 선택값 설정
    />
  );
};

export default CustomDropdown;
