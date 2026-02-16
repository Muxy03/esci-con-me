// place files you want to import through the `$lib` alias in this folder.

type cityT = string;

type tempT = { city: string; decade: number; meanTemp: number }[];

type tempRegrT = {
    city: string;
    slope: number;
    yIntercept: number;
    r2: number;
}[];

export type { cityT, tempRegrT, tempT };