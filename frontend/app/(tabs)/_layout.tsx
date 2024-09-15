import { Stack, SplashScreen } from 'expo-router'
import React from 'react'
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

const TabsLayout = () => {
    return (
        <>
            <Stack>
                <Stack.Screen 
                    name="home" 
                    options={{ headerShown: false }} />
            </Stack>

            <StatusBar backgroundColor="#02020D" style="light" />
        </>
    )
}

export default TabsLayout