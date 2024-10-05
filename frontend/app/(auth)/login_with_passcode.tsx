import { View, Text } from 'react-native'
import { router, Href, Link } from "expo-router"
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'

import React, { useState, useEffect } from 'react'

import PasscodeOutput from '@/components/passcode_output'
import PasscodeInput from '@/components/passcode_input'
import CustomDialog from '@/components/custom_dialog'
import PageHeader from '@/components/page_header'
import { getItem, saveItem } from '@/context/SecureStorage'
import Loader from '@/components/loader'

const LoginWithPasscode = () => {
    const [showDialog, setShowDialog] = useState(false)
    const [passcode, setPasscode] = useState('')
    const [isConfirming, setIsConfirming] = useState(false)
    
    useEffect(() => {
        const loginUser = async () => {
            setIsConfirming(true)
            
            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: passcode,
                    publicKey: getItem('publicKey') ?? '',
                })
            })

            if (response.status.toString().startsWith('2')) {
                const data = await response.json();

                saveItem('accessToken', data.accessToken);
                saveItem('refreshToken', data.refreshToken);
                saveItem('username', data.username);
                saveItem('points', data.points.toString());

                setIsConfirming(false)

                if (router.canDismiss()) {
                    router.dismissAll()
                }

                router.replace('/(tabs)/wallet' as Href)
            } else {
                setIsConfirming(false)

                setPasscode('')
                setShowDialog(true)
            }
        }

        if (passcode.trimEnd().split(' ').length === 6) {
            loginUser();
        }
    }, [passcode]);

    if (isConfirming) {
        return <Loader isLoading/>
    }
    
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