import { useEffect, useMemo, useState } from 'react';
import { GraduationCap, LayoutDashboard, Users, BookOpen, Settings, Search, Plus, Pencil, Trash2, X, ChevronDown, Menu, Download, UserRound, CheckCircle2, Clock3, GraduationCap as CourseIcon, SlidersHorizontal, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'gothic-noir-students-v1';
const initialStudents = [
  { id: 'STU-1001', name: 'Thato Mokoena', age: 21, email: 'thato.mokoena@example.com', course: 'Diploma in Information Technology', status: 'Enrolled' },
  { id: 'STU-1002', name: 'Lerato Khumalo', age: 23, email: 'lerato.khumalo@example.com', course: 'Diploma in Business Studies', status: 'Enrolled' },
  { id: 'STU-1003', name: 'Kabelo Ndlovu', age: 20, email: 'kabelo.ndlovu@example.com', course: 'Diploma in Software Engineering', status: 'Pending' },
  { id: 'STU-1004', name: 'Mpho Rantšo', age: 22, email: 'mpho.rantso@example.com', course: 'Diploma in Information Technology', status: 'Enrolled' },
  { id: 'STU-1005', name: 'Palesa Molise', age: 24, email: 'palesa.molise@example.com', course: 'Diploma in Retail Management', status: 'Inactive' },
];
const courses = ['Diploma in Information Technology', 'Diploma in Business Studies', 'Diploma in Software Engineering', 'Diploma in Retail Management', 'Diploma in Business Information Technology'];
const emptyForm = { name: '', age: '', email: '', course: courses[0], status: 'Enrolled' };

function readStudents() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialStudents;
  } catch (error) {
    console.error('Could not load saved student records:', error);
    return initialStudents;
  }
}
function validateStudent(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Please enter the student’s full name.';
  if (form.age === '' || !Number.isFinite(Number(form.age)) || Number(form.age) < 16 || Number(form.age) > 100) errors.age = 'Age must be a number between 16 and 100.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Enter a valid email address.';
  if (!form.course) errors.course = 'Please select a course.';
  if (!['Enrolled', 'Pending', 'Inactive'].includes(form.status)) errors.status = 'Select a valid status.';
  return errors;
}
function makeId(students) {
  const maxId = students.reduce((max, student) => Math.max(max, Number(student.id.replace('STU-', '')) || 1000), 1000);
  return `STU-${String(maxId + 1).padStart(4, '0')}`;
}
function IconButton({ title, onClick, children, danger = false }) {
  return <button className={`icon-button ${danger ? 'danger' : ''}`} type="button" title={title} aria-label={title} onClick={onClick}>{children}</button>;
}
function Modal({ title, subtitle, onClose, children, wide = false }) {
  useEffect(() => {
    const closeOnEscape = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className={`modal ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-heading"><div><h2 id="modal-title">{title}</h2><p>{subtitle}</p></div><IconButton title="Close dialog" onClick={onClose}><X size={19}/></IconButton></div>
      {children}
    </section>
  </div>;
}
function StudentForm({ student, onSave, onCancel }) {
  const [form, setForm] = useState(student ? { name: student.name, age: String(student.age), email: student.email, course: student.course, status: student.status } : emptyForm);
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);
  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (attempted) setErrors((current) => ({ ...current, [name]: undefined }));
  };
  const submit = (event) => {
    event.preventDefault(); setAttempted(true);
    const nextErrors = validateStudent(form); setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSave({ ...form, name: form.name.trim(), age: Number(form.age), email: form.email.trim().toLowerCase() });
  };
  return <form className="student-form" onSubmit={submit} noValidate>
    <div className="form-grid">
      <label className="field"><span>Full name <b>*</b></span><input autoFocus name="name" value={form.name} onChange={update} placeholder="e.g. Thato Mokoena" aria-invalid={!!errors.name}/>{errors.name && <small className="error-text">{errors.name}</small>}</label>
      <label className="field"><span>Age <b>*</b></span><input name="age" type="number" min="16" max="100" value={form.age} onChange={update} placeholder="e.g. 21" aria-invalid={!!errors.age}/>{errors.age && <small className="error-text">{errors.age}</small>}</label>
      <label className="field full-field"><span>Email address <b>*</b></span><input name="email" type="email" value={form.email} onChange={update} placeholder="student@example.com" aria-invalid={!!errors.email}/>{errors.email && <small className="error-text">{errors.email}</small>}</label>
      <label className="field full-field"><span>Course of study <b>*</b></span><select name="course" value={form.course} onChange={update}>{courses.map((course) => <option key={course} value={course}>{course}</option>)}</select>{errors.course && <small className="error-text">{errors.course}</small>}</label>
      <label className="field full-field"><span>Enrollment status <b>*</b></span><select name="status" value={form.status} onChange={update}><option>Enrolled</option><option>Pending</option><option>Inactive</option></select>{errors.status && <small className="error-text">{errors.status}</small>}</label>
    </div>
    <div className="form-note">Fields marked * are required. Student IDs are generated automatically.</div>
    <div className="modal-actions"><button className="button secondary" type="button" onClick={onCancel}>Cancel</button><button className="button primary" type="submit">{student ? 'Save changes' : 'Add student'}</button></div>
  </form>;
}
function StatusBadge({ status }) { return <span className={`status-badge ${status.toLowerCase()}`}><span/> {status}</span>; }

export default function App() {
  const [students, setStudents] = useState(readStudents);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [courseFilter, setCourseFilter] = useState('All courses');
  const [modal, setModal] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [notice, setNotice] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [activePage, setActivePage] = useState('Students');
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(students)); }, [students]);
  useEffect(() => { if (!notice) return undefined; const timer = setTimeout(() => setNotice(''), 3500); return () => clearTimeout(timer); }, [notice]);
  const filteredStudents = useMemo(() => students.filter((student) => {
    const needle = query.trim().toLowerCase();
    const matchesQuery = !needle || [student.id, student.name, student.email, student.course].some((value) => value.toLowerCase().includes(needle));
    return matchesQuery && (statusFilter === 'All statuses' || student.status === statusFilter) && (courseFilter === 'All courses' || student.course === courseFilter);
  }), [students, query, statusFilter, courseFilter]);
  const enrolledCount = students.filter((student) => student.status === 'Enrolled').length;
  const pendingCount = students.filter((student) => student.status === 'Pending').length;
  const courseCount = new Set(students.map((student) => student.course)).size;
  const saveStudent = (data) => {
    if (modal?.type === 'edit') {
      setStudents((current) => current.map((student) => student.id === modal.student.id ? { ...student, ...data } : student));
      setNotice('Student record updated successfully.');
    } else {
      const newStudent = { id: makeId(students), ...data };
      setStudents((current) => [newStudent, ...current]); setNotice('Student added successfully.');
    }
    setModal(null);
  };
  const deleteStudent = () => {
    setStudents((current) => current.filter((student) => student.id !== studentToDelete.id));
    setNotice(`${studentToDelete.name} was deleted.`); setStudentToDelete(null);
  };
  const exportCsv = () => {
    const headers = ['Student ID', 'Full name', 'Age', 'Email', 'Course', 'Status'];
    const escapeCell = (value) => `"${String(value).replaceAll('"', '""')}"`;
    const csv = [headers, ...students.map((student) => [student.id, student.name, student.age, student.email, student.course, student.status])].map((row) => row.map(escapeCell).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' }); const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = 'student-records.csv'; link.click(); URL.revokeObjectURL(url);
  };
  const navItems = [{ label: 'Dashboard', icon: LayoutDashboard }, { label: 'Students', icon: Users }, { label: 'Courses', icon: BookOpen }];
  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><GraduationCap size={24}/></div><div><strong> STUDENT MANAGEMENT SYSTEM</strong><small>STUDENT PORTAL</small></div><button className="mobile-close" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X size={20}/></button></div>
      <div className="nav-label">WORKSPACE</div><nav>{navItems.map(({ label, icon: NavIcon }) => <button key={label} className={`nav-item ${activePage === label ? 'active' : ''}`} onClick={() => { setActivePage(label); setMobileNav(false); }}><NavIcon size={18}/><span>{label}</span>{label === 'Students' && <span className="nav-count">{students.length}</span>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="sidebar-note"><div className="note-icon"><GraduationCap size={19}/></div><strong>Every student matters.</strong><p>One place for every academic journey.</p></div><button className="nav-item settings-item" onClick={() => setNotice('Settings are unavailable.')}><Settings size={18}/><span>Settings</span></button><div className="profile"><div className="avatar">AD</div><div className="profile-copy"><strong>Administrator</strong><small>Academic office</small></div><ChevronDown size={16}/></div></div>
    </aside>
    {mobileNav && <button className="mobile-scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation overlay"/>}
    <main className="main-content">
      <header className="topbar"><button className="mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={21}/></button><div className="breadcrumbs">Workspace <span>/</span> <strong>{activePage}</strong></div><div className="topbar-right"><span className="live-dot"/> <span className="system-label">Student records system</span><div className="top-avatar">AD</div></div></header>
      <div className="page-content">
        <section className="welcome-row"><div><div className="eyebrow">ACADEMIC MANAGEMENT <span>•</span> OVERVIEW</div><h1>{activePage === 'Students' ? 'Student management' : activePage}</h1><p className="page-subtitle">Manage student records, monitor enrollment, and keep everything in order.</p></div><div className="header-actions"><button className="button secondary export-button" onClick={exportCsv}><Download size={16}/> Export CSV</button><button className="button primary" onClick={() => setModal({ type: 'add' })}><Plus size={17}/> Add student</button></div></section>
        {activePage !== 'Students' && <div className="info-banner"><AlertCircle size={18}/><span>Everything you need to manage Use <button onClick={() => setActivePage('Students')}>Students</button> information, all in one place. Keep records organized, track enrollment status, and maintain accurate student details.</span></div>}
        <section className="stats-grid" aria-label="Student statistics">
          <article className="stat-card"><div className="stat-top"><span>Total students</span><div className="stat-icon black"><Users size={19}/></div></div><div className="stat-number">{students.length.toLocaleString()}</div><div className="stat-foot">All student records</div></article>
          <article className="stat-card"><div className="stat-top"><span>Enrolled</span><div className="stat-icon mauve"><CheckCircle2 size={19}/></div></div><div className="stat-number">{enrolledCount}</div><div className="stat-foot"><span className="tiny-dot green"/> Currently active enrollment</div></article>
          <article className="stat-card"><div className="stat-top"><span>Pending</span><div className="stat-icon taupe"><Clock3 size={19}/></div></div><div className="stat-number">{pendingCount}</div><div className="stat-foot">Awaiting confirmation</div></article>
          <article className="stat-card"><div className="stat-top"><span>Courses</span><div className="stat-icon light"><CourseIcon size={19}/></div></div><div className="stat-number">{courseCount}</div><div className="stat-foot">Courses represented</div></article>
        </section>
        <section className="table-panel"><div className="panel-heading"><div><h2>Student directory</h2><p>A complete overview of your student records.</p></div><span className="record-count">{filteredStudents.length} {filteredStudents.length === 1 ? 'record' : 'records'}</span></div>
          <div className="toolbar"><label className="search-box"><Search size={17}/><input aria-label="Search students" placeholder="Search name, ID, email or course..." value={query} onChange={(event) => setQuery(event.target.value)}/>{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={15}/></button>}</label><div className="filters"><SlidersHorizontal size={16} className="filter-icon"/><label className="select-wrap"><span className="sr-only">Filter by status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All statuses</option><option>Enrolled</option><option>Pending</option><option>Inactive</option></select><ChevronDown size={14}/></label><label className="select-wrap course-select"><span className="sr-only">Filter by course</span><select value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)}><option>All courses</option>{courses.map((course) => <option key={course}>{course}</option>)}</select><ChevronDown size={14}/></label></div></div>
          <div className="table-scroll"><table><thead><tr><th>STUDENT</th><th>STUDENT ID</th><th>COURSE OF STUDY</th><th>AGE</th><th>STATUS</th><th><span className="sr-only">Actions</span>ACTIONS</th></tr></thead><tbody>
            {filteredStudents.map((student) => <tr key={student.id}><td><div className="student-cell"><div className="student-avatar">{student.name.split(/\s+/).slice(0,2).map((part) => part[0]).join('').toUpperCase()}</div><div className="student-details"><strong>{student.name}</strong><span>{student.email}</span></div></div></td><td><span className="student-id">{student.id}</span></td><td><span className="course-name">{student.course}</span></td><td>{student.age}</td><td><StatusBadge status={student.status}/></td><td><div className="row-actions"><IconButton title={`Edit ${student.name}`} onClick={() => setModal({ type: 'edit', student })}><Pencil size={16}/></IconButton><IconButton title={`Delete ${student.name}`} danger onClick={() => setStudentToDelete(student)}><Trash2 size={16}/></IconButton></div></td></tr>)}
            {!filteredStudents.length && <tr><td colSpan="6"><div className="empty-state"><div className="empty-icon"><Users size={25}/></div><strong>No students found</strong><p>{students.length ? 'Try changing your search or filters.' : 'Add your first student to start building the directory.'}</p>{!students.length && <button className="button primary" onClick={() => setModal({ type: 'add' })}><Plus size={16}/> Add student</button>}{students.length > 0 && <button className="button secondary" onClick={() => { setQuery(''); setStatusFilter('All statuses'); setCourseFilter('All courses'); }}>Clear filters</button>}</div></td></tr>}
          </tbody></table></div>
          <div className="table-footer"><span>Showing <strong>{filteredStudents.length}</strong> of <strong>{students.length}</strong> student records</span><span className="saved-indicator"><span/> Saved locally on this device</span></div>
        </section>
        <footer className="page-footer"><span>STUDENT MANAGEMENT SYSTEM <span className="footer-separator">•</span> Student Management System</span><span>Built for academic administration</span></footer>
      </div>
    </main>
    {modal && <Modal title={modal.type === 'edit' ? 'Edit student record' : 'Add a new student'} subtitle={modal.type === 'edit' ? `Update the details for ${modal.student.name}.` : 'Enter the student details below to create a record.'} onClose={() => setModal(null)}><StudentForm key={modal.type === 'edit' ? modal.student.id : 'new-student'} student={modal.type === 'edit' ? modal.student : null} onSave={saveStudent} onCancel={() => setModal(null)}/></Modal>}
    {studentToDelete && <Modal title="Delete student record?" subtitle="This action cannot be undone." onClose={() => setStudentToDelete(null)}><div className="delete-content"><div className="delete-symbol"><Trash2 size={22}/></div><p>You are about to permanently delete <strong>{studentToDelete.name}</strong> ({studentToDelete.id}). This student record will be removed from this device.</p></div><div className="modal-actions"><button className="button secondary" onClick={() => setStudentToDelete(null)}>Cancel</button><button className="button delete-button" onClick={deleteStudent}><Trash2 size={16}/> Delete record</button></div></Modal>}
    {notice && <div className="toast" role="status"><CheckCircle2 size={19}/><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss notification"><X size={16}/></button></div>}
  </div>;
}