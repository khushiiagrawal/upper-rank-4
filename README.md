# JalRakshak (SIH25001) - Digital Water Health Surveillance

JalRakshak is an integrated solution for water health surveillance, designed for Smart India Hackathon (SIH) problem SIH25001. It enables monitoring, reporting, and alerting of water bodies using IoT sensors, field reports, and actionable insights.

## Features

- **Multi-platform:** Android app & Web dashboard (Next.js)
- **Real-time Alerts:** ML-powered, from sensors and field reports
- **Water Source Watchlist:** Track and get updates on selected water bodies
- **Interactive Map:** Visualize water bodies with live health status
- **Reporting:** File water health reports, view summaries, and send info to authorities
- **Admin Panel:** Manage users, media, and system data
- **PWA Support:** Works offline and as an installable web app

## Tech Stack

- **Frontend:** Next.js (TypeScript), PWA-ready, UI components for dashboard, map & admin
- **Mobile:** Android (Kotlin, Jetpack Compose, Dagger/Hilt)
- **Backend:** Firebase (auth, reports, messaging), MongoDB (alerts, storage), Python (Summarization ML API)
- **Observability:** Prometheus + Grafana for IoT sensor monitoring

## Modules

- **Sensors:** Arduino/Firebase for water quality
- **User:** Onboarding, home location, watchlist
- **Alerts:** Critical, warning, info; real-time push and dashboard display
- **Map:** Google Maps (Android), custom overlays (Web)
- **Reporting:** User field reports, summarization, admin actions

## Quick Start

1. **Web:** Visit [jalrakshak-lemon.vercel.app](https://jalrakshak-lemon.vercel.app)
2. **Android:** See `app-android/README.md` for setup
3. **API/ML:** Python summarizer available in `Summerizer-model/`

## SIH Relevance

- Directly addresses problem SIH25001
- Minimal, modular architecture for scalable deployment
- Real-time actionable health insights for public water sources