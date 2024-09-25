import { View, Text, Image, Animated, Dimensions } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'

import { SafeAreaView } from 'react-native-safe-area-context'
import { router, Href, Redirect } from "expo-router";

import SegmentBar from '@/components/SegmentBar'
import { ScrollView } from 'react-native-gesture-handler'
import Swiper from "react-native-swiper";
import { images, icons } from '@/constants'
import CustomButton from '@/components/CustomButton'
import Loader from '@/components/Loader'
import { useGlobalContext } from "../context/GlobalProvider";

const Index = () => {
    const { loading, isLogged, isFirstTime } = useGlobalContext();

    if (!loading && isLogged) return <Redirect href="/(tabs)/wallet"/>;
    if (!loading && !isFirstTime && !isLogged) return <Redirect href="/(auth)/login_with_passcode"/>;

    const swiperRef = useRef<Swiper>(null);
    const [currentSegment, setCurrentSegment] = useState(0);
    const numberOfSegments = 3

    const screenWidth = Dimensions.get('window').width - 250;
    const positionX = useRef(new Animated.Value(screenWidth)).current;

    useEffect(() => {
        const moveAnimation = Animated.timing(positionX, {
            toValue: 0,
            duration: 3500,
            useNativeDriver: true,
        });
      
        Animated.loop(
            Animated.sequence([
                moveAnimation,
                Animated.timing(positionX, {
                toValue: screenWidth,
                duration: 0,
                useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <SafeAreaView className='bg-background h-full'>
            <Loader isLoading={loading} />

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
                        <View className='w-full min-h-[85vh] mt-10 items-center justify-between'>
                            <Text className='justify-center w-max font-pbold text-white text-xl'>
                                Welcome to{' '}
                                <Text className='text-primary'>
                                    SOLASAFE
                                </Text>
                            </Text>

                            <Image 
                                source={images.welcome1} 
                                className='w-[397px] h-[272px]'
                                resizeMode='contain'
                            />

                            <Text className='text-secondaryHighlight w-3/5 text-center'>
                                Your secure Solana wallet to easily manage and grow your crypto.
                            </Text>

                            <Animated.View
                                style={{
                                transform: [{ translateX: positionX }],
                                }}
                            >
                                <Image
                                    source={icons.swipeLeft}
                                    className="w-[200px] h-[75px]"
                                    resizeMode="contain"
                                />
                            </Animated.View>
                        </View>

                        {/* Slide 2 */}
                        <View className='w-full min-h-[85vh] mt-10 items-center justify-between pb-10'>
                            <Text className='justify-center text-center w-4/5 font-pbold text-white text-xl'>
                                Complete fun{' '}
                                <Text className='text-primary'>
                                    challenges
                                </Text>
                                {' '}and earn exclusive{' '}
                                <Text className='text-primary'>
                                    rewards
                                </Text>
                            </Text>

                            <Image 
                                source={images.welcome2} 
                                className='w-[397px] h-[272px]'
                                resizeMode='contain'
                            />

                            <Text className='text-secondaryHighlight w-3/5 text-center'>
                                Dive into the world of Solana with a wallet that{"'"}s more than just a storage.
                            </Text>
                        </View>

                        {/* Slide 3 */}
                        <View className='w-full min-h-[85vh] mt-10 items-center justify-between'>
                            <Image 
                                source={images.logo} 
                                className='w-[657px] h-[425px]'
                                resizeMode='contain'
                            />

                            <CustomButton 
                                title='Create new wallet'
                                handlePress={() => router.push('/(auth)/recovery_phrase_generation' as Href)}
                                containerStyles='w-[90%] mx-auto'
                                primary={true}
                            />

                            <CustomButton 
                                title='Connect to existing wallet'
                                handlePress={() => router.push('/(auth)/recover_wallet' as Href)}
                                containerStyles='w-[90%] mx-auto'
                            />
                        </View>
                    </Swiper>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Index