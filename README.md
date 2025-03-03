# HealthflexTimerApp
# Timer Management App

A simple React Native Timer Management App that allows users to add, track, and manage multiple timers with different categories.

## Features
- **Add Timers**: Users can create timers with a name, duration, and category.
- **Start, Pause & Reset**: Timers can be started, paused, and Reset at any time.
- **Auto-complete**: Timers automatically mark as completed when they reach zero.
- **Error Validation**: Ensures valid input for timer name and duration.
- **Persistent Storage**: Timers are stored and retrieved using `AsyncStorage`.
- **Proper Cleanup**: Ensures timers stop running when unmounted to prevent memory leaks.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Hardheek/HealthflexTimerApp.git
   cd HealthflexTimerApp
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
   or
   ```sh
   yarn install
   ```
3. Start the app:
   ```sh
   npx react-native run-android  # For Android
   npx react-native run-ios      # For iOS
   ```

## Components & Implementation

### 1. **HomePage.js**
- Displays the list of active timers.
- Allows users to start, pause, and reset timers.
- Uses `useEffect` for timer countdown and cleanup.

### 2. **AddTimers.js**
- Provides a form to add new timers.
- Validates user input for name and duration.
- Uses `Picker` for selecting categories.
- Saves the timer data and navigates back to the home screen.

### 3. **Error Handling & Validation**
- Name field must not be empty.
- Duration must be a positive number.
- Displays error messages for invalid inputs.

### 4. **Timer State Management**
- Timers are stored using `useState` and `useEffect`.
- Running timers update every second using `setInterval`.
- Timers persist across app restarts using `AsyncStorage`.

## Technologies Used
- React Native
- AsyncStorage (for persistent storage)
- useState & useEffect (for state and timer updates)
- React Navigation (for navigation)

## Future Improvements
- Implement notifications for completed timers.
- Add custom sound alerts.
- Support background timer functionality.

## License
This project is licensed under the MIT License.

## APK file link
https://drive.google.com/file/d/1dFH6fVACV-n565lXxyPZherqPEF18-Dx/view?usp=sharing

---

Feel free to contribute and improve the app!

# Timer-app
