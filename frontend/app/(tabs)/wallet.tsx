import { View, Text, Image, TouchableOpacity, FlatList, Modal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, RefreshControl } from 'react-native-gesture-handler'
import { router, Href } from 'expo-router'
import React, { useState, useEffect } from 'react'

import CircleButton from '@/components/CircleButton'
import CryptoAssetCardItem from '@/components/CryptoAssetCardItem'
import Loader from '@/components/Loader'
import SkeletonLoader from '@/components/SkeletonLoader'

import { icons, images } from '@/constants'

import { 
    getWalletInfo, 
    WalletInfo, 
    TransactionHistoryData, 
    getTransactionsHistory,
    getAllStakeAccounts,
    StakingItemData,
    unstakeSolana
} from '@/context/WalletFunctions'
import TransactionHistoryCardItem from '@/components/TransactionHistoryCardItem'
import CustomDialog from '@/components/CustomDialog'

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
    const [stakingData, setStakingData] = useState([{
        imageUri: '',
        accounts: [] as StakingItemData[]
    }] as any)

    const [selectedStakingItemData, setSelectedStakingItemData] = useState(null as StakingItemData | null)

    const [modalData, setModalData] = useState({
        isModalVisible: false,
        selectedTransaction: null as TransactionHistoryData | null
    })

    const [dialogProps, setDialogProps] = useState({
        title: '',
        description: '',
        visible: false
    });

    const fetchWalletInfo = async () => {
        const fetching = await Promise.all([
            await getWalletInfo(),
            await getTransactionsHistory(1),
            await getAllStakeAccounts()
        ])

        setWalletInfo(fetching[0])
        setHistory(fetching[1])
        setStakingData(fetching[2])
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

    useEffect(() => {
        if (selectedStakingItemData !== null && selectedStakingItemData !== undefined) {
            setDialogProps({
                title: 'Do you want to withdraw?',
                description: `You are about to cancel staking for ${selectedStakingItemData.stakePubkey}\nin amount: ${selectedStakingItemData.stakeBalance} SOL`,
                visible: true
            })
        }
    }, [selectedStakingItemData])

    if (loading) {
        return (
            <SafeAreaView className='bg-background h-full'>
                <View className='min-h-[85vh] w-full mt-7 items-center mb-[100px]'>
                    <View className='w-full items-center'>
                        <SkeletonLoader 
                            width={80}
                            height={80}
                            customStyles={{ borderRadius: 9999 }}
                        />

                        <SkeletonLoader 
                            width={200}
                            height={20}
                            customStyles={{ borderRadius: 20, marginTop: 20 }}
                        />

                        <SkeletonLoader 
                            width={80}
                            height={30}
                            customStyles={{ borderRadius: 20, marginTop: 8 }}
                        />
                    </View>

                    <View className='w-[90%] justify-between flex-row mt-5'>
                        <SkeletonLoader 
                            width={55}
                            height={55}
                            customStyles={{ borderRadius: 9999 }}
                        />

                        <SkeletonLoader 
                            width={55}
                            height={55}
                            customStyles={{ borderRadius: 9999 }}
                        />

                        <SkeletonLoader 
                            width={55}
                            height={55}
                            customStyles={{ borderRadius: 9999 }}
                        />

                        <SkeletonLoader 
                            width={55}
                            height={55}
                            customStyles={{ borderRadius: 9999 }}
                        />
                    </View>

                    <View className='min-h-[18vh] w-[90%] rounded-3xl mt-5'>
                        <SkeletonLoader 
                            width='100%'
                            height={90}
                            customStyles={{ borderRadius: 24, marginTop: 10 }}
                        />

                        <SkeletonLoader 
                            width='100%'
                            height={90}
                            customStyles={{ borderRadius: 24, marginTop: 10 }}
                        />

                        <SkeletonLoader 
                            width='100%'
                            height={90}
                            customStyles={{ borderRadius: 24, marginTop: 10 }}
                        />
                    </View>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className='bg-background h-full'>
            <CustomDialog 
                title={dialogProps.title}
                description={dialogProps.description}
                visible={dialogProps.visible}
                showCancel
                onOkPress={() => {
                    setDialogProps({ title: '', description: '', visible: false })

                    unstakeSolana(selectedStakingItemData?.stakePubkey ?? '', selectedStakingItemData?.stakeBalance ?? 0);
                    
                    setSelectedStakingItemData(null);
                }}
                onCancelPress={() => {
                    setDialogProps({ title: '', description: '', visible: false })
                    setSelectedStakingItemData(null);
                }}
            />
            
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
                            handleClick={() => {router.push('/(tabs)/swap' as Href)}}
                        />

                        <CircleButton 
                            title='Stake'
                            icon={icons.moneyBox}
                            handleClick={() => {router.push('/stake_crypto' as Href)}}
                        />

                        <CircleButton 
                            title='Receive'
                            icon={icons.arrowDown}
                            handleClick={() => {router.push('/receive_crypto' as Href)}}
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
                            <View className='w-full justify-center items-center'>
                                {walletInfo.tokens.map((token, index) => (
                                    <CryptoAssetCardItem 
                                        sourcePicutre={token.logoURIbase64}
                                        assetName={token.name}
                                        currentPrice={`$${token.marketValueInDollars}`}
                                        userAmount={token.userAmount}
                                        key={index}
                                    />
                                ))}
                            </View>
                        )}

                        {selectedMenu === 1 && (
                            <View className='w-full justify-center items-center'>
                                {stakingData.accounts.length === 0 ? (
                                    <Text className='text-secondary text-sm font-pregular mt-2'>
                                        There are no staking assets
                                    </Text>
                                ) : (
                                    stakingData.accounts.map((account: StakingItemData, index: number) => (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setSelectedStakingItemData(account);
                                            }}
                                            activeOpacity={0.5}
                                            key={`button-${index}`}
                                        >
                                            <TransactionHistoryCardItem
                                                transferBalanceInToken={account.stakeBalance}
                                                coinLogoBase64={stakingData.imageUri}
                                                coinName={'Wrapped SOL'}
                                                key={`item-${index}`}
                                                showPriceMovement={false}
                                            />
                                        </TouchableOpacity>
                                    ))
                                )}
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
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setModalData({
                                                        isModalVisible: true,
                                                        selectedTransaction: item
                                                    })
                                                }}
                                                activeOpacity={0.5}
                                            >
                                                <TransactionHistoryCardItem
                                                    transferBalanceInToken={item.transferBalanceInToken}
                                                    coinLogoBase64={item.coinLogoBase64}
                                                    coinName={item.coinName}
                                                    transferTimestamp={item.transferTimestamp}
                                                />
                                            </TouchableOpacity>
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

                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalData.isModalVisible}
                    >
                        <View className='flex-1 justify-center items-center bg-black/50'>
                            <View className='bg-secondaryUtils w-[90%] p-5 rounded-lg'>
                                {modalData.selectedTransaction && (
                                    <>
                                        <Text className='text-lg font-bold mb-3 text-primary text-center'>Transaction Details</Text>
                                        <Text className='text-white'>From:</Text>
                                        <Text className='text-white mb-2'>{modalData.selectedTransaction.fromPublicWallet}</Text>
                                        <Text className='text-white'>To:</Text>
                                        <Text className='text-white'>{modalData.selectedTransaction.toPublicWallet}</Text>
                                        
                                        <TouchableOpacity
                                            onPress={() => {
                                                setModalData({
                                                    isModalVisible: false,
                                                    selectedTransaction: null
                                                })
                                            }}
                                            className='mt-5 bg-secondaryUtils p-2 rounded-lg'
                                        >
                                            <Text className='text-center text-white'>Close</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        </View>
                    </Modal>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Wallet