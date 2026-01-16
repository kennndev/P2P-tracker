import { NextResponse } from 'next/server';
import type { ExchangeData } from '@/lib/types';

export async function POST() {
    try {
        const response = await fetch('https://api2.bybit.com/fiat/otc/item/online', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tokenId: 'USDC',
                currencyId: 'USD',
                payment: [],
                side: '1',
                size: '20',
                page: '1',
                amount: ''
            }),
            cache: 'no-store'
        });

        const data = await response.json();

        if (data.result?.items && data.result.items.length > 0) {
            const totalVolume = data.result.items.reduce((acc: number, order: any) => {
                const volume = parseFloat(order.lastQuantity || 0);
                return acc + volume;
            }, 0);

            const avgPrice = data.result.items.reduce((acc: number, order: any) => {
                return acc + parseFloat(order.price || 0);
            }, 0) / data.result.items.length;

            const result: ExchangeData = {
                volume: totalVolume,
                orders: data.result.items.length,
                avgPrice: avgPrice,
                timestamp: new Date().toISOString(),
                exchange: 'bybit'
            };

            console.log('✅ Bybit P2P Data:', result);
            return NextResponse.json(result);
        } else {
            return NextResponse.json(
                { error: 'No data available from Bybit' },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error('❌ Bybit API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch Bybit data', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return POST();
}
