import { Stack, SplashScreen } from 'expo-router'
import React from 'react'
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

const AuthLayout = () => {
    return (
        <>
            <Stack>
                <Stack.Screen 
                    name="recover_wallet" 
                    options={{ headerShown: false }} />

                <Stack.Screen 
                    name="recovery_phrase_generation" 
                    options={{ headerShown: false }} />

                <Stack.Screen 
                    name="enter_passcode" 
                    options={{ headerShown: false }} />

                <Stack.Screen 
                    name="login_with_passcode" 
                    options={{ headerShown: false }} />
            </Stack>

            <StatusBar backgroundColor="#02020D" style="light" />
        </>
    )
}

export default AuthLayout