import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Activity, DollarSign } from 'lucide-react';

const P2PVolumeTracker = () => {
  const [volumes, setVolumes] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [error, setError] = useState(null);

  // Backend API URL - change this to your deployed backend URL
  const API_BASE_URL = 'http://localhost:3001';

  // Exchange configurations
  const exchanges = [
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

  // Fetch data from backend
  const fetchAllVolumes = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/all-exchanges`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setVolumes(data);
      setLastUpdate(new Date());
    } catch (err) {
      setError('Failed to fetch data from backend. Make sure the server is running on port 3001.');
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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1d3a 50%, #0f1729 100%)',
      fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
      color: '#e8edf5',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background grid */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(56, 189, 248, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(56, 189, 248, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        opacity: 0.4,
        animation: 'gridMove 20s linear infinite'
      }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;600&display=swap');
        
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(56, 189, 248, 0.3); }
          50% { box-shadow: 0 0 40px rgba(56, 189, 248, 0.5); }
        }

        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{
          animation: 'slideIn 0.6s ease-out',
          marginBottom: '3rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '0.5rem'
          }}>
            <Activity size={40} style={{ color: '#38bdf8' }} />
            <h1 style={{
              fontSize: '3rem',
              fontWeight: '700',
              margin: 0,
              background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em'
            }}>
              P2P Volume Tracker
            </h1>
          </div>
          <p style={{
            fontSize: '1.1rem',
            color: '#94a3b8',
            margin: 0,
            fontFamily: '"JetBrains Mono", monospace'
          }}>
            Real-time USDC peer-to-peer trading volumes across major exchanges
          </p>
        </div>

        {/* Stats Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
          animation: 'slideIn 0.6s ease-out 0.1s backwards'
        }}>
          <div style={{
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: '16px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              fontSize: '0.875rem',
              color: '#94a3b8',
              marginBottom: '0.5rem',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Total Volume
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#38bdf8',
              fontFamily: '"JetBrains Mono", monospace'
            }}>
              ${totalVolume.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
          </div>

          <div style={{
            background: 'rgba(129, 140, 248, 0.1)',
            border: '1px solid rgba(129, 140, 248, 0.2)',
            borderRadius: '16px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              fontSize: '0.875rem',
              color: '#94a3b8',
              marginBottom: '0.5rem',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Active Orders
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#818cf8',
              fontFamily: '"JetBrains Mono", monospace'
            }}>
              {totalOrders}
            </div>
          </div>

          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '16px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              fontSize: '0.875rem',
              color: '#94a3b8',
              marginBottom: '0.5rem',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Exchanges
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#10b981',
              fontFamily: '"JetBrains Mono", monospace'
            }}>
              {Object.keys(volumes).length}
            </div>
          </div>

          <div style={{
            background: 'rgba(248, 113, 113, 0.1)',
            border: '1px solid rgba(248, 113, 113, 0.2)',
            borderRadius: '16px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{
              fontSize: '0.875rem',
              color: '#94a3b8',
              marginBottom: '0.5rem',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Last Update
            </div>
            <div style={{
              fontSize: '1rem',
              fontWeight: '500',
              color: '#f87171',
              fontFamily: '"JetBrains Mono", monospace'
            }}>
              {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '2rem',
          animation: 'slideIn 0.6s ease-out 0.2s backwards'
        }}>
          <button
            onClick={fetchAllVolumes}
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
              opacity: loading ? 0.6 : 1,
              boxShadow: '0 4px 20px rgba(56, 189, 248, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 30px rgba(56, 189, 248, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 20px rgba(56, 189, 248, 0.3)';
            }}
          >
            <RefreshCw size={18} style={{
              animation: loading ? 'spin 1s linear infinite' : 'none'
            }} />
            {loading ? 'Updating...' : 'Refresh Data'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'rgba(248, 113, 113, 0.1)',
            border: '1px solid rgba(248, 113, 113, 0.3)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '2rem',
            color: '#f87171'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Exchange Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {exchanges.map((exchange, index) => {
            const volumeData = volumes[exchange.id];
            const isLoading = loading && !volumeData;

            return (
              <div
                key={exchange.id}
                className="card-hover"
                style={{
                  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  padding: '2rem',
                  position: 'relative',
                  overflow: 'hidden',
                  backdropFilter: 'blur(10px)',
                  animation: `slideIn 0.6s ease-out ${0.3 + index * 0.1}s backwards`
                }}
              >
                {/* Decorative gradient */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '150px',
                  height: '150px',
                  background: `radial-gradient(circle, ${exchange.color}20 0%, transparent 70%)`,
                  pointerEvents: 'none'
                }} />

                {/* Exchange Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.5rem',
                  position: 'relative'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: exchange.color,
                      animation: volumeData ? 'pulse 2s ease-in-out infinite' : 'none'
                    }} />
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      margin: 0,
                      color: '#e8edf5'
                    }}>
                      {exchange.name}
                    </h3>
                  </div>
                  <DollarSign size={24} style={{ color: exchange.color, opacity: 0.6 }} />
                </div>

                {/* Volume Data */}
                {isLoading ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '2rem 0',
                    color: '#64748b'
                  }}>
                    <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite' }} />
                    <p style={{ marginTop: '1rem' }}>Loading...</p>
                  </div>
                ) : volumeData ? (
                  <>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{
                        fontSize: '0.875rem',
                        color: '#94a3b8',
                        marginBottom: '0.5rem',
                        fontWeight: '500',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        24h Volume
                      </div>
                      <div style={{
                        fontSize: '2.25rem',
                        fontWeight: '700',
                        color: exchange.color,
                        fontFamily: '"JetBrains Mono", monospace',
                        textShadow: `0 0 20px ${exchange.color}40`
                      }}>
                        ${volumeData.volume.toLocaleString(undefined, { 
                          minimumFractionDigits: 0, 
                          maximumFractionDigits: 0 
                        })}
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1rem',
                      paddingTop: '1.5rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#64748b',
                          marginBottom: '0.25rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          Active Orders
                        </div>
                        <div style={{
                          fontSize: '1.25rem',
                          fontWeight: '600',
                          color: '#e8edf5',
                          fontFamily: '"JetBrains Mono", monospace'
                        }}>
                          {volumeData.orders}
                        </div>
                      </div>
                      <div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#64748b',
                          marginBottom: '0.25rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          Avg Price
                        </div>
                        <div style={{
                          fontSize: '1.25rem',
                          fontWeight: '600',
                          color: '#e8edf5',
                          fontFamily: '"JetBrains Mono", monospace'
                        }}>
                          ${volumeData.avgPrice.toFixed(4)}
                        </div>
                      </div>
                    </div>

                    {/* Show note if simulated data */}
                    {volumeData.note && (
                      <div style={{
                        marginTop: '1rem',
                        padding: '0.5rem',
                        background: 'rgba(251, 191, 36, 0.1)',
                        border: '1px solid rgba(251, 191, 36, 0.2)',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        color: '#fbbf24'
                      }}>
                        ℹ️ {volumeData.note}
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '2rem 0',
                    color: '#64748b'
                  }}>
                    No data available
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div style={{
          marginTop: '3rem',
          padding: '1.5rem',
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center',
          color: '#94a3b8',
          fontSize: '0.875rem',
          animation: 'slideIn 0.6s ease-out 0.8s backwards'
        }}>
          <p style={{ margin: '0 0 0.5rem 0' }}>
            📊 Data refreshes automatically every 30 seconds | Connected to backend API on port 3001
          </p>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
            ✅ Live data from Binance & Bybit | ⚠️ OKX & KuCoin may require API authentication
          </p>
        </div>
      </div>
    </div>
  );
};

export default P2PVolumeTracker;
