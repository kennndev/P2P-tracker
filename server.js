const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Binance P2P API endpoint
app.post('/api/binance-p2p', async (req, res) => {
  try {
    const response = await fetch('https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        asset: 'USDC',
        fiat: 'USD',
        merchantCheck: false,
        page: 1,
        payTypes: [],
        publisherType: null,
        rows: 20,
        tradeType: 'BUY'
      })
    });

    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      // Calculate total volume from the listings
      const totalVolume = data.data.reduce((acc, order) => {
        const volume = parseFloat(order.adv?.tradableQuantity || 0);
        return acc + volume;
      }, 0);

      const avgPrice = data.data.reduce((acc, order) => {
        return acc + parseFloat(order.adv?.price || 0);
      }, 0) / data.data.length;

      const result = {
        volume: totalVolume,
        orders: data.data.length,
        avgPrice: avgPrice,
        timestamp: new Date().toISOString(),
        exchange: 'binance'
      };

      console.log('Binance P2P Data:', result);
      res.json(result);
    } else {
      res.status(404).json({ error: 'No data available' });
    }
  } catch (error) {
    console.error('Binance API Error:', error);
    res.status(500).json({ error: 'Failed to fetch Binance data', details: error.message });
  }
});

// Bybit P2P API endpoint
app.post('/api/bybit-p2p', async (req, res) => {
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
      })
    });

    const data = await response.json();
    
    if (data.result?.items && data.result.items.length > 0) {
      const totalVolume = data.result.items.reduce((acc, order) => {
        const volume = parseFloat(order.lastQuantity || 0);
        return acc + volume;
      }, 0);

      const avgPrice = data.result.items.reduce((acc, order) => {
        return acc + parseFloat(order.price || 0);
      }, 0) / data.result.items.length;

      const result = {
        volume: totalVolume,
        orders: data.result.items.length,
        avgPrice: avgPrice,
        timestamp: new Date().toISOString(),
        exchange: 'bybit'
      };

      console.log('Bybit P2P Data:', result);
      res.json(result);
    } else {
      res.status(404).json({ error: 'No data available' });
    }
  } catch (error) {
    console.error('Bybit API Error:', error);
    res.status(500).json({ error: 'Failed to fetch Bybit data', details: error.message });
  }
});

// OKX P2P API endpoint (placeholder - requires authentication)
app.post('/api/okx-p2p', async (req, res) => {
  try {
    // OKX requires authentication, so this is a placeholder
    // You'll need to implement proper API key authentication
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
      })
    });

    const data = await response.json();
    
    // Parse OKX response format
    if (data.data && data.data.buy && data.data.buy.length > 0) {
      const totalVolume = data.data.buy.reduce((acc, order) => {
        const volume = parseFloat(order.availableAmount || 0);
        return acc + volume;
      }, 0);

      const avgPrice = data.data.buy.reduce((acc, order) => {
        return acc + parseFloat(order.price || 0);
      }, 0) / data.data.buy.length;

      const result = {
        volume: totalVolume,
        orders: data.data.buy.length,
        avgPrice: avgPrice,
        timestamp: new Date().toISOString(),
        exchange: 'okx'
      };

      console.log('OKX P2P Data:', result);
      res.json(result);
    } else {
      // If authentication is required, return simulated data
      res.json({
        volume: Math.random() * 500000 + 100000,
        orders: Math.floor(Math.random() * 50) + 10,
        avgPrice: 0.998 + Math.random() * 0.004,
        timestamp: new Date().toISOString(),
        exchange: 'okx',
        note: 'Simulated data - API requires authentication'
      });
    }
  } catch (error) {
    console.error('OKX API Error:', error);
    // Return simulated data on error
    res.json({
      volume: Math.random() * 500000 + 100000,
      orders: Math.floor(Math.random() * 50) + 10,
      avgPrice: 0.998 + Math.random() * 0.004,
      timestamp: new Date().toISOString(),
      exchange: 'okx',
      note: 'Simulated data - API error or authentication required'
    });
  }
});

// KuCoin P2P API endpoint (placeholder - requires authentication)
app.post('/api/kucoin-p2p', async (req, res) => {
  try {
    // KuCoin requires authentication
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
      })
    });

    const data = await response.json();
    
    if (data.data && data.data.items && data.data.items.length > 0) {
      const totalVolume = data.data.items.reduce((acc, order) => {
        const volume = parseFloat(order.availableAmount || 0);
        return acc + volume;
      }, 0);

      const avgPrice = data.data.items.reduce((acc, order) => {
        return acc + parseFloat(order.price || 0);
      }, 0) / data.data.items.length;

      const result = {
        volume: totalVolume,
        orders: data.data.items.length,
        avgPrice: avgPrice,
        timestamp: new Date().toISOString(),
        exchange: 'kucoin'
      };

      console.log('KuCoin P2P Data:', result);
      res.json(result);
    } else {
      // Return simulated data if no data available
      res.json({
        volume: Math.random() * 500000 + 100000,
        orders: Math.floor(Math.random() * 50) + 10,
        avgPrice: 0.998 + Math.random() * 0.004,
        timestamp: new Date().toISOString(),
        exchange: 'kucoin',
        note: 'Simulated data - API requires authentication'
      });
    }
  } catch (error) {
    console.error('KuCoin API Error:', error);
    // Return simulated data on error
    res.json({
      volume: Math.random() * 500000 + 100000,
      orders: Math.floor(Math.random() * 50) + 10,
      avgPrice: 0.998 + Math.random() * 0.004,
      timestamp: new Date().toISOString(),
      exchange: 'kucoin',
      note: 'Simulated data - API error or authentication required'
    });
  }
});

// Get all exchanges data at once
app.get('/api/all-exchanges', async (req, res) => {
  try {
    const results = {};

    // Fetch all exchanges in parallel
    const [binance, bybit, okx, kucoin] = await Promise.allSettled([
      fetch('http://localhost:' + PORT + '/api/binance-p2p', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).then(r => r.json()),
      fetch('http://localhost:' + PORT + '/api/bybit-p2p', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).then(r => r.json()),
      fetch('http://localhost:' + PORT + '/api/okx-p2p', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).then(r => r.json()),
      fetch('http://localhost:' + PORT + '/api/kucoin-p2p', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).then(r => r.json())
    ]);

    if (binance.status === 'fulfilled') results.binance = binance.value;
    if (bybit.status === 'fulfilled') results.bybit = bybit.value;
    if (okx.status === 'fulfilled') results.okx = okx.value;
    if (kucoin.status === 'fulfilled') results.kucoin = kucoin.value;

    res.json(results);
  } catch (error) {
    console.error('Error fetching all exchanges:', error);
    res.status(500).json({ error: 'Failed to fetch exchange data' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════╗
║  P2P Volume Tracker API Server                       ║
║  Server running on http://localhost:${PORT}            ║
╚══════════════════════════════════════════════════════╝

Available endpoints:
  POST /api/binance-p2p  - Fetch Binance P2P data
  POST /api/bybit-p2p    - Fetch Bybit P2P data
  POST /api/okx-p2p      - Fetch OKX P2P data
  POST /api/kucoin-p2p   - Fetch KuCoin P2P data
  GET  /api/all-exchanges - Fetch all exchanges at once
  GET  /health           - Health check

Press Ctrl+C to stop the server
  `);
});
