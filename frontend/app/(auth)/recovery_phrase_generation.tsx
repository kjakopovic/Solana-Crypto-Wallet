import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'

import { SafeAreaView } from 'react-native-safe-area-context'
import { router, Href } from "expo-router";
import { ScrollView } from 'react-native-gesture-handler'
import Swiper from "react-native-swiper";

import { images, icons } from '@/constants'
import CustomButton from '@/components/custom_button'
import ExplanationPage from '@/components/explanation_page';
import SegmentBar from '@/components/segment_bar'
import Loader from '@/components/loader';

import { generateWallet } from '@/context/WalletFunctions'
import { saveItem } from '@/context/SecureStorage';
import PageHeader from '@/components/page_header';
import RecoveryPhrase12Word from '@/components/recovery_phrase_12_word';

const RecoveryPhraseGeneration = () => {
    const swiperRef = useRef<Swiper>(null);
    const [currentSegment, setCurrentSegment] = useState(0);
    const numberOfSegments = 3

    const [isRecoveryPhraseVisible, setIsRecoveryPhraseVisible] = useState(false)

    const [newRecoveryPhrase, setNewRecoveryPhrase] = useState([] as string[])
    const [emptyRecoveryPhrase, setEmptyRecoveryPhrase] = useState([
        '', '', '', '', '', '', '', '', '', '', '', ''
    ] as string[])

    const [isRecoveryPhraseLoading, setIsRecoveryPhraseLoading] = useState(true)

    useEffect(() => {
        const mnemonic = generateWallet()
        setNewRecoveryPhrase(mnemonic.split(' '))

        saveItem('isUserFound', 'true');

        setIsRecoveryPhraseLoading(false)
    }, []);

    if (isRecoveryPhraseLoading) {
        return <Loader isLoading={true} />;
    }

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
                        <View className='w-full min-h-[85vh] items-center justify-between'>
                            <PageHeader 
                                title='Recovery phrase'
                            />

                            <View className='w-full pb-10 justify-center items-center'>
                                <RecoveryPhrase12Word
                                    readonly
                                    recoveryPhrase={isRecoveryPhraseVisible ? newRecoveryPhrase: emptyRecoveryPhrase}
                                    setRecoveryPhrase={setNewRecoveryPhrase}
                                />

                                <TouchableOpacity 
                                    onPress={() => setIsRecoveryPhraseVisible(!isRecoveryPhraseVisible)} 
                                    className="flex-row absolute bottom-0 justify-center items-center"
                                >
                                    <Image
                                        source={isRecoveryPhraseVisible ? icons.eye : icons.eyeHide}
                                        className="w-6 h-6 mr-2"
                                        resizeMode="contain"
                                    />
                                    <Text className="text-secondaryHighlight font-lufgaSemiBold mt-0.5">
                                        {isRecoveryPhraseVisible ? 'Hide' : 'Show'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <CustomButton 
                                title='Continue'
                                handlePress={() => router.replace('/(auth)/enter_passcode' as Href)}
                                containerStyles='w-[90%] mx-auto'
                                primary={true}
                                isLoading={!isRecoveryPhraseVisible}
                            />
                        </View>
                    </Swiper>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default RecoveryPhraseGeneration