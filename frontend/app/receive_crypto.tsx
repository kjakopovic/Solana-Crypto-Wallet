import { View, Text, Share } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';

import React from 'react'

import { getItem } from '@/context/SecureStorage';
import CustomButton from '@/components/custom_button';

import { icons } from '@/constants';
import PageHeader from '@/components/page_header';

const ReceiveCrypto = () => {
    const publicKey = getItem('publicKey') ?? '';
    const truncatedPublicKey = `${publicKey.substring(0, 12)}......${publicKey.slice(-7)}`;

    const onShare = async () => {
        try {
            const result = await Share.share({
                message: publicKey,
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log('shared with activity type of result.activityType');
                } else {
                    console.log('shared');
                }
            } else if (result.action === Share.dismissedAction) {
                console.log('dismissed');
            }
        } catch (error: any) {
            console.log(error.message);
        }
    };

    return (
        <SafeAreaView className='bg-background h-full'>
            <View className='w-[100%] h-[85vh] items-center justify-between mt-10'>
                <PageHeader 
                    title='Receive'
                    containerStyles='mt-1'
                />

                <View className='bg-secondaryUtils w-[90%] h-[90vw] items-center justify-center rounded-3xl'>
                    <QRCode
                        value={publicKey}
                        size={270}
                        color="white"
                        backgroundColor="transparent"
                    />
                </View>

                <View className='w-[90%] justify-center items-center bg-secondaryUtils rounded-full min-h-[10vh]'>
                    <Text
                        className='text-white text-lg font-lufgaSemiBold'
                    >
                        {truncatedPublicKey}
                    </Text>
                </View>

                <View className='w-[90%] flex-row justify-between'>
                    <CustomButton
                        title='Copy'
                        primary
                        containerStyles='w-[48%]'
                        icon={icons.copy}
                        handlePress={() => {
                            Clipboard.setStringAsync(publicKey);
                        }}
                    />

                    <CustomButton
                        title='Share'
                        containerStyles='w-[48%]'
                        icon={icons.share}
                        handlePress={onShare}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default ReceiveCrypto