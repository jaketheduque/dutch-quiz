// PocketBaseProvider.js
import React from 'react';
import PocketBaseContext from './PocketBaseContext';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://dutch.xieservers.com/pb');

const PocketBaseProvider = ({ children }) => {
  return (
    <PocketBaseContext.Provider value={pb}>
      {children}
    </PocketBaseContext.Provider>
  );
};

export default PocketBaseProvider;
