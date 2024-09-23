import { View, Text, Image } from 'react-native'
import React from 'react'

import CryptoPriceMovement from './CryptoPriceMovement'

import { images } from '../constants'

interface CryptoAssetCardItemProps {
    sourcePicutre: string
    assetName: string
    currentPrice: string
    oneDayMovement: string
    userAmount: string
}

const CryptoAssetCardItem: React.FC<CryptoAssetCardItemProps> = ({ sourcePicutre, assetName, currentPrice, oneDayMovement, userAmount }) => {
    return (
        <View className='w-full flex-row min-h-[10vh] justify-between items-center'>
            <View className='flex-row space-x-3'>
                <View className='w-11 h-11 items-center justify-center'>
                    <Image
                        source={sourcePicutre !== '' ? { uri: sourcePicutre } : images.logoSmall}
                        className='w-11 h-11'
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

                        <CryptoPriceMovement 
                            percentage={oneDayMovement}
                            customStyles='w-[62px]'
                        />
                    </View>
                </View>
            </View>

            <Text className='font-pregular text-lg text-secondaryHighlight items-end text-end'>
                {userAmount ?? 0}
            </Text>
        </View>
    )
}

export default CryptoAssetCardItem