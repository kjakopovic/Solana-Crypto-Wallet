import { View, Text, Image } from 'react-native'
import React from 'react'

import { images } from '@/constants'

interface TransactionHistoryCardItemProps {
    coinLogoBase64: string
    coinName: string
    transferBalanceInToken: number
    transferTimestamp?: string
    showPriceMovement?: boolean
}

const TransactionHistoryCardItem: React.FC<TransactionHistoryCardItemProps> = ({ coinLogoBase64, coinName, transferBalanceInToken, transferTimestamp, showPriceMovement = true }) => {
    return (
        <View className='w-[100%] px-3 min-h-[10vh] items-center justify-between flex-row mb-2'>
            <View className='flex-row space-x-3'>
                <View className='w-11 h-11 items-center justify-center'>
                    <Image
                        source={coinLogoBase64 !== '' ? { uri: coinLogoBase64 } : images.logoSmall}
                        className='w-11 h-11 rounded-full'
                        resizeMode='contain'
                    />
                </View>
                <View className='ml-2 space-y-0.5'>
                    <Text className='font-pmedium text-sm text-secondaryHighlight'>
                        {coinName}
                    </Text>
                    {transferTimestamp && 
                        <Text className='font-pmedium text-[12px] text-secondary'>
                            {transferTimestamp}
                        </Text>
                    }
                </View>
            </View>
            <View className='justify-center items-center'>
                <Text className='font-psemibold text-[14px] text-secondaryHighlight'>
                    {transferBalanceInToken >= 0 && showPriceMovement ? `+ ${transferBalanceInToken}` : transferBalanceInToken}
                </Text>
            </View>
        </View>
    )
}

export default TransactionHistoryCardItem