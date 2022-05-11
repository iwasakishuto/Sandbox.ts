/**
 * @summtarget Get weather forecast html.
 */

import { HTMLElement, parse } from "node-html-parser";

export type WeatherForcast = {
  date: Date;
  place: string;
  img: string;
  description: string;
  wind: string;
  wave: string;
  rainyRate: {
    "00-06": string;
    "06-12": string;
    "12-18": string;
    "18-24": string;
  };
  min_temp_morning: number;
  max_temp_daytime: number;
  announcement: {
    date: string;
    from: string;
  };
};

export function getWeatherhtml({
  area_type = "offices",
  area_code = "130000",
}: {
  area_type: string;
  area_code: string;
}): WeatherForcast[] {
  var ret: WeatherForcast[] = [];

  const root: HTMLElement = parse(
    UrlFetchApp.fetch(
      `https://www.jma.go.jp/bosai/forecast/#area_type=${area_type}&area_code=${area_code}`
    ).getContentText()
  );
  const forcastTables: HTMLElement[] = root.querySelectorAll(
    "table.forecast-table"
  );

  /** <--- Get weather forcast meta information --- */
  const weatherForcastMetaTable: HTMLElement = forcastTables[0];
  const announcements: string[] = weatherForcastMetaTable
    .querySelector("tr.contents-header")!
    .textContent.split("　");
  const place: string = weatherForcastMetaTable
    .querySelector("tr.contents-title")!
    .textContent.split("の天気予報")[0];

  /** --- END Get weather forcast meta information ---> */

  /** <--- Get the weather information --- */
  const targetWeatherForcastTable: HTMLElement = forcastTables[2];
  const forcastTRows: HTMLElement[] =
    targetWeatherForcastTable.querySelectorAll("tr");
  const weather_images: string[] = forcastTRows[2]
    .querySelectorAll("img")
    .map((e: HTMLElement) => e.getAttribute("src")!);
  const weather_descriptions: string[] = forcastTRows[3]
    .querySelectorAll("td")
    .map((e: HTMLElement) => e.textContent);
  const weather_winds: string[] = forcastTRows[4]
    .querySelectorAll("td")
    .map((e: HTMLElement) => e.textContent);
  const weather_waves: string[] = forcastTRows[5]
    .querySelectorAll("td")
    .map((e: HTMLElement) => e.textContent);
  const weatehr_rainyRates: string[] = forcastTRows[7]
    .querySelectorAll("td")
    .map((e: HTMLElement) => e.textContent);
  const weatehr_temperatures: string[] = forcastTRows[10]
    .querySelectorAll("td")
    .map((e: HTMLElement) => e.textContent);
  /** --- END Get the weather information ---> */

  for (let i = 0; i < 3; i++) {
    if (weatehr_temperatures.length > (i + 1) * 4) break;
    let date: Date = new Date();
    date.setDate(date.getDate() + i);
    ret.push({
      date: date,
      place: place,
      img: weather_images[i],
      description: weather_descriptions[i],
      wind: weather_winds[i],
      wave: weather_waves[i],
      rainyRate: {
        "00-06": weatehr_rainyRates[i],
        "06-12": weatehr_rainyRates[i + 1],
        "12-18": weatehr_rainyRates[i + 2],
        "18-24": weatehr_rainyRates[i + 3],
      },
      min_temp_morning: 0,
      max_temp_daytime: 0,
      announcement: {
        date: announcements[0],
        from: announcements[1],
      },
    });
  }

  return ret;
}
