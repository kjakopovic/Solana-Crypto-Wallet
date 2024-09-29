import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import { router, Href, Link } from "expo-router";

import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import PasscodeOutput from '@/components/passcode_output'
import PasscodeInput from '@/components/passcode_input'
import CustomDialog from '@/components/custom_dialog';
import PageHeader from '@/components/page_header';

const LoginWithPasscode = () => {
    const [showDialog, setShowDialog] = useState(false)
    const [passcode, setPasscode] = useState('')
    
    useEffect(() => {
        if (passcode.trimEnd().split(' ').length === 6) {
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
                    <PageHeader
                        title='Enter Passcode'
                        showExitButton={false}
                    />

                    <PasscodeOutput 
                        numberOfDots={6}
                        passcode={passcode.split(' ')}
                    />

                    <View className='w-full justify-center items-center'>
                        <PasscodeInput
                            handleInput={(x) => {
                                setPasscode(passcode + `${x} `)
                            }}

                            handleDelete={() => {
                                setPasscode(passcode.slice(0, -2))
                            }}
                        />

                        <Text className='text-secondary text-sm font-lufgaRegular mt-3 -mb-3 text-white'>
                            Forgot your passcode?{' '}
                            <Link href={'/(auth)/recover_wallet'} className='text-primary'>Recover wallet</Link>
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default LoginWithPasscode