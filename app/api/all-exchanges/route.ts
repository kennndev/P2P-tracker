import { NextResponse } from 'next/server';
import type { AllExchangesResponse } from '@/lib/types';

export async function GET() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const results: AllExchangesResponse = {};

        // Fetch all exchanges in parallel
        const [binance, bybit, okx, kucoin] = await Promise.allSettled([
            fetch(`${baseUrl}/api/binance-p2p`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store'
            }).then(r => r.json()),
            fetch(`${baseUrl}/api/bybit-p2p`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store'
            }).then(r => r.json()),
            fetch(`${baseUrl}/api/okx-p2p`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store'
            }).then(r => r.json()),
            fetch(`${baseUrl}/api/kucoin-p2p`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store'
            }).then(r => r.json())
        ]);

        // Only include successful responses with valid data (no errors)
        if (binance.status === 'fulfilled' && !binance.value.error) {
            results.binance = binance.value;
        }
        if (bybit.status === 'fulfilled' && !bybit.value.error) {
            results.bybit = bybit.value;
        }
        if (okx.status === 'fulfilled' && !okx.value.error) {
            results.okx = okx.value;
        }
        if (kucoin.status === 'fulfilled' && !kucoin.value.error) {
            results.kucoin = kucoin.value;
        }

        console.log(`📊 Aggregated data from ${Object.keys(results).length} exchanges`);
        return NextResponse.json(results);
    } catch (error) {
        console.error('❌ Error fetching all exchanges:', error);
        return NextResponse.json(
            { error: 'Failed to fetch exchange data' },
            { status: 500 }
        );
    }
}
