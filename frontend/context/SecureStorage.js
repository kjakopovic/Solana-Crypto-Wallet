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

function deleteItem(key) {
    SecureStore.deleteItem(key);
}

export { saveItem, getItem, deleteItem };