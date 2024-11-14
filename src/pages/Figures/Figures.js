// Figures.js

import React, { useState, useContext, useEffect } from 'react';
import Header from '../../components/common/Header/Header';

import NEBDropdown from '../../components/figures/NEBDropdown/NEBDropdown';
import PeriodDropdown from '../../components/figures/periodDropdown/periodDropdown';
import WhatCheckBoxes from '../../components/figures/whatSelectBox/WhatRadioButtons';
import TopBox from '../../components/figures/TopBox/TopBox';
import styles from '../Figures/figures.module.css';
import LineChart from '../../components/figures/charts/lineChart';
import ControlBox from '../../components/figures/ControlBox.js/ControlBox';
import AlarmScrollBox from '../../components/figures/alarmScrollBox/alarmScrollBox';
import { SensorDataContext } from '../../API/SensorDataContext';

const buildingName = "신공학관";

function Figures() {
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedFavorited, setSelectedFavorited] = useState(false); // favorited 상태 추가
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedValues, setSelectedValues] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(null);

  const { data: sensorData, setSelectedSensorName, loading, error } = useContext(SensorDataContext);

  useEffect(() => {
    if (selectedOption) {
      setSelectedSensorName(selectedOption);
    }
  }, [selectedOption, setSelectedSensorName]);

  const handleNEBSelect = (value, favorited) => {
    setSelectedOption(value);
    setSelectedFavorited(favorited); // favorited 값 업데이트
  };

  const handlePeriodSelect = (value) => setSelectedValue(value);
  const handleCheckboxSelect = (values, index) => {
    setSelectedValues(values);
    setHighlightedIndex(index);
  };

  return (
    <div className={styles.fullScreenContainer}>
      <Header />
      <div className={styles.mainContent}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.currentRoom}>
              <div className={styles.titleTop}>
                <div style={{paddingRight: '0.1vw'}}>현재 강의실</div>
              </div>
              <div className={styles.title}>
                <img
                  src={require('../../assets/images/building_icon.png')}
                  alt="building"
                  className={styles.titleImg}
                />
                <div>{buildingName}</div>
              </div>
              <NEBDropdown onSelect={handleNEBSelect} />
                </div>
            <TopBox image="tempIcon.png" value={loading ? '--' : sensorData.Temperature?.value} unit="℃" name="temp" />
            <TopBox image="humidIcon.png" value={loading ? '--' : sensorData.Humidity?.value} unit="%" name="humidity" />
            <TopBox image="TVOCIcon.png" value={loading ? '--' : sensorData.TVOC?.value} unit="㎍/m³" name="TVOC" />
            <TopBox image="PM25Icon.png" value={loading ? '--' : sensorData.PM2_5MassConcentration?.value} unit="㎍/m³" name="PM2.5" />
          </div>
          <div className={styles.bottom}>
            <div className={styles.leftContainer}>
              <div className={styles.leftBox}>
                <div className={styles.select}>
                  <div style={{ width: '100%' }}>
                    <PeriodDropdown height='clamp(10px, 5vw, 56px)' onSelect={handlePeriodSelect} />
                  </div>

                  <div style={{ width: '100%' }}>
                    <WhatCheckBoxes
                      selectedValues={selectedValues}
                      onSelect={handleCheckboxSelect}
                      borderColor="#A5A5A5"
                      borderWidth="2px"
                    />
                  </div>
                </div>

                <hr className={styles.verticalLine} />
                <LineChart width='100%' selectedValues={selectedValues} highlightedIndex={highlightedIndex} classRoom={selectedOption} period={selectedValue} />
              </div>
            </div>
            <div className={styles.rightContainer}>
              <AlarmScrollBox title="alarms" classRoom={selectedOption}/>
              <AlarmScrollBox title="significant" />
              <ControlBox title="facility control" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Figures;
