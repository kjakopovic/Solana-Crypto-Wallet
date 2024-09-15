import { View, Text, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'

import React, { useState } from 'react'

import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import TopLeftExitButton from '@/components/TopLeftExitButton'

const RecoverWallet = () => {
    const [recoveryPhrase, setRecoveryPhrase] = useState('')

    const validateRecoveryPhrase = () => {
        //TODO: Implement validation logic here (backend), if true navigate to HOME else show error message
        console.log('Not implemented yet.')
    }

    return (
        <KeyboardAvoidingView className='bg-background' behavior='padding'>
            <SafeAreaView className='bg-background h-full'>
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
                                title='Confirm'
                                containerStyles='w-[90%] mx-auto mt-10'
                                primary={true}
                                isLoading={recoveryPhrase === ''}
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