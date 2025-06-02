import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";
import QuestionHeader from './QuestionHeader';

const QuestionPaperView = ({ metadata, modules, goBack }) => {
  const paperRef = useRef();

  const downloadPDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    let yPos = 10; // Starting position for content

    // --- Common Header Content (Non-table) ---
    pdf.setFontSize(12);
    pdf.text('|| Jai Sri Gurudev ||', pdfWidth / 2, yPos, { align: 'center' });
    yPos += 7;
    pdf.text('Sri AdichunchanagiriShikshana Trust(R)', pdfWidth / 2, yPos, { align: 'center' });
    yPos += 7;

    pdf.setFontSize(16);
    pdf.text('SJB Institute of Technology', pdfWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    pdf.setFontSize(12);
    pdf.text('ESTD:2001', pdfWidth / 2, yPos, { align: 'center' });
    yPos += 10;
    pdf.text('(An Autonomous Institution affiliated to VTU, Belagavi)', pdfWidth / 2, yPos, { align: 'center' });
    yPos += 7;

    // Add logos
    try {
      pdf.addImage('/sjb_logo.jpg', 'JPEG', 10, yPos, 40, 40);
      pdf.addImage('/naac.png', 'PNG', pdfWidth - 50, yPos, 40, 40);
    } catch (error) {
      console.error('Error loading images or image paths incorrect (ensure they are accessible or base64):', error);
    }
    yPos += 50; // Space for logos

    pdf.text('Approved by AICTE-New Delhi, Recognized by UGC, Accredited by NAAC with \'A\' Grade', pdfWidth / 2, yPos, { align: 'center' });
    yPos += 7;
    pdf.text('Accredited by National Board of Accreditation', pdfWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    pdf.setFontSize(14);
    pdf.text('Department of Computer Science and Engineering', pdfWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    // --- Table 1: Metadata Table (PDF) ---
    pdf.setFontSize(12);

    const academicYear = metadata.academicYear || 'N/A';
    const courseTitle = metadata.courseTitle || 'N/A';
    // Use metadata.subjectcode for Course Code, as per your HTML table
    const courseCode = metadata.subjectcode || 'N/A';
    // Use metadata.examsections for Semester & Section, as per your HTML table
    const semesterSection = metadata.examsections || 'N/A';
    const date = metadata.date || 'DD/MM/YYYY';
    const time = metadata.time || 'HH:MM AM/PM';
    const duration = metadata.duration || '0 Hours';
    // Use metadata.questionpapersetter for Faculty In-Charge, as per your HTML table
    const facultyInCharge = metadata.questionpapersetter || 'N/A';
    const maxMarks = metadata.maxMarks || '0';


    autoTable(pdf, {
      startY: yPos,
      head: [
        [{ content: `Internal Assessment: ${metadata.examType || 'N/A'}`, colSpan: 3, styles: { halign: 'left' } }, { content: `Academic Year: ${academicYear}`, colSpan: 1, styles: { halign: 'left' } }],
        [
          { content: 'Course Title', styles: { halign: 'left' } },
          { content: 'Course Code', styles: { halign: 'left' } },
          { content: 'Semester & Section', colSpan: 2, styles: { halign: 'left' } }
        ],
        [
          { content: 'Date', styles: { halign: 'left' } },
          { content: 'Time', styles: { halign: 'left' } },
          { content: 'Duration', colSpan: 2, styles: { halign: 'left' } }
        ],
        [
          { content: 'Faculty In-Charge', styles: { halign: 'left' } },
          { content: 'Max Marks', colSpan: 3, styles: { halign: 'left' } }
        ]
      ],
      body: [
        [courseTitle, courseCode, semesterSection, ''],
        [date, time, duration, ''],
        [facultyInCharge, maxMarks, '', '']
      ],
      theme: 'grid',
      tableWidth: pdfWidth - 20,
      margin: { left: 10, right: 10 },
      styles: { fontSize: 10, cellPadding: 2, lineColor: [0, 0, 0], lineWidth: 0.1 },
      headStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: 'bold' },
      bodyStyles: { textColor: [0, 0, 0] },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 'auto' }
      },
    });

    yPos = pdf.autoTable.previous.finalY + 15;

    // --- Table 2: Questions Table (PDF) ---
    const questionsTableHead = [
      ['Q. No.', 'Question', 'Marks', 'RBT', 'CO']
    ];

    const questionsTableBody = [];
    let pdfOverallQuestionNumber = 1; // Global question number for the PDF output

    modules.forEach((mod) => {
      const beforeQuestions = mod.questions.filter(q => q.location === 'before');
      const afterQuestions = mod.questions.filter(q => q.location === 'after');

      if (yPos + 20 > pdfHeight - 20) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.setFontSize(14);
      pdf.text(`Module ${mod.moduleId}`, 10, yPos);
      yPos += 10;

      // Add "before" questions to the body
      if (beforeQuestions.length > 0) {
        beforeQuestions.forEach((q, index) => {
          const questionNumbering = `${pdfOverallQuestionNumber}.${String.fromCharCode(97 + index)})`;
          let questionContent = q.text;
          if (q.image) {
            questionContent += `\n(Image: ${q.image})`;
          }
          questionsTableBody.push([
            questionNumbering,
            questionContent,
            q.Marks || 'N/A',
            q.rbt || 'N/A',
            q.co || 'N/A'
          ]);
        });
        // Increment after this group of questions
        pdfOverallQuestionNumber++;
      }

      // Add "OR" row if both before and after questions exist
      if (beforeQuestions.length > 0 && afterQuestions.length > 0) {
        questionsTableBody.push([
          { content: 'OR', colSpan: 5, styles: { halign: 'center', fontStyle: 'bold' } }
        ]);
      }

      // Add "after" questions to the body
      if (afterQuestions.length > 0) {
        afterQuestions.forEach((q, index) => {
          const questionNumbering = `${pdfOverallQuestionNumber}.${String.fromCharCode(97 + index)})`;
          let questionContent = q.text;
          if (q.image) {
            questionContent += `\n(Image: ${q.image})`;
          }
          questionsTableBody.push([
            questionNumbering,
            questionContent,
            q.Marks || 'N/A',
            q.rbt || 'N/A',
            q.co || 'N/A'
          ]);
        });
        // Increment after this group of questions
        pdfOverallQuestionNumber++;
      }
      // If a module has no questions or only one group, we still need to make sure the numbering progresses.
      // This logic ensures pdfOverallQuestionNumber is always ready for the next logical question set.
    });

    autoTable(pdf, {
      startY: yPos,
      head: questionsTableHead,
      body: questionsTableBody,
      theme: 'grid',
      tableWidth: pdfWidth - 20,
      margin: { left: 10, right: 10 },
      styles: { fontSize: 10, cellPadding: 2, lineColor: [0, 0, 0], lineWidth: 0.1 },
      headStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: 'bold' },
      bodyStyles: { textColor: [0, 0, 0] },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 15, halign: 'center' },
        3: { cellWidth: 15, halign: 'center' },
        4: { cellWidth: 15, halign: 'center' }
      },
    });

    yPos = pdf.autoTable.previous.finalY + 10;

    pdf.save(`${metadata.subject}_question_paper.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow font-serif">
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
        {/* --- HTML Preview Header --- */}
        <div className="mb-6 text-center">
          <QuestionHeader metadata={metadata} />  

          {/* --- Metadata Table for Web Preview --- */}
          <table className="w-full text-sm border-collapse border border-black-300 my-4 font-serif">
            <tbody>
              <tr>
                <td className="border border-black-300 p-2 text-left " colSpan="3">
                  <b>Exam:</b> {metadata.examType || 'N/A'}
                </td>
                <td className="border border-black-300 p-2 text-left ">
                  <b>Academic Year:</b> {metadata.academicYear || 'N/A'}
                </td>
              </tr>
              <tr>
                <td className="border border-black-300 p-2 text-left "><b>Course Title:</b> {metadata.subject}</td>
                <td className="border border-black-300 p-2 text-left "><b>Course Code:</b> {metadata.subjectcode}</td>
                <td className="border border-black-300 p-2 text-left " colSpan="2"><b>Semester & Section:</b> {metadata.semester}({metadata.examsections})</td>
              </tr>
              <tr>
                <td className="border border-black-300 p-2 text-left "><b>Date:</b> {metadata.date}</td>
                <td className="border border-black-300 p-2 text-left "><b>Time:</b> {metadata.time}</td>
                <td className="border border-black-300 p-2 text-left " colSpan="2"><b>Duration:</b> {metadata.duration}</td> {/* Added metadata.duration here */}
              </tr>
              <tr>
                <td className="border border-black-300 p-2 text-left "><b>Faculty In-Charge:</b> {metadata.questionpapersetter || 'N/A'}</td>
                <td className="border border-black-300 p-2 text-left " colSpan="3"><b>Max Marks:</b> {metadata.maxMarks || '50'}</td>
              </tr>

            </tbody>
          </table>
        </div>

        {/* --- HTML Preview of Modules and Questions (Table Format) --- */}
        <table className="w-full text-sm border-collapse border border-black-300 my-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black-300 p-2 text-center w-[60px]">Q. No.</th>
              <th className="border border-black-300 p-2 text-center">Questions</th>
              <th className="border border-black-300 p-2 text-center w-[60px]">Marks</th>
              <th className="border border-black-300 p-2 text-center w-[60px]">RBT</th>
              <th className="border border-black-300 p-2 text-center w-[60px]">CO</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              let overallQuestionNumber = 1; // Tracks the main question number (e.g., 1, 2, 3) for HTML preview
              const tableRows = [];

              modules.forEach((mod) => {
                tableRows.push(
                  <tr key={`module-header-${mod.moduleId}`} className="bg-gray-50">
                    <td colSpan="5" className="border border-black-300 p-2 text-center  text-base">
                      <b>Module {mod.moduleId}</b>
                    </td>
                  </tr>
                );

                const beforeQuestions = mod.questions.filter(q => q.location === 'before');
                const afterQuestions = mod.questions.filter(q => q.location === 'after');

                // Add "before" questions
                if (beforeQuestions.length > 0) { // Only render if there are questions
                  beforeQuestions.forEach((q, index) => {
                    tableRows.push(
                      <tr key={`q-before-${mod.moduleId}-${index}`}>
                        <td className="border border-black-300 p-2 align-top text-center ">
                          {overallQuestionNumber}.{String.fromCharCode(97 + index)})
                        </td>
                        <td className="border border-black-300 p-2 align-top">
                          <p className="text-justify">{q.text.split('\n').map((line, idx) => <span key={idx}>{line}<br /></span>)}</p>
                          {q.image && (
                            <img
                              src={q.image}
                              alt="question related"
                              className="mt-2 w-32 h-32 object-contain mx-auto"
                            />
                          )}
                        </td>
                        <td className="border border-black-300 p-2 align-top text-center">
                          {q.Marks}
                        </td>
                        <td className="border border-black-300 p-2 align-top text-center">
                          {q.rbt || 'N/A'}
                        </td>
                        <td className="border border-black-300 p-2 align-top text-center">
                          {q.co || 'N/A'}
                        </td>
                      </tr>
                    );
                  });
                  // Increment overallQuestionNumber AFTER this set of "before" questions
                  overallQuestionNumber++;
                }


                // Add "OR" row if both before and after questions exist
                if (beforeQuestions.length > 0 && afterQuestions.length > 0) {
                  tableRows.push(
                    <tr key={`or-${mod.moduleId}`}>
                      <td colSpan="5" className="border border-black-300 p-2 text-center  text-gray-500">
                       <b> OR</b>
                      </td>
                    </tr>
                  );
                }

                // Add "after" questions
                if (afterQuestions.length > 0) { // Only render if there are questions
                  afterQuestions.forEach((q, index) => {
                    tableRows.push(
                      <tr key={`q-after-${mod.moduleId}-${index}`}>
                        <td className="border border-black-300 p-2 align-top text-center ">
                          {overallQuestionNumber}.{String.fromCharCode(97 + index)})
                        </td>
                        <td className="border border-black-300 p-2 align-top">
                          <p className="text-justify">{q.text.split('\n').map((line, idx) => <span key={idx}>{line}<br /></span>)}</p>
                          {q.image && (
                            <img
                              src={q.image}
                              alt="question related"
                              className="mt-2 w-32 h-32 object-contain mx-auto"
                            />
                          )}
                        </td>
                        <td className="border border-black-300 p-2 align-top text-center">
                          {q.Marks}
                        </td>
                        <td className="border border-black-300 p-2 align-top text-center">
                          {q.rbt || 'N/A'}
                        </td>
                        <td className="border border-black-300 p-2 align-top text-center">
                          {q.co || 'N/A'}
                        </td>
                      </tr>
                    );
                  });
                  // Increment overallQuestionNumber AFTER this set of "after" questions
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