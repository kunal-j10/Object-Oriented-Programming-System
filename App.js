import React from "react";
import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import StartUp from "./src/navigations/Startup";

import store, { persistor } from "./store";
import NavigationRefScreen from "./src/screens/NavigationRefScreen";
import SplashScreen from "./src/screens/SplashScreen";

export default function App() {
  return (
    <RootSiblingParent>
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={<SplashScreen />} persistor={persistor}>
            <NavigationRefScreen />
            <StartUp />
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    </RootSiblingParent>
  );
}
