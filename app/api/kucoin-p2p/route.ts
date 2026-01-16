import { NextResponse } from 'next/server';
import type { ExchangeData } from '@/lib/types';

export async function POST() {
    try {
        const response = await fetch('https://www.kucoin.com/_api/otc/ad/list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                currency: 'USDC',
                legal: 'USD',
                side: 'BUY',
                page: 1,
                pageSize: 20
            }),
            cache: 'no-store'
        });

        const data = await response.json();

        if (data.data && data.data.items && data.data.items.length > 0) {
            const totalVolume = data.data.items.reduce((acc: number, order: any) => {
                const volume = parseFloat(order.availableAmount || 0);
                return acc + volume;
            }, 0);

            const avgPrice = data.data.items.reduce((acc: number, order: any) => {
                return acc + parseFloat(order.price || 0);
            }, 0) / data.data.items.length;

            const result: ExchangeData = {
                volume: totalVolume,
                orders: data.data.items.length,
                avgPrice: avgPrice,
                timestamp: new Date().toISOString(),
                exchange: 'kucoin'
            };

            console.log('✅ KuCoin P2P Data:', result);
            return NextResponse.json(result);
        } else {
            // No dummy data - return error if API doesn't work
            console.log('⚠️ KuCoin: No data available or authentication required');
            return NextResponse.json(
                { error: 'KuCoin API requires authentication or no data available' },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error('❌ KuCoin API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch KuCoin data - may require API authentication', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return POST();
}
