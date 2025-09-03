import React, { useState } from 'react';
import { Plus, ImageIcon, Sparkles, Trash2 } from 'lucide-react';
import QuestionPaperView from './QuestionPaperView';

const ModuleList = ({ metadata, QB }) => {
  const [modules, setModules] = useState(
    Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      checked: false,
      questions: [],
    }))
  );
  const [showPreview, setShowPreview] = useState(false);

  const selectedModules = modules
    .filter((mod) => mod.checked)
    .map((mod) => ({
      moduleId: mod.id,
      questions: mod.questions.map((q) => ({
        text: q.text,
        Marks: q.Marks,
        location: q.location,
        image: q.image,
        co: q.co, // Standardized field name
        rbt: q.rbt, // Standardized field name
        image_link: q.image, // Assuming you use the uploaded image URL
      })),
    }));

  if (showPreview) {
    return (
      <QuestionPaperView
        metadata={metadata}
        modules={selectedModules}
        goBack={() => setShowPreview(false)}
      />
    );
  }

  const toggleModule = (id) => {
    setModules((prev) =>
      prev.map((mod) =>
        mod.id === id
          ? { ...mod, checked: !mod.checked, questions: !mod.checked ? [] : mod.questions } // Clear questions if unchecked
          : mod
      )
    );
  };

  const addQuestion = (id, location) => {
    const newQuestion = {
      id: Date.now() + Math.random(),
      text: '',
      Marks: '',
      location,
      image: '',
      co: '', // Standardized field name
      rbt: '', // Standardized field name
      image_link: '',
      isEditing: true,
    };

    setModules((prev) =>
      prev.map((mod) =>
        mod.id === id ? { ...mod, questions: [...mod.questions, newQuestion] } : mod
      )
    );
  };

  const deleteQuestion = (modId, qId) => {
    setModules((prev) =>
      prev.map((mod) =>
        mod.id === modId
          ? { ...mod, questions: mod.questions.filter((q) => q.id !== qId) }
          : mod
      )
    );
  };

  const updateQuestion = (modId, qId, key, value) => {
    setModules((prev) =>
      prev.map((mod) =>
        mod.id === modId
          ? {
              ...mod,
              questions: mod.questions.map((q) =>
                q.id === qId ? { ...q, [key]: value } : q
              ),
            }
          : mod
      )
    );
  };

  const toggleEdit = (modId, qId) => {
    setModules((prev) =>
      prev.map((mod) =>
        mod.id === modId
          ? {
              ...mod,
              questions: mod.questions.map((q) =>
                q.id === qId ? { ...q, isEditing: !q.isEditing } : q
              ),
            }
          : mod
      )
    );
  };

  const generateQuestion = (modId, qId) => {
    if (!QB[modId] || QB[modId].length === 0) {
      console.warn(`No questions available for module ${modId}`);
      return;
    }

    const randomIndex = Math.floor(Math.random() * QB[modId].length);
    const randomQuestion = QB[modId][randomIndex];

    // Update the question text
    updateQuestion(modId, qId, 'text', randomQuestion.text || randomQuestion);

    // Check if the question bank has CO and RBT information and update if available
    if (randomQuestion.co) {
      updateQuestion(modId, qId, 'co', randomQuestion.co);
    }

    if (randomQuestion.rbt) {
      updateQuestion(modId, qId, 'rbt', randomQuestion.rbt);
    }

    // If marks are available in the question bank, update them too
    if (randomQuestion.Marks) {
      updateQuestion(modId, qId, 'Marks', randomQuestion.Marks);
    }

    // If image is available, update it
    if (randomQuestion.image || randomQuestion.image_link) {
      updateQuestion(modId, qId, 'image', randomQuestion.image || randomQuestion.image_link);
    }
  };

  // Function to generate three questions for each location ('before' and 'after' OR) in selected modules
