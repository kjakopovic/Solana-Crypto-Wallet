import { View, Text, Image, TouchableOpacity } from 'react-native'
import { router, Href } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react'

import CircleButton from './circle_button';

import { icons } from '@/constants'

interface WalletHeaderProps {
    gradientBoxStyles?: string
    containerStyles?: string
    isCustomProfilePicture?: boolean
    profileUri: string
    username: string
    balance: string
    solaSafePoints: string
}

const WalletHeader: React.FC<WalletHeaderProps> = ({ gradientBoxStyles, containerStyles, profileUri, username, balance, solaSafePoints, isCustomProfilePicture=false }) => {
    return (
        <>
            <View className={`items-center justify-center mt-5 ${containerStyles}`}>
                <LinearGradient
                    colors={['#1484ff', '#0066d6']}
                    start={{ x: 0.2, y: 0.2 }}
                    end={{ x: 0.7, y: 0.7 }}
                    className={`min-h-[200px] w-[90%] items-center rounded-3xl ${gradientBoxStyles}`}
                >
                    <View className='flex-row justify-between px-5 mt-5 w-[100%] h-[70px]'>
                        <View className='h-[100%] justify-center items-start'>
                            <Text className='text-white font-lufgaMedium text-[17px]'>
                                {username}
                            </Text>

                            <Text className='mt-1 text-white font-lufgaSemiBold text-[30px]'>
                                {`$${balance}`}
                            </Text>

                            <Text className='mt-1 text-white font-lufgaMedium text-[17px]'>
                                {`${solaSafePoints}`} SolaSafe Points
                            </Text>
                        </View>
                        <View className='justify-center items-center w-[70px] h-[70px] rounded-full bg-[#1457a3]'>
                            <TouchableOpacity
                                onPress={() => {router.push('/select_avatar' as Href)}}
                                activeOpacity={0.5}
                            >
                                <Image
                                    source={{ uri: profileUri}}
                                    className={`${isCustomProfilePicture ? 'w-[70px] h-[70px]' : 'w-[50px] h-[50px]'} rounded-full`}
                                    resizeMode='contain'
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View className='w-[100%] flex-row justify-between mt-5 px-2'>
                        <CircleButton 
                            icon={icons.send}
                            title='Send'
                            handleClick={() => router.push('/send_crypto' as Href)}
                            additionalImageStyles='transform -rotate-90'
                        />

                        <CircleButton 
                            icon={icons.swap}
                            title='Swap'
                            handleClick={() => router.push('/(tabs)/swap' as Href)}
                            additionalImageStyles='transform -rotate-90'
                        />

                        <CircleButton 
                            icon={icons.stake}
                            title='Stake'
                            handleClick={() => router.push('/stake_crypto' as Href)}
                        />

                        <CircleButton 
                            icon={icons.send}
                            title='Receive'
                            handleClick={() => router.push('/receive_crypto' as Href)}
                            additionalImageStyles='transform rotate-90'
                        />
                    </View>
                </LinearGradient>
            </View>
            
        </>
    )
}

export default WalletHeader