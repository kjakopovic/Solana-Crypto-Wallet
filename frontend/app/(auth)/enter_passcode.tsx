import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import { router, Href } from "expo-router";

import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import PasscodeOutput from '@/components/PasscodeOutput'
import PasscodeInput from '@/components/PasscodeInput'
import CustomDialog from '@/components/CustomDialog';

const EnterPasscode = () => {
    const [isConfirming, setIsConfirming] = useState(false)
    const [showDialog, setShowDialog] = useState(false)

    const [passcodes, setPasscodes] = useState({
        newPasscode: '',
        confirmPasscode: ''
    })
    
    useEffect(() => {
        if (passcodes.confirmPasscode.length === 6) {
            if (passcodes.newPasscode === passcodes.confirmPasscode) {
                //TODO: zovi backend za spremanje, odnosno tu je user registered i 
                //saljem mu sve podatke (takodjer posalji i onaj random words generated)
                router.dismissAll()
                router.replace('/(tabs)/wallet' as Href)
            }
            else {
                setPasscodes({ newPasscode: '', confirmPasscode: '' })
                setIsConfirming(false)
                setShowDialog(true)
            }
        }
    }, [passcodes.confirmPasscode]);

    useEffect(() => {
        if (passcodes.newPasscode.length === 6) {
            setIsConfirming(true);
        }
    }, [passcodes.newPasscode]);
    
    return (
        <SafeAreaView className='bg-background h-full'>
            <CustomDialog 
                title='Passcodes do not match'
                description='Please try again'
                visible={showDialog}
                showCancel={false}
                onOkPress={() => {setShowDialog(false)}}
            />

            <ScrollView>
                <View className='justify-between items-center w-full min-h-[85vh]'>
                    <Text className='text-secondaryHighlight text-lg font-pbold mt-10'>
                        {isConfirming ? 'Confirm Passcode' : 'Enter New Passcode'}
                    </Text>

                    <PasscodeOutput 
                        numberOfDots={6}
                        passcode={isConfirming ? passcodes.confirmPasscode : passcodes.newPasscode}
                    />

                    <PasscodeInput
                        handleInput={(x) => {
                            isConfirming
                                ? setPasscodes({ ...passcodes, confirmPasscode: passcodes.confirmPasscode + x })
                                : setPasscodes({ ...passcodes, newPasscode: passcodes.newPasscode + x })
                        }}

                        handleDelete={() => {
                            isConfirming
                                ? setPasscodes({ ...passcodes, confirmPasscode: passcodes.confirmPasscode.slice(0, -1) })
                                : setPasscodes({ ...passcodes, newPasscode: passcodes.newPasscode.slice(0, -1) })
                        }}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default EnterPasscode