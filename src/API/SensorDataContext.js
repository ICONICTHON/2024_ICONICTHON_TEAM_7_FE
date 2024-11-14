import React, { createContext, useState, useEffect } from 'react';
import API from '../API/api';

// Context 생성
export const SensorDataContext = createContext();

export const SensorDataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSensorName, setSelectedSensorName] = useState(''); // 초기값 빈 문자열로 설정
  const [selectedBuilding, setSelectedBuilding] = useState('신공학관'); // 초기 빌딩값을 '신공학관'으로 설정

  // 데이터를 초기화하는 함수
  const resetSensorData = () => {
    setData([]); // 데이터를 빈 배열로 초기화
  };

  const fetchData = async (name, building) => {
    if (!name || !building) return null;

    // building과 name을 쿼리 파라미터로 추가하여 endpoint 구성
    const endpoint = `/api/sensorData/recent/classroom?building=` + encodeURIComponent(building) + `&name=` + encodeURIComponent(name);
    setLoading(true);

    try {
      const response = await API.get(endpoint);
      setData(response.data); // 센서 데이터를 설정
      console.log("응답 데이터:", response.data);
    } catch (e) {
      console.error("API 오류: ", e);
      setData([]); // API 오류 발생 시 데이터 초기화
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSensorName && selectedBuilding) {
      fetchData(selectedSensorName, selectedBuilding);
    }

    const intervalId = setInterval(() => {
      if (selectedSensorName && selectedBuilding) {
        fetchData(selectedSensorName, selectedBuilding);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [selectedSensorName, selectedBuilding]);

  useEffect(() => {
    if (!children) {
      resetSensorData(); // children이 없을 경우 데이터 초기화
    }
  }, [children]); // children이 변경될 때마다 호출

  return (
    <SensorDataContext.Provider value={{ data, setSelectedSensorName, setSelectedBuilding, loading, resetSensorData }}>
      {children}
    </SensorDataContext.Provider>
  );
};
