import React, { useState,useEffect } from 'react';
import MetadataForm from './components/MetaDataForm';
import ModuleList from './components/ModuleList'; 
import LogInForm from './components/LogInForm';
const App = () => {
  const [metadata, setMetadata] = useState(null); // null = show form
  const [QuestionBank, setQB] = useState({});
  const [loggedIn,setloggedIn] = useState(false);

  const handleMetadataSubmit = (data) => {
    setMetadata(data); 
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {(!metadata && loggedIn) ? (
        <MetadataForm onSubmit={handleMetadataSubmit} setQB={setQB} />
      ) : (!loggedIn) ?
      (
        <LogInForm setloggedIn = {setloggedIn}/>
      ) : 
      (
        <ModuleList metadata={metadata} QB = {QuestionBank} />
      )}
    </div>
  );
};

export default App;
