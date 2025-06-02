import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import QuestionHeader from './QuestionHeader';
import autoTable from "jspdf-autotable";

const QuestionPaperView = ({ metadata, modules, goBack }) => {
  const paperRef = useRef();

  const downloadPDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
  
    let yPos = 10; // Starting position
  
    // Add Header (Question Header Content)
    pdf.setFontSize(12);
  
    // Add "|| Jai Sri Gurudev ||" text
    pdf.text('|| Jai Sri Gurudev ||', pdfWidth / 2, yPos, { align: 'center' });
    yPos += 7;
  
    // Add "Sri AdichunchanagiriShikshana Trust(R)"
    pdf.text('Sri AdichunchanagiriShikshana Trust(R)', pdfWidth / 2, yPos, { align: 'center' });
    yPos += 7;
  
    // Add SJB Institute of Technology Title
    pdf.setFontSize(16);
    pdf.text('SJB Institute of Technology', pdfWidth / 2, yPos, { align: 'center' });
    yPos += 10;
  
    // Add "ESTD:2001"
    pdf.setFontSize(12);
    pdf.text('ESTD:2001', pdfWidth / 2, yPos, { align: 'center' });
    yPos += 10;
  
    // Add the logos and texts in the center section
    pdf.text('(An Autonomous Institution affiliated to VTU, Belagavi)', pdfWidth / 2, yPos, { align: 'center' });
    yPos += 7;
  
    // Add logos (left logo and right logo)
    try {
      // Left logo
      pdf.addImage('./sjb_logo.jpg', 'JPEG', 10, yPos, 40, 40);
      // Right logo
      pdf.addImage('./naac.png', 'PNG', pdfWidth - 50, yPos, 40, 40);
    } catch (error) {
      console.error('Error loading images:', error);
    }
    yPos += 50;
  
    // Add accreditation info
    pdf.text('Approved by AICTE-New Delhi, Recognized by UGC, Accredited by NAAC with \'A\' Grade', pdfWidth / 2, yPos, { align: 'center' });
    yPos += 7;
    pdf.text('Accredited by National Board of Accreditation', pdfWidth / 2, yPos, { align: 'center' });
    yPos += 10;
  
    // Department Name
    pdf.setFontSize(14);
    pdf.text('Department of Computer Science and Engineering', pdfWidth / 2, yPos, { align: 'center' });
    yPos += 10;
  
    // Table Section
    pdf.setFontSize(12);
    autoTable({
      startY: yPos,
      head: [
        ['Internal Assessment', 'Academic Year'],
        ['Course Title', 'Course Code', 'Semester & Section', ''],
        ['Date', 'Time', 'Duration', ''],
        ['Faculty In-Charge', 'Max Marks', '', '']
      ],
      body: [
        ['Course Name', '12345', 'Semester 1', ''],
        ['01/01/2025', '10:00 AM', '2 Hours', ''],
        ['John Doe', '100', '', '']
      ],
      theme: 'grid',
      tableWidth: pdfWidth - 20,
    });
    
    yPos += 50; // After the table, adjust yPos as necessary for the next content
  
    // Now we move on to the questions and other details, so remember to add the other parts as necessary
    modules.forEach((mod, modIndex) => {
      pdf.setFontSize(14);
      pdf.text(`Module ${mod.moduleId}`, 10, yPos);
      yPos += 10;
      pdf.setFontSize(12);
  
      let overallQuestionNumber = 1;
  
      const beforeQuestions = mod.questions.filter(q => q.location === 'before');
      const afterQuestions = mod.questions.filter(q => q.location === 'after');
  
      if (beforeQuestions.length > 0) {
        let subIndex = 0;
        beforeQuestions.forEach((q) => {
          const numbering = `${overallQuestionNumber}.${String.fromCharCode(97 + subIndex)})`;
          const lines = q.text.split('\n');
          lines.forEach((line, idx) => {
            if (idx === 0) {
              pdf.text(`${numbering} ${line}`, 20, yPos);
            } else {
              pdf.text(line, 30, yPos);
            }
            yPos += 7;
          });
  
          pdf.text(`[${q.Marks} marks, CO: ${q.co}, RBT: ${q.rbt}]`, 30, yPos);
          yPos += 10;
  
          if (q.image) {
            try {
              const imageData = q.image;
              if (imageData.startsWith('data:image') || imageData.startsWith('http')) {
                pdf.addImage(imageData, 'JPEG', 20, yPos, 50, 50);
                yPos += 60;
              }
            } catch (error) {
              console.error("Error adding image:", error);
            }
          }
  
          subIndex++;
        });
  
        overallQuestionNumber++;
      }
  
      if (beforeQuestions.length > 0 && afterQuestions.length > 0) {
        pdf.text("OR", pdfWidth / 2 - 5, yPos);
        yPos += 10;
      }
  
      if (afterQuestions.length > 0) {
        let subIndex = 0;
        afterQuestions.forEach((q) => {
          const numbering = `${overallQuestionNumber}.${String.fromCharCode(97 + subIndex)})`;
          const lines = q.text.split('\n');
          lines.forEach((line, idx) => {
            if (idx === 0) {
              pdf.text(`${numbering} ${line}`, 20, yPos);
            } else {
              pdf.text(line, 30, yPos);
            }
            yPos += 7;
          });
  
          pdf.text(`[${q.Marks} marks, CO: ${q.co}, RBT: ${q.rbt}]`, 30, yPos);
          yPos += 10;
  
          if (q.image) {
            try {
              const imageData = q.image;
              if (imageData.startsWith('data:image') || imageData.startsWith('http')) {
                pdf.addImage(imageData, 'JPEG', 20, yPos, 50, 50);
                yPos += 60;
              }
            } catch (error) {
              console.error("Error adding image:", error);
            }
          }
  
          subIndex++;
        });
  
        overallQuestionNumber++;
      }
  
      yPos += 15;
  
      if (yPos > pdfHeight - 20) {
        pdf.addPage();
        yPos = 20;
      }
    });
  
    pdf.save(`${metadata.subject}_question_paper.pdf`);
  };
  
  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Question Paper Preview</h2>
        <div className="space-x-2">
          <button
            onClick={goBack}
            className="h-fit mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back to Editor
          </button>
          <button
            onClick={downloadPDF}
            className="h-fit mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Download as PDF
          </button>
        </div>
      </div>

      <div ref={paperRef} className="pdf-safe-colors">
        <div className="mb-6 text-center">
          <QuestionHeader metadata={metadata} />
          <span className="px-6"><strong>Subject:</strong> {metadata.subject}</span>
          <span className="px-6"><strong>Semester:</strong> {metadata.semester}</span>
          <span className="px-6"><strong>Exam Type:</strong> {metadata.examType}</span>
        </div>

        {(() => {
          let overallQuestionNumber = 1; // <<<<<<<<<<
          return modules.map((mod) => (
            <div key={mod.moduleId} className="mb-6 border border-2 p-4">
              <h3 className="text-xl font-semibold mb-2 text-center">Module {mod.moduleId}</h3>

              {mod.questions.filter(q => q.location === 'before').length > 0 && (
                <>
                  {mod.questions.filter(q => q.location === 'before').map((q, index) => (
                    <div key={`before-${index}`} className="border p-3 mb-2 rounded">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div className="flex-1 mb-2 sm:mb-0 flex">
                          <span className="font-semibold mr-2">{overallQuestionNumber}.{String.fromCharCode(97 + index)})</span>
                          <div>
                            {q.text.split('\n').map((line, idx) => (
                              <p key={idx} className="text-justify">{line}</p>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-center min-w-[120px] pl-4">
                          <p className="text-sm text-gray-600"><strong>{q.Marks} Marks</strong></p>
                          <p className="text-sm text-blue-600">CO: {q.co || 'N/A'}</p>
                          <p className="text-sm text-green-600">RBT: {q.rbt || 'N/A'}</p>
                        </div>
                      </div>
                      {q.image && (
                        <img
                          src={q.image}
                          alt="question related"
                          className="mt-2 w-64 h-64 object-contain mx-auto"
                        />
                      )}
                    </div>
                  ))}
                  {(() => { overallQuestionNumber++; return null; })()}
                </>
              )}

              {mod.questions.filter(q => q.location === 'before').length > 0 &&
               mod.questions.filter(q => q.location === 'after').length > 0 && (
                <div className="text-center font-semibold text-gray-500 my-2">OR</div>
              )}

              {mod.questions.filter(q => q.location === 'after').length > 0 && (
                <>
                  {mod.questions.filter(q => q.location === 'after').map((q, index) => (
                    <div key={`after-${index}`} className="border p-3 mb-2 rounded">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div className="flex-1 mb-2 sm:mb-0 flex">
                          <span className="font-semibold mr-2">{overallQuestionNumber}.{String.fromCharCode(97 + index)})</span>
                          <div>
                            {q.text.split('\n').map((line, idx) => (
                              <p key={idx} className="text-justify">{line}</p>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-center min-w-[120px] pl-4">
                          <p className="text-sm text-gray-600"><strong>{q.Marks} Marks</strong></p>
                          <p className="text-sm text-blue-600">CO: {q.co || 'N/A'}</p>
                          <p className="text-sm text-green-600">RBT: {q.rbt || 'N/A'}</p>
                        </div>
                      </div>
                      {q.image && (
                        <img
                          src={q.image}
                          alt="question related"
                          className="mt-2 w-64 h-64 object-contain mx-auto"
                        />
                      )}
                    </div>
                  ))}
                  {(() => { overallQuestionNumber++; return null; })()}
                </>
              )}
            </div>
          ));
        })()}
      </div>
    </div>
  );
};

export default QuestionPaperView;
