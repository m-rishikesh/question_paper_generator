import React, { useRef } from 'react';
import QuestionHeader from './QuestionHeader';
import './print.css';

const QuestionPaperView = ({ metadata, modules, goBack }) => {
  const paperRef = useRef();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold no-print">Question Paper Preview</h2>
        <div className="no-print space-x-2">
          <button
            onClick={goBack}
            className="h-fit mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer"
          >
            Back to Editor
          </button>
          <button
            onClick={handlePrint}
            className="h-fit mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
          >
            Print Question Paper
          </button>
        </div>
      </div>

      <div
        ref={paperRef}
        id="print-area"
        className="bg-white text-black font-serif mx-auto p-6"
        style={{
          width: '794px', // A4 width in px
          minHeight: '1123px', // A4 height
          boxSizing: 'border-box',
        }}
      >
        <div className="mb-6 text-center">
          <QuestionHeader metadata={metadata} />

          <table className="w-full text-sm border-collapse border border-black my-4 font-serif">
            <tbody>
              {/* Metadata rows remain unchanged */}
              {/* Wrap <tr> in <tbody> and add break-avoid classes */}
              <tr><td colSpan="3" className="border p-2 text-left"><b>Exam:</b> {metadata.examType || 'N/A'}</td>
                <td className="border p-2 text-left"><b>Academic Year:</b> {metadata.academicYear || 'N/A'}</td></tr>
              <tr><td className="border p-2 text-left"><b>Course Title:</b> {metadata.subject}</td>
                <td className="border p-2 text-left"><b>Course Code:</b> {metadata.subjectcode}</td>
                <td colSpan="2" className="border p-2 text-left"><b>Semester & Section:</b> {metadata.semester} ({metadata.examsections})</td></tr>
              <tr><td className="border p-2 text-left"><b>Date:</b> {metadata.date}</td>
                <td className="border p-2 text-left"><b>Time:</b> {metadata.time}</td>
                <td colSpan="2" className="border p-2 text-left"><b>Duration:</b> {metadata.duration}</td></tr>
              <tr><td className="border p-2 text-left"><b>Faculty In-Charge:</b> {metadata.questionpapersetter || 'N/A'}</td>
                <td colSpan="3" className="border p-2 text-left"><b>Max Marks:</b> {metadata.maxMarks || '50'}</td></tr>
            </tbody>
          </table>
        </div>

        <table className="w-full text-sm border-collapse border border-black my-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-center w-[60px]">Q. No.</th>
              <th className="border p-2 text-center">Questions</th>
              <th className="border p-2 text-center w-[60px]">Marks</th>
              <th className="border p-2 text-center w-[60px]">RBT</th>
              <th className="border p-2 text-center w-[60px]">CO</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              let overallQuestionNumber = 1;
              const tableRows = [];

              modules.forEach((mod) => {
                tableRows.push(
                  <tr key={`module-header-${mod.moduleId}`} style={{ breakInside: 'avoid' }}>
                    <td colSpan="5" className="border p-2 text-center font-semibold bg-gray-50">
                      Module {mod.moduleId}
                    </td>
                  </tr>
                );

                const renderQuestions = (questions, location) =>
                  questions.map((q, index) => (
                    <tr key={`${location}-${mod.moduleId}-${index}`} style={{ breakInside: 'avoid' }}>
                      <td className="border p-2 align-top text-center">
                        {overallQuestionNumber}.{String.fromCharCode(97 + index)})
                      </td>
                      <td className="border p-2 align-top">
                        <p className="text-justify whitespace-pre-wrap">
                          {q.text}
                        </p>
                        {q.image && (
                          <img
                            src={q.image}
                            alt="question"
                            className="mt-2 max-w-[90%] max-h-64 object-contain mx-auto"
                          />
                        )}
                      </td>
                      <td className="border p-2 align-top text-center">{q.Marks}</td>
                      <td className="border p-2 align-top text-center">{q.rbt || 'N/A'}</td>
                      <td className="border p-2 align-top text-center">{q.co || 'N/A'}</td>
                    </tr>
                  ));

                const before = mod.questions.filter(q => q.location === 'before');
                const after = mod.questions.filter(q => q.location === 'after');

                if (before.length > 0) {
                  tableRows.push(...renderQuestions(before, 'before'));
                  overallQuestionNumber++;
                }

                if (before.length > 0 && after.length > 0) {
                  tableRows.push(
                    <tr key={`or-${mod.moduleId}`}>
                      <td colSpan="5" className="border p-2 text-center text-gray-500 font-semibold">OR</td>
                    </tr>
                  );
                }

                if (after.length > 0) {
                  tableRows.push(...renderQuestions(after, 'after'));
                  overallQuestionNumber++;
                }
              });

              return tableRows;
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuestionPaperView;

