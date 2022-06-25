
export interface Country {
    code: string;
    name: string;
}

export interface Timezone {
    countryCode: string;
    zoneName: string;
}

export interface CityState {
    code: string;
    name: string;
    subdivision: string;
}
