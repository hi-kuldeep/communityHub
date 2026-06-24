# 🌐 Community Hub

[![React Native](https://img.shields.io/badge/React%20Native-0.86.0-61dafb.svg?style=flat-square&logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React Query](https://img.shields.io/badge/React%20Query-5.101.0-FF4154.svg?style=flat-square&logo=reactquery)](https://tanstack.com/query/latest)
[![Zustand](https://img.shields.io/badge/Zustand-5.0.14-orange.svg?style=flat-square)](https://github.com/pmndrs/zustand)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**Community Hub** is a high-performance, offline-first React Native mobile application built as a senior engineering assessment. It enables users to browse, search, and join local communities, write and manage posts, and interact seamlessly even under poor or completely disconnected network environments.

---

## 📱 Product Showcase (Key Features)

- **🔒 Session Security (Mocked)**: Email/password authentication flow backed by a Zustand session manager. The sensitive authorization token is securely stored in device keychain using `react-native-keychain`, while non-sensitive user metadata is persisted in `AsyncStorage` to automatically restore session status across restarts.
- **📋 High-Performance Listings**: Paginated list of communities using `@shopify/flash-list` for smooth 60fps rendering, supporting search queries, multiple sorting methods (`name_asc`, `name_desc`, `members_desc`), and pull-to-refresh.
- **💬 Interactive Communities**: Tab-organized screens to inspect community details and statistics alongside a separate scrollable posts stream, complete with independent pull-to-refresh behaviors.
- **📝 Optimistic Posting Form**: Post creation screen powered by `formik` and `yup` validation. Submissions appear immediately in the feed using optimistic React Query updates, with full error handling and manual retry buttons for failed requests.
- **📶 Offline Resilience**: Global network listening via `NetInfo` that triggers a subtle offline banner. Reads load instantly from the local query cache, and offline actions (like joining/leaving a community) are held inside a synchronized queue and executed automatically when connection recovers.
- **🎨 Premium Fluid Design**: Sleek dark-mode compatible design system featuring glassmorphic floating docks, subtle animations using `react-native-reanimated`, custom loading micro-interactions, and visual states.
- **🚀 Native Splash Screens**: Clean, edge-to-edge native launch views matching the design theme on both iOS (LaunchScreen.storyboard auto-layout) and Android (`react-native-splash-view` overlay).

---

## 🛠️ Setup & Running Instructions

### Prerequisites

Before running, make sure your machine has the following tools set up:

- **Node.js**: Version 18.x or 20.x
- **Yarn** or **npm**
- **Watchman**: `brew install watchman` (macOS)
- **CocoaPods**: For iOS dependencies (`sudo gem install cocoapods`)
- **Xcode** & **Android Studio** configured with simulators/emulators.

### 🌐 Backend Service Configuration

The API and database server are hosted in a separate Git repository:

- **Backend Repo**: [hi-kuldeep/community-hub-backend](https://github.com/hi-kuldeep/community-hub-backend)
  Please follow the instructions in the backend repository to set up and run the server before launching this mobile application.

> [!NOTE]
> **Render Free Tier Server Spin-Up (Cold Starts)**:
> The hosted backend API is deployed on Render's free tier (`https://community-hub-backend-hgxl.onrender.com/`). Render automatically spins down (puts to sleep) free containers after 15 minutes of inactivity. 
> - **How to wake it up**: If the mobile application displays connection errors or fails to load data initially, open the API URL [https://community-hub-backend-hgxl.onrender.com/](https://community-hub-backend-hgxl.onrender.com/) in your web browser, or run `curl https://community-hub-backend-hgxl.onrender.com/` in your terminal.
> - **Spin-up time**: It usually takes **50 to 90 seconds** for the Render instance to spin back up and resume responding. Once it loads successfully in your browser, the mobile app will function normally.

### 🔑 Demo Credentials

To login and test the application, use one of the following mock accounts:

| User Type           | Email               | Password    |
| :------------------ | :------------------ | :---------- |
| **Standard User 1** | `test@gmail.com`    | `123456`    |
| **Standard User 2** | `sarah@example.com` | `555444333` |

### 1. Installation

Clone the repository and install dependency packages:

```bash
# Install node packages
yarn install
# or
npm install
```

If targetting iOS, configure and install CocoaPods:

```bash
cd ios
pod install
cd ..
```

### 2. Launching the App

1.  **Start Metro Bundler**:
    ```bash
    yarn start
    ```
2.  **Run Application**:
    - **iOS**: `yarn ios`
    - **Android**: `yarn android`

---

## 📐 Architecture Overview

The codebase is organized to enforce a strict **separation of concerns** (SoC), ensuring high testability, maintainability, and clean boundaries.

```
src/
├── assets/         # App static resources (images, vector icons, lottie assets)
├── components/     # Globally shared reusable UI widgets and providers
│   ├── modalProvider/   # Centralized global overlay alert system
│   ├── OfflineBanner/   # Network status connection banner
│   └── ScreenHeader.tsx # Universal screen-specific navigation headers
├── constants/      # Shared constant mappings and static configs
├── hooks/          # Cross-cutting custom hooks (e.g. useCommunityJoinQueue)
├── localization/   # i18n localization setup and string translations
├── navigation/     # Navigators, type-safe stack param definitions
├── screens/        # Screen-level modules grouped by feature domain
├── services/       # API call interfaces and TanStack Query configurations
├── store/          # Zustand client/UI stores (Auth, UI settings, Offline queue)
├── theme/          # Design tokens (colors.ts, spacing.ts, typography.ts)
├── types/          # Core TypeScript definitions (community.d.ts)
└── utils/          # General utility helpers
```

### 🔒 Strict Screen Component Structure

To avoid bloated, hard-to-test UI files, every screen directory follows a strict component architecture:

```
ScreenName/
├── ScreenName.tsx        # Pure UI markup rendering & hook consumption
├── useScreenName.ts      # Business logic: state, forms, API mutations & navigation
├── screenName.styles.ts  # Stylesheets using shared theme design tokens
├── index.ts              # Module entry point
└── components/           # Private, screen-only subcomponents
```

1.  **`ScreenName.tsx`**: A functional component containing only rendering tags, layouts, and style references. It is completely logic-free and simply consumes output parameters from `useScreenName`.
2.  **`useScreenName.ts`**: A custom hook containing React Query calls, mutations, navigation hooks, local states, forms, and business logic.
3.  **`screenName.styles.ts`**: Pure `StyleSheet.create()` styles. Inline styles are strictly banned, ensuring a single source of truth for styles referencing design tokens.

---

## 💾 State Management & Data Flow

The application divides state into two logical layers:

- **Server State (React Query)**: Caches remote data (Communities list, posts feed, community details, and user profiles) to avoid redundant requests and load screens instantly.
- **Client State (Zustand)**: Stores local client-side configuration, including authentication status, active session credentials (secured via Keychain), user preference settings, and the pending offline actions queue (persisted via AsyncStorage).

### Unidirectional Data Flow

Data flows in a single direction to keep states predictable and make debugging simple:

1.  **User Action**: The user interacts with the Screen UI (e.g. presses a button or submits a form).
2.  **Logic Hook**: The Screen component triggers a callback inside its corresponding `useScreen` hook.
3.  **API Call / Mutation**: The hook executes an API call using Axios or triggers a React Query mutation.
4.  **Cache Sync**: The mutation updates the query cache (either optimistically or on success response).
5.  **UI Refresh**: The query cache updates propagate back to the hook, causing the Screen UI to automatically re-render with the latest state.

---

## 📶 Offline-First Implementation Strategy

The offline architecture guarantees the application remains stable and functional under unreliable network conditions:

- **Offline Operation**: When the device is offline, read requests are loaded immediately from the local query cache. Writes (like joining a community) bypass remote mutation, saving actions directly to the local Zustand offline queue (persisted to AsyncStorage) and optimistically modifying the cache to update the UI instantly.
- **Reconnect Replay**: When the device detects reconnection, a synchronization listener retrieves queued actions chronologically and replays them back to the server. Once successful, actions are removed from storage, and active queries are invalidated to sync the client UI with the backend database.

> [!IMPORTANT] > **Testing Offline Flow on Simulators / Emulators**:
> Due to Apple Simulator and Android Emulator networking loopback behaviors, toggling your host computer's Wi-Fi connection off and on may not reliably broadcast network state updates to `react-native-netinfo` inside the virtualized environment. For a consistent evaluation, it is recommended to test the offline-first sync engine on a **real physical device** (toggling Wi-Fi/cellular connection) or by disabling network access directly within the simulator's internal cellular/Wi-Fi developer settings.

---

## ⚡ Performance Optimization Strategy

The application adopts key React Native performance best practices to ensure a fluid 60fps experience:

- **📋 Efficient List Rendering (FlashList & Memoized Renderers)**: Replaced standard `FlatList` with `@shopify/flash-list` in [CommunityList.tsx](file:///Users/kuldeep/kuldeep/communityHub/src/screens/communityList/CommunityList.tsx) and [CommunityDetails.tsx](file:///Users/kuldeep/kuldeep/communityHub/src/screens/communityDetails/CommunityDetails.tsx), using `estimatedItemSize` to prevent layout shifts. The `renderItem` methods are memoized via `useCallback` and list card components are wrapped in `React.memo` to eliminate redundant layout runs.
- **🖼️ High-Performance Image Caching (FastImage)**: Used `react-native-fast-image` (in [ImageComponent.tsx](file:///Users/kuldeep/kuldeep/communityHub/src/components/imageComponent/ImageComponent.tsx) and [Avatar.tsx](file:///Users/kuldeep/kuldeep/communityHub/src/components/imageComponent/Avatar.tsx)) to perform aggressive memory/disk caching and prioritize image rendering directly at the native OS layer.
- **⚡ Lightweight Form & Schema Validation (Formik & Yup)**: Leveraged `formik` to isolate input state changes and prevent parent re-renders. Combined with `yup` validation schemas memoized via `useMemo` to prevent rebuilding schemas on every render cycle.
- **🔄 Caching, Pull-to-Refresh & Pagination**: Utilized TanStack Query's caching (`staleTime` & `gcTime`) for instant loading on screen navigation. Configured end-of-scroll pagination via `onEndReached` and pull-to-refresh to fetch updates in the background.
- **🔄 Avoiding Re-renders & Proper Memoization**: Leveraged granular Zustand slice selectors, `useCallback` for event handlers, and `useMemo` for filtering/sorting computations to maintain strict reference equality across renders.

---

## ⚙️ Technical Choices & Tradeoffs

| Decision                            | Choice                               | Why                                                                                                                                             | Tradeoff                                                                                            |
| :---------------------------------- | :----------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------- |
| **Remote Data & Caching**           | React Query (TanStack)               | Handles remote caching, queries/mutations, automatic retries, pagination, and caching out of the box.                                           | Requires understanding stale/cache timers, but drastically cuts async state boilerplate.            |
| **Lightweight Global Client State** | Zustand                              | Zero-boilerplate global state management. Extremely lightweight, performant, and does not trigger parent re-renders.                            | Lacks complex middleware ecosystems like Redux Sagas, but perfect for lightweight client state.     |
| **High-Performance List Rendering** | `@shopify/flash-list`                | Reuses cell views to prevent garbage collection spikes. Ideal for maintaining 60fps scrolling in long lists.                                    | Requires careful item layout sizing to prevent visual layout shifts during view recycling.          |
| **Local Cache & Queue Persistence** | Zustand Persist + AsyncStorage       | Quick to implement, lightweight, and perfect for simple state persistence like user preferences and offline sync queues.                        | Not suited for complex relational databases, but highly sufficient for queue/preference operations. |
| **Secure Credential Management**    | `react-native-keychain`              | Secures sensitive authorization tokens in the iOS Keychain and Android Keystore, preventing token theft through standard storage inspection.    | Slightly more complex API, but critical for enterprise security compliance.                         |
| **Shared Offline Queue Handler**    | Generic `useCommunityJoinQueue` Hook | Extracted standard community join/leave queue/optimistic logic into a shared custom hook. Detail and list views use a unified path for joining. | Slight abstraction, but guarantees identical offline/online sync logic across the app.              |

---

## 🚀 Production Roadmap & Future Enhancements

If given additional timeline, the following architecture upgrades would be implemented:

1.  **Background Sync Engine**: Integrate `react-native-background-fetch` or work manager queues to replay the offline sync queue even when the app is backgrounded or terminated.
2.  **Comprehensive Component Testing**: Set up `@testing-library/react-native` tests for core custom hooks (`useScreenName.ts` hooks), utilizing `msw` (Mock Service Worker) to mock API responses at the network layer.
3.  **Refresh Token Flow**: Implement secure silent token rotation (refresh tokens) by extending the Axios interceptor logic. This allows retrieving a new short-lived access token dynamically when the current one expires, ensuring a seamless user session without requiring recurrent manual logins.
4.  **CI/CD Pipeline**: Integrate GitHub Actions with Fastlane to automate builds, trigger TypeScript validation, run tests, and publish staging builds directly to TestFlight and Play Store internal tracks.
