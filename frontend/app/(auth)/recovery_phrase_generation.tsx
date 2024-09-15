import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useState, useRef } from 'react'

import { SafeAreaView } from 'react-native-safe-area-context'
import { router, Href } from "expo-router";
import { ScrollView } from 'react-native-gesture-handler'
import Swiper from "react-native-swiper";

import { images, icons } from '@/constants'
import CustomButton from '@/components/CustomButton'
import ExplanationPage from '@/components/ExplanationPage';
import SegmentBar from '@/components/SegmentBar'
import TopLeftExitButton from '@/components/TopLeftExitButton';
import FormField from '@/components/FormField';

const RecoveryPhraseGeneration = () => {
    const swiperRef = useRef<Swiper>(null);
    const [currentSegment, setCurrentSegment] = useState(0);
    const numberOfSegments = 3

    const [isRecoveryPhraseVisible, setIsRecoveryPhraseVisible] = useState(false)
    //TODO: change to '' when implementing backend
    const [recoveryPhrase, setRecoveryPhrase] = useState('Default so I can continue')

    return (
        <SafeAreaView className='bg-background h-full'>
            <ScrollView>
                <View className='h-full'>
                    <SegmentBar 
                        numberOfSegments={numberOfSegments}
                        currentSegment={currentSegment}
                    />

                    <Swiper
                        ref={swiperRef}
                        loop={false}
                        onIndexChanged={(index) => setCurrentSegment(index)}
                        showsPagination={false}
                        className='h-[96vh]'
                    >
                        {/* Slide 1 */}
                        <View className='w-full min-h-[85vh] mt-20 items-center'>
                            <ExplanationPage 
                                title='Recovery phrase is a backup key for your wallet.'
                                image={images.lock}
                                explanation='You will have a passcode to log in to your wallet,
                                  but in case you want to recover your wallet if you move to a new phone,
                                  you will need your recovery phrase.'
                                containerStyles='mt-5 w-full items-center min-h-[65vh] pb-10'
                                titleStyles='w-5/6'
                                explanationStyles='w-4/5'
                            />
                        </View>

                        {/* Slide 2 */}
                        <View className='w-full min-h-[85vh] mt-20 items-center'>
                            <ExplanationPage 
                                title='Keep it safe!'
                                image={images.writeDown}
                                explanation='Store it in a safe place—if lost,
                                  you will lose access to your funds permanently.
                                  Also should keep it secured from other people!'
                                containerStyles='mt-5 w-full items-center min-h-[55vh] pb-10'
                                titleStyles='w-5/6'
                                explanationStyles='w-4/5'
                            />
                        </View>

                        {/* Slide 3 */}
                        <View className='w-full min-h-[85vh] mt-10 items-center justify-between'>
                            <View className='w-full flex-row items-center justify-between'>
                                <TopLeftExitButton 
                                    containerStyles='mr-7'
                                />

                                <Text className='flex-1 font-psemibold text-white text-lg text-start ml-2'>
                                    Your Recovery Phrase
                                </Text>
                            </View>

                            <View className='w-full justify-center items-center'>
                                <FormField 
                                    value={recoveryPhrase}
                                    handleChangeText={(x) => setRecoveryPhrase(x)}
                                    isTextVisible={isRecoveryPhraseVisible}
                                    isReadOnly={true}
                                />

                                <TouchableOpacity 
                                    onPress={() => setIsRecoveryPhraseVisible(!isRecoveryPhraseVisible)} 
                                    className="flex-row absolute bottom-3 justify-center items-center"
                                >
                                    <Image
                                        source={isRecoveryPhraseVisible ? icons.eye : icons.eyeHide}
                                        className="w-6 h-6 mr-2"
                                        resizeMode="contain"
                                    />
                                    <Text className="text-secondaryHighlight font-psemibold mt-0.5">
                                        {isRecoveryPhraseVisible ? 'Hide' : 'Show'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <CustomButton 
                                title='Continue'
                                handlePress={() => router.replace('/(auth)/enter_passcode' as Href)}
                                containerStyles='w-[90%] mx-auto'
                                primary={true}
                                isLoading={!isRecoveryPhraseVisible || recoveryPhrase.length === 0}
                            />
                        </View>
                    </Swiper>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default RecoveryPhraseGeneration