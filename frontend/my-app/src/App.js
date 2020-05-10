import React from 'react';
import './App.css';
import ReactNotifications from 'react-notifications-component';
import UploadScreen from './components/UploadScreen';


function App() {
  return (
    <div>
      <ReactNotifications />
      <UploadScreen />
    </div>
  );
}

export default App;
