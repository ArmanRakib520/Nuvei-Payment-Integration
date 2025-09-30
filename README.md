# Nuvei Payment Integration

This is a React Native application for payment processing with Nuvei payment gateway integration. The project is built using React Native 0.76.0.

## Project Setup

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

### Prerequisites

- Node.js
- npm or Yarn
- Watchman (for macOS/Linux users)
- JDK (for Android development)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Step 1: Install Dependencies

After cloning the repository, install the project dependencies:

```bash
# using npm
npm install

# OR using Yarn
yarn install
```

For iOS, you'll also need to install pods:

```bash
cd ios && pod install && cd ..
```

## Step 2: Start the Metro Server

Start Metro, the JavaScript bundler for React Native:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 3: Run the Application

Let Metro Bundler run in its own terminal. Open a new terminal from the root of your React Native project. Run the following command to start your Android or iOS app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

## Payment Integration

This project integrates the Nuvei payment gateway using their official React Native SDK. The integration follows a clean architecture pattern with the following components:

### Directory Structure

```
src/
├── components/
│   └── common/
│       └── TestSafeArea.tsx
│   └── payment/
│       ├── PaymentConfirmation.tsx
│       ├── PaymentError.tsx
│       └── PaymentForm.tsx
├── navigation/
│   └── AppNavigator.tsx
├── screens/
│   ├── home/
│   │   └── HomeScreen.tsx
│   └── payment/
│       └── PaymentScreen.tsx
└── services/
    └── payment/
        └── nuveiPaymentService.ts
```

### Payment Flow

1. User enters payment amount and currency on the HomeScreen
2. User proceeds to PaymentScreen
3. User fills in card details via NuveiCreditCardField component
4. Card gets tokenized through Nuvei SDK
5. App performs payment using the token
6. Success or error screen is displayed accordingly

### Test Card Information

For testing purposes, you can use the following card details:

- Card Number: 4111 1111 1111 1111
- Expiry Date: Any future date
- CVV: Any 3 digits
- Card Holder Name: Any name

### Nuvei SDK Configuration

#### Android Configuration

The project includes the necessary Nuvei SDK configuration for Android in:
- `android/build.gradle` - Added Nuvei maven repository
- `android/settings.gradle` - Added Nuvei dependency resolution

#### iOS Configuration

The project includes the necessary Nuvei SDK configuration for iOS in:
- `ios/Podfile` - Added Nuvei specs repo
- Enabled `use_frameworks!` and disabled Flipper (requirement for Nuvei SDK)
- Set `BUILD_LIBRARY_FOR_DISTRIBUTION` for all dependencies

## Security Considerations

**Important Note**: In a production environment, sensitive operations like obtaining session tokens and processing payments should be handled by your backend server, not in the mobile app. The current implementation includes direct API calls for demonstration purposes only.

For a production app, you should:
1. Move all API calls with merchant credentials to your secure backend
2. Only expose necessary endpoints to your mobile app
3. Implement proper authentication and authorization
4. Use HTTPS for all API communications

## Project Structure

```
NuveiPayment/
  ├── android/                 # Android native code
  ├── ios/                     # iOS native code
  ├── src/                     # Application source code
  │   ├── components/          # Reusable UI components
  │   ├── navigation/          # Navigation configuration
  │   ├── screens/             # Application screens
  │   └── services/            # API services
  ├── App.tsx                  # Main application component
  ├── index.js                 # Application entry point
  └── package.json             # Project dependencies and scripts
```

## Troubleshooting
### Metro bundler 500 error: Unable to resolve module ../../components/common/TestSafeArea

If you see a red screen with a 500 error complaining that `TestSafeArea` cannot be resolved from `src/screens/home/HomeScreen.tsx`, ensure the file `src/components/common/TestSafeArea.tsx` exists. This repository includes a minimal implementation. If the error persists, clear Metro's cache and restart:

```bash
rm -rf /tmp/metro-* && rm -rf $TMPDIR/metro-*
npm run start -- --reset-cache
```


### Android-specific Issues

If you encounter compilation issues when building for Android, try the following solutions:

1. **NDK Version Issues**: The project has been configured to use NDK version 25.1.8937393. If you have a different version, update it in `android/build.gradle`:

```gradle
ndkVersion = "25.1.8937393"  // Change to your installed version if needed
```

2. **New Architecture Issues**: If you encounter C++ compilation errors related to the new architecture, disable it by setting `newArchEnabled=false` in `android/gradle.properties`.

3. **SDK Path**: Ensure your `android/local.properties` file contains the correct path to your Android SDK:

```properties
sdk.dir=/path/to/your/Android/sdk
```

4. **Running Doctor Command**: To check if your environment is properly set up, run:

```bash
npx react-native doctor
```

### iOS-specific Issues

For iOS issues, try:

1. Make sure you have the latest version of CocoaPods installed
2. Delete the `ios/build` directory
3. Run `cd ios && pod install`

### Nuvei SDK Issues

If you encounter issues with the Nuvei SDK:

1. Make sure you've correctly configured both Android and iOS projects
2. Verify that the merchant credentials are correct
3. Check Nuvei's [official documentation](https://docs.nuvei.com/documentation/accept-payment/mobile-sdk/react-native-sdk/) for troubleshooting tips

For other issues, see the [React Native Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

## References

- [Nuvei React Native SDK Documentation](https://docs.nuvei.com/documentation/accept-payment/mobile-sdk/react-native-sdk/)
- [Nuvei API Reference](https://docs.nuvei.com/api/main/indexMain_v1_0.html)

---

### Version Control Hygiene
A `.gitignore` file is included to keep the repo clean and secure. It ignores platform build outputs (Android `build/`, iOS `DerivedData/`), Pods, Gradle caches, Metro caches, editor and OS artifacts, and common temp/log files. Lockfiles (`package-lock.json`, `yarn.lock`, `Podfile.lock`, `Gemfile.lock`) are intentionally kept under version control.