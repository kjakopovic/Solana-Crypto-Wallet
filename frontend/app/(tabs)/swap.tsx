import { View, Text, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import React, { useEffect, useState } from 'react'

import {
  getAllAvailableTokens, 
  TokenInfo,
  getSelectedCoinAmount,
  swapTokens,
  airdropMoney
} from '@/context/WalletFunctions';

import { createSwapPool } from '@/utils/swap';

import CustomDialog from '@/components/CustomDialog';
import CustomDropDown from '@/components/CustomDropDown';
import DividerWithIcon from '@/components/DividerWithIcon';
import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';

const Swap = () => {
  const [accountBalance, setAccountBalance] = useState('0.00');
  const [inputAmount, setInputAmount] = useState(0);

  const [cryptoData, setCryptoData] = useState([] as any[]);
  const [selectedCrypto, setSelectedCrypto] = useState({
    convertFromCrypto: null as any,
    convertToCrypto: null as any
  });

  const [dialogProps, setDialogProps] = useState({
    title: '',
    description: '',
    visible: false
  });

  useEffect(() => {
    const fetchAllTokensData = async () => {
        const tokens = await getAllAvailableTokens();
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
            if (selectedCrypto.convertFromCrypto) {
                const amount = await getSelectedCoinAmount(selectedCrypto.convertFromCrypto.address);
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
  }, [selectedCrypto.convertFromCrypto]);

  const handleCoinsSwap = async () => {
    try {
      if (/*parseFloat(accountBalance) > inputAmount && inputAmount > 0 && */ selectedCrypto.convertToCrypto !== null) {
        // await swapTokens(selectedCrypto.convertFromCrypto.address, selectedCrypto.convertToCrypto.address, inputAmount);
        await createSwapPool(selectedCrypto.convertFromCrypto.address, selectedCrypto.convertToCrypto.address, inputAmount);
        // await airdropMoney(100);
      } else{
        setDialogProps({
          title: 'Transaction failure',
          description: 'You do not have enough coins to swap or the input is not valid.',
          visible: true
        })
      }
    } catch (error) {
      setDialogProps({
        title: 'Transaction failure',
        description: 'An error occurred while trying to swap coins.',
        visible: true
      })
    }
  }
  
  return (
    <SafeAreaView className='bg-background h-full'>
      <ScrollView>
        <CustomDialog 
          title={dialogProps.title}
          description={dialogProps.description}
          visible={dialogProps.visible}
          showCancel={false}
          onOkPress={() => {setDialogProps({ title: '', description: '', visible: false })}}
        />
        <View className='h-[75vh] mt-10 items-center justify-between'>
          <View className='items-center w-[90%]'>
            <CustomDropDown 
              data={cryptoData}
              emptyTextPlaceholder='Select a coin to convert from'
              selectedItem={selectedCrypto.convertFromCrypto}
              setSelectedItem={(selected) => {setSelectedCrypto({ ...selectedCrypto, convertFromCrypto: selected })}}
            />
            <Text className='text-white text-left w-[90%]'>
              {`Available: ${accountBalance} ${selectedCrypto.convertFromCrypto?.symbol ?? ''}`}
            </Text>

            <DividerWithIcon />

            <CustomDropDown 
              data={cryptoData}
              emptyTextPlaceholder='Select a coin to convert to'
              selectedItem={selectedCrypto.convertToCrypto}
              setSelectedItem={(selected) => {setSelectedCrypto({ ...selectedCrypto, convertToCrypto: selected })}}
            />
          </View>

          <View className='w-[90%]'>
            <FormField
              value={inputAmount}
              placeholder='Enter amount of coins to swap'
              handleChangeText={(input) => {setInputAmount(parseFloat(input))}}
              otherStyles='w-[100%] h-[50px]'
              digitsOnly
            />
          </View>

          <View className='w-[90%]'>
            <CustomButton
              title='Swap'
              primary
              handlePress={handleCoinsSwap}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Swap