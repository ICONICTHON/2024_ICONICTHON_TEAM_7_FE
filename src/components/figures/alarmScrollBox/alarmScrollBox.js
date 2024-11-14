import React, { useState, useEffect } from 'react';
import styles from './alarmScrollBox.module.css'; // CSS 모듈 import
import API from '../../../API/api';
import moment from 'moment';
import debounce from 'lodash.debounce';

const AlarmScrollBox = ({ title, classRoom }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const sensorTypes = ['PM2_5MassConcentration', 'AmbientNoise', 'Temperature', "Humidity", "TVOC"];

  const fetchData = async (classRoom) => {
    if (!classRoom) return;
    setLoading(true);

    const currentTime = moment();
    let endDate = currentTime;
    let startDate = currentTime.clone().subtract(1, 'days');

    const encodedBuilding = encodeURIComponent('신공학관');
    const endpoint = `/api/sensorData/classroom/betweenDates?sensorTypes=ALL&building=${encodedBuilding}&name=${classRoom}&order=ASC&startDate=${encodeURIComponent(startDate.format('YYYY-MM-DDTHH:mm:ss'))}&endDate=${encodeURIComponent(endDate.format('YYYY-MM-DDTHH:mm:ss'))}&page=0&size=1000000000`;

    try {
      const response = await API.get(endpoint);
      const formattedData = [];

      const timestamps = response.data.data ? response.data.data.map(item => item.timestamp) : [];

      timestamps.forEach((timestamp) => {
        const formattedTimestamp = timestamp.replace('T', ' ');
        const dataPoint = { name: formattedTimestamp };

        sensorTypes.forEach((sensorType) => {
          const sensorData = response.data.data.find(item => item.sensorType === sensorType && item.timestamp === timestamp);
          dataPoint[sensorType.toLowerCase()] = sensorData ? sensorData.value : 'N/A';
        });

        formattedData.push(dataPoint);
      });

      setData(formattedData.reverse());
    } catch (e) {
      console.error("API 오류: ", e);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataDebounced = debounce(fetchData, 300);

  useEffect(() => {
    fetchDataDebounced(classRoom);
  }, [classRoom]);

  const getColorByRange = (type, value) => {
    if (type === 'temperature') {
      if (value < 16.5 || value > 27.5) return 'red';
      if ((16.5 <= value && value < 17.6) || (26.4 < value && value <= 27.5)) return 'orange';
      if ((17.6 <= value && value < 18.7) || (25.3 < value && value <= 26.4)) return 'yellow';
    } else if (type === 'humidity') {
      if (value < 10 || value > 90) return 'red';
      if ((10 <= value && value < 20) || (80 < value && value <= 90)) return 'orange';
      if ((20 <= value && value < 30) || (70 < value && value <= 80)) return 'yellow';
    } else if (type === 'tvoc') {
      if (value > 10000) return 'red';
      if (3000 < value && value <= 10000) return 'orange';
      if (1000 < value && value <= 3000) return 'yellow';
    } else if (type === 'pm2_5massconcentration') {
      if (value > 64) return 'red';
      if (53 < value && value <= 64) return 'orange';
      if (41 < value && value <= 53) return 'yellow';
    } else if (type === 'ambientnoise') {
      if (value > 80) return 'red';
      if (70 < value && value <= 80) return 'orange';
      if (60 < value && value <= 70) return 'yellow';
    }
    return null;
  };

  const formatMessage = (item) => {
    const pm25 = item.pm2_5massconcentration !== 'N/A' && getColorByRange('pm2_5massconcentration', item.pm2_5massconcentration) ? `PM2.5 ${item.pm2_5massconcentration}㎍/m³ 수치 이상\n` : '';
    const noise = item.ambientnoise !== 'N/A' && getColorByRange('ambientnoise', item.ambientnoise) ? `소음 ${item.ambientnoise}dB 수치 이상\n` : '';
    const temperature = item.temperature !== 'N/A' && getColorByRange('temperature', item.temperature) ? `온도 ${item.temperature}℃ 수치 이상\n` : '';
    const humidity = item.humidity !== 'N/A' && getColorByRange('humidity', item.humidity) ? `습도 ${item.humidity}% 수치 이상\n` : '';
    const tvoc = item.tvoc !== 'N/A' && getColorByRange('tvoc', item.tvoc) ? `TVOC ${item.tvoc}㎍/m³ 수치 이상\n` : '';
  
    // 모든 값이 없으면 null 반환
    if (!pm25 && !noise && !temperature && !humidity && !tvoc) {
      return null;
    }
  
    // 항목이 있는 경우에만 메시지 생성
    const message = `[${item.name}]\n${pm25}${noise}${temperature}${humidity}${tvoc}`;
    return message.trim(); // 메시지가 비어 있으면 null 반환
  };
  

  return (
    <div className={styles.Container}>
      <div style={{ marginLeft: '5%' }}>{title}</div>
      <div className={styles.scrollableContainer}>
        {loading ? (
          <div>Loading...</div>
        ) : (
          data.map((item, index) => {
            const message = formatMessage(item);
            return message ? (
              <div key={index}>
                {message.split("\n").map((line, i) => (
                  <span key={i}>{line}<br /></span>

                ))} <br/>
              </div>
            ) : null;
          })
        )}
      </div>
    </div>
  );
};

export default AlarmScrollBox;
