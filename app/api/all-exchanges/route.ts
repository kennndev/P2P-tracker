import { NextResponse } from 'next/server';
import type { AllExchangesResponse } from '@/lib/types';

export async function GET() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const results: AllExchangesResponse = {};

        // Fetch all exchanges and both assets (USDC and USDT) in parallel
        const [binanceUSDC, bybitUSDC, okxUSDC, kucoinUSDC, binanceUSDT, bybitUSDT] = await Promise.allSettled([
            // USDC endpoints
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
            }).then(r => r.json()),
            // USDT endpoints
            fetch(`${baseUrl}/api/binance-usdt`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store'
            }).then(r => r.json()),
            fetch(`${baseUrl}/api/bybit-usdt`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store'
            }).then(r => r.json()),
        ]);

        // Only include successful responses with valid data (no errors)
        if (binanceUSDC.status === 'fulfilled' && !binanceUSDC.value.error) {
            results['binance-usdc'] = binanceUSDC.value;
        }
        if (bybitUSDC.status === 'fulfilled' && !bybitUSDC.value.error) {
            results['bybit-usdc'] = bybitUSDC.value;
        }
        if (okxUSDC.status === 'fulfilled' && !okxUSDC.value.error) {
            results['okx-usdc'] = okxUSDC.value;
        }
        if (kucoinUSDC.status === 'fulfilled' && !kucoinUSDC.value.error) {
            results['kucoin-usdc'] = kucoinUSDC.value;
        }
        if (binanceUSDT.status === 'fulfilled' && !binanceUSDT.value.error) {
            results['binance-usdt'] = binanceUSDT.value;
        }
        if (bybitUSDT.status === 'fulfilled' && !bybitUSDT.value.error) {
            results['bybit-usdt'] = bybitUSDT.value;
        }

        console.log(`📊 Aggregated data from ${Object.keys(results).length} exchange-asset pairs`);
        return NextResponse.json(results);
    } catch (error) {
        console.error('❌ Error fetching all exchanges:', error);
        return NextResponse.json(
            { error: 'Failed to fetch exchange data' },
            { status: 500 }
        );
    }
}
