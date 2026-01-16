# P2P USDC Volume Tracker

A modern **Next.js 14** application that tracks real-time USDC peer-to-peer trading volumes across major cryptocurrency exchanges.

![P2P Volume Tracker](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)

## ✨ Features

- 🔴 **Live Data** - Real-time USDC P2P volumes from exchange APIs (no dummy data)
- 🔄 **Auto-Refresh** - Updates every 30 seconds automatically
- 🎨 **Beautiful UI** - Modern gradient design with smooth animations
- 📱 **Responsive** - Works perfectly on all screen sizes
- ⚡ **Fast** - Built with Next.js 14 App Router
- 🔒 **Type-Safe** - Full TypeScript support

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository** (or you're already here!)

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Live Data Sources

Currently fetching live data from:

- ✅ **Binance** - Public API (no authentication required)
- ✅ **Bybit** - Public API (no authentication required)
- ⚠️ **OKX** - May require API authentication
- ⚠️ **KuCoin** - May require API authentication

> **Note**: Only exchanges with successful API responses are displayed. No dummy or simulated data is shown.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Fonts**: DM Sans, JetBrains Mono

## 📁 Project Structure

```
d:/P2P-tracker/
├── app/
│   ├── api/                    # API routes (backend)
│   │   ├── binance-p2p/
│   │   ├── bybit-p2p/
│   │   ├── okx-p2p/
│   │   ├── kucoin-p2p/
│   │   └── all-exchanges/
│   ├── page.tsx               # Home page
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── components/
│   └── P2PVolumeTracker.tsx   # Main dashboard
├── lib/
│   └── types.ts               # TypeScript types
└── public/                    # Static assets
```

## 🔌 API Endpoints

All API routes are located in the `app/api` folder:

- `GET /api/binance-p2p` - Binance P2P data
- `GET /api/bybit-p2p` - Bybit P2P data
- `GET /api/okx-p2p` - OKX P2P data
- `GET /api/kucoin-p2p` - KuCoin P2P data
- `GET /api/all-exchanges` - Aggregated data from all exchanges

### Example Response

```json
{
  "binance": {
    "volume": 46467.123,
    "orders": 20,
    "avgPrice": 1.0245,
    "timestamp": "2026-01-16T19:15:48.701Z",
    "exchange": "binance"
  },
  "bybit": {
    "volume": 25369.456,
    "orders": 20,
    "avgPrice": 1.0528,
    "timestamp": "2026-01-16T19:15:48.701Z",
    "exchange": "bybit"
  }
}
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for environment variables:

```env
# Optional: API keys for exchanges that require authentication
# OKX_API_KEY=your_okx_api_key
# OKX_API_SECRET=your_okx_api_secret
# KUCOIN_API_KEY=your_kucoin_api_key
# KUCOIN_API_SECRET=your_kucoin_api_secret
```

### Customization

**Change refresh interval** (default: 30 seconds):

Edit `components/P2PVolumeTracker.tsx`:
```typescript
const interval = setInterval(fetchAllVolumes, 30000); // Change to your desired interval
```

## 📦 Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🎯 Key Highlights

### ✅ No Dummy Data
- All data is fetched from real exchange APIs
- Failed API calls result in exchanges not being displayed
- No simulated or placeholder values

### ✅ Modern Architecture
- Next.js 14 App Router
- Server-side API routes
- Client-side components for interactivity
- TypeScript for type safety

### ✅ Beautiful Design
- Gradient backgrounds
- Animated grid pattern
- Smooth transitions
- Responsive layout
- Custom fonts

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT

---

**Built with ❤️ using Next.js 14**
