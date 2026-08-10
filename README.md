# AI Frands

AI Frands is a Vite + React + TypeScript CS learning portal with Firebase Authentication, study roadmaps, AI tools, assignments, streaks, and study notebooks.

## Recent fixes

- Rebranded remaining visible CS Portal copy to AI Frands.
- Added a dedicated first-time Google-user onboarding flow.
- Added `getAdditionalUserInfo()` handling so Firebase can distinguish new Google users from returning users.
- Improved Google Sign-In error handling for popup blocking, disabled providers, unauthorized domains, and network errors.
- Made the header streak badge clickable with a streak explanation modal.
- Added a polished Learning Links & Webinars card to the dashboard. External resources open in a new tab instead of rendering broken third-party pages inside the app.
- Made Study Notebook creation optimistic and functional even when the backend API is unavailable. New notebooks appear immediately and are cached locally.
- Kept server synchronization when `/api/notebooks` is available.

## Firebase Google Sign-In setup

The repository's `firebase-applet-config.json` contains the Firebase web app configuration. The frontend cannot enable Google as a provider or authorize a production domain by code alone.

In Firebase Console:

1. Open **Authentication → Sign-in method**.
2. Enable **Google**.
3. Open **Authentication → Settings → Authorized domains**.
4. Add the exact domain where AI Frands is deployed.
5. Keep `localhost` for local development.
6. If the app is deployed under a custom domain, add that custom domain as well.

The Firebase web `apiKey` is an identifier for the client application; access control is enforced through Firebase/Google configuration and security rules.

## Run locally

```bash
npm install
npm run dev
```

The project uses the existing `server.ts` entrypoint and Vite.

## Build

```bash
npm run build
```
