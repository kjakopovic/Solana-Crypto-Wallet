import * as SecureStore from 'expo-secure-store';

function saveItem(key, value) {
    SecureStore.setItem(key, value);
}

function getItem(key) {
    let result = SecureStore.getItem(key);
    
    if (!result) {
        console.log(`No value found for key: ${key}`);
    }

    return result;
}

async function deleteItem(key) {
    await SecureStore.deleteItemAsync(key);
}

export { saveItem, getItem, deleteItem };