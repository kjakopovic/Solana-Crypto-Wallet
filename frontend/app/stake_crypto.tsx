import { View, Text, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { LinearGradient } from 'expo-linear-gradient';

import React, { useEffect, useState } from 'react'

import { icons } from '@/constants'

import { getSelectedCoinAmount, stakeSolana, getMinimumStakeAmount } from '@/context/WalletFunctions'

import CustomButton from '@/components/custom_button'
import CustomDialog from '@/components/custom_dialog'
import CustomInput from '@/components/custom_input';
import PageHeader from '@/components/page_header';

const StakeCrypto = () => {
    const [solBalance, setSolBalance] = useState('');

    const [minStakeAmount, setMinStakeAmount] = useState(0);
    const [amount, setAmount] = useState(0);

    const [processingStake, setProcessingStake] = useState(false);
    const [allowStake, setAllowStake] = useState(false);

    const [dialogProps, setDialogProps] = useState({
        title: '',
        description: '',
        visible: false
    });

    const fetchSolBalance = async () => {
        try {
            const amount = await getSelectedCoinAmount('SOL');
            setSolBalance(amount);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchSolBalance();

                const minStake = await getMinimumStakeAmount();
                setMinStakeAmount(minStake);
            } catch (error) {
                console.log(error);
            }
        }
    
        fetchData();
    }, [])

    useEffect(() => {
        setAllowStake(amount > minStakeAmount && amount <= parseFloat(solBalance));
    }, [amount])
    
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
                <View className='h-[90vh] w-full justify-between items-center mt-10 pb-5'>
                    <PageHeader 
                        title='Stake'
                        containerStyles='mt-1'
                    />

                    <View className='w-[90%]'>
                        <LinearGradient
                            colors={['#1484ff', '#0066d6']}
                            start={{ x: 0.2, y: 0.2 }}
                            end={{ x: 0.7, y: 0.7 }}
                            className={`h-[100px] w-[100%] items-center rounded-[30px] mb-5`}
                        >
                            <View className='flex-row items-center justify-between px-5 w-[100%] h-[100%]'>
                                <View className='h-[100%] justify-center items-start'>
                                    <Text className='text-white font-lufgaMedium text-[17px]'>
                                        Balance
                                    </Text>
                                    <Text className='mt-1 text-white font-lufgaSemiBold text-[30px]'>
                                        {solBalance}
                                    </Text>
                                </View>
                                <View className='justify-center items-center w-[70px] h-[70px] rounded-full bg-white/20'>
                                    <Image
                                        source={icons.solana}
                                        className='w-[50px] h-[50px] rounded-full'
                                        resizeMode='contain'
                                    />
                                </View>
                            </View>
                        </LinearGradient>

                        <CustomInput
                            value={amount}
                            placeholder='Amount'
                            onChangeText={(text) => setAmount(text)}
                            digitsOnly
                        />
                    </View>

                    <View className='w-[90%]'>
                        <Text className='text-secondaryHighlight font-lufgaMedium mb-5 text-[15px] text-center'>
                            {`Minimum stake amount: ${minStakeAmount} SOL`}
                        </Text>

                        <CustomButton
                            title={processingStake ? 'Processing...' : 'Stake'}
                            handlePress={async () => {
                                try {
                                    setProcessingStake(true);
                                    
                                    await stakeSolana(amount);
                                    await fetchSolBalance();

                                    setDialogProps({
                                        title: 'Success',
                                        description: 'Staking started successfully',
                                        visible: true
                                    })
                                } catch (error) {
                                    console.log(error);
                                } finally {
                                    setProcessingStake(false);
                                }
                            }}
                            isLoading={processingStake || !allowStake}
                            primary
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default StakeCrypto