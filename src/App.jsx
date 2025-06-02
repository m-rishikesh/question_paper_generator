import React, { useState } from 'react';
import MetadataForm from './components/MetaDataForm';
import ModuleList from './components/ModuleList'; // Your full question editor

const App = () => {
  const [metadata, setMetadata] = useState(null); // null = show form
  const [QuestionBank, setQB] = useState({});

  const handleMetadataSubmit = (data) => {
    setMetadata(data); // This triggers the switch to ModuleList
  };

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
