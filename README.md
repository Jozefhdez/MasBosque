# +Bosque

**Cross-platform mobile application enabling real-time SOS alerts for bikers in remote forests.**  
![Status](https://img.shields.io/badge/Status-In%20Development-yellow)

## Overview
+Bosque is a React Native mobile app designed to improve safety for bikers in areas with limited or no network infrastructure. The app allows users to:

- **Send SOS Alerts:** Share GPS location, battery status, and timestamp in emergencies.
- **Stay Connected:** Utilize a Bluetooth LoRa mesh network for reliable communication.
- **Navigate Offline:** Access maps and trail information without an internet connection.

This project was developed as part of a collaborative initiative for **Bosque de la Primavera**, addressing the challenge of reliable communication in remote recreational areas.

## Features
- **SOS Alerts:** One-touch SOS button to send critical information including GPS location, battery status, and timestamp.
- **Offline-capable:** Maps and trail information available offline for seamless navigation.
- **Bluetooth LoRa Mesh:** Transmits messages from phones to strategically placed nodes in the forest.
- **Real-time Backend:** AWS Amplify and DynamoDB handle incoming alerts and notify emergency teams instantly.
- **Secure & Reliable:** Encrypted communication channels ensure data privacy and message reliability.
- **Volunteer Dashboard:** Web interface for monitoring active alerts, tracking rescues, and exporting data.

## Tech Stack
- **Frontend:** ![React Native](https://img.shields.io/badge/React%20Native-20232A?style=flat&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
- **Backend:** ![AWS Amplify](https://img.shields.io/badge/AWS%20Amplify-FF9900?style=flat&logo=aws-amplify&logoColor=white) ![DynamoDB](https://img.shields.io/badge/DynamoDB-4053D6?style=flat&logo=amazon-dynamodb&logoColor=white) ![AWS Lambda](https://img.shields.io/badge/AWS%20Lambda-FF9900?style=flat&logo=aws-lambda&logoColor=white) ![API Gateway](https://img.shields.io/badge/API%20Gateway-FF4F8B?style=flat&logo=amazon-api-gateway&logoColor=white)
- **Communication:** ![Bluetooth](https://img.shields.io/badge/Bluetooth-0082FC?style=flat&logo=bluetooth&logoColor=white) ![LoRa](https://img.shields.io/badge/LoRa-00AEEF?style=flat&logo=lorawan&logoColor=white)
- **Other Tools:** ![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white)

## Architecture
1. User taps SOS button on the app.
2. GPS, battery, and timestamp data are collected.
3. Data is sent via Bluetooth to nearby LoRa nodes.
4. LoRa nodes relay the message through the mesh network to a gateway node.
5. Gateway sends HTTP request to backend.
6. Backend processes the alert and notifies emergency teams.
7. Volunteers can monitor alerts through a dashboard.