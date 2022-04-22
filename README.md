# Sundance PR Review Bot

This repo contains the code for the Sundance UI team's PR review assignment Slackbot. The application is written using Firebase Functions and Firestore

# Working with the repo

## Emulators

`npm run emulate` will create start the Firebase emulator suite for functions and firestore. Once the emulators are running, you can access the following

- Emulator UI: http://localhost:4000
- Firebase Functions: localhost:5001
- Firestore: localhost:8080

The emulators enable you to develop and test without touching any of the production services.

## Testing

Tests can either be executed by the Firebase emulator suite or directly through npm

### Test development

- Start the emulator suite as documented above
- Start the test script in developmen mode using `npm run test:watch`

### CI

- Install Firebase emulators on your machine and run `npm run test:ci`
