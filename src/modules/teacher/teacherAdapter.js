/**
 * O'qituvchi va Sinf boshqaruvi moduli (Teacher Adapter Boundary)
 *
 * ESLATMA: Asosiy ilova oflayn va server talab qilmaydi.
 * Kelajakda Supabase, Firebase yoki Node.js backend ulanganda
 * quyidagi TeacherAdapter interfeysi orqali serverga ulanadi.
 *
 * @typedef {Object} TeacherAdapterInterface
 * @property {function(string, string): Promise<any>} createClass
 * @property {function(): Promise<any[]>} getClasses
 * @property {function(string, string): Promise<any>} joinClass
 * @property {function(string): Promise<any[]>} getClassResults
 */

const STORAGE_KEY_CLASSES = 'fq_teacher_classes_mock';
const STORAGE_KEY_STUDENTS = 'fq_teacher_students_mock';

// Mock Adapter (LocalStorage asosida simulyatsiya)
class MockTeacherAdapter {
  getStoredClasses() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CLASSES);
      return raw ? JSON.parse(raw) : [
        {
          id: 'cls_1',
          name: '11-A sinf Abituriyentlar',
          teacher: 'Aziz Raximov',
          inviteCode: 'ABITUR-11A',
          createdAt: new Date().toISOString(),
          studentsCount: 3,
          weakestFormulas: ['geom_pifagor', 'alg_diskriminant']
        }
      ];
    } catch {
      return [];
    }
  }

  saveClasses(classes) {
    try {
      localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(classes));
    } catch (e) {
      console.warn('Teacher storage xatosi:', e);
    }
  }

  getStoredStudents() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_STUDENTS);
      return raw ? JSON.parse(raw) : [
        { id: 'st_1', classCode: 'ABITUR-11A', name: 'Jasur Temirov', score: 26, total: 30, date: '2026-11-15' },
        { id: 'st_2', classCode: 'ABITUR-11A', name: 'Madina Alimova', score: 28, total: 30, date: '2026-11-16' },
        { id: 'st_3', classCode: 'ABITUR-11A', name: 'Bobur Saidov', score: 21, total: 30, date: '2026-11-16' }
      ];
    } catch {
      return [];
    }
  }

  saveStudents(students) {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.warn('Student storage xatosi:', e);
    }
  }

  // Yangi sinf yaratish
  async createClass(teacherName, className) {
    const classes = this.getStoredClasses();
    const randomCode = `${className.slice(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newClass = {
      id: `cls_${Date.now()}`,
      name: className,
      teacher: teacherName,
      inviteCode: randomCode,
      createdAt: new Date().toISOString(),
      studentsCount: 0,
      weakestFormulas: []
    };
    classes.push(newClass);
    this.saveClasses(classes);
    return newClass;
  }

  // Barcha sinflarni olish
  async getClasses() {
    return this.getStoredClasses();
  }

  // Sinfga taklif kodi orqali qo'shilish
  async joinClass(studentName, inviteCode) {
    const classes = this.getStoredClasses();
    const found = classes.find((c) => c.inviteCode.toUpperCase() === inviteCode.trim().toUpperCase());
    if (!found) {
      throw new Error('Bunday taklif kodli sinf topilmadi.');
    }

    found.studentsCount += 1;
    this.saveClasses(classes);

    return {
      success: true,
      class: found,
      message: `${found.name} sinfiga muvaffaqiyatli qoʻshildingiz!`
    };
  }

  // Sinf o'quvchilari natijalarini olish
  async getClassResults(inviteCode) {
    const students = this.getStoredStudents();
    return students.filter((s) => s.classCode === inviteCode);
  }
}

// Global adapter ekzemplyari (Kelajakda new SupabaseTeacherAdapter() bilan almashtirilishi mumkin)
export const teacherService = new MockTeacherAdapter();
