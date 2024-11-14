/*Main.js*/
import React, { useState, useEffect, useRef, useContext } from "react";
import Header from "../../components/common/Header/Header";
import styles from "../main/main.module.css";
import { fetchForeCast, fetchForeCast2 } from "../forecast";
import { SensorDataContext } from "../../API/SensorDataContext";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../API/api";
import buildingIcon from "../../assets/images/building_icon.png";
import singongImage from "../../assets/images/singong.png";


function Main() {
  const [popupContent, setPopupContent] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState("신공학관");
 
  const [dateTime, setDateTime] = useState(new Date());
  const [forecast, setForecast] = useState(null);
  const [forecast2, setForecast2] = useState(null);
  const [loadingdata, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleBuildingClick = (building, buildingInfo) => {
    if (building == "신공학관") {
    
      setTimeout(() => {
        setSelectedBuilding(building);
       
      }, 1000);
    }
    setPopupContent(buildingInfo);
  };
  const closePopup = () => {
    setPopupContent(null);
    setSelectedBuilding(null);
  };
  // 날씨 안내 멘트 생성 함수
  const getWeatherAdvice = () => {
    if (!forecast || !forecast2) {
      return "날씨 데이터를 불러오는 중입니다.";
    }
    if (forecast.rain === "1") {
      return "오늘은 하루 종일 비가 예상됩니다\n외출 시 우산을 챙기세요";
    } else if (forecast.rain === "3") {
      return "눈이 오는 날입니다\n외출 시 따뜻하게 입으세요";
    } else if (forecast.rain === "2") {
      return "오늘은 비와 눈이 섞여 내릴 수 있습니다\n미끄럼에 주의하세요";
    } else if (forecast.cloudy === "1") {
      return "맑은 날씨입니다\n야외 활동을 즐기기 좋은 날이에요!";
    } else if (forecast.cloudy === "3") {
      return "햇살이 구름 사이로 드문드문 비추고 있어요\n산책이나 가벼운 야외 활동을 즐겨보세요!";
    } else if (forecast.cloudy === "4") {
      return "흐린 날씨입니다\n실내 활동을 계획해보세요";
    } else if (forecast.humidity < 30) {
      return "건조한 날씨입니다\n수분 보충에 유의하세요";
    } else if (forecast2.maxTemp >= 30) {
      return "무더운 날씨가 예상됩니다\n시원한 곳에서 휴식을 취하세요";
    } else if (forecast2.minTemp <= 5) {
      return "추운 날씨입니다\n따뜻한 옷차림을 준비하세요";
    } else {
      return "오늘의 날씨에 맞게 계획을 세워보세요!";
    }
  };
  // Format the date and time
  const formatDate = (date) => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const dayOfWeek = days[date.getDay()];
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}년 ${month}월 ${day}일 ${dayOfWeek} KST ${hours}:${minutes}`;
  };
  // Fetch weather data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const weatherData = await fetchForeCast(60, 127);
        const weatherData2 = await fetchForeCast2(60, 127);
        setForecast(weatherData);
        setForecast2(weatherData2);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather data: ", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const imageRef = useRef(null);

  const { data, setSelectedSensorName, loading, error } =
    useContext(SensorDataContext);

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const location = useLocation();
  const Id = location.pathname.split("/").pop(); // URL에서 ID 가져오기

  useEffect(() => {
    if (Id) {
      setSelectedSensorName(Id); // 선택된 강의실 ID로 센서 데이터 업데이트
    }
    console.log("현재 센서 ID:", Id); // URL에서 가져온 ID 확인
  }, [Id, setSelectedSensorName]);

  // **sensorData 구조 확인 로그 추가**
  useEffect(() => {
    console.log("Main.js - sensorData 전체 구조 확인:", data); // 전체 데이터를 출력
  }, [data]);

  // 좌표 저장
  const coordinates = [
    { id: "6144", x: 137, y: 116 },
    { id: "6119", x: 366, y: 125 },
    { id: "5147", x: 184, y: 213 },
    { id: "5145", x: 192, y: 237 },
    { id: "4142", x: 262, y: 388 },
    { id: "3115", x: 464, y: 442 },
    { id: "3173", x: 488, y: 482 },
  ];

  const handleClick = (id) => {
    // 클릭 시 해당 강의실 페이지로 이동
    navigate(`/floorcheck`);
  };

  const getSensorIAQValue = (id) => {
    const sensor = data.find((sensor) => sensor.name === id); // `name` 속성으로 매칭
    console.log(`강의실 ID: ${id}, 센서 데이터:`, sensor); // 각 강의실 ID별 데이터 확인
    return sensor ? sensor.IAQIndex?.value || "--" : "--"; // 데이터가 없으면 "--" 반환
  };

  // 좌표별 색상 결정 함수 추가
  const getColor = (IAQvalue) => {
    if (IAQvalue === null) return "gray";
    if (IAQvalue >= 90) return "green";
    if (IAQvalue >= 80) return "orange";
    else return "red";
  };
  // 도형을 표시하는 함수
  const renderShapes = () => {
    return coordinates.map((coord, index) => {
      const IAQvalue = getSensorIAQValue(coord.id); // 강의실 번호에 맞는 IAQ 값 가져오기
      const color = getColor(IAQvalue);
      console.log(`ID: ${coord.id}, IAQIndex: ${IAQvalue}, Color: ${color}`); // 디버그 출력

      return (
        <div
          key={index}
          onMouseEnter={() => setHoveredIndex(index)} // 마우스 진입 시 인덱스 설정
          onMouseLeave={() => setHoveredIndex(null)} // 마우스 나가면 초기화
          onClick={() => handleClick(coord.id)}
          style={{
            position: "absolute",
            top: `${coord.y}px`,
            left: `${coord.x}px`,
            width: "16px",
            height: "16px",
            backgroundColor: color,
            borderRadius: "50%",
            transform: "translate(-50%, -50%)", // 중앙 정렬
            zIndex: 100,
            cursor: "pointer",
          }}
          className="animated-shape"
        >
          <div className="ring"></div>
          <div className="ring"></div>
          {/* 호버 시 표시할 박스 */}
          {hoveredIndex === index && (
            <div
              style={{
                top: "30px",
                left: "50px",
                width: "220px",
                padding: "20px",
                backgroundColor: "rgba(255, 251, 216, 0.85)",
                border: "1px solid #ccc",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
                borderRadius: "16px",
                zIndex: 100,
              }}
            >
              {/* 강의실 이름 */}
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  marginBottom: "16px",
                  textAlign: "center",
                }}
              >
                {coord.id} 강의실
              </div>
              <hr
                style={{
                  border: "0.5px solid #FFD8A0",
                  margin: "8px 8px 16px 8px",
                }}
              />
              {/* 각 항목 표시 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "6px",
                }}
              >
                <img
                  src="/Icons/img_temp.png"
                  alt="온도"
                  style={{
                    width: "20px",
                    marginRight: "8px",
                    marginBottom: "4px",
                  }}
                />
                <span>온도</span>
                <span style={{ marginLeft: "auto" }}>
                  {loading ? "--" : "24°C"}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "6px",
                }}
              >
                <img
                  src="/Icons/img_mois.png"
                  alt="습도"
                  style={{
                    width: "20px",
                    marginRight: "8px",
                    marginBottom: "4px",
                  }}
                />
                <span>습도</span>
                <span style={{ marginLeft: "auto" }}>
                  {loading ? "--" : "56%"}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "6px",
                }}
              >
                <img
                  src="/Icons/img_tvoc.png"
                  alt="TVOC"
                  style={{
                    width: "20px",
                    marginRight: "8px",
                    marginBottom: "4px",
                  }}
                />
                <span>TVOC</span>
                <span style={{ marginLeft: "auto" }}>
                  {loading ? "--" : "23"}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "6px",
                }}
              >
                <img
                  src="/Icons/img_pm2.5.png"
                  alt="PM2.5"
                  style={{
                    width: "20px",
                    marginRight: "8px",
                    marginBottom: "4px",
                  }}
                />
                <span>PM 2.5</span>
                <span style={{ marginLeft: "auto" }}>
                  {loading ? "--" : "150um"}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "6px",
                }}
              >
                <img
                  src="/Icons/img_noise.png"
                  alt="소음"
                  style={{
                    width: "20px",
                    marginRight: "8px",
                    marginBottom: "4px",
                  }}
                />
                <span>소음</span>
                <span style={{ marginLeft: "auto" }}>
                  {loading ? "--" : "89dB"}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "6px",
                }}
              >
                <img
                  src="/Icons/img_sensor.png"
                  alt="센서 상태"
                  style={{
                    width: "20px",
                    marginRight: "8px",
                    marginBottom: "4px",
                  }}
                />
                <span>센서 상태</span>
                <span style={{ marginLeft: "auto" }}>
                  {loading ? "--" : "ON"}
                </span>
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div>
      <Header />
      <div className={styles.mainContainer}>
        
        {selectedBuilding === "신공학관" && (
          <div className={styles.topMessage} style={{ width: "400px" }}>
            <img src={buildingIcon} 
              alt="현재 건물"
              style={{ width: "88px", height: "80px", marginRight: "12px", marginTop:"8%"}}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                className={styles.topMessageDetail}
                style={{
                  fontSize: "44px",
                  textShadow: "3px 3px 1.5px lightgray",
                  marginTop: "44px",
                }}
              >
                신공학관
              </div>
              
            </div>
          </div>
        )}
        <div className={styles.content}>
          {/* 건물 섹션 */}
          <div className={styles.buildings}>
            <div
              className={`${styles.building} ${
                selectedBuilding !== null && selectedBuilding !== "신공학관"           
                 
              } ${selectedBuilding === "신공학관" }`}
              onClick={() => handleBuildingClick("신공학관", null)}
              onMouseEnter={(e) => {
                if (selectedBuilding === "신공학관") {
                  e.preventDefault(); // hover 방지
                }
              }}
            >
              <img src={singongImage} 
              alt="현재 건물"/>
              <p className={styles.buildingName}>신공학관</p>
              <div className={styles.sensorInfo}>
                <p>설치된 센서</p>
                <p>
                  7 <span className={styles.greenLight}></span>
                </p>
                <p>
                  0 <span className={styles.redLight}></span>
                </p>
              </div>
            </div>

            {/* 신공학관이 선택되었을 때 이미지 표시 */}
            {selectedBuilding === "신공학관" && (
              <div className={styles.additionalContent}>
                <div className={styles.selectedBuildingImage}>
                  <img
                    src="/Main/floorplan.png"
                    alt="신공학관 도면도"
                    ref={imageRef}
                    style={{
                      width: "640px",
                      height: "640px",
                    }}
                  />
                  {renderShapes()}
                </div>
              </div>
            )}
            <style jsx>{`
              .animated-shape {
                position: relative;
              }
              /* 도형 주위의 확산 링 */
              .ring {
                position: absolute;
                border: 2px solid rgba(255, 0, 0, 0.5);
                border-radius: 50%;
                width: 36px;
                height: 36px;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                animation: pulse 1.5s infinite;
                opacity: 0;
              }
              /* 두 번째 링을 조금 더 크게 설정하고 딜레이 추가 */
              .ring:nth-child(2) {
                width: 52px;
                height: 52px;
                animation-delay: 0.75s;
              }
              /* 확산 효과 애니메이션 */
              @keyframes pulse {
                0% {
                  transform: translate(-50%, -50%) scale(0.5);
                  opacity: 1;
                }
                100% {
                  transform: translate(-50%, -50%) scale(1.5);
                  opacity: 0;
                }
              }
            `}</style>
          </div>

          {/* 오른쪽 날씨 및 로그 섹션 */}
          <div
            className={styles.weatherAndLogs}
            style={{ position: "relative" }}
          >
            <div className={styles.weatherInfo}>
              <h2>
                <img
                  src="/Main/location_icon.png"
                  alt="위치 아이콘"
                  style={{
                    width: "28px",
                    height: "28px",
                    marginRight: "8px",
                    marginBottom: "-4px",
                  }} // 이미지 크기와 간격 조절
                />
                서울 중구 필동
              </h2>

              {loadingdata ? (
                <p>Loading weather data...</p>
              ) : forecast && forecast2 ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* 날씨 상태에 따른 이미지 */}
                    <img
                      src={
                        forecast.rain >= "1"
                          ? "/Main/cloudyrain_icon.png"
                          : forecast.cloudy === "1"
                          ? "/Main/sun_icon.png"
                          : forecast.cloudy === "3"
                          ? "/Main/semicloudy_icon.png"
                          : "/Main/cloudy_icon.png"
                      }
                      alt="날씨 이미지"
                      style={{
                        width: "100px", // 이미지 크기 조정
                        height: "100px",
                        filter: "drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.2))",
                      }}
                    />
                    <h1
                      className={styles.weatherTemperature}
                      style={{
                        fontSize: "4rem",
                        fontWeight: "bold",
                        textAlign: "right",
                      }}
                    >
                      {forecast.temperature}°C
                    </h1>
                  </div>

                  <p
                    className={styles.weatherRain}
                    style={{
                      fontSize: "28px",
                      textAlign: "center",
                    }}
                  >
                    {forecast.rain >= "1"
                      ? "흐리고 비"
                      : forecast.cloudy === "1"
                      ? "맑음"
                      : forecast.cloudy === "3"
                      ? "구름많음"
                      : "흐림"}
                  </p>
                  <p
                    className={styles.weatherMinMax}
                    style={{
                      fontSize: "20px",
                      textAlign: "right",
                      fontWeight: "600",
                      marginTop: "10px",
                    }}
                  >
                    최고 {forecast2.maxTemp}°C / 최저 {forecast2.minTemp}°C
                    <span style={{ marginLeft: "16px" }}>
                      습도 {forecast.humidity}%
                    </span>
                  </p>
                  <p
                    style={{
                      textAlign: "right",
                      fontSize: "12px",
                      marginBottom: "10px",
                    }}
                  >
                    {" "}
                    {formatDate(dateTime)}
                  </p>
                  <p
                    className={styles.weatherAdvice}
                    style={{
                      textAlign: "right",
                    }}
                  >
                    <p
                      className={styles.weatherAdvice}
                      style={{
                        textAlign: "right",
                        whiteSpace: "pre-line", // 줄바꿈 적용
                        fontSize: "20px",
                      }}
                    >
                      {getWeatherAdvice()}
                    </p>
                  </p>
                </>
              ) : (
                <p>데이터를 불러오는 중입니다.</p>
              )}
            </div>

           
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default Main;
