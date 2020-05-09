import React, {useMemo} from 'react';
import {useDropzone} from 'react-dropzone';

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

  const file = acceptedFiles.map(f => <li key={f.path}>{f.path}</li>)[0];

  const renderSuccessMessage = ()=>{
    if(file !== undefined){
      return <h3>{file} uploaded successfully</h3>
    }
  }

  const renderTrainBanner = ()=>{
    return;
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
      <aside>
        {renderSuccessMessage()}
        {renderTrainBanner()}
      </aside>
    </div>
  );
}

export default UploadScreen;