// It's important to use the 'web' entrypoint since this is running in the browser.
import { formatNumber } from "@nshiab/journalism/web";
import type { tempRegrT } from "../lib/index.ts";

export default function getTempChange(
  city: string,
  tempRegr: tempRegrT,
): string {
  const cityRegression = tempRegr.find((r) => r.city === city);

  if (cityRegression === undefined) {
    throw new Error(`City ${city} not found in tempRegr.`);
  }

  const slopPerDecade = cityRegression.slope * 10;

  return formatNumber(slopPerDecade, { decimals: 3, suffix: "°C" });
}
