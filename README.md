# Solana-Crypto-Wallet

## How to setup project
Frontend needs to be set up in expo go on your mobile phone (preferably android).
If this tutorial is not clear to you here is the video that explains how to setup development build:
https://egghead.io/lessons/react-native-create-a-development-build-for-android-with-eas
  1. Install expo go on your device
  2. You need to create expo.dev account: https://expo.dev/
  3. Open project on your computer and go to ./frontend
  4. npm install
  5. eas --version (check if you already have eas installed)
  6. if not, npm install -g eas-cli
  7. eas login (to login to your eas CLI)
  8. if you have eas.json please delete it in this step
  9. eas init
  10. eas build:configure
  11. npx eas build --profile development --platform android (aprox. 8-9mins)
  12. choose no for the emulator setup, and then go to your phone and scan the QR code
  13. while the APK is downloading on your phone, run in your CLI: npx expo start -c
  14. After the APK is downloaded and installed open your app

Database is deployed using NEON and our backend is deployed using AWS ECS so you should not have problems with it.
