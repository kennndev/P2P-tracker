import { NextResponse } from 'next/server';
import type { ExchangeData } from '@/lib/types';

export async function POST() {
    try {
        const response = await fetch('https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                asset: 'USDT',
                fiat: 'USD',
                merchantCheck: false,
                page: 1,
                payTypes: [],
                publisherType: null,
                rows: 20,
                tradeType: 'BUY'
            }),
            cache: 'no-store'
        });

        const data = await response.json();

        if (data.data && data.data.length > 0) {
            // Calculate total volume from the listings
            const totalVolume = data.data.reduce((acc: number, order: any) => {
                const volume = parseFloat(order.adv?.tradableQuantity || 0);
                return acc + volume;
            }, 0);

            const avgPrice = data.data.reduce((acc: number, order: any) => {
                return acc + parseFloat(order.adv?.price || 0);
            }, 0) / data.data.length;

            const result: ExchangeData = {
                volume: totalVolume,
                orders: data.data.length,
                avgPrice: avgPrice,
                timestamp: new Date().toISOString(),
                exchange: 'binance',
                asset: 'USDT'
            };

            console.log('✅ Binance USDT P2P Data:', result);
            return NextResponse.json(result);
        } else {
            return NextResponse.json(
                { error: 'No data available from Binance' },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error('❌ Binance USDT API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch Binance USDT data', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return POST();
}
