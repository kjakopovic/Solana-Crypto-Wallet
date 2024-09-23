import { View, Text, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'

import React, { useState, useEffect } from 'react'

import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import CustomDialog from '@/components/CustomDialog';
import CustomDropDown from '@/components/CustomDropDown';

import { getItem } from '@/context/SecureStorage';
import { 
    getAllAvailableTokens, 
    TokenInfo, 
    getSelectedCoinAmount, 
    sendTokensTransaction, 
    calculateTransactionFees 
} from '@/context/WalletFunctions';
import { Transaction } from '@solana/web3.js';

const SendCrypto = () => {
    const [cryptoData, setCryptoData] = useState([] as any[]);
    const [selectedCrypto, setSelectedCrypto] = useState(null as any);

    const [sendData, setSendData] = useState({
        fromAddress: getItem('publicKey') ?? '',
        toAddress: '',
        amount: ''
    });

    const [transaction, setTransaction] = useState(null as Transaction | null);
    const [transactionFee, setTransactionFee] = useState('0.00');

    const [accountBalance, setAccountBalance] = useState('0.00');
    const [dialogProps, setDialogProps] = useState({
        title: '',
        description: '',
        visible: false
    });

    useEffect(() => {
        const tokens = getAllAvailableTokens();
        const data = tokens.map((token: TokenInfo, index: number) => ({
            label: token.name,
            logo: token.logoURI,
            symbol: token.symbol,
            id: index,
            address: token.address
        }));

        setCryptoData(data);
    }, []);

    useEffect(() => {
        const fetchSelectedCoinData = async () => {
            if (selectedCrypto) {
                const amount = await getSelectedCoinAmount(selectedCrypto.address);
                setAccountBalance(amount);
            }
        }

        fetchSelectedCoinData();
    }, [selectedCrypto]);

    useEffect(() => {
        const fetchFees = async () => {
            if (sendData.amount !== '' && selectedCrypto !== null) {
                const fees = await calculateTransactionFees(sendData.toAddress, parseFloat(sendData.amount), selectedCrypto.address);

                if (fees){
                    setTransaction(fees.transaction);
                    setTransactionFee(fees.fee.toFixed(2));
                }
            }
        }

        fetchFees();
    }, [selectedCrypto, sendData.amount]);

    return (
        <SafeAreaView className='bg-background h-full'>
            <CustomDialog 
                title={dialogProps.title}
                description={dialogProps.description}
                visible={dialogProps.visible}
                showCancel={false}
                onOkPress={() => {setDialogProps({ title: '', description: '', visible: false })}}
            />
            <ScrollView>
                <View className="flex-1 h-full justify-between px-5 w-full mt-7 pb-5 mb-3">
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
                            otherStyles='w-full h-[80px] border-[1px]'
                            textStyles='text-[13px]'
                            isReadOnly
                        />
                    </View>

                    <View className='w-full mt-10'>
                        <Text className='text-secondary font-pmedium ml-3 text-[12px]'>
                            To Address
                        </Text>
                        <FormField
                            value={sendData.toAddress}
                            handleChangeText={(text: string) => setSendData({ ...sendData, toAddress: text })}
                            otherStyles='w-full h-[80px] border-[1px]'
                            textStyles='text-[13px]'
                        />
                    </View>

                    <View className='w-full mt-10'>
                        <Text className='text-secondary font-pmedium ml-3 text-[12px]'>
                            Amount
                        </Text>

                        <FormField
                            value={sendData.amount}
                            handleChangeText={(text: string) => setSendData({ ...sendData, amount: text })}
                            otherStyles='w-full h-[80px] border-[1px]'
                            textStyles='text-[13px]'
                            digitsOnly
                        />

                        <View className='flex-row justify-between'>
                            <Text className='text-secondaryHighlight font-pmedium ml-3 text-[12px] mt-3'>
                                {`Available: ${accountBalance} ${selectedCrypto?.symbol ?? ''}`}
                            </Text>

                            <Text className='text-secondaryHighlight font-pmedium mr-3 text-[12px] mt-3 text-right'>
                                {`Fees: ${transactionFee} ${selectedCrypto?.symbol ?? ''}`}
                            </Text>
                        </View>
                    </View>

                    <CustomButton
                        title='Send'
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
                                await sendTokensTransaction(transaction);
                            } catch (error) {
                                setDialogProps({ 
                                    title: 'Transaction failure', 
                                    description: 'We couldn\'t make that transaction, please contact support.', 
                                    visible: true 
                                });
                            }
                        }}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SendCrypto