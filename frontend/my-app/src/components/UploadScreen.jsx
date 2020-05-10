import React, {useMemo} from 'react';
import {useDropzone} from 'react-dropzone';
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const activeStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

function UploadScreen(props) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles,
    open
  } = useDropzone({accept: '.py', noClick: true, noKeyboard: true});

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isDragActive,
    isDragReject,
    isDragAccept
  ]);

  let file = acceptedFiles.length > 0 ? acceptedFiles[0].path : "";

  const renderSuccessMessage = ()=>{
    if(file !== ""){
      store.addNotification({
        title: 'Upload successful',
        message: 'The model will now be trained. Download and metrics will be available on completion',
        type: 'success',                         
        container: 'bottom-center',              
        animationIn: ["animated", "fadeIn"], 
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 10000 
        }
      })
    }
  }


  return (
    <div className="container">
      <div {...getRootProps({style})}>
        <input {...getInputProps()} />
        <p>Drag and drop / click upload to select python file containing model code </p>
        <button type="button" onClick={open}>
          Upload
        </button>
      </div>
      {renderSuccessMessage()}
    </div>
  );
}

export default UploadScreen;