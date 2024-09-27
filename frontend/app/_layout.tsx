import '../context/polyfills';

import { Stack, SplashScreen } from 'expo-router'
import React, { useEffect } from 'react'
import { useFonts } from 'expo-font'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from "expo-status-bar";

import GlobalProvider from "../context/GlobalProvider";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
    const [fontsLoaded, error] = useFonts({
        "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
        "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
        "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
        "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
        "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
        "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    });
    
    useEffect(() => {
        if (error) throw error;
        
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, error]);
    
    if (!fontsLoaded && !error) {
        return null;
    }
      
    return (
        <GlobalProvider>
            <GestureHandlerRootView className='flex-1 bg-background'>
                <Stack>
                    <Stack.Screen 
                        name="index" 
                        options={{ headerShown: false }} />

                    <Stack.Screen 
                        name="(auth)" 
                        options={{ headerShown: false }} />

                    <Stack.Screen
                        name="(tabs)" 
                        options={{ headerShown: false }} />

                    <Stack.Screen
                        name="send_crypto" 
                        options={{ headerShown: false }} />
                    
                    <Stack.Screen
                        name="receive_crypto" 
                        options={{ headerShown: false }} />

                    <Stack.Screen
                        name="stake_crypto" 
                        options={{ headerShown: false }} />
                </Stack>

                <StatusBar backgroundColor="#02020D" style="light" />
            </GestureHandlerRootView>
        </GlobalProvider>
    )
}

export default RootLayout