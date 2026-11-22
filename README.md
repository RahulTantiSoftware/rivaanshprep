# RivaanshPrep — Class 10 NCERT Secure Study & Assessment Platform

[![Spring Boot 3.3.5](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Java 21+](https://img.shields.io/badge/Java-21%2B-orange.svg)](https://openjdk.org/)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](#)

RivaanshPrep is an enterprise-grade, high-security digital learning platform tailored for **CBSE Class 10th students and educators**. It delivers verified NCERT textbooks, solutions, appendices, and study notes in both English and Hindi mediums with zero-download digital rights protection (DRM).

---

## 🌟 Key Features

1. **Complete Class 10 Subjects**:
   - Mathematics (Standard & Basic - Code 041)
   - Science (Physics, Chemistry, Biology)
   - Social Science (History, Geography, Political Science, Economics)
   - English (First Flight, Footprints Without Feet, Words and Expressions)
   - Hindi (Kshitij, Kritika, Sparsh, Sanchayan)

2. **Dual-Medium Language Switch**:
   - On-the-fly switching between **English** and **Hindi (हिंदी माध्यम)** within the secure reader without losing position or context.

3. **High-Security Anti-Download DRM Viewer**:
   - In-memory canvas rendering powered by PDF.js.
   - Zero raw blob URL injection into the DOM.
   - Dynamic canvas watermarking with student username and IP.
   - Complete prevention of keyboard shortcuts (`Ctrl+P`, `Ctrl+S`, `F12`, `Ctrl+U`), context menu right-clicks, and drag-and-drop.

4. **Role-Based Admin User Management**:
   - Seeded exclusively by backend startup (no public admin registration).
   - Unified standard login screen with automatic role-based routing.
   - Comprehensive dashboard: account status toggle (Active/Suspended), tier upgrades (Free/Pro/Premium), password resets, and user creation.

---

## 🏗️ Architecture

```
rivaanshprep/
├── web-app/
│   ├── backend/               # Spring Boot 3.3.5 REST API
│   │   ├── src/main/java/     # Controllers, Entities, Security, DTOs, Repositories
│   │   ├── src/main/resources/# application.yml, schema, configuration
│   │   └── pom.xml
│   └── frontend/              # React 19 + Vite 6 + Tailwind CSS v4
│       ├── src/               # Pages, Components, Context, API client
│       ├── public/            # Static brand assets and logo
│       └── package.json
├── ncert_class10_math/        # English NCERT Mathematics chapters
├── ncert_class10_science/     # English NCERT Science chapters
├── ncert_class10_social_science/ # English NCERT Social Science chapters
├── ncert_class10_english/     # English NCERT Literature & Language chapters
├── ncert_class10_hindi/       # Hindi NCERT chapters
└── ncert_class10_hindi_medium/ # Hindi Medium textbooks (Ganit, Vigyan, etc.)
```

---

## 🚀 Quick Start & Local Run

### Prerequisites
- **Java 21+** (`java -version`)
- **Node.js 18+** (`node -v`)
- **Maven** (included via `./mvnw`)

### 1. Run Backend
```bash
cd web-app/backend
./mvnw spring-boot:run
```
*Backend runs at: `http://localhost:8080`*

### 2. Run Frontend
```bash
cd web-app/frontend
npm install
npm run dev
```
*Frontend runs at: `http://localhost:5173`*

---

## 🔐 Default Seed Accounts

| Account Role | Username / Email | Password | Scope |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` / `admin@rivaanshprep.com` | `Admin@12345` | Full administrative control & user management |
| **Demo Student** | `student10` / `student10@rivaanshprep.com` | `Password123!` | Standard Class 10 student access |
| **Premium Student** | `aarav_sharma` / `aarav.sharma@rivaanshprep.com` | `Password123!` | Premium Class 10 student access |

---

## 🚢 Production Deployment

### Environment Variables
Configure the following in your cloud environment (Docker / AWS / Render / Railway):

```env
PORT=8080
DATABASE_URL=jdbc:h2:file:./data/rivaanshprep_db;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
NCERT_BASE_DIR=/path/to/ncert_data
JWT_SECRET=4e9c7f21a8b3d5e6f0123456789abcdef0123456789abcdef0123456789abcdef
```

### Production Build
```bash
# Build Frontend
cd web-app/frontend
npm run build

# Package Backend Jar
cd ../backend
./mvnw clean package -DskipTests
```
The deployable executable JAR is produced at `web-app/backend/target/backend-0.0.1-SNAPSHOT.jar`.
