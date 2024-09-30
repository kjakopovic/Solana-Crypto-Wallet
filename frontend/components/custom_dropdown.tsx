import { View, Text, TouchableOpacity, Image, Modal, FlatList, StyleSheet, TextInput } from 'react-native'
import React, { useState } from 'react'

import { images } from '@/constants';

interface Data {
    id: string;
    label: string;
    logo: string | null;
}

interface CustomDropDownProps {
    data: Data[];
    emptyTextPlaceholder?: string;
    selectedItem?: Data | null;
    setSelectedItem: (item: Data) => void;
}

const CustomDropDown: React.FC<CustomDropDownProps> = ({ data, emptyTextPlaceholder, selectedItem, setSelectedItem }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchText, setSearchText] = useState('');

    // Handle dropdown open/close
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
  
    // Handle selecting a crypto option
    const selectItem = (item: Data) => {
        setSelectedItem(item);
        setIsDropdownOpen(false);
        setSearchText('');
    };

    // Filter the options based on the search input
    const filteredData = data.filter(item => 
        item.label.toLowerCase().includes(searchText.toLowerCase())
    );
  
    // Render each option in the dropdown list
    const renderOption = ({ item }: { item: Data }) => (
      <TouchableOpacity
        style={styles.option}
        onPress={() => selectItem(item)}
      >
        <Image 
            source={item.logo !== null && item.logo !== '' ? { uri: item.logo } : images.logoSmall} 
            style={styles.cryptoLogo}
            className='rounded-full'
        />

        <Text style={styles.optionText}>{item.label}</Text>
      </TouchableOpacity>
    );
  
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={toggleDropdown}
        >
          {selectedItem ? (
            <View style={styles.selectedItem}>
              <Image
                source={selectedItem.logo !== null && selectedItem.logo !== '' ? { uri: selectedItem.logo } : images.logoSmall}
                style={styles.cryptoLogoSelected}
                className='rounded-full'
              />
              <View className='w-[70%]'>
                <Text style={styles.dropdownText}>
                  {selectedItem.label}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.emptyDropdownText}>
              {emptyTextPlaceholder ?? 'Select...'}
            </Text>
          )}
        </TouchableOpacity>
  
        {/* Modal for dropdown options */}
        <Modal
          visible={isDropdownOpen}
          transparent={true}
          animationType="fade"
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={toggleDropdown}
          >
            <View style={styles.dropdown}>
              <TextInput
                style={styles.searchInput}
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search..."
                placeholderTextColor="#888"
              />

              <FlatList
                data={filteredData} // Use filteredData instead of original data
                keyExtractor={(item) => item.id}
                renderItem={renderOption}
                ListEmptyComponent={<Text style={styles.emptyText}>No results found</Text>}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      width: '100%',
      paddingVertical: 7
    },
    label: {
      fontSize: 18,
      marginBottom: 10,
      fontWeight: 'bold',
    },
    dropdownButton: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: '#232324',
      borderRadius: 25,
      minHeight: 70,
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectedItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    dropdownText: {
      fontSize: 16,
      color: 'white',
      fontFamily: "LufgaMedium"
    },
    emptyDropdownText: {
      fontSize: 16,
      color: 'white',
      fontFamily: "LufgaMedium"
    },
    cryptoLogo: {
      width: 30,
      height: 30,
      marginRight: 10,
    },
    cryptoLogoSelected: {
      width: 48,
      height: 48,
      marginRight: 10,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dropdown: {
      backgroundColor: '#232324',
      marginHorizontal: 20,
      borderRadius: 30,
      padding: 10,
    },
    searchInput: {
      backgroundColor: '#232324',
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
      color: '#fff',
      fontFamily: "LufgaRegular"
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
    },
    optionText: {
      fontSize: 16,
      color: '#fff',
      fontFamily: "LufgaRegular"
    },
    emptyText: {
      textAlign: 'center',
      color: '#fff',
      marginTop: 20,
      fontFamily: "LufgaRegular",
      marginBottom: 20,
    },
  });

export default CustomDropDown;
