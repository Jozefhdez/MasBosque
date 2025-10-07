# +Bosque

**Cross-platform mobile application enabling real-time SOS alerts for bikers in remote forests.** 
*Status: In development*

## Overview
+Bosque is a React Native mobile app designed to improve safety for bikers in areas with limited or no network infrastructure. The app allows users to send SOS alerts with GPS and battery information, which are transmitted via a Bluetooth LoRa mesh to a backend system. Emergency teams are notified in real time to ensure rapid response.

This project was developed as part of a collaborative initiative for **Bosque de la Primavera**, addressing the challenge of reliable communication in remote recreational areas.

## Features
- **SOS Alerts:** One-touch SOS button to send critical information including GPS location, battery status, and timestamp.
- **Offline-capable:** Maps and trail information available offline for seamless navigation.
- **Bluetooth LoRa Mesh:** Transmits messages from phones to strategically placed nodes in the forest.
- **Real-time Backend:** AWS Amplify and DynamoDB handle incoming alerts and notify emergency teams instantly.
- **Secure & Reliable:** Encrypted communication channels ensure data privacy and message reliability.
- **Volunteer Dashboard:** Web interface for monitoring active alerts, tracking rescues, and exporting data.

## Tech Stack
- **Frontend:** React Native, TypeScript
- **Backend:** AWS Amplify, DynamoDB, Lambda, API Gateway
- **Communication:** Bluetooth LoRa mesh network
- **Other Tools:** Git, CI/CD pipelines

## Architecture
1. User taps SOS button on the app.
2. GPS, battery, and timestamp data are collected.
3. Data is sent via Bluetooth to nearby LoRa nodes.
4. LoRa nodes relay the message through the mesh network to a gateway node.
5. Gateway sends HTTP request to backend.
6. Backend processes the alert and notifies emergency teams.
7. Volunteers can monitor alerts through a dashboard.