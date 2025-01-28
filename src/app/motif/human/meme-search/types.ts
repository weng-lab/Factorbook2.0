export type Motif = {
    name: string;
    pwm: number[][];
}

export type ACMAPType = {
    [key: string]: number;
};

export type PCMAPType = {
    [key: string]: number[];
};

export type Result = {
    ppm: number[][];
};