import React, { useState, useEffect } from 'react';
import { X, GraduationCap, Plus, Users, Key, CheckCircle, BarChart3, AlertCircle } from 'lucide-react';
import { teacherService } from './teacherAdapter';
import t from '../../i18n';

export default function TeacherModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('teacher'); // 'teacher' | 'student'
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [studentsResults, setStudentsResults] = useState([]);

  // Forma holatlari
  const [teacherName, setTeacherName] = useState('');
  const [newClassName, setNewClassName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [joinMessage, setJoinMessage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadClasses();
    }
  }, [isOpen]);

  const loadClasses = async () => {
    const list = await teacherService.getClasses();
    setClasses(list);
    if (list.length > 0) {
      handleSelectClass(list[0]);
    }
  };

  const handleSelectClass = async (cls) => {
    setSelectedClass(cls);
    const results = await teacherService.getClassResults(cls.inviteCode);
    setStudentsResults(results);
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    const created = await teacherService.createClass(teacherName || 'Oʻqituvchi', newClassName);
    setNewClassName('');
    await loadClasses();
    handleSelectClass(created);
  };

  const handleJoinClass = async (e) => {
    e.preventDefault();
    if (!inviteCodeInput.trim()) return;
    try {
      const res = await teacherService.joinClass(studentName || 'Oʻquvchi', inviteCodeInput);
      setJoinMessage({ success: true, text: res.message });
      setInviteCodeInput('');
      await loadClasses();
    } catch (err) {
      setJoinMessage({ success: false, text: err.message });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-purple-600 text-white shadow-md shadow-purple-600/30">
              <GraduationCap className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Oʻqituvchi xonasi (Eksperimental modul)
              </h2>
              <p className="text-xs text-slate-500">
                Sinflarni boshqarish, taklif kodlari va oʻquvchilar natijalari
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rejim tablari */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-950/40 p-1">
          <button
            onClick={() => setActiveTab('teacher')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'teacher'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Oʻqituvchi boshqaruvi
          </button>
          <button
            onClick={() => setActiveTab('student')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'student'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Oʻquvchi (Sinfga qoʻshilish)
          </button>
        </div>

        {/* Modal Tana Qismi */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'teacher' ? (
            <div className="space-y-5">
              {/* Yangi sinf ochish formasi */}
              <form onSubmit={handleCreateClass} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                  Yangi sinf yoki guruh ochish:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    placeholder="Ismingiz (masalan: Aziz Raximov)"
                    className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  />
                  <input
                    type="text"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="Sinf nomi (masalan: 10-B Matematika)"
                    className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newClassName.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                >
                  Sinf yaratish
                </button>
              </form>

              {/* Mavjud sinflar ro'yxati */}
              {classes.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block">
                    Mening sinflarim:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {classes.map((cls) => (
                      <div
                        key={cls.id}
                        onClick={() => handleSelectClass(cls)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          selectedClass?.id === cls.id
                            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">{cls.name}</span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {cls.inviteCode}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                          <span>{cls.teacher}</span>
                          <span>•</span>
                          <span>{cls.studentsCount || 0} ta oʻquvchi</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tanlangan sinf o'quvchilari natijalari */}
              {selectedClass && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      «{selectedClass.name}» sinfi test natijalari:
                    </span>
                    <span className="text-xs text-slate-500 font-mono font-semibold">
                      Taklif kodi: <strong className="text-indigo-600">{selectedClass.inviteCode}</strong>
                    </span>
                  </div>

                  {studentsResults.length > 0 ? (
                    <div className="space-y-1.5">
                      {studentsResults.map((st) => (
                        <div key={st.id} className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                          <span className="font-semibold">{st.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-slate-400">{st.date}</span>
                            <span className="font-black text-indigo-600">{st.score} / {st.total} ball</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-2">
                      Ushbu sinfda hali topshirilgan testlar yoʻq.
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* O'QUVCHI UCHUN SINFGA QO'SHILISH */
            <div className="max-w-md mx-auto py-6 space-y-4 text-center">
              <Key className="w-12 h-12 mx-auto text-indigo-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Oʻqituvchi sinfiga qoʻshilish
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Oʻqituvchingiz bergan taklif kodini kiriting.
                </p>
              </div>

              <form onSubmit={handleJoinClass} className="space-y-3 text-left">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Ism va familiyangiz:
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Masalan: Sardor Rustamov"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Sinf taklif kodi:
                  </label>
                  <input
                    type="text"
                    value={inviteCodeInput}
                    onChange={(e) => setInviteCodeInput(e.target.value)}
                    placeholder="Masalan: ABITUR-11A"
                    className="w-full px-3 py-2 text-xs uppercase font-mono font-bold tracking-wider rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!inviteCodeInput.trim()}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-indigo-600/20"
                >
                  Sinfga aʼzo boʻlish
                </button>
              </form>

              {joinMessage && (
                <div className={`p-3 rounded-xl text-xs font-bold ${joinMessage.success ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                  {joinMessage.text}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-950/50">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
}
