import { View, Text } from 'react-native'
import React from 'react'

interface CryptoPriceMovementProps {
    percentage: string
    customStyles?: string
}
//TODO: popravi zelenu na temelju izgleda od solflarea
const CryptoPriceMovement: React.FC<CryptoPriceMovementProps> = ({ percentage, customStyles }) => {
    
    return (
        <View
            style={{
                backgroundColor: percentage.startsWith('-') ? 
                    'rgba(220, 38, 38, 0.2)' :
                    percentage.startsWith('0.00') ? 
                        'rgba(156, 163, 175, 0.2)' :
                        'rgba(22, 163, 74, 0.2)'
            }}
            className={`rounded-md px-2 py-[1px] pt-[2px] ml-2 ${customStyles}`}
        >
            <Text 
                style={{
                    color: percentage.startsWith('-') ? 
                        'rgba(220, 38, 38, 1)' :
                        percentage.startsWith('0.00') ? 
                            'rgba(156, 163, 175, 1)' :
                            'rgba(33, 204, 78, 1)'
                }}
                className='text-xs font-pregular text-center'
            >
                {percentage}
            </Text>
        </View>
    )
}

export default CryptoPriceMovement