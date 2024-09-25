import { View, Text, KeyboardAvoidingView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { router, Href } from 'expo-router'

import React, { useState, useEffect } from 'react'

import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import TopLeftExitButton from '@/components/TopLeftExitButton'
import CustomDialog from '@/components/CustomDialog'

import { restoreWallet } from '../../context/WalletFunctions'

const RecoverWallet = () => {
    const [recoveryPhrase, setRecoveryPhrase] = useState('')
    const [isCheckingRecoveryPhrase, setIsCheckingRecoveryPhrase] = useState(false)
    const [isWalletRestored, setIsWalletRestored] = useState(false)

    const [dialogProps, setDialogProps] = useState({
        message: '',
        show: false
    })

    const validateRecoveryPhrase = () => {
        setIsCheckingRecoveryPhrase(true)
    }

    useEffect(() => {
        if (isCheckingRecoveryPhrase){
            try {
                restoreWallet(recoveryPhrase)

                setIsWalletRestored(true)
            } catch (error) {
                setDialogProps({ message: 'Invalid recovery phrase', show: true })
    
                setIsCheckingRecoveryPhrase(false)
            }
        }
    }, [isCheckingRecoveryPhrase])

    useEffect(() => {
        if (isWalletRestored){
            router.dismissAll()
            router.replace('/(tabs)/wallet' as Href)
        }
    }, [isWalletRestored])

    return (
        <KeyboardAvoidingView className='bg-background' behavior='padding'>
            <SafeAreaView className='bg-background h-full'>
                <CustomDialog 
                    title='Wrong recovery phrase'
                    description={dialogProps.message}
                    visible={dialogProps.show}
                    showCancel={false}
                    onOkPress={() => {setDialogProps({ ...dialogProps, show: false })}}
                />

                <ScrollView>
                    <View className='h-full w-full pb-8'>
                        <View className='w-full flex-row items-center justify-between mt-10'>
                            <TopLeftExitButton 
                                containerStyles='mr-5'
                            />

                            <Text className='flex-1 font-pbold text-white text-lg'>
                                Enter your{' '}
                                <Text className='text-primary'>
                                    recovery phrase
                                </Text>
                            </Text>
                        </View>

                        <View className='w-full min-h-[75vh] justify-between items-center mt-20'>
                            <Text className='text-secondaryHighlight w-4/5 text-left'>
                                Your recovery phrase is made out of words. Please enter the words in the correct order, divided with spaces.
                            </Text>

                            <FormField 
                                value={recoveryPhrase}
                                handleChangeText={(x) => setRecoveryPhrase(x)}
                                placeholder='Enter your recovery phrase here.'
                                otherStyles='mt-10'
                            />

                            <CustomButton 
                                title={isCheckingRecoveryPhrase ? 'Checking...' : 'Confirm'}
                                containerStyles='w-[90%] mx-auto mt-10'
                                primary={true}
                                isLoading={recoveryPhrase === '' || isCheckingRecoveryPhrase}
                                handlePress={validateRecoveryPhrase}
                            />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

export default RecoverWallet