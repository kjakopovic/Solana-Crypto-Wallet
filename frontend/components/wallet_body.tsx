import { View, Text } from 'react-native'
import React, { useState } from 'react'

import RowSelection from './row_selection';
import CardItem from './card_item';
import { StakingItemData, TransactionHistoryData } from '@/context/WalletFunctions';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface WalletBodyProps {
    assetsData?: any[];
    stakingData?: any;
    historyData?: any[];
    onHistoryItemPress?: (item: TransactionHistoryData) => void;
    onStakingItemPress?: (item: StakingItemData) => void;
}

const WalletBody: React.FC<WalletBodyProps> = ({ assetsData, stakingData, historyData, onHistoryItemPress, onStakingItemPress }) => {
    const [selectedOption, setSelectedOption] = useState(0);
    
    return (
        <View className='w-[100%] justify-center items-center'>
            <View className='w-[90%] justify-center items-center'>
                <RowSelection
                    options={['Assets', 'Staking', 'History']}
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                    containerStyles='mb-3 mt-7'
                />

                {selectedOption === 0 && (
                    assetsData === null || assetsData === undefined ? (
                        <Text className='text-white mt-5'>Your wallet is empty</Text>
                    ) : (
                        assetsData.map((data, index) => (
                            <CardItem 
                                key={index}
                                iconUri={data.logoURIbase64}
                                topLeftText={data.symbol}
                                bottomLeftText={data.name}
                                topRightText={`$${data.marketValueInDollars}`}
                                bottomRightText={data.userAmount}
                            />
                        ))
                    )
                )}

                {selectedOption === 1 && (
                    stakingData === null || stakingData === undefined ? (
                        <Text className='text-white mt-5'>Start staking to see data here</Text>
                    ) : (
                        stakingData.accounts.map((data: StakingItemData, index: number) => (
                            <TouchableOpacity
                                key={`button-${index}`}
                                onPress={() => {
                                    if (onStakingItemPress) {
                                        onStakingItemPress(data);
                                    }
                                }}
                            >
                                <CardItem
                                    key={index}
                                    iconUri={stakingData.imageUri}
                                    topLeftText={'wSOL'}
                                    bottomLeftText='Wrapped SOL'
                                    topRightText={`${data.stakeBalance}`}
                                />
                            </TouchableOpacity>
                        ))
                    )
                )}

                {selectedOption === 2 && (
                    historyData === null || historyData === undefined || historyData.length === 0 ? (
                        <Text className='text-white mt-5'>No trading history</Text>
                    ) : (
                        historyData.map((data: TransactionHistoryData, index) => (
                            <TouchableOpacity
                                key={`history-button-${index}`}
                                onPress={() => {
                                    if (onHistoryItemPress) {
                                        onHistoryItemPress(data);
                                    }
                                }}
                            >
                                <CardItem
                                    key={`history-${index}`}
                                    iconUri={data.coinLogoBase64}
                                    topLeftText={data.coinName}
                                    bottomLeftText={data.transferTimestamp}
                                    topRightText={`${data.transferBalanceInToken >= 0 ? '+ ' : ''}${data.transferBalanceInToken}`}
                                />
                            </TouchableOpacity>
                        ))
                    )
                )}
            </View>
        </View>
    )
}

export default WalletBody