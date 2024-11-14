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
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [sensorData, setSensorData] = useState(null); // 센서 데이터 상태 추가

  const { data, setSelectedSensorName, loading, error } =
    useContext(SensorDataContext);

  // 좌표 저장
  const coordinates = [
    { building: "신공학관", id: "6144", x: 137, y: 116 },
    { building: "신공학관", id: "6119", x: 366, y: 125 },
    { building: "신공학관", id: "5147", x: 184, y: 213 },
    { building: "신공학관", id: "5145", x: 192, y: 237 },
    { building: "신공학관", id: "4142", x: 262, y: 388 },
    { building: "신공학관", id: "3115", x: 464, y: 442 },
    { building: "신공학관", id: "3173", x: 488, y: 482 },
  ];

  useEffect(() => {
    const fetchSensorData = async () => {
      if (hoveredIndex !== null) {
        const hoveredCoord = coordinates[hoveredIndex];
        if (!hoveredCoord) return; // hoveredCoord가 없을 경우 반환
        try {
          const endpoint = `/api/sensorData/recent/classroom?building=${encodeURIComponent(
            hoveredCoord.building
          )}&name=${encodeURIComponent(hoveredCoord.id)}`;
          console.log("API 요청 URL: ", endpoint);
          const response = await API.get(endpoint);
          setSensorData(response.data); // API에서 가져온 데이터 설정
          console.log(
            `Fetched sensor data for ${hoveredCoord.id}`,
            response.data
          );
        } catch (error) {
          console.error("Error fetching sensor data:", error);
          setSensorData(null);
        }
      } else {
        setSensorData(null);
      }
    };
    fetchSensorData();
  }, [hoveredIndex]); // hoveredIndex 변경 시마다 데이터 요청

  const handleClick = (id) => {
    // 클릭 시 해당 강의실 페이지로 이동
    navigate(`/figures/${id}`);
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
            cursor: "pointer",
          }}
          className="animated-shape"
        >
          <div className="ring"></div>
          <div className="ring"></div>
          {/* 호버 시 표시할 박스 */}
          {hoveredIndex === index && (
            <div
              className={styles.hoverBox}
              style={{
                [coord.id === "6144" ||
                coord.id === "6119" ||
                coord.id === "5145"
                  ? "bottom"
                  : "bottom"]:
                  coord.id === "6144" ||
                  coord.id === "6119" ||
                  coord.id === "5145"
                    ? "20%"
                    : "-100%",
              }}
            >
              {/* 강의실 이름 */}
              <div
                style={{
                  fontWeight: "500",
                  textShadow: "1.5px 1.5px 1.5px lightgray",
                  fontSize: "1.5rem",
                  marginBottom: "16px",
                  textAlign: "center",
                }}
              >
                {coord.id} 강의실
              </div>
              <hr
                style={{
                  margin: "4px 4px 20px 4px",
                }}
              />
              {/* 각 항목 표시 */}
              {sensorData ? (
                <>
                  <div className={styles.sensorText}>
                    <img
                      src="/Icons/img_temp.png"
                      alt="온도"
                      className={styles.sensorImg}
                    />
                    <span>온도</span>
                    <span style={{ marginLeft: "auto" }}>
                      {loading ? "--" : `${sensorData.Temperature?.value}°C`}
                    </span>
                  </div>
                  <div className={styles.sensorText}>
                    <img
                      src="/Icons/img_mois.png"
                      alt="습도"
                      className={styles.sensorImg}
                    />
                    <span>습도</span>
                    <span style={{ marginLeft: "auto" }}>
                      {loading ? "--" : `${sensorData.Humidity?.value}%`}
                    </span>
                  </div>
                  <div className={styles.sensorText}>
                    <img
                      src="/Icons/img_tvoc.png"
                      alt="TVOC"
                      className={styles.sensorImg}
                    />
                    <span>TVOC</span>
                    <span style={{ marginLeft: "auto" }}>
                      {loading ? "--" : `${sensorData.TVOC?.value}㎍/m³`}
                    </span>
                  </div>
                  <div className={styles.sensorText}>
                    <img
                      src="/Icons/img_pm2.5.png"
                      alt="PM2.5"
                      className={styles.sensorImg}
                    />
                    <span>PM 2.5</span>
                    <span style={{ marginLeft: "auto" }}>
                      {loading
                        ? "--"
                        : `${sensorData.PM2_5MassConcentration?.value}㎍/m³`}
                    </span>
                  </div>
                  <div className={styles.sensorText}>
                    <img
                      src="/Icons/img_noise.png"
                      alt="소음"
                      className={styles.sensorImg}
                    />
                    <span>소음</span>
                    <span style={{ marginLeft: "auto" }}>
                      {loading ? "--" : `${sensorData.AmbientNoise?.value}db`}
                    </span>
                  </div>
                  <div className={styles.sensorText}>
                    <img
                      src="/Icons/img_sensor.png"
                      alt="센서 상태"
                      className={styles.sensorImg}
                    />
                    <span>센서 상태</span>
                    <span style={{ marginLeft: "auto" }}>
                      {loading ? "--" : "ON"}
                    </span>
                  </div>
                </>
              ) : (
                <>""</>
              )}
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
          <div className={styles.topMessage}>
            <img
              src={buildingIcon}
              alt="현재 건물"
              style={{
                width: "88px",
                height: "80px",
                marginRight: "12px",
                marginTop: "8%",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div className={styles.topMessageDetail}>신공학관</div>
            </div>
          </div>
        )}
        <div className={styles.content}>
          {/* 건물 섹션 */}
          <div className={styles.buildings}>
            <div
              className={`${styles.building} ${
                selectedBuilding !== null && selectedBuilding !== "신공학관"
              } ${selectedBuilding === "신공학관"}`}
              onClick={() => handleBuildingClick("신공학관", null)}
              onMouseEnter={(e) => {
                if (selectedBuilding === "신공학관") {
                  e.preventDefault(); // hover 방지
                }
              }}
            >
              <img src={singongImage} alt="현재 건물" />
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
                zindex: 10;
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
                zindex: 1;
              }
              /* 두 번째 링을 조금 더 크게 설정하고 딜레이 추가 */
              .ring:nth-child(2) {
                width: 52px;
                height: 52px;
                animation-delay: 0.75s;
                zindex: 1;
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
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                }}
              >
                <img
                  src="/Main/location_icon.png"
                  alt="위치 아이콘"
                  style={{
                    width: "36px",
                    height: "36px",
                    marginRight: "4%",
                    marginBottom: "-8px",
                  }} // 이미지 크기와 간격 조절
                />
                서울 중구 필동
              </p>

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
                      className={styles.weatherImg}
                    />
                    <h1 className={styles.weatherTemperature}>
                      {forecast.temperature}°C
                    </h1>
                  </div>

                  <p className={styles.weatherShow}>
                    {forecast.rain >= "1"
                      ? "흐리고 비"
                      : forecast.cloudy === "1"
                      ? "맑음"
                      : forecast.cloudy === "3"
                      ? "구름많음"
                      : "흐림"}
                  </p>
                  <p className={styles.weatherMinMax}>
                    최고 {forecast2.maxTemp}°C / 최저 {forecast2.minTemp}°C
                    <span style={{ marginLeft: "6%" }}>
                      습도 {forecast.humidity}%
                    </span>
                  </p>
                  <p className={styles.weatherTime}> {formatDate(dateTime)}</p>

                  <p className={styles.weatherAdvice}>{getWeatherAdvice()}</p>
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
