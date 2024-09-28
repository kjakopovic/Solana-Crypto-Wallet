import { View, Text, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import { CameraView, useCameraPermissions } from 'expo-camera'

import React, { useState, useEffect } from 'react'

import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import CustomDialog from '@/components/CustomDialog';
import CustomDropDown from '@/components/CustomDropDown';

import { getItem } from '@/context/SecureStorage';
import { 
    getAllTradeableTokens, 
    TokenInfo, 
    getSelectedCoinAmount, 
    sendTokensTransaction
} from '@/context/WalletFunctions';

import { icons } from '@/constants'

const SendCrypto = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [isCameraVisible, setIsCameraVisible] = useState(false);

    const [cryptoData, setCryptoData] = useState([] as any[]);
    const [selectedCrypto, setSelectedCrypto] = useState(null as any);

    const [sendData, setSendData] = useState({
        fromAddress: getItem('publicKey') ?? '',
        toAddress: '',
        amount: ''
    });

    const [isFetching, setIsFetching] = useState(false);

    const [accountBalance, setAccountBalance] = useState('0.00');
    
    const [dialogProps, setDialogProps] = useState({
        title: '',
        description: '',
        visible: false
    });
    const [infoDialogProps, setInfoDialogProps] = useState({
        title: '',
        description: '',
        visible: false
    });

    const sendTransaction = async () => {
        try {
            setIsFetching(true);
            
            if (sendData.amount !== '' && selectedCrypto !== null) {
                await sendTokensTransaction(sendData.toAddress, parseFloat(sendData.amount), selectedCrypto.address);
            }
        } catch (error) {
            setDialogProps({ 
                title: 'Transaction failure', 
                description: 'If this keeps happening and you checked that everything is correct please contact support.',
                visible: true
            });
        } finally {
            setIsFetching(false);
        }
    }

    useEffect(() => {
        const fetchAllTokensData = async () => {
            const tokens = await getAllTradeableTokens();
            const data = tokens.map((token: TokenInfo, index: number) => ({
                label: token.name,
                logo: token.logoURI,
                symbol: token.symbol,
                id: index,
                address: token.address
            }));

            setCryptoData(data);
        }

        fetchAllTokensData();
    }, []);

    useEffect(() => {
        const fetchSelectedCoinData = async () => {
            try {
                if (selectedCrypto) {
                    const amount = await getSelectedCoinAmount(selectedCrypto.address);
                    setAccountBalance(amount);
                }
            } catch (error) {
                setDialogProps({ 
                    title: 'Transaction failure', 
                    description: 'That coin is not supported at the moment.',
                    visible: true
                });
            }
        }

        fetchSelectedCoinData();
    }, [selectedCrypto]);

    if (isCameraVisible) {
        return (
            <SafeAreaView className='h-full'>
                {Platform.OS === 'android' ? <StatusBar hidden /> : null}

                <CameraView 
                    className='h-full'
                    facing='back'
                    onBarcodeScanned={({ data }) => {
                        console.log(data);
                        setSendData({ ...sendData, toAddress: data });
                        setIsCameraVisible(false);
                    }}
                />
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className='bg-background h-full'>
            <CustomDialog 
                title={dialogProps.title}
                description={dialogProps.description}
                visible={dialogProps.visible}
                showCancel={false}
                onOkPress={() => {setDialogProps({ title: '', description: '', visible: false })}}
            />
            <CustomDialog 
                title={infoDialogProps.title}
                description={infoDialogProps.description}
                visible={infoDialogProps.visible}
                showCancel
                onOkPress={() => {
                    setInfoDialogProps({ title: '', description: '', visible: false })
                    sendTransaction();
                }}
                onCancelPress={() => {setInfoDialogProps({ title: '', description: '', visible: false })}}
            />
            <ScrollView>
                <View className="flex-1 h-full justify-between px-5 w-full mt-10 pb-5 mb-3">
                    <CustomDropDown 
                        data={cryptoData}
                        emptyTextPlaceholder='Please select a coin'
                        selectedItem={selectedCrypto}
                        setSelectedItem={setSelectedCrypto}
                    />

                    <View className='w-full mt-10'>
                        <Text className='text-secondary font-pmedium ml-3 text-[12px]'>
                            From Address
                        </Text>
                        <FormField
                            value={sendData.fromAddress}
                            handleChangeText={() => {}}
                            otherStyles='w-full h-[65px] border-[1px]'
                            textStyles='text-[13px]'
                            isReadOnly
                        />
                    </View>

                    <View className='w-full mt-10'>
                        <Text className='text-secondary ml-3 font-pmedium text-[12px]'>
                            To Address
                        </Text>
                        <FormField
                            value={sendData.toAddress}
                            handleChangeText={(text: string) => setSendData({ ...sendData, toAddress: text })}
                            otherStyles='w-full h-[65px] border-[1px]'
                            textStyles='text-[13px]'
                            hasPressableIcon
                            handleIconPress={() => {
                                if (!permission?.granted) {
                                    requestPermission();
                                } else{
                                    setIsCameraVisible(true);
                                }
                            }}
                            icon={icons.qrCodeScan}
                        />
                    </View>

                    <View className='w-full mt-10'>
                        <Text className='text-secondary font-pmedium ml-3 text-[12px]'>
                            Amount
                        </Text>

                        <FormField
                            value={sendData.amount}
                            handleChangeText={(text: string) => setSendData({ ...sendData, amount: text })}
                            otherStyles='w-full h-[50px] border-[1px]'
                            textStyles='text-[13px]'
                            digitsOnly
                        />

                        <Text className='text-secondaryHighlight font-pmedium ml-3 text-[12px] mt-3'>
                            {`Available: ${accountBalance} ${selectedCrypto?.symbol ?? ''}`}
                        </Text>
                    </View>

                    <CustomButton
                        title={isFetching ? 'Processing...' : 'Send'}
                        containerStyles={'w-full mt-10'}
                        primary
                        handlePress={async () => {
                            try {
                                if (parseFloat(sendData.amount) > parseFloat(accountBalance)) {
                                    setDialogProps({ 
                                        title: 'Insufficient balance', 
                                        description: 'You don\'t have enough balance to make that transaction.', 
                                        visible: true 
                                    });
                                    return;
                                }

                                setInfoDialogProps({ 
                                    title: 'Fee paymet', 
                                    description: 'Your payment will include fees of 0.0021 SOL', 
                                    visible: true 
                                });
                            } catch (error) {
                                setDialogProps({ 
                                    title: 'Transaction failure', 
                                    description: 'We couldn\'t make that transaction, please contact support.', 
                                    visible: true 
                                });
                            }
                        }}
                        isLoading={isFetching}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SendCrypto