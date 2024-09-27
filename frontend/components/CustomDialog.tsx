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
        <View className='justify-center items-center bg-background border-secondaryUtils rounded-3xl'>
            <Dialog.Container 
                contentStyle={{ 
                    backgroundColor: "#02020d", 
                    borderRadius: 15
                }}
                visible={visible}
            >
                <Dialog.Title style={{ color: '#D6D6D6' }}>
                    {title}
                </Dialog.Title>

                <Dialog.Description  style={{ color: '#D6D6D6' }}>
                    {description}
                </Dialog.Description>

                { showCancel && 
                    <Dialog.Button 
                        label="Cancel" 
                        onPress={onCancelPress ?? (() => {})} 
                        style={{ color: '#BBA880' }}
                    />
                }

                <Dialog.Button 
                    label="OK" 
                    onPress={onOkPress} 
                    style={{ color: '#BBA880' }}
                />
            </Dialog.Container>
        </View>
    )
}

export default CustomDialog