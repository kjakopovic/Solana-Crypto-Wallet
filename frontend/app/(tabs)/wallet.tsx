import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, RefreshControl } from 'react-native-gesture-handler'
import { router, Href } from 'expo-router'
import React, { useState, useEffect } from 'react'

import CircleButton from '@/components/CircleButton'
import CryptoAssetCardItem from '@/components/CryptoAssetCardItem'
import Loader from '@/components/Loader'

import { icons, images } from '@/constants'

import { getWalletInfo, WalletInfo, TransactionHistoryData, getTransactionsHistory } from '@/context/WalletFunctions'
import TransactionHistoryCardItem from '@/components/TransactionHistoryCardItem'

const Wallet = () => {
    const [selectedMenu, setSelectedMenu] = useState(0)

    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [loadingTransactionHistory, setLoadingTransactionHistory] = useState(false)

    const [currentTransactionsHistoryPage, setCurrentTransactionsHistoryPage] = useState(1)
    const [hasMoreTransactionHistory, setHasMoreTransactionHistory] = useState(true);

    const [walletInfo, setWalletInfo] = useState({
        balance: '0.00',
        tokens: []
    } as WalletInfo)
    const [history, setHistory] = useState([] as TransactionHistoryData[])

    const fetchWalletInfo = async () => {
        const fetching = await Promise.all([
            // await getWalletInfo(),
            await getTransactionsHistory(1)
        ])

        // setWalletInfo(fetching[0])
        setHistory(fetching[0]) //TODO: inace je index 1
        setCurrentTransactionsHistoryPage(2)

        setLoading(false)
    }

    const fetchMoreTransactionHistory = async () => {
        try {
            console.log('Fetching more transaction history...');
            setLoadingTransactionHistory(true);
            const newHistory = await getTransactionsHistory(currentTransactionsHistoryPage);
            if (newHistory.length === 0) {
                console.log('No more transaction history to fetch.');
                setHasMoreTransactionHistory(false);
            } else {
                setHistory((prevHistory) => [...prevHistory, ...newHistory]);
                setCurrentTransactionsHistoryPage((prevPage) => prevPage + 1);
            }
        } catch (error) {
            console.error('Error fetching transaction history:', error);
        } finally {
            setLoadingTransactionHistory(false);
        }
    };

    useEffect(() => {
        fetchWalletInfo()
    }, [])

    if (loading) {
        return <Loader isLoading={true} />
    }

    return (
        <SafeAreaView className='bg-background h-full'>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        enabled={true}
                        refreshing={refreshing}
                        onRefresh={async () => {
                            setRefreshing(true)
                            await fetchWalletInfo()
                            setRefreshing(false)
                        }}
                        colors={['#BBA880']}
                        progressBackgroundColor={'#02020D'}
                    />
                }
            >
                <View className='min-h-[85vh] w-full mt-7 items-center mb-[100px]'>
                    {/*TODO: onclick na tu sliku moze birati ostale avatare za profilne slike*/}
                    <View className='w-full items-center'>
                        <Image 
                            source={images.userProfileTemplate}
                            className='w-20 h-20'
                            resizeMode="contain"
                        />

                        <Text className='text-secondaryHighlight text-sm font-pbold mt-5 text-center'>
                            RandomUsernameokefoiod
                        </Text>

                        <Text className='text-secondaryHighlight text-3xl font-pbold mt-2 text-center'>
                            ${walletInfo.balance}
                        </Text>
                    </View>

                    <View className='w-[90%] justify-between flex-row mt-5'>
                        <CircleButton 
                            title='Send'
                            icon={icons.arrowDown}
                            handleClick={() => {
                                router.push('/send_crypto' as Href)
                            }}
                            additionalStyles='rotate-180'
                        />

                        <CircleButton 
                            title='Swap'
                            icon={icons.trade}
                            handleClick={() => {}}
                        />

                        <CircleButton 
                            title='Stake'
                            icon={icons.moneyBox}
                            handleClick={() => {}}
                        />

                        <CircleButton 
                            title='Receive'
                            icon={icons.arrowDown}
                            handleClick={() => {}}
                        />
                    </View>

                    <View className='min-h-[18vh] w-[90%] bg-secondaryUtils rounded-3xl mt-5'>
                        <View className='flex-row justify-between mt-3 pb-2'>
                            <TouchableOpacity
                                onPress={() => {setSelectedMenu(0)}}
                                activeOpacity={1}
                            >
                                <Text className={`${selectedMenu === 0 ? 'text-secondaryHighlight' : 'text-secondary'} ml-7 text-[16px] font-pmedium`}>
                                    Assets
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {setSelectedMenu(1)}}
                                activeOpacity={1}
                            >
                                <Text className={`${selectedMenu === 1 ? 'text-secondaryHighlight' : 'text-secondary'} text-[16px] font-pmedium`}>
                                    Staking
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {setSelectedMenu(2)}}
                                activeOpacity={1}
                            >
                                <Text className={`${selectedMenu === 2 ? 'text-secondaryHighlight' : 'text-secondary'} mr-7 text-[16px] font-pmedium`}>
                                    Activity
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {selectedMenu === 0 && (
                            <View className='w-[90%] mx-4'>
                                {walletInfo.tokens.map((token, index) => (
                                    <CryptoAssetCardItem 
                                        sourcePicutre={token.logoURIbase64}
                                        assetName={token.name}
                                        currentPrice={`$${token.marketValueInDollars}`}
                                        oneDayMovement={token.oneDayMovement}
                                        userAmount={token.userAmount}
                                        key={index}
                                    />
                                ))}
                            </View>
                        )}

                        {selectedMenu === 1 && (
                            <View className='w-full justify-center items-center'>
                                <Text className='text-secondary text-sm font-pregular mt-2'>
                                    There are no staking assets
                                </Text>
                            </View>
                        )}

                        {selectedMenu === 2 && (
                            <View className='w-full justify-center items-center'>
                                {history.length === 0 ? (
                                    <Text className='text-secondary text-sm font-pregular mt-2'>
                                        No history
                                    </Text>
                                ) : (
                                    <FlatList
                                        scrollEnabled={false}
                                        data={history}
                                        renderItem={({ item }: any) => (
                                            <TransactionHistoryCardItem
                                              transferBalanceInToken={item.transferBalanceInToken}
                                              coinLogoBase64={item.coinLogoBase64}
                                              coinName={item.coinName}
                                              fromPublicWallet={item.fromPublicWallet}
                                              toPublicWallet={item.toPublicWallet}
                                              transferTimestamp={item.transferTimestamp}
                                            />
                                        )}
                                        keyExtractor={(item, index) => index.toString()}
                                        onEndReached={fetchMoreTransactionHistory}
                                        onEndReachedThreshold={0.2}
                                        ListFooterComponent={
                                            loadingTransactionHistory && hasMoreTransactionHistory ? (
                                                <Loader isLoading={true} />
                                            ) : null
                                        }
                                    />
                                )}
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Wallet