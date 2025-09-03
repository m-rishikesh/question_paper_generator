import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const MetadataForm = ({ onSubmit, setQB }) => {
  const [subject, setSubject] = useState('');
  const [subjectcode,setsubjectcode] = useState('');
  const [examsections,setexamsections] = useState('');
  const [semester, setSemester] = useState('1');
  const [examType, setExamType] = useState('CIE');
  const [time,settime] = useState('');
  const [duration,setduration] = useState("");
  const [date,setdate]= useState('');
  const [questionpapersetter,setquesetionpapersetter] = useState('');
  const [file, setFile] = useState(null);
  const [questionBank, setQuestionBank] = useState({});
  const [acad_yr,setacad_yr] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const total_marks = examType == 'CIE' ? 50 : examType =='SEE' ? 100 : 0
    onSubmit({ subject, semester, examType, questionBank,subjectcode,examsections,time,date,questionpapersetter,total_marks,duration,acad_yr });
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
      const ws = wb.Sheets[wb.SheetNames[0]];
      
      const data = XLSX.utils.sheet_to_json(ws);
      
      const newQuestionBank = {};
      
      data.forEach((row) => {
        const moduleNumber = row['Module Number'];
        
        const questionObj = {
          text: row['Question'] || '', // The question text
          co: row['CO'] || '',         // CO value
          rbt: row['RBT_Level'] || '',       // RBT value
          image_link: row['image_link'] || '', // Image link if available
          Marks:row['Marks'] || ''
        };
        
        if (!newQuestionBank[moduleNumber]) {
          newQuestionBank[moduleNumber] = [];
        }
        
        newQuestionBank[moduleNumber].push(questionObj);
      });
      
      console.log("Processed Question Bank:", newQuestionBank);
      
      setQuestionBank(newQuestionBank);
      
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
          placeholder='Enter the Subject Name'
          onChange={(e) => setSubject(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Academic Year</label>
        <input
          type="text"
          value={acad_yr}
          placeholder='Enter the Academic Year'
          onChange={(e) => setacad_yr(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Duration</label>
        <input
          type="text"
          value={duration}
          placeholder='Enter the Duration of Exam'
          onChange={(e) => setduration(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">SubjectCode</label>
        <input
          type="text"
          placeholder='Enter the Subject Code'
          value={subjectcode}
          onChange={(e) => setsubjectcode(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Class Sections</label>
        <input
          type="text"
          value={examsections}
          placeholder='Enter the Class Sections '
          onChange={(e) => setexamsections(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Time Of Examination</label>
        <input
          type="text"
          value={time}
          placeholder='Enter the Time of Exam'
          onChange={(e) => settime(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Date of Examination</label>
        <input
          type="text"
          value={date}
          placeholder='Enter the Date of Exam'
          onChange={(e) => setdate(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Exam Paper Setter</label>
        <input
          type="text" placeholder='Enter the Subject Faculty Name'
          value={questionpapersetter}
          onChange={(e) => setquesetionpapersetter(e.target.value)}
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
          <option>CIE</option>
          <option>SEE</option>
          {/* <option>Internal</option>
          <option>Quiz</option>
          <option>Assignment</option> */}
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