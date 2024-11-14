// forecast.js
const DATA_API_KEY = "m8O0QaTVwAzleVprK21I2DbmjGFRkESZ4rc92WP%2BKAFaUBVIulitnqHyJKSp53eGq9plQdyGFypxFkBH3Maq2g%3D%3D";
const API_STEM = "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst";

// 최대 재시도 횟수
const MAX_RETRIES = 10000;

function xyUrl(x, y) {
    let std_time = new Date();
    std_time.setMinutes(std_time.getMinutes() - 30);

    let today = getFormatDate(std_time);
    let time = getFormatTime(std_time);
    return `${API_STEM}?serviceKey=${DATA_API_KEY}&dataType=JSON&numOfRows=1000&pageNo=1&base_date=${today}&base_time=${time}&nx=${x}&ny=${y}`;
}

// fetch 요청 함수에 재시도 로직 추가
async function fetchWithRetry(url, retries = MAX_RETRIES) {
    let lastError;
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                headers: {
                    "Accept": "text/json" // JSON 응답을 기대함
                }
            });
            
            if (response.ok) {
                return await response.json();
            } else {
                console.warn(`Attempt ${i + 1}: API 호출 실패 - 상태 코드: ${response.status}`);
                lastError = new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error(`Attempt ${i + 1} failed with error:`, error);
            lastError = error;
        }
    }
    throw lastError; // 모든 재시도 실패 시 마지막 오류를 throw
}

async function fetchForeCast(x, y) {
    try {
        const responseJSON = await fetchWithRetry(xyUrl(x, y));
        
        if (!responseJSON?.response?.body?.items?.item) {
            console.log("데이터가 수신되지 않았습니다. 다시 시도 중...");
            return fetchForeCast(x, y); // 데이터가 없으면 대기 상태로 다시 호출
        }

        const items = responseJSON.response.body.items.item;
        return {
            cloudy: items.find(object => object['category'] === 'SKY')?.fcstValue || '데이터 없음',
            humidity: items.find(object => object['category'] === 'REH')?.fcstValue || '데이터 없음',
            temperature: items.find(object => object['category'] === 'T1H')?.fcstValue || '데이터 없음',
            rain: items.find(object => object['category'] === 'PTY')?.fcstValue || '데이터 없음',
        };
    } catch (error) {
        console.error("Forecast fetch error:", error);
    }
}

function getFormatDate(date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
}

function getFormatTime(date) {
    let hour = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hour}${minutes}`;
}

const API_Base = "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";

function xyUrl2(x, y) {
    let std_time = new Date();
    std_time.setMinutes(std_time.getMinutes() - 180); // 현재 시간에서 3시간 전으로 설정

    let today = getFormatDate(std_time);
    let currentHour = std_time.getHours(); 
    let availableTimes = [200, 500, 800, 1100, 1400, 1700, 2000, 2300]; 

    let time = availableTimes.reverse().find(t => t <= currentHour * 100);

    if (!time) {
        std_time.setDate(std_time.getDate() - 1); 
        today = getFormatDate(std_time);
        time = 2300; 
    }

    return `${API_Base}?serviceKey=${DATA_API_KEY}&dataType=JSON&numOfRows=1000&pageNo=1&base_date=${today}&base_time=${time.toString().padStart(4, '0')}&nx=${x}&ny=${y}`;
}

async function fetchForeCast2(x, y) {
    try {
        const responseJSON = await fetchWithRetry(xyUrl2(x, y));
        
        if (!responseJSON?.response?.body?.items?.item) {
            console.log("데이터가 수신되지 않았습니다. 다시 시도 중...");
            return fetchForeCast2(x, y); // 데이터가 없으면 대기 상태로 다시 호출
        }

        const items = responseJSON.response.body.items.item;
        return {
            minTemp: items.find(object => object['category'] === 'TMN')?.fcstValue || '데이터 없음',
            maxTemp: items.find(object => object['category'] === 'TMX')?.fcstValue || '데이터 없음',
        };
    } catch (error) {
        console.error("Forecast2 fetch error:", error);
    }
}

// 일반 export로 내보내기
export { fetchForeCast, fetchForeCast2 };
