# +Bosque Manu

**Enterprise Emergency Response Platform for Remote Recreational Areas**  
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen) ![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-blue)

---

## Executive Summary

+Bosque Manu is an enterprise-grade safety platform that bridges the connectivity gap in remote recreational areas. By combining IoT mesh networking with cloud infrastructure, we enable instant emergency response capabilities where traditional cellular networks fail.

**The Challenge:** Thousands of outdoor enthusiasts visit remote forests daily, facing life-threatening situations with no reliable way to call for help. Traditional cellular networks don't reach these areas, creating critical safety gaps for bikers, hikers, and recreational visitors.

**Our Solution:** A hybrid communication system that leverages Bluetooth LoRa mesh networking to transmit SOS alerts from any location to emergency response teams, regardless of cellular coverage.

**Business Value:** Reduces emergency response times, provides comprehensive incident tracking and analytics, and enables infrastructure managers to make data-driven safety decisions while maintaining 99.9% system uptime.

---

## Technology Stack

### Frontend & Mobile Application
![React Native](https://img.shields.io/badge/React%20Native-20232A?style=flat&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) ![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white)

- **React Native 0.81** - Cross-platform native mobile framework for iOS and Android
- **TypeScript 5.9** - Type-safe development with enhanced code quality and maintainability
- **Expo SDK 54** - Managed workflow for rapid development and seamless deployment
- **React Navigation 7** - Type-safe navigation with native stack navigator
- **React Native BLE PLX 3.5** - Production-ready Bluetooth Low Energy communication
- **Expo Location** - GPS tracking with background location capabilities
- **AsyncStorage** - Encrypted local data persistence for offline functionality
- **React Native Gesture Handler** - Native touch interactions and gestures
- **React Native Reanimated** - 60 FPS animations running on the native thread

### Backend & Cloud Infrastructure
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white) ![PostgREST](https://img.shields.io/badge/PostgREST-0F172A?style=flat&logo=fastapi&logoColor=white)

- **Supabase** - Backend-as-a-Service platform providing:
  - **PostgreSQL Database** - ACID-compliant relational database with Row Level Security (RLS)
  - **PostgREST API** - Auto-generated RESTful API from database schema
  - **Realtime Engine** - WebSocket-based real-time data synchronization
  - **Edge Functions** - Serverless compute for complex business logic
  - **Authentication** - JWT-based authentication with email/password flows
  - **Storage** - Object storage for user profile images and attachments
- **SQLite (Expo SQLite)** - Local embedded database for offline-first data persistence

### IoT & Communication
![Bluetooth](https://img.shields.io/badge/Bluetooth-0082FC?style=flat&logo=bluetooth&logoColor=white) ![LoRa](https://img.shields.io/badge/LoRa-00AEEF?style=flat&logo=lorawan&logoColor=white)

- **Bluetooth Low Energy (BLE)** - Energy-efficient wireless communication protocol
- **LoRa/LoRaWAN** - Long-range, low-power wireless platform for IoT mesh networks
- **ESP32 Microcontrollers** - Dual-core processors for LoRa node gateway functionality

### Development & Operations
![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white) ![Sentry](https://img.shields.io/badge/Sentry-362D59?style=flat&logo=sentry&logoColor=white) ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=eslint&logoColor=white)

- **Sentry 7.6** - Real-time error tracking and performance monitoring
- **ESLint** - Code quality and consistency enforcement
- **Git** - Version control with feature branch workflow
- **Expo EAS Build** - Cloud-based native build service for iOS and Android

---

## Software Architecture

### Architectural Patterns & Best Practices

#### 1. **Clean Architecture & Separation of Concerns**
The application follows a layered architecture pattern, ensuring maintainability and scalability:

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                       │
│  Views (Screens + Components) • Controllers • Navigation        │     
│  Responsibility: UI rendering, user interactions, routing       │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────────┐
│                       STATE MANAGEMENT LAYER                    │
│          Context Providers (Auth, User, Location, BLE)          │
│  Responsibility: Global state, cross-component communication    │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────────┐
│                         BUSINESS LOGIC LAYER                    │
│              Services (Database, Bluetooth, Location)           │
│  Responsibility: Core business rules, API communication         │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────────┐
│                           DATA LAYER                            │
│        Supabase Client • SQLite • External APIs • Models        │
│  Responsibility: Data persistence, external integrations        │
└─────────────────────────────────────────────────────────────────┘
```

**Key Benefits:**
- **Modularity:** Each layer has single responsibility, enabling independent testing and updates
- **Scalability:** New features can be added without modifying existing code
- **Maintainability:** Clear boundaries make debugging and refactoring straightforward
- **Testability:** Business logic is decoupled from UI, facilitating unit and integration testing

#### 2. **Model-View-Controller (MVC) Pattern**
Controllers act as intermediaries between views and services:

- **Models** (`src/models/`) - TypeScript interfaces defining data structures
- **Views** (`src/views/`) - React components for UI rendering
- **Controllers** (`src/controllers/`) - Business logic orchestration and state management

**Example:** `SOSController` manages emergency alert flow, coordinating between `SOSScreen` view, `LocationService`, `BluetoothService`, and `DatabaseService`.

#### 3. **Context API for State Management**
React Context pattern provides centralized, type-safe state management:

- **AuthContext** - User authentication state and session management
- **UserContext** - Profile data and user preferences
- **LocationContext** - GPS tracking and permission management
- **BluetoothContext** - BLE scanning, pairing, and communication

**Benefits:**
- Eliminates prop drilling through component trees
- Provides single source of truth for shared state
- Enables real-time UI updates across components
- Type-safe with TypeScript interfaces

#### 4. **Service Layer Pattern**
Dedicated service modules encapsulate external dependencies:

- **`supabaseClient.ts`** - Singleton instance with authentication configuration
- **`databaseService.ts`** - CRUD operations, query abstraction, data validation
- **`bluetoothService.ts`** - BLE device management, characteristic reading/writing
- **`locationService.ts`** - GPS tracking, geofencing, permission handling

**Advantages:**
- Centralized error handling and logging
- Easy mocking for unit tests
- Consistent API across application
- Simplified dependency injection

#### 5. **Offline-First Architecture**
The application prioritizes functionality without network connectivity:

- **Local Database (SQLite):** Critical data cached on device

#### 6. **Security Best Practices**

**Authentication & Authorization:**
- Row Level Security (RLS) policies in PostgreSQL
- Automatic session refresh with token rotation

**Data Protection:**
- End-to-end encryption for sensitive medical information
- Encrypted local storage using Expo SecureStore
- HTTPS-only communication with certificate pinning
- Input validation and sanitization at all entry points

**Privacy Compliance:**
- GPS data transmitted only during active emergencies
- User consent management for location and Bluetooth permissions
- Data anonymization for analytics
- GDPR-compliant data retention policies

#### 8. **Error Handling & Monitoring**

**Sentry Integration:**
- Real-time error tracking with stack traces
- Performance monitoring and transaction tracing
- Release health tracking and crash analytics
- Custom error contexts (user ID, location, device info)

**Logging Strategy:**
- Structured logging with severity levels
- Context-aware log messages
- Production-safe (no PII in logs)
- Centralized log aggregation

#### 9. **Performance Optimization**

**Mobile Performance:**
- Lazy loading for heavy components
- Image optimization with Expo Image
- Native animations (60 FPS) via React Native Reanimated
- Memory-efficient list rendering with FlashList pattern
- Background task management for location tracking

**Database Performance:**
- Indexed queries on frequently accessed columns
- Connection pooling for concurrent requests
- Query result caching with TTL expiration
- Efficient pagination for large datasets

#### 10. **Scalability Patterns**

**Horizontal Scaling:**
- Stateless application design enables multi-instance deployment
- Supabase auto-scales based on load
- CDN integration for static assets

**Modular Extensibility:**
- Plugin architecture for new communication protocols
- Feature flags for gradual rollouts
- Microservice-ready service layer design

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      MOBILE APPLICATION LAYER                   │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐      │
│  │   Views     │←─│ Controllers  │←─│  Context Providers │      │
│  │ (UI/UX)     │  │  (Business)  │  │  (Global State)    │      │
│  └─────────────┘  └──────────────┘  └────────────────────┘      │
│         │                  │                    │               │
│  ┌──────┴──────────────────┴────────────────────┴──────┐        │
│  │              Service Layer                           │       │
│  │  • Database • Bluetooth • Location • Auth            │       │
│  └──────┬───────────────────────────────────────────────┘       │
│         │                                                       │
│  React Native 0.81 • TypeScript 5.9 • Expo SDK 54               │
└─────────┴───────────────────────────────────────────────────────┘
          │ BLE Protocol                    │ HTTPS/REST + WebSocket
          ▼                                 ▼
┌───────────────────────┐        ┌─────────────────────────────────┐
│   IoT MESH NETWORK    │        │    CLOUD INFRASTRUCTURE         │
│                       │        │                                 │
│  LoRa Nodes (ESP32)   │        │  ┌────────────────────────┐     │
│  • 15km Range         │────────┼──│  Supabase Platform     │     │
│  • Self-Healing Mesh  │ HTTPS  │  │  • PostgreSQL DB       │     │
│  • Solar Powered      │        │  │  • PostgREST API       │     │
│  • Redundant Paths    │        │  │  • Realtime Engine     │     │
│                       │        │  │  • Edge Functions      │     │
└───────────────────────┘        │  │  • Authentication      │     │
                                 │  └────────────────────────┘     │
                                 │                                 │
                                 │  99.9% Uptime • Auto-scaling    │
                                 └─────────────┬───────────────────┘
                                               │ WebSocket/REST
                                               ▼
                                 ┌─────────────────────────────────┐
                                 │  RESPONSE COORDINATION LAYER    │
                                 │                                 │
                                 │  • Web Dashboard                │
                                 │  • SMS Alerts                   │
                                 │  • Push Notifications           │
                                 │  • Analytics & Reporting        │
                                 └─────────────────────────────────┘
```

---

## Key Features & Capabilities

### End Users
- ✅ **One-Touch Emergency Activation:** Instant SOS with GPS coordinates, timestamp, and battery level
- ✅ **Zero Configuration Required:** Works out-of-the-box in any supported area
- ✅ **Offline Functionality:** Core features available without cellular connectivity
- ✅ **Battery Efficient:** Optimized power consumption extends device life during emergencies
- ✅ **Privacy-First Design:** Location data only transmitted during active emergencies
- ✅ **Secure Profile Management:** Medical information encrypted and accessible to authorized responders
- ✅ **Multi-Platform Support:** Native iOS and Android applications

---

## Business Impact

### Target Markets & Use Cases
- 🏞️ **National and State Parks:** 50,000+ annual visitors requiring safety infrastructure
- 🚴 **Mountain Biking Trail Networks:** High-risk activities in remote areas
- ⛰️ **Hiking and Climbing Destinations:** Multi-day expeditions without cellular coverage
- 🏕️ **Remote Camping Areas:** Family-friendly outdoor recreation zones
- 🌲 **Forest Conservation Areas:** Protected wilderness with limited infrastructure

---