import { View, Text, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import React from 'react'

import { getItem } from '@/context/SecureStorage';
import { icons } from '@/constants';

const ReceiveCrypto = () => {
    const publicKey = getItem('publicKey') ?? '';
    
    return (
        <SafeAreaView className='bg-background h-full'>
            <View className='w-[100%] h-[50vh] items-center justify-between mt-[150px]'>
                <View className='flex-row w-[65%] items-center justify-center'>
                    <TouchableOpacity
                        onPress={async () => {
                            await Clipboard.setStringAsync(publicKey);
                        }}
                        className='bg-secondaryUtils p-2 rounded-lg items-center justify-center mr-2'
                    >
                        <Image 
                            source={icons.copy}
                            className='w-[30px] h-[30px]'
                            tintColor={'#BBA880'}
                        />
                    </TouchableOpacity>
                    
                    <Text
                        className='text-secondaryHighlight text-lg font-bold'
                    >
                        {publicKey}
                    </Text>
                </View>
                <View className='bg-secondaryHighlight w-[60%] h-[30vh] items-center justify-center rounded-lg'>
                    <QRCode
                        value={publicKey}
                        size={200}
                        color="black"
                        backgroundColor="#D6D6D6"
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default ReceiveCrypto