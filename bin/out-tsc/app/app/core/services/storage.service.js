import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let StorageService = class StorageService {
    // Local Storage methods
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        }
        catch (error) {
            console.error('Error saving to localStorage', error);
        }
    }
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        }
        catch (error) {
            console.error('Error getting data from localStorage', error);
            return null;
        }
    }
    remove(key) {
        try {
            localStorage.removeItem(key);
        }
        catch (error) {
            console.error('Error removing data from localStorage', error);
        }
    }
    clear() {
        try {
            localStorage.clear();
        }
        catch (error) {
            console.error('Error clearing localStorage', error);
        }
    }
    // Session Storage methods
    setSession(key, value) {
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
        }
        catch (error) {
            console.error('Error saving to sessionStorage', error);
        }
    }
    getSession(key) {
        try {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        }
        catch (error) {
            console.error('Error getting data from sessionStorage', error);
            return null;
        }
    }
    removeSession(key) {
        try {
            sessionStorage.removeItem(key);
        }
        catch (error) {
            console.error('Error removing data from sessionStorage', error);
        }
    }
    clearSession() {
        try {
            sessionStorage.clear();
        }
        catch (error) {
            console.error('Error clearing sessionStorage', error);
        }
    }
    // Utility methods
    exists(key) {
        return localStorage.getItem(key) !== null;
    }
    existsSession(key) {
        return sessionStorage.getItem(key) !== null;
    }
    // Get all keys
    getAllKeys() {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key)
                keys.push(key);
        }
        return keys;
    }
    // Get storage size (approximate)
    getStorageSize() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        return total;
    }
};
StorageService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], StorageService);
export { StorageService };
