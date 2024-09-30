import { View, Text, KeyboardAvoidingView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { router, Href } from 'expo-router'

import React, { useState, useEffect } from 'react'

import CustomButton from '@/components/custom_button'
import CustomDialog from '@/components/custom_dialog'

import { restoreWallet } from '../../context/WalletFunctions'
import PageHeader from '@/components/page_header'
import RecoveryPhrase12Word from '@/components/recovery_phrase_12_word'

const RecoverWallet = () => {
    const [recoveryPhrase, setRecoveryPhrase] = useState([] as string[])
    const [isCheckingRecoveryPhrase, setIsCheckingRecoveryPhrase] = useState(false)
    const [isWalletRestored, setIsWalletRestored] = useState(false)
    const [isValidInput, setIsValidInput] = useState(false)

    const [dialogProps, setDialogProps] = useState({
        message: '',
        show: false
    })

    const validateRecoveryPhrase = () => {
        setIsCheckingRecoveryPhrase(true)
    }

    useEffect(() => {
        setIsValidInput(recoveryPhrase.filter(x => x === undefined).length === 0 && recoveryPhrase.length === 12)
    }, [recoveryPhrase])

    useEffect(() => {
        if (isCheckingRecoveryPhrase){
            try {
                restoreWallet(recoveryPhrase.join(' '))

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
                        <PageHeader title='Recovery phrase' />

                        <View className='w-full min-h-[75vh] justify-between items-center mt-20'>
                            <Text className='text-white w-[90%] font-lufgaMedium text-center'>
                                Your recovery phrase is made out of words. Please enter the words in the correct order.
                            </Text>

                            <RecoveryPhrase12Word
                                recoveryPhrase={recoveryPhrase}
                                setRecoveryPhrase={setRecoveryPhrase}
                            />

                            <CustomButton 
                                title={isCheckingRecoveryPhrase ? 'Checking...' : 'Confirm'}
                                containerStyles='w-[90%] mx-auto mt-10'
                                primary={true}
                                isLoading={!isValidInput || isCheckingRecoveryPhrase}
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