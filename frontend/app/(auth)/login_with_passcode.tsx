import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import { router, Href, Link } from "expo-router";

import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import PasscodeOutput from '@/components/PasscodeOutput'
import PasscodeInput from '@/components/PasscodeInput'
import CustomDialog from '@/components/CustomDialog';

const LoginWithPasscode = () => {
    const [showDialog, setShowDialog] = useState(false)
    const [passcode, setPasscode] = useState('')
    
    useEffect(() => {
        if (passcode.length === 6) {
            const callBackend = true //TODO: pozvati backend da vidimo jel tocan passcode
            if (callBackend) {
                if (router.canDismiss()) {
                    router.dismissAll()
                }
                router.replace('/(tabs)/wallet' as Href)
            }
            else {
                setPasscode('')
                setShowDialog(true)
            }
        }
    }, [passcode]);
    
    return (
        <SafeAreaView className='bg-background h-full pb-9'>
            <CustomDialog 
                title='Passcodes do not match'
                description='Please try again'
                visible={showDialog}
                showCancel={false}
                onOkPress={() => {setShowDialog(false)}}
            />

            <ScrollView>
                <View className='justify-between items-center w-full min-h-[95vh] pb-5 pt-5'>
                    <Text className='text-secondaryHighlight text-lg font-pbold mt-10'>
                        Enter Your Passcode
                    </Text>

                    <PasscodeOutput 
                        numberOfDots={6}
                        passcode={passcode}
                    />

                    <PasscodeInput
                        handleInput={(x) => {
                            setPasscode(passcode + x)
                        }}

                        handleDelete={() => {
                            setPasscode(passcode.slice(0, -1))
                        }}
                    />

                    <Text className='text-secondary text-sm font-pregular'>
                        Forgot your passcode?{' '}
                        <Link href={'/(auth)/recover_wallet'} className='text-primary'>Recover wallet</Link>
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default LoginWithPasscode