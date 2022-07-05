import React from 'react';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { AuthProvider } from './Contexts/AuthContext';
import Navigation from './Stacks/Navigation'

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: "light",
};
const customTheme = extendTheme({ config });

export default function App() {
  return (
    <NativeBaseProvider theme={customTheme}>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </NativeBaseProvider>
  );
}