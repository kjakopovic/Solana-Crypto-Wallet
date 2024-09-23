import { View, Text, Image } from 'react-native'
import React from 'react'
import { TransactionHistoryData } from '@/context/WalletFunctions'

import { images } from '@/constants'

const TransactionHistoryCardItem: React.FC<TransactionHistoryData> = ({ fromPublicWallet, toPublicWallet, coinLogoBase64, coinName, transferBalanceInToken, transferTimestamp }) => {
    return (
        <View className='w-[90%] min-h-[10vh] items-center justify-between flex-row mb-2'>
            <View className='flex-row items-start'>
                <View className='w-11 h-11 items-center justify-center'>
                    <Image
                        source={coinLogoBase64 !== '' ? { uri: coinLogoBase64 } : images.logoSmall}
                        className='w-11 h-11 rounded-full'
                        resizeMode='contain'
                    />
                </View>
                <View className='ml-2 space-y-0.5'>
                    <Text className='font-psemibold text-[14px] text-secondaryHighlight'>
                        {coinName}
                    </Text>
                    <Text className='font-pmedium text-[12px] text-secondary'>
                        {transferTimestamp}
                    </Text>
                </View>
            </View>
            <View className='justify-center items-center'>
                <Text className='font-psemibold text-[14px] text-secondaryHighlight'>
                    {transferBalanceInToken >= 0 ? `+ ${transferBalanceInToken}` : transferBalanceInToken}
                </Text>
            </View>
        </View>
    )
}

export default TransactionHistoryCardItem