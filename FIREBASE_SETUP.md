# Firebase Google Authentication Setup

This guide will help you set up Google authentication using Firebase for your Brain Dump application.

## Prerequisites

- A Google account
- Firebase project created at https://console.firebase.google.com

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name (e.g., "brain-dump-app")
4. Follow the setup wizard

## Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Google" provider
   - Click on "Google" in the providers list
   - Toggle "Enable" to ON
   - Enter your project support email
   - Click "Save"

## Step 3: Get Configuration

1. Click the gear icon next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click "Add app" and choose "Web app" (</>) icon
5. Enter app nickname (e.g., "brain-dump-web")
6. Click "Register app"
7. Copy the configuration object

## Step 4: Set Environment Variables

Create a `.env.local` file in your project root with the following variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Replace the placeholder values with your actual Firebase config values.

## Step 5: Test Authentication

1. Run your development server: `npm run dev`
2. Navigate to `/login` to sign in with Google
3. Navigate to `/profile` to view user profile

## Features Implemented

- ✅ Google authentication (handles both sign in and sign up)
- ✅ User profile page
- ✅ Logout functionality
- ✅ Protected routes
- ✅ Authentication state management
- ✅ Loading states
- ✅ Clean UI with Google branding
- ✅ Simplified user experience

## Next Steps

Once Firebase is configured, you can:
- Add additional authentication providers (GitHub, Twitter, etc.)
- Add user profile editing
- Set up Firestore database for storing user data
- Add email verification for enhanced security
- Implement role-based access control

## Troubleshooting

If you encounter issues:
1. Check that all environment variables are correctly set
2. Verify Firebase project settings
3. Check browser console for error messages
4. Ensure Authentication is enabled in Firebase Console 