import { LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import React, { useState, useEffect } from 'react';
import API from '../../../API/api';
import moment from 'moment';
import debounce from 'lodash.debounce';


const LineChartComponent = ({ width = '34vw', height = '56vh', selectedValues, classRoom, period }) => {
  const [data, setData] = useState([]);
  const [prevSelectedValues, setPrevSelectedValues] = useState(selectedValues);
  const [drawEffect, setDrawEffect] = useState({});
  const [loading, setLoading] = useState(false);

  // 디바운스를 적용하여 fetchData가 너무 자주 호출되지 않도록 함
  const fetchDataDebounced = debounce((classRoom, period) => fetchData(classRoom, period), 300);

  useEffect(() => {
    const addedLines = selectedValues.filter(value => !prevSelectedValues.includes(value));
    const removedLines = prevSelectedValues.filter(value => !selectedValues.includes(value));

    setDrawEffect(prev => ({
      ...prev,
      ...addedLines.reduce((acc, value) => ({ ...acc, [value]: true }), {}),
      ...removedLines.reduce((acc, value) => ({ ...acc, [value]: false }), {}),
    }));

    setPrevSelectedValues(selectedValues);
    fetchDataDebounced(classRoom, period);
  }, [selectedValues, classRoom, period]);

  const fetchData = async (classRoom, period) => {
    if (!classRoom || !period) return null;



    const sensorTypes = ['PM2_5MASSCONCENTRATION', 'TEMPERATURE', 'HUMIDITY', 'TVOC', 'AMBIENTNOISE'];
    setLoading(true);

    // currentTime을 fetchData 호출 시마다 최신 값으로 업데이트
    const currentTime = moment();

    let startDate, endDate;
    switch (period) {
      case '1':
        endDate = moment(); // endDate는 현재 시간
        startDate = moment().subtract(1, 'hours'); // startDate는 1시간 전
        break;
      case '24':
        endDate = moment(); // endDate는 현재 시간
        startDate = moment().subtract(1, 'days'); // startDate는 1일 전
        break;
      case '168':
        endDate = moment(); // endDate는 현재 시간
        startDate = moment().subtract(1, 'weeks'); // startDate는 1주일 전
        break;
      case '720':
        endDate = moment(); // endDate는 현재 시간
        startDate = moment().subtract(1, 'months'); // startDate는 1개월 전
        break;
      default:
        endDate = moment(); // endDate는 현재 시간
        startDate = moment().startOf('day'); // startDate는 오늘의 시작 시간
        break;
    }

    const encodedBuilding = encodeURIComponent('신공학관');
    try {
      const promises = sensorTypes.map(type => {
        const endpoint = `/api/sensorData/classroom/betweenDates?sensorTypes=${encodeURIComponent(type)}&building=${encodedBuilding}&name=${classRoom}&order=DESC&startDate=${encodeURIComponent(startDate.format('YYYY-MM-DDTHH:mm:ss'))}&endDate=${encodeURIComponent(endDate.format('YYYY-MM-DDTHH:mm:ss'))}&page=0&size=1000000000`;
        console.log('startDate:', startDate.format('YYYY-MM-DDTHH:mm:00'));
        console.log('endDate:', endDate.format('YYYY-MM-DDTHH:mm:00'));
        
        return API.get(endpoint);
      });

      const responses = await Promise.all(promises);
      const formattedData = [];
      const timestamps = responses[0]?.data.data ? responses[0].data.data.map(item => item.timestamp) : [];

      timestamps.forEach((timestamp, index) => {
        const formattedTimestamp = timestamp.replace('T', ' ');
        const dataPoint = { name: formattedTimestamp };

        responses.forEach((response, responseIndex) => {
          const sensorType = sensorTypes[responseIndex].toLowerCase();
          const value = response.data.data[index] ? response.data.data[index].value : null;
          if (sensorType === 'pm2_5massconcentration') {
            dataPoint['pm2_5'] = value;
          } else if (sensorType === 'ambientnoise') {
            dataPoint['noise'] = value;
          } else {
            dataPoint[sensorType] = value;
          }
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

 return (
    <div style={{ width, height }}>
      {loading && <div style={{marginLeft:'5%'}}>로딩 중...</div>}
      {data.length === 0 && !loading && <div style={{marginLeft:'5%'}}>기간과 강의실을 선택해주세요.</div>}
 
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="name" interval={0} axisLine={false} tickLine={false} tick={false} />
        <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
        
          {selectedValues.includes('temperature') && (
            <Line
              type="natural"
              dataKey="temperature"
              stroke="#96C0E8"
              activeDot={{ r: 8 }}
              strokeWidth={3}
              isAnimationActive={drawEffect['temperature']}
              onAnimationEnd={() => setDrawEffect(prev => ({ ...prev, temperature: false }))}
              dot={false}
            />
          )}
          {selectedValues.includes('humidity') && (
            <Line
              type="natural"
              dataKey="humidity"
              stroke="#F1B5FB"
              strokeWidth={3}
              isAnimationActive={drawEffect['humidity']}
              onAnimationEnd={() => setDrawEffect(prev => ({ ...prev, humidity: false }))}
              dot={false}
            />
          )}
          {selectedValues.includes('TVOC') && (
            <Line
              type="natural"
              dataKey="tvoc"
              stroke="#19E6A0"
              strokeWidth={3}
              isAnimationActive={drawEffect['TVOC']}
              onAnimationEnd={() => setDrawEffect(prev => ({ ...prev, TVOC: false }))}
              dot={false}
            />
          )}
          {selectedValues.includes('PM2.5') && (
            <Line
              type="natural"
              dataKey="pm2_5"
              stroke="#FFDC82"
              strokeWidth={3}
              isAnimationActive={drawEffect['PM2.5']}
              onAnimationEnd={() => setDrawEffect(prev => ({ ...prev, 'PM2.5': false }))}
              dot={false}
            />
          )}
          {selectedValues.includes('noise') && (
            <Line
              type="natural"
              dataKey="noise"
              stroke="#FF8484"
              strokeWidth={3}
              isAnimationActive={drawEffect['noise']}
              onAnimationEnd={() => setDrawEffect(prev => ({ ...prev, 'noise': false }))}
              dot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
      </div>
  );
};

export default LineChartComponent;
