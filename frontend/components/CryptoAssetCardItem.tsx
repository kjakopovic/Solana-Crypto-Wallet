import { View, Text, Image } from 'react-native'
import React from 'react'

import { images } from '../constants'

interface CryptoAssetCardItemProps {
    sourcePicutre: string
    assetName: string
    currentPrice: string
    userAmount: string
}

const CryptoAssetCardItem: React.FC<CryptoAssetCardItemProps> = ({ sourcePicutre, assetName, currentPrice, userAmount }) => {
    return (
        <View className='w-[100%] px-3 flex-row min-h-[10vh] justify-between items-center'>
            <View className='flex-row space-x-3'>
                <View className='w-11 h-11 items-center justify-center'>
                    <Image
                        source={sourcePicutre !== '' ? { uri: sourcePicutre } : images.logoSmall}
                        className='w-11 h-11 rounded-full'
                        resizeMode='contain'
                    />
                </View>
                
                <View className='space-y-0.5 min-w-[41vw] max-w-[41vw]'>
                    <Text className='font-pmedium text-sm text-secondaryHighlight'>
                        {assetName}
                    </Text>

                    <View className='flex-row items-center space-x-2'>
                        <Text className='text-secondary font-pregular text-center'>
                            {currentPrice}
                        </Text>
                    </View>
                </View>
            </View>

            <View className='justify-center items-center'>
                <Text className='font-psemibold text-[14px] text-right text-secondaryHighlight'>
                    {userAmount ?? 0}
                </Text>
            </View>
        </View>
    )
}

export default CryptoAssetCardItem