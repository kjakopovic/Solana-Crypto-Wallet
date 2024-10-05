import { View, Text, TouchableOpacity, Modal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, RefreshControl } from 'react-native-gesture-handler'
import React, { useState, useEffect } from 'react'

import SkeletonLoader from '@/components/skeleton_loader'

import { 
    getWalletInfo, 
    WalletInfo, 
    TransactionHistoryData, 
    getTransactionsHistory,
    getAllStakeAccounts,
    StakingItemData,
    unstakeSolana,
    airdropMoney
} from '@/context/WalletFunctions'
import CustomDialog from '@/components/custom_dialog'
import WalletHeader from '@/components/wallet_header'
import WalletBody from '@/components/wallet_body'
import CustomButton from '@/components/custom_button'
import { getItem } from '@/context/SecureStorage'

const Wallet = () => {
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

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
        var walletInfoResult: any = null;
        try {
            walletInfoResult = await getWalletInfo()
        } catch (error) {
            console.log(error)
        }

        var transactionHistoryResult: any = null;
        try {
            transactionHistoryResult = await getTransactionsHistory()
        } catch (error) {
            console.log(error)
        }

        var stakeAccountsResult: any = null;
        try {
            stakeAccountsResult = await getAllStakeAccounts()
        } catch (error) {
            console.log(error)
        }

        if (walletInfoResult !== null && walletInfoResult !== undefined) {
            setWalletInfo(walletInfoResult)
        }

        if (transactionHistoryResult !== null && transactionHistoryResult !== undefined) {
            setHistory(transactionHistoryResult)
        }

        if (stakeAccountsResult !== null && stakeAccountsResult !== undefined) {
            setStakingData(stakeAccountsResult)
        }

        setLoading(false)
    }

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
                    <View className='w-[90%] items-center'>
                        <View className='w-[90%] justify-between items-center flex-row'>
                            <View>
                                <SkeletonLoader 
                                    width={100}
                                    height={15}
                                    customStyles={{ borderRadius: 20, marginTop: 8 }}
                                />

                                <SkeletonLoader 
                                    width={100}
                                    height={30}
                                    customStyles={{ borderRadius: 20, marginTop: 8 }}
                                />
                            </View>

                            <SkeletonLoader 
                                width={80}
                                height={80}
                                customStyles={{ borderRadius: 9999, marginTop: 20 }}
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
                    </View>

                    <View className='min-h-[18vh] w-[90%] rounded-3xl mt-5'>
                        <SkeletonLoader 
                            width='100%'
                            height={40}
                            customStyles={{ borderRadius: 24, marginTop: 10, marginBottom: 30 }}
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
                        colors={['#007AFF']}
                        progressBackgroundColor={'#171717'}
                    />
                }
            >
                <View className='min-h-[85vh] w-full mt-7 items-center mb-[100px]'>
                    <WalletHeader
                        balance={walletInfo.balance}
                        username='John-Doe'
                        profileUri='https://cdn.pixabay.com/photo/2022/08/28/21/51/cartoon-7417574_1280.png'
                        isCustomProfilePicture={getItem('isNFTProfile') === 'yes'}
                        solaSafePoints='100000'
                    />

                    <WalletBody
                        assetsData={walletInfo.tokens}
                        stakingData={stakingData}
                        historyData={history}
                        onHistoryItemPress={(item: TransactionHistoryData) => {
                            setModalData({
                                isModalVisible: true,
                                selectedTransaction: item
                            })
                        }}
                        onStakingItemPress={(item: StakingItemData) => {
                            setSelectedStakingItemData(item);
                        }}
                    />

                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalData.isModalVisible}
                    >
                        <View className='flex-1 justify-center items-center bg-black/50'>
                            <View className='bg-secondaryUtils w-[90%] p-5 rounded-3xl'>
                                {modalData.selectedTransaction && (
                                    <>
                                        <Text className='text-lg font-bold mb-3 text-secondaryHighlight text-center'>Transaction Details</Text>
                                        <Text className='text-white font-lufgaSemiBold text-[15px]'>From:</Text>
                                        <Text className='text-secondaryHighlight font-lufgaMedium text-[11px] mb-2 mt-0.5'>{modalData.selectedTransaction.fromPublicWallet}</Text>
                                        <Text className='text-white font-lufgaSemiBold text-[15px]'>To:</Text>
                                        <Text className='text-secondaryHighlight font-lufgaMedium text-[11px] mt-0.5'>{modalData.selectedTransaction.toPublicWallet}</Text>
                                        
                                        <TouchableOpacity
                                            onPress={() => {
                                                setModalData({
                                                    isModalVisible: false,
                                                    selectedTransaction: null
                                                })
                                            }}
                                            className='mt-5 bg-secondaryUtils p-2 rounded-lg'
                                        >
                                            <Text className='text-center font-lufgaBold text-primary'>Close</Text>
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