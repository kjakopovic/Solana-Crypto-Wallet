import { View, Text, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import React, { useEffect, useState } from 'react'

import {
  getAllTradeableTokens, 
  TokenInfo,
  getSelectedCoinAmount,
  swapTokens
} from '@/context/WalletFunctions';

import CustomDialog from '@/components/custom_dialog';
import CustomDropDown from '@/components/custom_dropdown';
import CustomButton from '@/components/custom_button';
import { icons } from '@/constants';
import CustomInput from '@/components/custom_input';
import PageHeader from '@/components/page_header';

const Swap = () => {
  const [accountBalance, setAccountBalance] = useState('0');
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
            setAccountBalance('0');
        }
    }

    fetchSelectedCoinData();
  }, [selectedCrypto.convertFromCrypto]);

  const handleCoinsSwap = async () => {
    try {
      if (parseFloat(accountBalance) > inputAmount && inputAmount > 0 && selectedCrypto.convertToCrypto !== null) {
        await swapTokens(selectedCrypto.convertFromCrypto.address, selectedCrypto.convertToCrypto.address, inputAmount);
      } else{
        setDialogProps({
          title: 'Transaction failure',
          description: 'You do not have enough coins to swap or the input is not valid.',
          visible: true
        })
      }
    } catch (error: any) {
      setDialogProps({
        title: 'Transaction failure',
        description: error.message ?? 'An error occurred while trying to swap coins.',
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
            <PageHeader 
                title='Swap'
                showExitButton={false}
                containerStyles='mb-10 mt-1 mr-2'
            />

            <CustomDropDown 
              data={cryptoData}
              emptyTextPlaceholder='Select a coin to convert from'
              selectedItem={selectedCrypto.convertFromCrypto}
              setSelectedItem={(selected) => {setSelectedCrypto({ ...selectedCrypto, convertFromCrypto: selected })}}
            />

            <View className='z-10 -mb-5 -mt-5 w-10 h-10 bg-background justify-center items-center rounded-full'>
              <Image
                source={icons.swap}
                className='rounded-full w-5 h-5 transform rotate-90'
                resizeMode='contain'
              />
            </View>

            <CustomDropDown 
              data={cryptoData}
              emptyTextPlaceholder='Select a coin to convert to'
              selectedItem={selectedCrypto.convertToCrypto}
              setSelectedItem={(selected) => {setSelectedCrypto({ ...selectedCrypto, convertToCrypto: selected })}}
            />

            <CustomInput
              value={inputAmount}
              placeholder={`Enter amount of ${selectedCrypto.convertFromCrypto?.symbol === undefined ? '' : selectedCrypto.convertFromCrypto?.symbol + ' '}coins to swap`}
              onChangeText={(text) => {setInputAmount(text)}}
              digitsOnly
              containerStyles='mt-5'
              textStyles='text-[14px]'
            />
            <Text className='text-white font-lufgaMedium text-center mt-1'>
              {`Available: ${accountBalance} ${selectedCrypto.convertFromCrypto?.symbol ?? ''}`}
            </Text>
          </View>

          <View className='w-[90%]'>
            <CustomButton
              title='Exchange'
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