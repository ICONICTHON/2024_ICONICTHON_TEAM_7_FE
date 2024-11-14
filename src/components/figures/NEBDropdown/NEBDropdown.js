// NEBDropdown.js

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import styles from './NEBDropdown.module.css';
import API from '../../../API/api';

const CustomDropdown = ({ onSelect, borderColor = '#A5A5A5', borderWidth = '1px', width = '100%' }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {      
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      const encodedBuilding = encodeURIComponent('신공학관');
      try {
        const endpoint = `/api/classrooms/myFavorites?building=${encodedBuilding}&favoriteFirst=false&orderDirection=asc`;
        const responses = await API.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });  

        const formattedData = responses.data
          .filter(room => room.sensorType === 'Air')
          .map(room => ({
            value: room.name,
            label: room.name,
            favorited: room.favorited
          }));

        setOptions(formattedData);
      } catch (e) {
        console.error("API 오류: ", e);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  return (
    <Select 
      options={options}
      onChange={option => onSelect(option.value, option.favorited)}  // 선택된 강의실과 favorited 값 함께 전달
      styles={customStyles}
      placeholder={<span className={styles.customPlaceholder}>강의실 선택</span>}
      className={styles.NEBDropdown}
      classNamePrefix="custom-select"
      isLoading={loading}
    />
  );
};

export default CustomDropdown;
