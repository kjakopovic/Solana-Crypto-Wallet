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
    const [searchText, setSearchText] = useState(''); // Add searchText state

    // Handle dropdown open/close
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
  
    // Handle selecting a crypto option
    const selectItem = (item: Data) => {
        setSelectedItem(item);
        setIsDropdownOpen(false);
        setSearchText(''); // Clear search text after selection
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
                style={styles.cryptoLogo}
                className='rounded-full'
              />
              <Text style={styles.dropdownText}>
                {selectedItem.label}
              </Text>
            </View>
          ) : (
            <Text style={styles.dropdownText}>
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
      padding: 10,
      width: '100%',
    },
    label: {
      fontSize: 18,
      marginBottom: 10,
      fontWeight: 'bold',
    },
    dropdownButton: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: '#6a6a6b',
      borderRadius: 8,
    },
    selectedItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dropdownText: {
      fontSize: 16,
      color: '#fff',
    },
    cryptoLogo: {
      width: 24,
      height: 24,
      marginRight: 10,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      marginTop: 40,
      marginBottom: 40,
    },
    dropdown: {
      backgroundColor: '#191A21',
      marginHorizontal: 30,
      borderRadius: 8,
      padding: 10,
    },
    searchInput: {
      backgroundColor: '#191A21',
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
      color: '#fff',
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#6a6a6b',
    },
    optionText: {
      fontSize: 16,
      color: '#fff',
    },
    emptyText: {
      textAlign: 'center',
      color: '#fff',
      marginTop: 20,
    },
  });

export default CustomDropDown;
