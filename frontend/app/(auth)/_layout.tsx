import { Stack, SplashScreen } from 'expo-router'
import React from 'react'
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

const AuthLayout = () => {
    return (
        <GestureHandlerRootView className='flex-1'>
            <Stack>
                <Stack.Screen 
                    name="recover_wallet" 
                    options={{ headerShown: false }} />

                <Stack.Screen 
                    name="recovery_phrase_generation" 
                    options={{ headerShown: false }} />
            </Stack>

            <StatusBar backgroundColor="#02020D" style="light" />
        </GestureHandlerRootView>
    )
}

export default AuthLayout