import { View, Text } from 'react-native'
import React from 'react'

import TopLeftExitButton from './top_left_exit_button'

interface PageHeaderProps {
    title: string
    showExitButton?: boolean
    containerStyles?: string
    onExitClick?: () => void
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, showExitButton=true, containerStyles, onExitClick }) => {
    return (
        <View className={`w-full items-center justify-center mt-10 ${containerStyles}`}>
            {showExitButton && 
                <TopLeftExitButton
                    onExitClick={onExitClick}
                />}

            <Text className='font-lufgaBold ml-2 text-white text-[20px]'>
                {title}
            </Text>
        </View>
    )
}

export default PageHeader