import React, { useState,useEffect } from 'react';
import MetadataForm from './components/MetaDataForm';
import ModuleList from './components/ModuleList'; 

const App = () => {
  const [metadata, setMetadata] = useState(null); // null = show form
  const [QuestionBank, setQB] = useState({});

  const handleMetadataSubmit = (data) => {
    setMetadata(data); 
  };
  useEffect(()=>{
    console.log("metadata:",metadata);
  },[metadata]);
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {!metadata ? (
        <MetadataForm onSubmit={handleMetadataSubmit} setQB={setQB} />
      ) : (
        <ModuleList metadata={metadata} QB = {QuestionBank} />
      )}
    </div>
  );
};

export default App;
