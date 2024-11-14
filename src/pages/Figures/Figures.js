import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header/Header';
import NEBDropdown from '../../components/figures/NEBDropdown/NEBDropdown';
import PeriodDropdown from '../../components/figures/periodDropdown/periodDropdown';
import WhatCheckBoxes from '../../components/figures/whatSelectBox/WhatRadioButtons';
import TopBox from '../../components/figures/TopBox/TopBox';
import LineChart from '../../components/figures/charts/lineChart';
import WhichSee from '../../components/figures/whichSee/whichSee';
import WhichSee1 from '../../components/figures/whichSee1/whichSee1';
import AlarmBox from '../../components/figures/alarmlBox/alarmBox';
import ControlCriteria from '../../components/figures/controlCriteria/controlCriteria';
import { SensorDataContext } from '../../API/SensorDataContext';
import styles from '../Figures/figures.module.css';

const buildingName = "신공학관";

function Figures() {
  const { roomNumber } = useParams();  // URL에서 roomNumber 파라미터를 받아옴
  const navigate = useNavigate();  // useNavigate 훅 사용
  const [selectedOption, setSelectedOption] = useState(roomNumber || '');  // 초기값으로 roomNumber 설정
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedValues, setSelectedValues] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [activeComponent, setActiveComponent] = useState('nextControl');

  const { data: sensorData, setSelectedSensorName, loading } = useContext(SensorDataContext);

  useEffect(() => {
    if (selectedOption) {
      setSelectedSensorName(selectedOption);
      navigate(`/figures/${selectedOption}`);  // URL을 선택된 강의실 번호로 변경
    }
  }, [selectedOption, setSelectedSensorName, navigate]);

  const handleNEBSelect = (value) => {
    setSelectedOption(value);
    navigate(`/figures/${value}`);  // 선택된 강의실 번호로 URL 변경
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
              <div className={styles.titleTop}>현재 강의실</div>
              <div className={styles.title}>
                <img
                  src={require('../../assets/images/building.png')}
                  alt="building"
                  className={styles.titleImg}
                />
               <div style={{ fontSize: '25px' }}>{buildingName}</div>
              </div>
              <NEBDropdown onSelect={handleNEBSelect} defaultValue={selectedOption} />
            </div>
            <TopBox image="tempIcon.png" value={loading ? '--' : sensorData.Temperature?.value} unit="℃" name="temperature" />
            <TopBox image="humidIcon.png" value={loading ? '--' : sensorData.Humidity?.value} unit="%" name="humidity" />
            <TopBox image="TVOCIcon.png" value={loading ? '--' : sensorData.TVOC?.value} unit="㎍/m³" name="TVOC" />
            <TopBox image="PM25Icon.png" value={loading ? '--' : sensorData.PM2_5MassConcentration?.value} unit="㎍/m³" name="PM2.5" />
            <TopBox image="noise.png" value={loading ? '--' : sensorData.AmbientNoise?.value} unit="db" name="noise" />
          </div>
          <div className={styles.bottom}>
            <div className={styles.leftContainer}>
              <div className={styles.leftBox}>
                <div className={styles.select}>
                  period
                  <PeriodDropdown height='clamp(10px, 5vw, 56px)' onSelect={handlePeriodSelect} />
                  what
                  <WhatCheckBoxes
                    selectedValues={selectedValues}
                    onSelect={handleCheckboxSelect}
                    borderColor="#7DBD73"
                    borderWidth="2px"
                  />
                </div>
                <hr className={styles.verticalLine} />
                <LineChart width='100%' selectedValues={selectedValues} highlightedIndex={highlightedIndex} classRoom={selectedOption} period={selectedValue} />
              </div>
            </div>
            <div className={styles.rightContainer}>
              <AlarmBox title="Status" />
              <ControlCriteria title="Control Criteria" />
              <div className={styles.toggleContainer}>
                <div className={styles.toggleTitles}>
                  <span
                    className={`${styles.toggleTitle} ${activeComponent === 'nextControl' ? styles.activeTitle : ''}`}
                    onClick={() => setActiveComponent('nextControl')}
                  >
                    Next Expected Control
                  </span>
                  <span
                    className={`${styles.toggleTitle} ${activeComponent === 'controlLog' ? styles.activeTitle : ''}`}
                    onClick={() => setActiveComponent('controlLog')}
                  >
                    Controlled Log
                  </span>
                </div>
                <div className={styles.logBox}>
                  {activeComponent === 'nextControl' ? <WhichSee /> : <WhichSee1 />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Figures;
