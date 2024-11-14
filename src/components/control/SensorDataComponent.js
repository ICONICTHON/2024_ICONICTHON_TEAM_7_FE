import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';

function SensorDataComponent() {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // MQTT 클라이언트 설정
    const client = mqtt.connect('mqtt://donggukseoul.com:1883');

    // 연결 성공 시 실행
    client.on('connect', () => {
      console.log('MQTT 연결 성공');
      // 토픽 구독
      client.subscribe('sensor/data', (err) => {
        if (!err) {
          console.log('sensor/data 토픽 구독 성공');
        } else {
          console.error('토픽 구독 실패:', err);
        }
      });
    });

    // 메시지 수신 시 실행
    client.on('message', (topic, message) => {
      if (topic === 'sensor/data') {
        setMessage(message.toString());
      }
    });

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      client.end();
    };
  }, []);

  return (
    <div>
      <h1>Sensor Data</h1>
      <p>Received Message: {message}</p>
    </div>
  );
}

export default SensorDataComponent;
