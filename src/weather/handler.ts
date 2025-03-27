
type Daily = {
    time: string[],
    temperature_2m_max: number[],
    temperature_2m_min: number[],
    precipitation_probability_max: number[],
}

export type SevenDayForecastResponse = {
    daily: Daily
}

export const getSevenDayForecast = async (location: string) => {
    if(!location) {
        return "No location provided"
    }

    const {results} = await getLatLongForLocation(location)

    if (!results) {
        return "No location found"
    }

    // usually we want the first response
    const { latitude, longitude, timezone } = results[0]


    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=${timezone}&forecast_days=7`

    return await makeWeatherApiCall<SevenDayForecastResponse>(forecastUrl)
}


export const formatWeeklyForecast = (forecast: SevenDayForecastResponse): string => {
    const { time, temperature_2m_min: min, temperature_2m_max: max, precipitation_probability_max: rain } = forecast.daily;

    let message = "";

    for (let i = 1; i < 7; i++) {
        const t = time[i];
        const mn = min[i];
        const mx = max[i];
        const r = rain[i];

        message += `date: ${t} has a max temperature of ${mx} and a low of ${mn}. There is a ${r}% chance of rain.\n`;
    }

    return message;
}

export type CoordinatesResult = {
    id: number,
    name: string,
    latitude: number,
    longitude: number
    timezone: string,
}

type CoordinatesResponse = {
    results: CoordinatesResult[]
}

const getLatLongForLocation = async (location: string): Promise<CoordinatesResponse> => {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=10&language=en&format=json`
    const response = await fetch(url)

    return await response.json() as CoordinatesResponse
}

const makeWeatherApiCall = async <T>(url: string): Promise<T> => {
    const response = await fetch(url)

    return await response.json() as T
}