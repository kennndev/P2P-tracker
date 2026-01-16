import { NextResponse } from 'next/server';
import type { ExchangeData } from '@/lib/types';

export async function POST() {
    try {
        const response = await fetch('https://www.okx.com/v3/c2c/tradingOrders/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                quoteCurrency: 'USD',
                baseCurrency: 'USDC',
                side: 'buy',
                paymentMethod: 'all',
                userType: 'all'
            }),
            cache: 'no-store'
        });

        const data = await response.json();

        // Parse OKX response format
        if (data.data && data.data.buy && data.data.buy.length > 0) {
            const totalVolume = data.data.buy.reduce((acc: number, order: any) => {
                const volume = parseFloat(order.availableAmount || 0);
                return acc + volume;
            }, 0);

            const avgPrice = data.data.buy.reduce((acc: number, order: any) => {
                return acc + parseFloat(order.price || 0);
            }, 0) / data.data.buy.length;

            const result: ExchangeData = {
                volume: totalVolume,
                orders: data.data.buy.length,
                avgPrice: avgPrice,
                timestamp: new Date().toISOString(),
                exchange: 'okx'
            };

            console.log('✅ OKX P2P Data:', result);
            return NextResponse.json(result);
        } else {
            // No dummy data - return error if API doesn't work
            console.log('⚠️ OKX: No data available or authentication required');
            return NextResponse.json(
                { error: 'OKX API requires authentication or no data available' },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error('❌ OKX API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch OKX data - may require API authentication', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return POST();
}
