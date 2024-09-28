import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import React, { useEffect, useState } from 'react'

import { icons } from '@/constants'

import { getSelectedCoinAmount, stakeSolana, getMinimumStakeAmount } from '@/context/WalletFunctions'

import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import CustomDialog from '@/components/CustomDialog'

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
                    <View className='w-full items-center'>
                        <Text className='text-secondary font-pmedium ml-3 text-[12px] text-left w-[80%]'>
                            {`Max: ${solBalance} SOL`}
                        </Text>
                        <FormField
                            value={amount}
                            digitsOnly
                            handleChangeText={(input) => {setAmount(input)}}
                            hasPressableIcon
                            icon={icons.solana}
                            removeIconColor
                            iconStyles='w-10 h-10'
                            otherStyles='h-[70px]'
                            textStyles='mt-5'
                        />
                    </View>

                    <View className='w-[90%]'>
                        <Text className='text-secondaryHighlight font-pmedium mb-5 text-[15px] text-center'>
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
                                        description: 'Staking successful',
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