export interface ExchangeData {
    volume: number;
    orders: number;
    avgPrice: number;
    timestamp: string;
    exchange: string;
    asset?: string;
    note?: string;
}

export interface AllExchangesResponse {
    [key: string]: ExchangeData;
}

export interface ExchangeConfig {
    id: string;
    name: string;
    color: string;
}
