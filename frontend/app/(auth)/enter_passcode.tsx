import { View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { router, Href, useGlobalSearchParams } from "expo-router";

import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'

import PasscodeOutput from '@/components/passcode_output'
import PasscodeInput from '@/components/passcode_input'
import CustomDialog from '@/components/custom_dialog';
import PageHeader from '@/components/page_header';
import { createWelcomeNft } from '@/context/WalletFunctions';
import Loader from '@/components/loader';
import { getRandomAvatar } from '@/utils/avatars';
import { getItem, saveItem } from '@/context/SecureStorage';

const EnterPasscode = () => {
    const { changePassword } = useGlobalSearchParams();

    const [isConfirming, setIsConfirming] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showDialog, setShowDialog] = useState(false)

    const [passcodes, setPasscodes] = useState({
        newPasscode: '',
        confirmPasscode: ''
    })

    const registerUser = async () => {
        setIsLoading(true)

        try {
            const imageUrl = getRandomAvatar()

            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageUrl,
                    password: passcodes.newPasscode.trimEnd().replaceAll(' ', ''),
                    publicKey: getItem('publicKey') ?? '',
                })
            })

            if (response.status.toString().startsWith('2')) {

                const data = await response.json()

                saveItem('accessToken', data.accessToken)
                saveItem('refreshToken', data.refreshToken)
                saveItem('username', data.username)
                saveItem('imageUrl', imageUrl)
                saveItem('points', '0')

                await createWelcomeNft()

                setIsLoading(false)

                if (router.canDismiss()) {
                    router.dismissAll()
                }
                
                router.replace('/(tabs)/wallet' as Href)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const updatePassword = async () => {
        setIsLoading(true)

        try {
            const publicKey = getItem('publicKey') ?? ''
            
            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/user/update/${publicKey}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getItem('accessToken')}`,
                    'x-refresh-token': getItem('refreshToken') ?? ''
                },
                body: JSON.stringify({
                    password: passcodes.newPasscode.trimEnd().replaceAll(' ', '')
                })
            })
        
            if (response.headers.get('x-access-token')) {
                saveItem('accessToken', response.headers.get('x-access-token'))
            }

            if (response.status.toString().startsWith('2')) {
                setIsLoading(false)

                if (router.canDismiss()) {
                    router.dismissAll()
                }
                
                router.replace('/(tabs)/settings' as Href)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }
    
    useEffect(() => {
        if (passcodes.confirmPasscode.trimEnd().split(' ').length === 6) {
            if (passcodes.newPasscode === passcodes.confirmPasscode) {
                if (changePassword === undefined || changePassword === null) {
                    registerUser()
                } else {
                    updatePassword()
                }
            }
            else {
                setPasscodes({ newPasscode: '', confirmPasscode: '' })
                setIsConfirming(false)
                setShowDialog(true)
            }
        }
    }, [passcodes.confirmPasscode]);

    useEffect(() => {
        if (passcodes.newPasscode.trimEnd().split(' ').length === 6) {
            setIsConfirming(true);
        }
    }, [passcodes.newPasscode]);

    if (isLoading) {
        return (
            <Loader isLoading />
        )
    }
    
    return (
        <SafeAreaView className='bg-background h-full'>
            <CustomDialog 
                title='Passcodes do not match'
                description='Please try again'
                visible={showDialog}
                showCancel={false}
                onOkPress={() => {setShowDialog(false)}}
            />

            <ScrollView>
                <View className='justify-between items-center w-full min-h-[95vh]'>
                    <PageHeader
                        title={isConfirming ? 'Confirm Passcode' : 'Enter New Passcode'}
                    />

                    <PasscodeOutput 
                        numberOfDots={6}
                        passcode={isConfirming ? passcodes.confirmPasscode.trimEnd().split(' ') : passcodes.newPasscode.trimEnd().split(' ')}
                    />

                    <PasscodeInput
                        handleInput={(x) => {
                            isConfirming
                                ? setPasscodes({ ...passcodes, confirmPasscode: passcodes.confirmPasscode + `${x} ` })
                                : setPasscodes({ ...passcodes, newPasscode: passcodes.newPasscode + `${x} ` })
                        }}

                        handleDelete={() => {
                            isConfirming
                                ? setPasscodes({ ...passcodes, confirmPasscode: passcodes.confirmPasscode.slice(0, -2) })
                                : setPasscodes({ ...passcodes, newPasscode: passcodes.newPasscode.slice(0, -2) })
                        }}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default EnterPasscode