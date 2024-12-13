// PocketBaseProvider.js
import React from 'react';
import PocketBaseContext from './PocketBaseContext';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://192.168.86.65:8090');

const PocketBaseProvider = ({ children }) => {
  return (
    <PocketBaseContext.Provider value={pb}>
      {children}
    </PocketBaseContext.Provider>
  );
};

export default PocketBaseProvider;