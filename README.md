# +Bosque Manu

**Emergency Response Platform for Remote Recreational Areas**  
![Status](https://img.shields.io/badge/Status-In%20Development-yellow)

---

## Executive Summary

+Bosque Manu is an enterprise-grade safety platform that bridges the connectivity gap in remote recreational areas. By combining IoT mesh networking with cloud infrastructure, we enable instant emergency response capabilities where traditional cellular networks fail.

**The Challenge:** Thousands of outdoor enthusiasts visit remote forests daily, facing life-threatening situations with no reliable way to call for help. Traditional cellular networks don't reach these areas, creating critical safety gaps for bikers, hikers, and recreational visitors.

**Our Solution:** A hybrid communication system that leverages Bluetooth LoRa mesh networking to transmit SOS alerts from any location to emergency response teams, regardless of cellular coverage.

---

## How It Works

### 1. **User Experience Layer**
Our cross-platform mobile application (iOS & Android) provides:
- **One-Touch SOS Activation:** Users trigger emergency alerts with a single button press
- **Automatic Data Collection:** GPS coordinates and precise timestamps are captured instantly
- **Offline Functionality:** SOS alert capabilities without internet connectivity
- **User Profile Management:** Medical information stored securely for first responders

**Technical Implementation:** Built with React Native and TypeScript for native performance on both platforms, utilizing device GPS APIs and local storage for offline capabilities.

### 2. **Communication Infrastructure**
When cellular networks are unavailable, our system creates an alternative communication pathway:
- **Bluetooth Low Energy (BLE):** Mobile devices connect to nearby LoRa nodes within 30-100m range
- **LoRa Mesh Network:** Strategically placed nodes relay signals across kilometers (up to 15km line-of-sight)
- **Redundancy Design:** Multiple relay paths ensure message delivery even if individual nodes fail
- **Low Power Consumption:** LoRa technology enables nodes to operate on solar power for years

**Technical Implementation:** Custom Bluetooth protocols interface with LoRa nodes running on ESP32 microcontrollers, creating a self-healing mesh network topology.

### 3. **Cloud Processing & Response Coordination**
Once alerts reach network coverage, our backend infrastructure orchestrates the emergency response:
- **Real-Time Processing:** Supabase Edge Functions process incoming alerts in milliseconds
- **Persistent Storage:** PostgreSQL database stores alert history, user profiles, and rescue metrics
- **Automated Notifications:** Emergency teams receive instant alerts via multiple channels (SMS, push notifications, dashboard)
- **Geographic Clustering:** Smart algorithms identify multiple alerts from the same incident

**Technical Implementation:** Supabase backend-as-a-service platform ensures scalability and 99.9% uptime, with built-in REST APIs and real-time subscriptions handling secure HTTPS communication.

### 4. **Emergency Response Dashboard**
Volunteer rescue teams access a dedicated web interface featuring:
- **Live Alert Monitoring:** Real-time view of all active emergencies with precise GPS mapping
- **Resource Dispatch:** Coordinate rescue teams and track response times
- **Historical Analytics:** Export data for safety reports and infrastructure planning
- **Communication Hub:** Two-way messaging capabilities (future enhancement)

**Technical Implementation:** React-based web application with real-time subscriptions via Supabase Realtime to the backend, integrated with mapping APIs for precise location visualization.

---

## Key Features

### For End Users
- ✅ **Zero Configuration Required:** Works out-of-the-box in any supported area
- ✅ **Battery Efficient:** Optimized power consumption extends device life during emergencies
- ✅ **Privacy-First Design:** Location data only transmitted during active emergencies
- ✅ **Multilingual Support:** Accessible to diverse user demographics

### For Administrators
- 📊 **Analytics Dashboard:** Track usage patterns, response times, and coverage gaps
- 🔧 **Network Monitoring:** Real-time status of all LoRa nodes in the mesh
- 📱 **User Management:** Registration, profile verification, and access control
- 📈 **Scalable Infrastructure:** Add new coverage areas without system redesign

---

## Technology Stack

### Mobile Application
![React Native](https://img.shields.io/badge/React%20Native-20232A?style=flat&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) ![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white)

### Cloud Infrastructure
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white) ![PostgREST](https://img.shields.io/badge/PostgREST-0F172A?style=flat&logo=fastapi&logoColor=white)

### IoT & Communication
![Bluetooth](https://img.shields.io/badge/Bluetooth-0082FC?style=flat&logo=bluetooth&logoColor=white) ![LoRa](https://img.shields.io/badge/LoRa-00AEEF?style=flat&logo=lorawan&logoColor=white)

### Development & Operations
![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white)

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      MOBILE APPLICATION LAYER                   │
│  React Native + TypeScript • GPS • Bluetooth • Offline Storage  │
└────────────────────────────┬────────────────────────────────────┘
                             │ Bluetooth LE
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    IoT MESH NETWORK LAYER                       │
│     LoRa Nodes (ESP32) • 15km Range • Self-Healing Mesh         │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS/REST API
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CLOUD PROCESSING LAYER                      │
│   Supabase REST API → Edge Functions → PostgreSQL → Realtime    │
└────────────────────────────┬────────────────────────────────────┘
                             │ WebSocket/REST
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RESPONSE COORDINATION LAYER                  │
│        Web Dashboard • SMS Alerts • Push Notifications          │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow (Emergency Scenario)
1. **Alert Initiation:** User activates SOS → App collects GPS, battery level, timestamp
2. **Local Transmission:** Data sent via BLE to nearest LoRa node (30-100m range)
3. **Mesh Relay:** LoRa nodes forward message through mesh network to gateway node
4. **Cloud Ingestion:** Gateway node sends HTTPS POST request to Supabase REST API
5. **Processing:** Edge Function validates data, stores in PostgreSQL, triggers real-time notifications
6. **Response Dispatch:** Emergency teams receive alert on dashboard with full context
7. **Resolution Tracking:** Status updates logged and user notified when help is en route

---

## Business Impact

### Target Markets
- 🏞️ National and state parks
- 🚴 Mountain biking trail networks
- ⛰️ Hiking and climbing destinations
- 🏕️ Remote camping areas
- 🌲 Forest conservation areas

---

## Project Status & Roadmap

**Current Phase:** Beta Testing & Infrastructure Deployment

### Completed ✅
- Core mobile application (iOS & Android)
- User authentication & profile management
- SOS alert system with GPS integration
- Cloud backend infrastructure
- Basic emergency response dashboard

### In Development 🚧
- LoRa mesh network hardware deployment
- Bluetooth-LoRa bridge protocol
- Advanced analytics dashboard
- Multi-language support

### Future Enhancements 🎯
- Two-way communication (rescue team → user)
- Offline map caching with trail overlays
- Integration with local emergency services (911)
- Wearable device support (smartwatches)
- AI-powered incident prediction

---

## Developed For

**Más Bosque Manu**, Jalisco, México  
A collaborative initiative to enhance safety infrastructure in one of Mexico's most visited protected natural areas, serving 50,000+ annual visitors.
