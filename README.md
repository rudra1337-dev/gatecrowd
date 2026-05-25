# GateCrowd 🛕📊

GateCrowd is a real-time crowd monitoring and visitor guidance platform designed for the 
Puri Jagannath Temple.

The platform helps visitors:
- View live crowd conditions at different temple gates
- Compare entry options
- Receive crowd alerts and recommendations
- Submit crowd feedback
- Track crowd trends over time

GateCrowd combines:
- Real-time crowd feedback
- Historical crowd patterns
- Live updates using Socket.IO
- Crowd aggregation algorithms

---

# 🚧 Development Status

> ⚠️ GateCrowd is currently under active development.

Features, APIs, UI, architecture, and crowd intelligence systems may continue to evolve over time.

---

# ✨ Why GateCrowd?

During peak darshan hours, festivals, and special rituals at the Puri Jagannath Temple, visitors often gather at the most familiar or visibly crowded gates without knowing the actual crowd conditions across all entrances.

As a result:
- One gate may become extremely congested 🚶🚶🚶
- Waiting time increases significantly ⏳
- Crowd pressure becomes uneven across gates
- Visitor movement becomes inefficient
- Nearby gates with lower crowd levels may remain underutilized

Many visitors currently have no reliable way to know:
- Which gate has less crowd
- Which route may provide faster entry
- How crowd conditions are changing in real time

GateCrowd aims to improve crowd distribution and visitor experience using a community-driven real-time crowd monitoring system.

---

# 💡 The Solution

GateCrowd collects optional crowd feedback from visitors and combines it with:
- Live crowd reports
- Historical crowd patterns
- Real-time crowd calculations
- Time-slot based analysis

The platform then:
- Displays live crowd levels for each gate 📊
- Helps visitors compare entry options 🚪
- Suggests less crowded gates when possible ✅
- Distributes crowd movement more evenly across temple entrances 🔄
- Reduces unnecessary congestion and waiting time ⏱️

Using real-time updates with Socket.IO, GateCrowd continuously refreshes crowd conditions so visitors can make better entry decisions before reaching heavily crowded areas.

The goal is to create a smoother, safer, and more organized darshan experience for everyone visiting the temple 🛕

---

# 🎯 Mission

To help devotees make better entry decisions through real-time crowd visibility, improving safety, reducing congestion, and creating a more organized temple visit experience.

---

# 🌍 Vision

To build a scalable smart crowd management platform that can assist large religious places, festivals, public gatherings, and high-footfall areas using community-driven real-time data and intelligent crowd analysis.

---

# 🏗️ System Overview

GateCrowd consists of:

## Frontend
A React-based web application for visitors.

Features:
- Live gate crowd monitoring
- Crowd comparison
- Feedback submission
- Crowd trend visualization
- Responsive UI
- Real-time updates

## Backend
A Node.js + Express backend that:
- Stores crowd feedback
- Calculates live crowd levels
- Uses historical fallback data
- Pushes updates using Socket.IO
- Manages real-time crowd state

---

# ⚡ Core Features

- 📊 Real-time gate crowd monitoring
- 🔄 Socket.IO live updates
- 🧠 Historical + live crowd analysis
- 📝 Visitor feedback system
- 📱 Responsive modern UI
- 🌐 Offline detection support
- 🛡️ Security middleware
- 📈 Crowd trend graphs
- 🎨 Three.js background effects

---

# 🛠️ Tech Stack

## Frontend
- React 18
- Vite
- React Router DOM
- Bootstrap 5
- Three.js

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO

---

# 📂 Repository Structure

```text
gatecrowd/
│
├── frontend/     # React frontend
├── backend/      # Express backend
│
├── README.md
└── LICENSE
```

---

# 🚀 Quick Start

## 1️⃣ Clone Repository

```bash
git clone <repo-url>
cd gatecrowd
```

## 2️⃣ Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

## 3️⃣ Setup Backend

```bash
cd backend
npm install
npm run dev
```

---

# 📚 Documentation

- Frontend Documentation → `frontend/README.md`
- Backend Documentation → `backend/README.md`

---

# 🔌 Architecture

```text
Frontend (React)
       │
       ▼
REST API + Socket.IO
       │
       ▼
Backend (Express.js)
       │
       ▼
MongoDB Database
```

---

# 🔮 Future Improvements

Planned improvements include:

- 🔐 Authentication system
- 🗺️ Temple navigation assistance
- 📍 Smart route recommendations
- 📈 Admin analytics dashboard
- 🤖 AI-based crowd prediction
- ☁️ Better production deployment setup
- 📲 Push notifications
- 🧭 Live heatmaps
- 📡 IoT or sensor-based crowd integration

---

# 📄 License

MIT License

---

# ❤️ Built For

Devotees and visitors of the Puri Jagannath Temple 🛕