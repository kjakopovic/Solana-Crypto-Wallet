import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // You can use any icon library
import Svg, { Line } from 'react-native-svg';

const DividerWithIcon = () => {
  return (
    <View style={styles.container}>
      <Svg height="40" width="100%">
        <Line x1="0" y1="20" x2="100%" y2="20" stroke="gray" strokeWidth="1" />
      </Svg>

      <View style={styles.iconContainer}>
        <MaterialIcons name="swap-vert" size={24} color="gray" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'relative',
    height: 40,
    width: '100%',
  },
  iconContainer: {
    position: 'absolute',
    backgroundColor: '#02020D',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    zIndex: 1,
  },
});

export default DividerWithIcon;
