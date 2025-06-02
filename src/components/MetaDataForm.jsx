import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const MetadataForm = ({ onSubmit, setQB }) => {
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState('1');
  const [examType, setExamType] = useState('Midterm');
  const [file, setFile] = useState(null);
  const [questionBank, setQuestionBank] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass form data and questionBank to the parent component
    onSubmit({ subject, semester, examType, questionBank });
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const processFile = () => {
    if (!file) {
      alert('Please upload a file first!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryString = e.target.result;
      const wb = XLSX.read(binaryString, { type: 'binary' });
      // Assuming the first sheet is the one with the questions
      const ws = wb.Sheets[wb.SheetNames[0]];
      
      // Use header: true to get column headers
      const data = XLSX.utils.sheet_to_json(ws);
      
      const newQuestionBank = {};
      
      // Process each row with column headers
      data.forEach((row) => {
        // Extract values based on your Excel column headers
        const moduleNumber = row['Module Number'];
        
        // Create a structured question object with all necessary fields
        const questionObj = {
          text: row['Question'] || '', // The question text
          co: row['CO'] || '',         // CO value
          rbt: row['RBT_Level'] || '',       // RBT value
          image_link: row['image_link'] || '', // Image link if available
          Marks:row['Marks'] || ''
        };
        
        // Initialize the array for this module if it doesn't exist
        if (!newQuestionBank[moduleNumber]) {
          newQuestionBank[moduleNumber] = [];
        }
        
        // Add the complete question object to the module's array
        newQuestionBank[moduleNumber].push(questionObj);
      });
      
      console.log("Processed Question Bank:", newQuestionBank);
      
      // Update the question bank state locally
      setQuestionBank(newQuestionBank);
      
      // Update the QB state passed as a prop to the parent component
      setQB(newQuestionBank);
      
      alert('Questions loaded successfully!');
    };
    
    reader.readAsBinaryString(file);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4 bg-white shadow rounded-xl mt-8">
      {console.log(questionBank)}
      <div>
        <label className="block mb-1 font-medium">Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Semester</label>
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {[...Array(8)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium">Exam Type</label>
        <select
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option>Midterm</option>
          <option>Final</option>
          <option>Internal</option>
          <option>Quiz</option>
          <option>Assignment</option>
        </select>
      </div>
      {/* File Upload Section */}
      <div>
        <label className="block mb-1 font-medium">Upload Excel File</label>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="w-full p-2 border rounded"
        />
        <button
          type="button"
          onClick={processFile}
          className="mt-2 w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
        >
          Process File
        </button>
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
};

export default MetadataForm;