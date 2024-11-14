import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import API from '../../../API/api';
import moment from 'moment';
import debounce from 'lodash.debounce';

// currentTime을 fetchData 호출 시마다 최신 값으로 업데이트
const currentTime = moment();

const LineChartComponent = ({ selectedAttribute, classroomA, classroomB, width, height, period }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log(period);
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
  // Debounced fetch function to avoid unnecessary API calls
  const fetchDataDebounced = debounce(async () => {



    setLoading(true);
    try {
      const endpoint1 = `/api/sensorData/classroom/betweenDates?sensorTypes=${encodeURIComponent(selectedAttribute)}&building=신공학관&name=${classroomA}&order=DESC&startDate=${encodeURIComponent(startDate.format('YYYY-MM-DDTHH:mm:ss'))}&endDate=${encodeURIComponent(endDate.format('YYYY-MM-DDTHH:mm:ss'))}&page=0&size=1000000000`;
      const endpoint2 = `/api/sensorData/classroom/betweenDates?sensorTypes=${encodeURIComponent(selectedAttribute)}&building=신공학관&name=${classroomB}&order=DESC&startDate=${encodeURIComponent(startDate.format('YYYY-MM-DDTHH:mm:ss'))}&endDate=${encodeURIComponent(endDate.format('YYYY-MM-DDTHH:mm:ss'))}&page=0&size=1000000000`;

      const [response1, response2] = await Promise.all([API.get(endpoint1), API.get(endpoint2)]);

      const timestamps = response1.data.data.map(item => item.timestamp);
      const formattedData = timestamps.map((timestamp, index) => {
        const formattedTimestamp = timestamp.replace('T', ' ');
        return {
          name: formattedTimestamp,
          [selectedAttribute + 'A']: response1.data.data[index]?.value || null,
          [selectedAttribute + 'B']: response2.data.data[index]?.value || null,
        };
      });

      setData(formattedData.reverse());
    } catch (e) {
      console.error("API 오류: ", e);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, 500); // Debounced with a delay of 500ms

  useEffect(() => {
    fetchDataDebounced();
    return () => {
      fetchDataDebounced.cancel(); // Cancel the debounced function when the component unmounts or dependencies change
    };
  }, [classroomA, classroomB, period, selectedAttribute]);  // 모든 의존성 추가

  return (
    <div style={{ width: width, height: height }}>
      {loading && <div style={{ marginLeft: '5%' }}>로딩 중...</div>}
      {data.length === 0 && !loading && <div style={{ fontSize: '16px', marginLeft: '5%' }}>기간과 강의실을 선택해주세요.</div>}

      <ResponsiveContainer width="100%" height="95%">
        <LineChart data={data} margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" interval={0} axisLine={false} tickLine={false} tick={false} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: '1.6vw' }} />

          <Line
            type="natural"
            dataKey={selectedAttribute + 'A'}
            stroke="#82ca9d"
            strokeWidth={3}
            name={`${classroomA} `}
            dot={false}
          />
          <Line
            type="natural"
            dataKey={selectedAttribute + 'B'}
            stroke="#1A9AFB"
            strokeWidth={3}
            name={`${classroomB} `}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
