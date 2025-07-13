## Overview

**Flowtrack App** is a mobile habit-tracking application built with _Expo_ and _React Native_. It lets users create, view, edit, and delete habits (core CRUD functionality) and displays upcoming habit reminders. The app is organized with tabs (“Home” tab, “My Habits” tab, “Stats” tab and “Settings” tab) so you can see all your habits in one place and view the next scheduled reminders for each. To use the app, simply tap the Add button to create a new habit (enter a name, category, frequency, due date, etc.), and the app will save it locally and schedule reminders. The main purpose of building **Flowtrack App** was to practice mobile app development and user data management – it is a project to improve React Native skills and learn how to implement features like local databases and reminders.

[Software Demo Video](https://youtu.be/I8aY6ko9cpE)

## Development Environment

- **Tools:** _Node.js_ (for running the development server), _npm_ (package manager), the _Expo CLI_ (to build and run the app), and _Visual Studio Code_ as editor. _Android SDK_ with _Android Emulator_ and a physical device with _Expo Go_ app are used to test the app on Android.

  ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white&style=flat)
  ![NPM](https://img.shields.io/badge/-npm-CB3837?logo=npm&logoColor=white&style=flat)
  ![Visual Studio Code](https://img.shields.io/badge/-VS%20Code-007ACC?logo=visualstudiocode&logoColor=white&style=flat)
  ![Android SDK](https://img.shields.io/badge/-Android%20SDK-3DDC84?logo=android&logoColor=white&style=flat)
  ![Android Emulator](https://img.shields.io/badge/-Android%20Emulator-3DDC84?logo=android&logoColor=white&style=flat)
  ![Expo Go](https://img.shields.io/badge/-Expo%20Go-faebd7?logo=expo&logoColor=black&style=flat)

- **Language and Framework:** The project is written in _TypeScript_ using _React Native_. We used _Expo SDK 53_, which provides the native modules and development environment for building the app.

  ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white&style=flat)
  ![React Native](https://img.shields.io/badge/-React%20Native-61DAFB?logo=react&logoColor=black&style=flat)
  ![Expo](https://img.shields.io/badge/-Expo-000020?logo=expo&logoColor=white&style=flat)

- **Libraries:** The app uses _Expo Router_ (for the tab-based navigation interface) and _React Hooks_ for state management. It also uses _Expo_ modules and libraries for mobile features – for example, a local database with _Expo SQLite_ for saving habits, and other _Expo APIs_ for functionality. (In future, it will integrate the `expo-notifications` API for scheduling notifications.)

  ![SQLite](https://img.shields.io/badge/-SQLite-003B57?logo=sqlite&logoColor=white&style=flat)

## Useful Websites

- [Expo Docs](https://docs.expo.dev/) - Official docs for Expo SDK and guides for building and running React Native apps.
- [React Native Docs](https://reactnative.dev/docs/getting-started) - Comprehensive resource for React Native components, APIs, and mobile development practices.
- [TypeScript Docs](https://www.typescriptlang.org/docs/) - Official documentation for TypeScript language features, types, and configuration tips.
- [SQLite Docs](https://www.sqlite.org/docs.html) - Technical reference and documentation for using SQLite as a lightweight, embedded database.
- [npm](https://www.npmjs.com/) - Package registry and dependency manager used to install and manage JavaScript and TypeScript libraries.

## Future Work

- **Search and Filter Habits:** Implement a search bar and filtering options on the Habits tab so users can quickly find specific habits (by name or category).
- **Auto-Disable Expired Habits:** Add logic to automatically disable or archive habits once their due date or expiration passes, preventing outdated habits from appearing in active tracking.
- **Expo Notifications Integration:** Connect the app to the Expo Notifications API so that users receive local reminders/push notifications when habit events are upcoming. This involves scheduling notifications when habits are created.
- **User Settings Screen:** Build a user settings or preferences page (e.g. profile info, notification toggles, app theme) so that each user can configure the app to their liking.
- **User Statistics Tracking Screen:** Collect and display statistics such as habit completion rate, streaks, or charts of activity over time.
- **Custom Categories:** Allow users to create, edit, and assign custom categories for their habits, improving organization.
- **Additional Enhancements:** Further polish the UI/UX (design, responsiveness), handle edge cases and errors gracefully, and clean up the codebase. In the longer term, one could add features like data backup or multi-device sync if needed.