const generatethreequestionpermodule = () => {
  setModules((prevModules) =>
    prevModules.map((mod) => {
      if (!mod.checked) return mod;

      // Determine target marks per section based on total_marks
      let marksPerLocation = metadata.total_marks === 50 ? 25
                        : metadata.total_marks === 100 ? 20 
                        : Math.floor((metadata.total_marks || 50) / 2);
      

      const usedQuestions = new Set();

      // Shuffle questions pool for randomness
      const getShuffledQuestions = (moduleID) => {
        const questions = [...(QB[moduleID] || [])];
        return questions.sort(() => Math.random() - 0.5);
      };

      // Greedy selection, adjusting last if needed
      const pickQuestionsForSection = (questions, targetMarks) => {
        let selected = [];
        let total = 0;

        for (const q of questions) {
          const text = (q.text || q).trim().toLowerCase();
          if (usedQuestions.has(text)) continue;

          let marks = q.Marks ? parseInt(q.Marks) : 5;
          if (total + marks > targetMarks) continue; // skip if it overshoots

          selected.push({
            id: Date.now() + Math.random(),
            location: '', // Will be set later
            isEditing: true,
            text: q.text || q,
            Marks: marks,
            co: q.co || '',
            rbt: q.rbt || '',
            image: q.image || q.image_link || '',
          });
          usedQuestions.add(text);
          total += marks;

          if (total === targetMarks) break; // stop on exactly hitting target
        }

        // If we undershot, adjust last question's marks to fill
        if (total < targetMarks && selected.length > 0) {
          selected[selected.length - 1].Marks += (targetMarks - total);
          total = targetMarks;
        }

        return { selected, total };
      };

      const allQuestions = getShuffledQuestions(mod.id);

      // Run selection for “before” and “after” sections
      const { selected: beforeQuestions, total: beforeTotal } =
        pickQuestionsForSection(allQuestions, marksPerLocation);
      const { selected: afterQuestions, total: afterTotal } =
        pickQuestionsForSection(allQuestions, marksPerLocation);

      // Mark questions with location
      return {
        ...mod,
        checked: true,
        questions: [
          ...beforeQuestions.map(q => ({ ...q, location: 'before' })),
          ...afterQuestions.map(q => ({ ...q, location: 'after' })),
        ],
      };
    })
  );
};






  const handleImageUpload = (modId, qId, fileName) => {
    updateQuestion(modId, qId, 'image', fileName);
  };

  // Calculate the total marks for each module
  const calculateTotalMarks = (mod) => {
    return mod.questions.reduce((total, question) => total + (parseInt(question.Marks) || 0), 0);
  };

  const submitSelectedModules = async () => {
    const selectedModules = modules
      .filter((mod) => mod.checked)
      .map((mod) => ({
        moduleId: mod.id,
        questions: mod.questions.map((q) => ({
          text: q.text,
          Marks: q.Marks,
          location: q.location,
          co: q.co,
          rbt: q.rbt,
          image: q.image
        })),
      }));

    const payload = {
      metadata,
      subject: metadata.subject,
      semester: metadata.semester,
      modules: selectedModules,
    };

    console.log("selectedModules:", payload);

    try {
      const res = await fetch('http://localhost:8000/upload-question-json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('Success:', data);
      alert('Data sent to backend successfully!');
    } catch (err) {
      console.error('Error uploading:', err);
      alert('Something went wrong!');
    }
  };


  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">

      <div className="flex items-center justify-between px-3">
        <div>
          <span className="px-3">Exam Type: {metadata.examType}</span>
          <span className="px-3">Semester: {metadata.semester}</span>
          <span className="px-3">Subject: {metadata.subject}</span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={generatethreequestionpermodule}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Generate 3 Question Per Module
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Show Question Paper
          </button>
        </div>
      </div>

      {modules.map((mod) => (
        <div key={mod.id} className="border p-5 rounded-xl shadow-sm bg-white">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={mod.checked}
              onChange={() => toggleModule(mod.id)}
            />
            <span className="text-lg font-semibold">Module {mod.id}</span>
            <span className="ml-4 text-sm text-gray-600">
              Total Marks: {calculateTotalMarks(mod)}
            </span>
          </label>

          {mod.checked && (
            <div className="mt-4 space-y-4">
              {/* Add Question BEFORE */}
              <button
                onClick={() => addQuestion(mod.id, 'before')}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <Plus className="w-5 h-5" /> Add Question (Before)
              </button>

              {/* Questions BEFORE OR */}
              {mod.questions
                .filter((q) => q.location === 'before')
                .map((q) => (
                  <div
                    key={q.id}
                    className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg"
                  >
                    <button
                      onClick={() => toggleEdit(mod.id, q.id)}
                      className="text-sm px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      {q.isEditing ? "Save" : "Edit"}
                    </button>

                    <input
                      type="text"
                      placeholder="Enter your question"
                      value={q.text}
                      onChange={(e) =>
                        updateQuestion(mod.id, q.id, 'text', e.target.value)
                      }
                      disabled={!q.isEditing}
                      className="flex-1 p-2 border rounded bg-white"
                    />

                    {/* Image Upload Handler */}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      id={`file-${q.id}`}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          const imgURL = URL.createObjectURL(file);
                          updateQuestion(mod.id, q.id, 'image', imgURL);
                        }
                      }}
                    />

                    <button
                      onClick={() => document.getElementById(`file-${q.id}`).click()}
                      className="p-2 bg-gray-200 hover:bg-gray-300 rounded"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </button>

                    {(q.image || q.image_link) && (
                      <div className="flex items-center gap-2">
                        <img
                          src={q.image || q.image_link}
                          alt="Uploaded"
                          className="w-14 h-14 object-cover rounded border"
                        />
                        {q.image && (
                          <button
                            onClick={() => updateQuestion(mod.id, q.id, 'image', '')}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    )}

                    <input
                      type="text"
                      placeholder="CO"
                      value={q.co || ""}
                      onChange={(e) =>
                        updateQuestion(mod.id, q.id, 'co', e.target.value)
                      }
                      className="w-28 p-2 border rounded"
                    />

                    <input
                      type="text"
                      placeholder="RBT Level"
                      value={q.rbt || ""}
                      onChange={(e) =>
                        updateQuestion(mod.id, q.id, 'rbt', e.target.value)
                      }
                      className="w-32 p-2 border rounded"
                    />

                    <input
                      type="text"
                      placeholder="Marks"
                      value={q.Marks}
                      onChange={(e) =>
                        updateQuestion(mod.id, q.id, 'Marks', e.target.value)
                      }
                      className="w-28 p-2 border rounded"
                    />
                    <button
                      onClick={() => generateQuestion(mod.id, q.id)}
                      className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded"
                    >
                      <Sparkles className="w-5 h-5 text-yellow-600" />
                    </button>
                    <button
                      onClick={() => deleteQuestion(mod.id, q.id)}
                      className="p-2 bg-red-100 hover:bg-red-200 rounded"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                ))}

              {/* OR divider */}
              <div className="text-center text-gray-400 font-semibold">OR</div>

              {/* Add Question AFTER */}
              <button
                onClick={() => addQuestion(mod.id, 'after')}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <Plus className="w-5 h-5" /> Add Question (After)
              </button>

              {/* Questions AFTER OR */}
              {mod.questions
                .filter((q) => q.location === 'after')
                .map((q) => (
                  <div
                    key={q.id}
                    className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg"
                  >
                    <button
                      onClick={() => toggleEdit(mod.id, q.id)}
                      className="text-sm px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      {q.isEditing ? "Save" : "Edit"}
                    </button>

                    <input
                      type="text"
                      placeholder="Enter your question"
                      value={q.text}
                      onChange={(e) =>
                        updateQuestion(mod.id, q.id, 'text', e.target.value)
                      }
                      disabled={!q.isEditing}
                      className="flex-1 p-2 border rounded bg-white"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      id={`file-${q.id}`}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          const imgURL = URL.createObjectURL(file);
                          updateQuestion(mod.id, q.id, 'image', imgURL);
                        }
                      }}
                    />

                    <button
                      onClick={() => document.getElementById(`file-${q.id}`).click()}
                      className="p-2 bg-gray-200 hover:bg-gray-300 rounded"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </button>

                    {(q.image || q.image_link) && (
                      <div className="flex items-center gap-2">
                        <img
                          src={q.image || q.image_link}
                          alt="Uploaded"
                          className="w-14 h-14 object-cover rounded border"
                        />
                        {q.image && (
                          <button
                            onClick={() => updateQuestion(mod.id, q.id, 'image', '')}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    )}

                    <input
                      type="text"
                      placeholder="CO"
                      value={q.co || ""}
                      onChange={(e) =>
                        updateQuestion(mod.id, q.id, 'co', e.target.value)
                      }
                      className="w-28 p-2 border rounded"
                    />

                    <input
                      type="text"
                      placeholder="RBT Level"
                      value={q.rbt || ""}
                      onChange={(e) =>
                        updateQuestion(mod.id, q.id, 'rbt', e.target.value)
                      }
                      className="w-32 p-2 border rounded"
                    />

                    <input
                      type="text"
                      placeholder="Marks"
                      value={q.Marks}
                      onChange={(e) =>
                        updateQuestion(mod.id, q.id, 'Marks', e.target.value)
                      }
                      className="w-28 p-2 border rounded"
                    />
                    <button
                      onClick={() => generateQuestion(mod.id, q.id)}
                      className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded"
                    >
                      <Sparkles className="w-5 h-5 text-yellow-600" />
                    </button>
                    <button
                      onClick={() => deleteQuestion(mod.id, q.id)}
                      className="p-2 bg-red-100 hover:bg-red-200 rounded"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ModuleList;