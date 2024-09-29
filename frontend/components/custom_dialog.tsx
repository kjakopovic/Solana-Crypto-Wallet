import { View } from 'react-native'
import Dialog from 'react-native-dialog';
import React from 'react'

interface CustomDialogProps {
    title: string,
    description: string,
    visible: boolean,
    showCancel: boolean,
    onOkPress: () => void,
    onCancelPress?: () => void
}

const CustomDialog: React.FC<CustomDialogProps> = ({ visible, title, description, onOkPress, onCancelPress, showCancel }) => {
    return (
        <View className='justify-center items-center'>
            <Dialog.Container 
                contentStyle={{ 
                    backgroundColor: "#232324", 
                    borderRadius: 24
                }}
                visible={visible}
            >
                <Dialog.Title style={{ color: '#ffffff', fontFamily: 'LufgaMedium' }}>
                    {title}
                </Dialog.Title>

                <Dialog.Description  style={{ color: '#6F6F70', fontFamily: 'LufgaRegular' }}>
                    {description}
                </Dialog.Description>

                { showCancel && 
                    <Dialog.Button 
                        label="Cancel" 
                        onPress={onCancelPress ?? (() => {})} 
                        style={{ color: '#007AFF', fontFamily: 'LufgaBold' }}
                    />
                }

                <Dialog.Button 
                    label="OK" 
                    onPress={onOkPress} 
                    style={{ color: '#007AFF', fontFamily: 'LufgaBold' }}
                />
            </Dialog.Container>
        </View>
    )
}

export default CustomDialog