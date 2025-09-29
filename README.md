# JalRakshak (SIH25001) - Digital Water Health Surveillance

JalRakshak is an integrated solution for water health surveillance, designed for Smart India Hackathon (SIH) problem SIH25001. It enables monitoring, reporting, and alerting of water bodies using IoT sensors, field reports, and actionable insights.

## Features

### Core Platform
- **Multi-platform:** Android app & Web dashboard (Next.js)
- **Multi-lingual Support:** Available in Hindi, English, Assamese, Bangla, Bodo, Mizo, Manipuri, and Nepali for wider accessibility
- **PWA Support:** Works offline and as an installable web app
- **Cross-device Sync:** Seamless data synchronization across all devices

### Specialized Dashboards
- **Healthcare Worker Dashboard:** Dedicated interface for medical professionals to monitor water-related health impacts, disease tracking, and outbreak management
- **Legal Authority Dashboard:** Compliance monitoring, regulatory reporting, legal documentation, and enforcement tracking tools
- **Admin Panel:** Comprehensive system management, user administration, media management, and system analytics
- **Public Dashboard:** General public access for water quality information and community reporting (available in app only)

### Water Monitoring & Alerts
- **Real-time Alerts:** ML-powered alerts from IoT sensors and field reports with severity classification
- **Water Source Watchlist:** Track and receive updates on selected water bodies with custom notification preferences
- **Interactive Maps:** Visualize water bodies with live health status, contamination levels, and historical data

## Tech Stack

### Web Only
- **Framework:** Next.js 14 with TypeScript, App Router, and Server Components
- **UI/UX:** Tailwind CSS, Framer Motion animations, responsive design
- **PWA:** Service workers, offline functionality, push notifications
- **Internationalization:** Next-intl for multi-language support (Hindi, English, Assamese, Bangla, Bodo, Mizo, Manipuri, Nepali)

### Mobile Application
- **Platform:** Android (Kotlin, Jetpack Compose)
- **Architecture:** Clean Architecture with MVVM pattern
- **DI:** Dagger/Hilt for dependency injection
- **Location:** GPS tracking and geofencing for water source monitoring
- **Camera:** Image capture and processing for field reports

### Backend & Infrastructure
- **Authentication:** Firebase Auth with role-based access control
- **Database:** MongoDB for scalable data storage and analytics
- **Real-time:** Firebase Realtime Database for live alerts and notifications
- **File Storage:** S3 bucket for images, videos, and documents

### AI & Machine Learning
- **Text Processing:** Python-based summarization API using transformers
- **Image Analysis:** TensorFlow/PyTorch models for water quality assessment from images
- **Predictive Analytics:** Time series forecasting for water quality trends
- **Natural Language:** Multi-language text processing and translation services

### Monitoring & Analytics
- **IoT Monitoring:** Prometheus + Grafana for sensor data visualization
- **Application Monitoring:** Real-time performance and error tracking
- **Data Analytics:** Advanced reporting and dashboard analytics
- **Security:** End-to-end encryption, secure API endpoints, and data protection

## Modules

### Sensor Management
- **IoT Integration:** Arduino-based sensors with Firebase connectivity for real-time data
- **Water Quality Metrics:** pH, turbidity, dissolved oxygen, temperature, and contamination detection
- **Calibration System:** Remote sensor calibration and maintenance scheduling
- **Data Validation:** Automated data quality checks and anomaly detection

### User Management & Authentication
- **Multi-role System:** Citizens, healthcare workers, legal authorities, and administrators
- **Onboarding:** Guided setup with location services and notification preferences
- **Profile Management:** Personal dashboards with activity history and saved locations
- **Watchlist:** Personalized monitoring of selected water sources with custom alerts

### Alert & Notification System
- **Severity Levels:** Critical (immediate health risk), Warning (potential issues), Info (updates)
- **Multi-channel Delivery:** Push notifications, SMS, email, and in-app alerts
- **Geo-targeted Alerts:** Location-based notifications for nearby water sources
- **Emergency Broadcasting:** Mass notification system for water-related emergencies

### Mapping & Visualization
- **Interactive Maps:** Google Maps (Android) with custom web-based mapping solution
- **Layer Management:** Water sources, contamination zones, sensor locations, and jurisdiction boundaries
- **Historical Data:** Time-lapse visualization of water quality changes
- **Offline Maps:** Cached mapping data for areas with limited connectivity

## SIH Relevance

### Problem SIH25001 Alignment
- **Direct Implementation:** Comprehensive solution for digital water health surveillance as specified
- **Scalable Architecture:** Designed for deployment across multiple states and districts
- **Multi-stakeholder Integration:** Seamless coordination between citizens, healthcare workers, and authorities
- **Real-time Monitoring:** Immediate detection and response to water quality issues

### Innovation Highlights
- **AI-Powered Intelligence:** Machine learning for predictive analytics and automated summarization
- **Multi-lingual Accessibility:** Breaking language barriers for widespread adoption across India
- **Offline Capability:** Essential functionality available without internet connectivity
- **IoT Integration:** Seamless sensor network integration for continuous monitoring

### Social Impact
- **Public Health Protection:** Early warning systems for waterborne disease prevention
- **Regulatory Compliance:** Tools for authorities to ensure water quality standards
- **Community Empowerment:** Citizen participation in water quality monitoring and reporting
- **Emergency Response:** Rapid coordination during water contamination incidents