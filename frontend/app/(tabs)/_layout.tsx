import { Image, View } from 'react-native'
import { Tabs } from 'expo-router'
import React from 'react'

import { icons, images } from '@/constants'

interface TabIconProps {
    icon: any
    color: string
    customStyles?: string
}

const TabIcon: React.FC<TabIconProps> = ({ icon, color, customStyles }) => {
    return (
        <View className="flex items-center justify-center gap-2">
            <Image
                source={icon}
                resizeMode="contain"
                tintColor={color}
                className={`w-7 h-7 ${customStyles}`}
            />
        </View>
    );
};

const TabsLayout = () => {
    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: "#BBA880",
                    tabBarInactiveTintColor: "#6a6a6b",
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        backgroundColor: "#101016",
                        borderTopColor: "transparent",
                        height: 70,
                        borderRadius: 30,
                        position: "absolute",
                        bottom: 25,
                        alignItems: "center",
                        marginHorizontal: 15,
                    },
                }}
            >
                <Tabs.Screen
                    name="wallet"
                    options={{
                        title: "Wallet",
                        headerShown: false,
                        tabBarIcon: ({ color }) => (
                            <TabIcon
                                icon={icons.digitalWallet}
                                color={color}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="collectibles"
                    options={{
                        title: "Collectibles",
                        headerShown: false,
                        tabBarIcon: ({ color }) => (
                            <TabIcon
                                icon={icons.collectibles}
                                color={color}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="games"
                    options={{
                        title: "Games",
                        headerShown: false,
                        tabBarIcon: ({ color }) => (
                            <TabIcon
                                icon={images.logo}
                                color={color}
                                customStyles="w-20 h-20"
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="swap"
                    options={{
                        title: "Swap",
                        headerShown: false,
                        tabBarIcon: ({ color }) => (
                            <TabIcon
                                icon={icons.trade}
                                color={color}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="settings"
                    options={{
                        title: "Settings",
                        headerShown: false,
                        tabBarIcon: ({ color }) => (
                            <TabIcon
                                icon={icons.settings}
                                color={color}
                            />
                        ),
                    }}
                />
            </Tabs>
        </>
    )
}

export default TabsLayout