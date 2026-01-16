'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Activity, DollarSign } from 'lucide-react';
import type { AllExchangesResponse, ExchangeConfig } from '@/lib/types';

const P2PVolumeTracker = () => {
    const [volumes, setVolumes] = useState<AllExchangesResponse>({});
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [error, setError] = useState<string | null>(null);

    // Exchange configurations
    const exchanges: ExchangeConfig[] = [
        {
            id: 'binance',
            name: 'Binance',
            color: '#F3BA2F',
        },
        {
            id: 'bybit',
            name: 'Bybit',
            color: '#F7A600',
        },
        {
            id: 'okx',
            name: 'OKX',
            color: '#000000',
        },
        {
            id: 'kucoin',
            name: 'KuCoin',
            color: '#24AE8F',
        }
    ];

    // Fetch data from API
    const fetchAllVolumes = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/all-exchanges');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setVolumes(data);
            setLastUpdate(new Date());
        } catch (err) {
            setError('Failed to fetch data from API. Please check the console for details.');
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch and auto-refresh every 30 seconds
    useEffect(() => {
        fetchAllVolumes();
        const interval = setInterval(fetchAllVolumes, 30000);
        return () => clearInterval(interval);
    }, []);

    // Calculate total volume across all exchanges
    const totalVolume = Object.values(volumes).reduce((acc, data) => acc + (data?.volume || 0), 0);
    const totalOrders = Object.values(volumes).reduce((acc, data) => acc + (data?.orders || 0), 0);

    // Filter to only show exchanges with data
    const activeExchanges = exchanges.filter(exchange => volumes[exchange.id]);

    return (
        <div className="min-h-screen relative overflow-hidden p-8">
            {/* Animated background grid */}
            <div
                className="absolute inset-0 opacity-40"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(56, 189, 248, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56, 189, 248, 0.03) 1px, transparent 1px)
          `,
                    backgroundSize: '50px 50px',
                    animation: 'gridMove 20s linear infinite'
                }}
            />

            <div className="max-width-[1400px] mx-auto relative z-10">
                {/* Header */}
                <div className="animate-[slideIn_0.6s_ease-out] mb-12">
                    <div className="flex items-center gap-4 mb-2">
                        <Activity size={40} className="text-cyan-400" />
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">
                            P2P Volume Tracker
                        </h1>
                    </div>
                    <p className="text-lg text-slate-400 font-mono">
                        Real-time USDC peer-to-peer trading volumes across major exchanges
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-[slideIn_0.6s_ease-out_0.1s_backwards]">
                    <div className="bg-cyan-400/10 border border-cyan-400/20 rounded-2xl p-6 backdrop-blur-md">
                        <div className="text-sm text-slate-400 mb-2 font-medium uppercase tracking-wider">
                            Total Volume
                        </div>
                        <div className="text-3xl font-bold text-cyan-400 font-mono">
                            ${totalVolume.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </div>
                    </div>

                    <div className="bg-indigo-400/10 border border-indigo-400/20 rounded-2xl p-6 backdrop-blur-md">
                        <div className="text-sm text-slate-400 mb-2 font-medium uppercase tracking-wider">
                            Active Orders
                        </div>
                        <div className="text-3xl font-bold text-indigo-400 font-mono">
                            {totalOrders}
                        </div>
                    </div>

                    <div className="bg-emerald-400/10 border border-emerald-400/20 rounded-2xl p-6 backdrop-blur-md">
                        <div className="text-sm text-slate-400 mb-2 font-medium uppercase tracking-wider">
                            Exchanges
                        </div>
                        <div className="text-3xl font-bold text-emerald-400 font-mono">
                            {Object.keys(volumes).length}
                        </div>
                    </div>

                    <div className="bg-rose-400/10 border border-rose-400/20 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
                        <div className="text-sm text-slate-400 mb-2 font-medium uppercase tracking-wider">
                            Last Update
                        </div>
                        <div className="text-base font-medium text-rose-400 font-mono">
                            {lastUpdate.toLocaleTimeString()}
                        </div>
                    </div>
                </div>

                {/* Refresh Button */}
                <div className="flex justify-end mb-8 animate-[slideIn_0.6s_ease-out_0.2s_backwards]">
                    <button
                        onClick={fetchAllVolumes}
                        disabled={loading}
                        className="bg-gradient-to-r from-cyan-400 to-indigo-400 text-white border-none rounded-xl px-6 py-3 text-base font-semibold cursor-pointer flex items-center gap-2 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(56,189,248,0.3)] hover:shadow-[0_8px_30px_rgba(56,189,248,0.5)] hover:-translate-y-0.5"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        {loading ? 'Updating...' : 'Refresh Data'}
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-rose-400/10 border border-rose-400/30 rounded-xl p-4 mb-8 text-rose-400">
                        ⚠️ {error}
                    </div>
                )}

                {/* Exchange Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                    {activeExchanges.map((exchange, index) => {
                        const volumeData = volumes[exchange.id];
                        const isLoading = loading && !volumeData;

                        return (
                            <div
                                key={exchange.id}
                                className="bg-gradient-to-br from-slate-800/80 to-slate-900/90 border border-white/10 rounded-3xl p-8 relative overflow-hidden backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                                style={{
                                    animation: `slideIn 0.6s ease-out ${0.3 + index * 0.1}s backwards`
                                }}
                            >
                                {/* Decorative gradient */}
                                <div
                                    className="absolute top-0 right-0 w-[150px] h-[150px] pointer-events-none"
                                    style={{
                                        background: `radial-gradient(circle, ${exchange.color}20 0%, transparent 70%)`
                                    }}
                                />

                                {/* Exchange Header */}
                                <div className="flex items-center justify-between mb-6 relative">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{
                                                background: exchange.color,
                                                animation: volumeData ? 'pulse 2s ease-in-out infinite' : 'none'
                                            }}
                                        />
                                        <h3 className="text-2xl font-bold text-slate-100">
                                            {exchange.name}
                                        </h3>
                                    </div>
                                    <DollarSign size={24} style={{ color: exchange.color, opacity: 0.6 }} />
                                </div>

                                {/* Volume Data */}
                                {isLoading ? (
                                    <div className="text-center py-8 text-slate-500">
                                        <RefreshCw size={32} className="animate-spin mx-auto" />
                                        <p className="mt-4">Loading...</p>
                                    </div>
                                ) : volumeData ? (
                                    <>
                                        <div className="mb-6">
                                            <div className="text-sm text-slate-400 mb-2 font-medium uppercase tracking-wider">
                                                24h Volume
                                            </div>
                                            <div
                                                className="text-4xl font-bold font-mono"
                                                style={{
                                                    color: exchange.color,
                                                    textShadow: `0 0 20px ${exchange.color}40`
                                                }}
                                            >
                                                ${volumeData.volume.toLocaleString(undefined, {
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0
                                                })}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                                            <div>
                                                <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider">
                                                    Active Orders
                                                </div>
                                                <div className="text-xl font-semibold text-slate-100 font-mono">
                                                    {volumeData.orders}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider">
                                                    Avg Price
                                                </div>
                                                <div className="text-xl font-semibold text-slate-100 font-mono">
                                                    ${volumeData.avgPrice.toFixed(4)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Show note if present */}
                                        {volumeData.note && (
                                            <div className="mt-4 p-2 bg-amber-400/10 border border-amber-400/20 rounded-lg text-xs text-amber-400">
                                                ℹ️ {volumeData.note}
                                            </div>
                                        )}
                                    </>
                                ) : null}
                            </div>
                        );
                    })}
                </div>

                {/* Footer Note */}
                <div className="mt-12 p-6 bg-slate-800/50 rounded-xl border border-white/10 text-center text-slate-400 text-sm animate-[slideIn_0.6s_ease-out_0.8s_backwards]">
                    <p className="mb-2">
                        📊 Data refreshes automatically every 30 seconds | Live data from exchange APIs
                    </p>
                    <p className="text-xs text-slate-500">
                        ✅ Displaying {Object.keys(volumes).length} exchange{Object.keys(volumes).length !== 1 ? 's' : ''} with live data | No simulated data
                    </p>
                </div>
            </div>
        </div>
    );
};

export default P2PVolumeTracker;
