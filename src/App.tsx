// @ts-nocheck
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  User, Briefcase, GraduationCap, Wrench, LayoutTemplate,
  Download, Plus, Trash2, ChevronLeft, ChevronRight,
  AlignLeft, AlignCenter, AlignJustify, ZoomIn, ZoomOut,
  Star, Eye, Type, Palette, Check, Sparkles, X, Edit3, Image as ImageIcon
} from 'lucide-react';

/* ─── SMART CONTENT ENGINE ────────────────────────────────────── */
const SMART_SUMMARIES = {
  driver: ["Professional driver with {exp} years of experience operating heavy/commercial vehicles safely across urban and highway routes. Holds a valid commercial license with a clean driving record. Known for punctuality, route optimization, and excellent vehicle maintenance practices.", "Experienced driver committed to safe, on-time delivery and passenger satisfaction. Skilled in GPS navigation, traffic management, and vehicle upkeep. {exp} years of accident-free driving in diverse conditions."],
  teacher: ["Dedicated educator with {exp} years of classroom experience teaching {subject} to students aged {age}. Passionate about creating engaging, inclusive learning environments. Skilled in curriculum development, student assessment, and parent communication.", "Enthusiastic teacher with a proven track record of improving student outcomes in {subject}. Experienced in differentiated instruction, technology integration, and fostering critical thinking skills."],
  engineer: ["Results-driven software engineer with {exp}+ years building scalable systems using {skills}. Track record of delivering high-quality code on time. Strong problem-solver with experience in full-stack development, system design, and cross-functional collaboration.", "Full-stack engineer skilled in {skills}. Passionate about clean architecture, performance optimization, and developer experience. {exp} years of experience shipping production-grade applications."],
  doctor: ["Dedicated medical professsional with {exp} years of clinical experience in {specialty}. Committed to evidence-based patient care, accurate diagnosis, and compassionate treatment. Strong background in patient education and multidisciplinary team collaboration.", "Board-eligible physician with {exp} years in {specialty}. Skilled in patient management, diagnostic procedures, and treatment planning. Committed to continuous learning and delivering the highest standard of care."],
  designer: ["Creative designer with {exp} years crafting visually compelling experiences across digital and print. Proficient in {skills}. Blends aesthetic sensibility with user-centered thinking to deliver solutions that are both beautiful and functional.", "UX/UI designer with a portfolio spanning mobile apps, web platforms, and brand identities. {exp} years of experience translating user needs into elegant, conversion-driven designs. Skilled in {skills}."],
  manager: ["Strategic leader with {exp} years managing cross-functional teams and delivering projects on time and budget. Skilled in stakeholder communication, performance management, and process optimization. Known for building high-performing teams.", "Operations manager with {exp} years of experience driving organizational efficiency and team performance. Adept at data-driven decision making, budget management, and change leadership."],
  accountant: ["Detail-oriented accountant with {exp} years managing financial records, tax compliance, and reporting for organizations across industries. Proficient in {skills}. Known for accuracy, efficiency, and integrity.", "Certified accounting professional with expertise in {skills}. {exp} years of experience in financial analysis, audit preparation, and budget planning. Strong analytical mindset with meticulous attention to detail."],
  lawyer: ["Experienced attorney with {exp} years practicing {specialty} law. Skilled in legal research, contract drafting, client counsel, and courtroom advocacy. Known for strategic thinking and delivering favorable outcomes.", "Results-oriented legal professional with expertise in {specialty}. {exp} years advising clients on complex legal matters with a focus on practical, cost-effective solutions."],
  nurse: ["Compassionate registered nurse with {exp} years of clinical experience in {specialty}. Skilled in patient assessment, medication administration, and care coordination. Committed to delivering safe, holistic patient care.", "Dedicated nursing professional with {exp} years working in {specialty} settings. Strong clinical judgment, excellent communication skills, and a patient-first approach to care delivery."],
  default: ["Results-driven professional with {exp}+ years of experience in {field}. Demonstrated ability to deliver exceptional outcomes through strategic thinking and collaborative approach. Passionate about continuous learning and making measurable impact.", "Dedicated {field} professional with a proven track record of {achievement}. Strong communicator, team player, and problem-solver with {exp} years of hands-on experience."]
};

function detectCategory(role = '') {
  const r = role.toLowerCase();
  if (/driv|chauffeur|transport|truck|delivery/.test(r)) return 'driver';
  if (/teach|instruct|educat|professor|tutor|faculty/.test(r)) return 'teacher';
  if (/engineer|developer|programmer|coder|architect|devops|fullstack|frontend|backend/.test(r)) return 'engineer';
  if (/doctor|physician|medical|surgeon|clinic|psychiatr|pediatr/.test(r)) return 'doctor';
  if (/design|ui|ux|graphic|visual|creative/.test(r)) return 'designer';
  if (/manager|director|head|chief|lead|supervisor|vp|president/.test(r)) return 'manager';
  if (/account|financ|audit|bookkeep|cpa|cfa|tax/.test(r)) return 'accountant';
  if (/lawyer|attorney|legal|counsel|advocate|jurist/.test(r)) return 'lawyer';
  if (/nurse|nursing|rn|lpn|caregiver|midwife/.test(r)) return 'nurse';
  return 'default';
}

function generateSmartSummary(data) {
  const cat = detectCategory(data.personal.role);
  const templates = SMART_SUMMARIES[cat] || SMART_SUMMARIES.default;
  const tpl = templates[Math.floor(Math.random() * templates.length)];
  const skillArr = data.skills.split(',').map(s => s.trim()).filter(Boolean);
  const expYears = data.experience.length > 0 ? Math.max(1, data.experience.length * 2) : 3;
  return tpl
    .replace(/{exp}/g, expYears)
    .replace(/{skills}/g, skillArr.slice(0, 4).join(', ') || 'industry-leading tools')
    .replace(/{field}/g, data.personal.role || 'their field')
    .replace(/{specialty}/g, skillArr[0] || 'their specialty')
    .replace(/{subject}/g, skillArr[0] || 'core subjects')
    .replace(/{achievement}/g, 'exceeding targets and mentoring teams')
    .replace(/{age}/g, 'K-12');
}

function generateSmartBullets(role = '', company = '') {
  const cat = detectCategory(role);
  const bullets = {
    engineer: [`• Built and maintained scalable ${role.includes('frontend') ? 'UI components' : 'backend services'} at ${company || 'the company'}, improving performance by 30%.`, `• Collaborated with cross-functional teams to define, design, and ship new features.`, `• Reduced technical debt by refactoring legacy code, cutting bug reports by 25%.`, `• Mentored junior developers and conducted code reviews to maintain quality standards.`],
    manager: [`• Led a team of 8+ professionals at ${company || 'the organization'}, achieving 120% of quarterly targets.`, `• Designed and implemented process improvements that reduced operational costs by 18%.`, `• Managed stakeholder relationships across departments, improving cross-team collaboration.`, `• Oversaw budget planning and resource allocation for projects exceeding ₹50L in value.`],
    teacher: [`• Designed and delivered engaging lesson plans for a class of 35+ students at ${company || 'the institution'}.`, `• Improved student assessment scores by 22% through differentiated instruction techniques.`, `• Implemented technology-based learning tools that increased student participation.`, `• Maintained regular communication with parents, ensuring student progress and support.`],
    driver: [`• Safely transported passengers/goods across designated routes with 100% punctuality record.`, `• Maintained vehicle cleanliness and performed daily safety inspections before each shift.`, `• Navigated efficiently using GPS tools, reducing average route time by 15%.`, `• Completed all deliveries on schedule with zero reported accidents or complaints.`],
    default: [`• Delivered key projects on time and within budget at ${company || 'the organization'}, contributing to team goals.`, `• Identified inefficiencies in existing workflows and implemented solutions that saved 20% time.`, `• Collaborated with cross-functional teams to drive organizational objectives.`, `• Recognized for consistent performance and promoted within the first year.`]
  };
  return (bullets[cat] || bullets.default).join('\n');
}

/* ─── TEMPLATES ──────────────────────────────────────────── */
const TEMPLATES = [
  { id:'t1', name:'Executive', cat:'Professional', layout:'classic', accent:'#1e3a8a', sidebar:'#1e3a8a', bg:'#fff', textDark:'#111827', textMid:'#374151', font:'Georgia, serif', headFont:'Georgia, serif' },
  { id:'t2', name:'Minimalist', cat:'Minimal', layout:'classic', accent:'#374151', sidebar:'#374151', bg:'#fff', textDark:'#111827', textMid:'#6b7280', font:'Helvetica, sans-serif', headFont:'Helvetica, sans-serif' },
  { id:'t19', name:'Modern Blue', cat:'Professional', layout:'sidebar', accent:'#1d4ed8', sidebar:'#1e3a8a', bg:'#fff', textDark:'#1e3a8a', textMid:'#3b82f6', font:'Helvetica, sans-serif', headFont:'Helvetica, sans-serif' },
  { id:'t20', name:'Dark Sidebar', cat:'Bold', layout:'sidebar', accent:'#f59e0b', sidebar:'#0f172a', bg:'#fff', textDark:'#111827', textMid:'#374151', font:'Arial, sans-serif', headFont:'Georgia, serif' },
  { id:'t37', name:'Sky Top', cat:'Clean', layout:'topbar', accent:'#0ea5e9', sidebar:'#0369a1', bg:'#fff', textDark:'#0c4a6e', textMid:'#374151', font:'Arial, sans-serif', headFont:'Georgia, serif' },
  { id:'t49', name:'Blue Timeline', cat:'Creative', layout:'timeline', accent:'#3b82f6', sidebar:'#1e3a8a', bg:'#fff', textDark:'#1e3a8a', textMid:'#374151', font:'Arial, sans-serif', headFont:'Georgia, serif' },
  { id:'t59', name:'Compact Pro', cat:'Professional', layout:'compact', accent:'#2563eb', sidebar:'#1e3a8a', bg:'#fff', textDark:'#0f172a', textMid:'#374151', font:'Arial, sans-serif', headFont:'Arial, sans-serif' },
  { id:'t65', name:'Hero Navy', cat:'Professional', layout:'banner', accent:'#fbbf24', sidebar:'#1e3a8a', bg:'#fff', textDark:'#1e3a8a', textMid:'#374151', font:'Georgia, serif', headFont:'Georgia, serif' },
  { id:'t71', name:'Executive I', cat:'Professional', layout:'executive', accent:'#1e3a8a', sidebar:'#1e3a8a', bg:'#fff', textDark:'#0f172a', textMid:'#374151', font:'Georgia, serif', headFont:'Georgia, serif' },
  { id:'t6', name:'Gold Standard', cat:'Elegant', layout:'classic', accent:'#92400e', sidebar:'#92400e', bg:'#fffbeb', textDark:'#451a03', textMid:'#78350f', font:'Georgia, serif', headFont:'Georgia, serif' },
  { id:'t25', name:'Gold Side', cat:'Elegant', layout:'sidebar', accent:'#fbbf24', sidebar:'#78350f', bg:'#fff', textDark:'#451a03', textMid:'#374151', font:'Georgia, serif', headFont:'Georgia, serif' },
  { id:'t70', name:'Hero Gold', cat:'Elegant', layout:'banner', accent:'#fcd34d', sidebar:'#78350f', bg:'#fff', textDark:'#451a03', textMid:'#374151', font:'Georgia, serif', headFont:'Georgia, serif' },
];

/* ─── RESUME RENDERER (USING RELATIVE UNITS FOR SCALING) ────── */
function ResumeDocument({ data, tpl, docFormat }) {
  const { personal, experience, education, skills, achievements, languages, certifications, hobbies } = data;
  const sk = skills.split(',').map(s => s.trim()).filter(Boolean);
  const cl = [personal.email, personal.phone, personal.location].filter(Boolean);
  const lk = [personal.linkedin, personal.website].filter(Boolean);
  const exp = experience.filter(e => e.company || e.role);
  const edu = education.filter(e => e.school || e.degree);

  const Sec = ({ title, children, c = tpl.accent }) => (
    <div style={{ marginBottom: '1.3em' }}>
      <div style={{ fontSize: '0.7em', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: c, borderBottom: `2px solid ${c}`, paddingBottom: '0.2em', marginBottom: '0.6em', fontFamily: tpl.headFont }}>{title}</div>
      {children}
    </div>
  );

  const Badge = ({ s }) => (
    <span style={{ display: 'inline-block', background: `${tpl.accent}18`, color: tpl.textDark, border: `1px solid ${tpl.accent}44`, padding: '0.2em 0.8em', borderRadius: '99px', fontSize: '0.85em', margin: '0.2em', fontFamily: tpl.font }}>{s}</span>
  );

  const ExpBlock = ({ e }) => (
    <div style={{ marginBottom: '1em' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontWeight: 700, fontSize: '1em', color: tpl.textDark, fontFamily: tpl.headFont }}>{e.role}</div>
        <div style={{ fontSize: '0.77em', color: tpl.textMid, fontFamily: 'monospace' }}>{e.date}</div>
      </div>
      <div style={{ fontSize: '0.92em', color: tpl.accent, fontWeight: 600, marginBottom: '0.3em', fontFamily: tpl.font }}>{e.company}</div>
      <div style={{ fontSize: '0.88em', color: '#555', lineHeight: 1.65, whiteSpace: 'pre-line', fontFamily: tpl.font }}>{e.desc}</div>
    </div>
  );

  const EduBlock = ({ e }) => (
    <div style={{ marginBottom: '0.75em' }}>
      <div style={{ fontWeight: 700, fontSize: '1em', color: tpl.textDark, fontFamily: tpl.headFont }}>{e.degree}{e.field ? ` in ${e.field}` : ''}</div>
      <div style={{ fontSize: '0.92em', color: tpl.accent, fontFamily: tpl.font }}>{e.school}{e.date ? ` · ${e.date}` : ''}{e.grade ? ` · ${e.grade}` : ''}</div>
    </div>
  );

  const extras = <>
    {certifications && <Sec title="Certifications"><div style={{ fontSize: '0.92em', color: '#444', fontFamily: tpl.font, whiteSpace: 'pre-line' }}>{certifications}</div></Sec>}
    {languages && <Sec title="Languages"><div style={{ fontSize: '0.92em', color: '#444', fontFamily: tpl.font }}>{languages}</div></Sec>}
    {achievements && <Sec title="Achievements"><div style={{ fontSize: '0.92em', color: '#444', fontFamily: tpl.font, whiteSpace: 'pre-line' }}>{achievements}</div></Sec>}
    {hobbies && <Sec title="Interests"><div style={{ fontSize: '0.92em', color: '#444', fontFamily: tpl.font }}>{hobbies}</div></Sec>}
  </>;

  const photoEl = personal.photo ? <img src={personal.photo} alt="" style={{ width: '6.5em', height: '6.5em', objectFit: 'cover', borderRadius: '50%', border: `0.2em solid ${tpl.accent}`, flexShrink: 0 }} /> : null;
  const sidePhotoEl = personal.photo ? <img src={personal.photo} alt="" style={{ width: '6em', height: '6em', objectFit: 'cover', borderRadius: '50%', border: `0.2em solid ${tpl.accent}55`, display: 'block', margin: '0 auto 1em' }} /> : null;

  const wrapperStyle = {
    fontFamily: tpl.font,
    background: tpl.bg,
    minHeight: '100%',
    textAlign: docFormat.align,
    fontSize: `${docFormat.fontSize}px`, // Root font size controls scaling
  };

  // ── CLASSIC
  if (tpl.layout === 'classic') return (
    <div style={{ ...wrapperStyle, padding: '3.4em 4em' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: personal.photo ? '1.7em' : 0, paddingBottom: '1.4em', borderBottom: `0.2em solid ${tpl.accent}`, marginBottom: '1.5em' }}>
        {photoEl}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '2.15em', fontWeight: 700, color: tpl.textDark, fontFamily: tpl.headFont, lineHeight: 1.1, marginBottom: '0.15em' }}>{personal.name || 'Your Name'}</div>
          <div style={{ fontSize: '1.07em', color: tpl.accent, fontWeight: 600, marginBottom: '0.4em' }}>{personal.role}</div>
          <div style={{ fontSize: '0.85em', color: '#666' }}>{cl.join('  ·  ')}</div>
          {lk.length > 0 && <div style={{ fontSize: '0.85em', color: '#888', marginTop: '0.15em' }}>{lk.join('  ·  ')}</div>}
        </div>
      </div>
      {personal.summary && <Sec title="Professional Summary"><p style={{ fontSize: '0.96em', color: '#444', lineHeight: 1.75, margin: 0, fontFamily: tpl.font }}>{personal.summary}</p></Sec>}
      {exp.length > 0 && <Sec title="Work Experience">{exp.map((e, i) => <ExpBlock key={i} e={e} />)}</Sec>}
      {edu.length > 0 && <Sec title="Education">{edu.map((e, i) => <EduBlock key={i} e={e} />)}</Sec>}
      {sk.length > 0 && <Sec title="Skills"><div>{sk.map((s, i) => <Badge key={i} s={s} />)}</div></Sec>}
      {extras}
    </div>
  );

  // ── SIDEBAR
  if (tpl.layout === 'sidebar') return (
    <div style={{ ...wrapperStyle, display: 'flex' }}>
      <div style={{ width: '19em', background: tpl.sidebar, color: '#fff', padding: '2.15em 1.4em', flexShrink: 0 }}>
        {sidePhotoEl}
        <div style={{ textAlign: 'center', marginBottom: '1.2em' }}>
          <div style={{ fontSize: '1.38em', fontWeight: 700, color: '#fff', fontFamily: tpl.headFont, lineHeight: 1.2 }}>{personal.name || 'Your Name'}</div>
          <div style={{ fontSize: '0.85em', color: tpl.accent, marginTop: '0.3em', fontWeight: 600 }}>{personal.role}</div>
        </div>
        <div style={{ fontSize: '0.85em', lineHeight: 2, color: 'rgba(255,255,255,.8)', borderTop: `1px solid ${tpl.accent}44`, paddingTop: '0.9em', marginBottom: '1.2em' }}>
          {personal.email && <div>✉ {personal.email}</div>}
          {personal.phone && <div>✆ {personal.phone}</div>}
          {personal.location && <div>⊙ {personal.location}</div>}
          {personal.linkedin && <div>⊕ {personal.linkedin}</div>}
        </div>
        {sk.length > 0 && <div style={{ marginBottom: '1.2em' }}><div style={{ fontSize: '0.7em', letterSpacing: '0.15em', textTransform: 'uppercase', color: tpl.accent, borderBottom: `1px solid ${tpl.accent}55`, paddingBottom: '0.2em', marginBottom: '0.6em', fontWeight: 700 }}>Skills</div><div style={{ fontSize: '0.85em', lineHeight: 2, color: 'rgba(255,255,255,.8)' }}>{sk.join('\n').split('\n').map((s, i) => <div key={i}>{s}</div>)}</div></div>}
      </div>
      <div style={{ flex: 1, padding: '2.3em 2em' }}>
        {personal.summary && <><div style={{ fontSize: '0.7em', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: '#555', borderBottom: '2px solid #ddd', paddingBottom: '0.2em', marginBottom: '0.6em' }}>Profile</div><p style={{ fontSize: '0.96em', color: '#444', lineHeight: 1.75, marginBottom: '1.4em' }}>{personal.summary}</p></>}
        {exp.length > 0 && <><div style={{ fontSize: '0.7em', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: '#555', borderBottom: '2px solid #ddd', paddingBottom: '0.2em', marginBottom: '0.6em' }}>Experience</div>{exp.map((e, i) => <ExpBlock key={i} e={e} />)}</>}
        {edu.length > 0 && <><div style={{ fontSize: '0.7em', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: '#555', borderBottom: '2px solid #ddd', paddingBottom: '0.2em', marginBottom: '0.6em', marginTop: '1.2em' }}>Education</div>{edu.map((e, i) => <EduBlock key={i} e={e} />)}</>}
        {achievements && <><div style={{ fontSize: '0.7em', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: '#555', borderBottom: '2px solid #ddd', paddingBottom: '0.2em', marginBottom: '0.6em', marginTop: '1.2em' }}>Achievements</div><div style={{ fontSize: '0.92em', color: '#444', whiteSpace: 'pre-line' }}>{achievements}</div></>}
      </div>
    </div>
  );

  // ── TOPBAR
  if (tpl.layout === 'topbar') return (
    <div style={{ ...wrapperStyle }}>
      <div style={{ background: tpl.sidebar, padding: '2em 3.4em', display: 'flex', alignItems: 'center', gap: personal.photo ? '1.7em' : 0 }}>
        {photoEl}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '2em', fontWeight: 700, color: '#fff', fontFamily: tpl.headFont, lineHeight: 1.1 }}>{personal.name || 'Your Name'}</div>
          <div style={{ fontSize: '1em', color: tpl.accent, fontWeight: 600, marginTop: '0.3em' }}>{personal.role}</div>
          <div style={{ fontSize: '0.85em', color: 'rgba(255,255,255,.65)', marginTop: '0.45em' }}>{[...cl, ...lk].join('  ·  ')}</div>
        </div>
      </div>
      <div style={{ padding: '2em 3.4em' }}>
        {personal.summary && <Sec title="Summary"><p style={{ fontSize: '0.96em', color: '#444', lineHeight: 1.75, margin: 0 }}>{personal.summary}</p></Sec>}
        {exp.length > 0 && <Sec title="Work Experience">{exp.map((e, i) => <ExpBlock key={i} e={e} />)}</Sec>}
        {edu.length > 0 && <Sec title="Education">{edu.map((e, i) => <EduBlock key={i} e={e} />)}</Sec>}
        {sk.length > 0 && <Sec title="Skills"><div>{sk.map((s, i) => <Badge key={i} s={s} />)}</div></Sec>}
        {extras}
      </div>
    </div>
  );

  // Fallback classic
  return (
    <div style={{ ...wrapperStyle, padding: '3.4em 4em' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: personal.photo ? '1.7em' : 0, paddingBottom: '1.4em', borderBottom: `0.2em solid ${tpl.accent}`, marginBottom: '1.5em' }}>
        {photoEl}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '2.15em', fontWeight: 700, color: tpl.textDark, fontFamily: tpl.headFont, lineHeight: 1.1, marginBottom: '0.15em' }}>{personal.name || 'Your Name'}</div>
          <div style={{ fontSize: '1.07em', color: tpl.accent, fontWeight: 600, marginBottom: '0.4em' }}>{personal.role}</div>
          <div style={{ fontSize: '0.85em', color: '#666' }}>{cl.join('  ·  ')}</div>
          {lk.length > 0 && <div style={{ fontSize: '0.85em', color: '#888', marginTop: '0.15em' }}>{lk.join('  ·  ')}</div>}
        </div>
      </div>
      {personal.summary && <Sec title="Professional Summary"><p style={{ fontSize: '0.96em', color: '#444', lineHeight: 1.75, margin: 0, fontFamily: tpl.font }}>{personal.summary}</p></Sec>}
      {exp.length > 0 && <Sec title="Work Experience">{exp.map((e, i) => <ExpBlock key={i} e={e} />)}</Sec>}
      {edu.length > 0 && <Sec title="Education">{edu.map((e, i) => <EduBlock key={i} e={e} />)}</Sec>}
      {sk.length > 0 && <Sec title="Skills"><div>{sk.map((s, i) => <Badge key={i} s={s} />)}</div></Sec>}
      {extras}
    </div>
  );
}

/* ─── MAIN APP WITH GITHUB + SPACE + WIZARD ────────────────────────────────────────────────── */
export default function App() {
  const [step, setStep] = useState(0); 
  const [tpl, setTpl] = useState(TEMPLATES[0]);
  const [zoom, setZoom] = useState(1);
  const [docFormat, setDocFormat] = useState({ fontSize: 13, align: 'left' });
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const previewRef = useRef(null);

  // Photo Crop States
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoCropMode, setPhotoCropMode] = useState(false);
  const [photoScale, setPhotoScale] = useState(1);
  const [photoDragging, setPhotoDragging] = useState(false);
  const offsetRef = useRef({ x: 0, y: 0 });
  const dragStartRef = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });
  const [offsetDisplay, setOffsetDisplay] = useState({ x: 0, y: 0 });
  
  // Refs
  const fileRef = useRef(null);
  const cropContainerRef = useRef(null);

  const [data, setData] = useState({
    personal: { name: '', role: '', email: '', phone: '', location: '', linkedin: '', website: '', summary: '', photo: null },
    experience: [{ id: 1, company: '', role: '', date: '', desc: '' }],
    education: [{ id: 1, school: '', degree: '', field: '', date: '', grade: '' }],
    skills: '', achievements: '', languages: '', certifications: '', hobbies: '',
  });

  // Calculate mobile zoom for A4
  useEffect(() => {
    const handleResize = () => {
      const containerWidth = window.innerWidth;
      // Prevent horizontal scroll by padding 32px on preview
      setZoom(Math.min(1, (containerWidth - 32) / 794));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Galaxy Stars Data
  const goldStars = useMemo(() => Array.from({length:80}, (_,i) => ({
    id:i, x:Math.random()*100, y:Math.random()*100,
    size: Math.random()<.12 ? 2.5 : Math.random()<.35 ? 1.8 : 1,
    delay: Math.random()*7, dur: 2.5+Math.random()*4,
    opacity: Math.random()<.08 ? 1 : 0.35+Math.random()*0.5,
  })), []);
  const whiteStars = useMemo(() => Array.from({length:55}, (_,i) => ({
    id:i, x:Math.random()*100, y:Math.random()*100,
    size: Math.random()<.08 ? 2 : 1,
    delay: Math.random()*9, dur: 3+Math.random()*5,
    opacity: 0.25+Math.random()*0.55,
  })), []);

  useEffect(() => {
    if (document.getElementById('sq-theme')) return;
    const l = document.createElement('style');
    l.id = 'sq-theme';
    l.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Josefin+Sans:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
      
      :root {
        --gh-bg: #0d1117;
        --gh-surface: #161b22;
        --gh-border: #30363d;
        --gh-text: #c9d1d9;
        --gh-muted: #8b949e;
        --sq-gold: #C8A951;
        --sq-gold-hover: #E6C97A;
      }
      
      * { box-sizing: border-box; }
      body { margin: 0; background-color: var(--gh-bg); color: var(--gh-text); font-family: 'Josefin Sans', sans-serif; overflow-x: hidden; }

      /* GitHub Animated Grid + SCALVIQ Space Glow */
      .bg-grid {
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        z-index: -2; background-size: 50px 50px;
        background-image: 
          linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
        mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%);
        -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%);
      }

      .glow-orb {
        position: fixed; top: -15vh; left: 50%;
        width: 80vw; max-width: 800px; height: 500px;
        background: radial-gradient(ellipse at top, rgba(200, 169, 81, 0.15) 0%, transparent 70%);
        transform: translateX(-50%); z-index: -2; pointer-events: none;
      }
      .glow-line {
        position: fixed; top: 0; left: 50%;
        width: 1px; height: 100vh;
        background: linear-gradient(to bottom, transparent, var(--sq-gold), transparent);
        opacity: 0.3; animation: dropGlow 4s linear infinite; z-index: -2;
      }

      /* Galaxy Animations */
      @keyframes twinkle { 0%,100% { opacity:.15; transform:scale(1); } 50% { opacity:1; transform:scale(1.5); } }
      @keyframes nebulaPulse { 0%,100% { opacity:.4; transform:translate(-50%,-50%) scale(1); } 50% { opacity:.7; transform:translate(-50%,-50%) scale(1.06); } }
      @keyframes dropGlow { 0% { transform: translateY(-100%); opacity: 0; } 50% { opacity: 0.5; } 100% { transform: translateY(100%); opacity: 0; } }

      /* Form Elements */
      .card {
        background: var(--gh-surface); border: 1px solid var(--gh-border);
        border-radius: 12px; padding: 24px; margin-bottom: 20px;
        position: relative; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      }
      .input-field {
        width: 100%; background: var(--gh-bg); border: 1px solid var(--gh-border);
        color: var(--gh-text); padding: 14px 16px; border-radius: 8px;
        font-family: 'Josefin Sans', sans-serif; font-size: 16px; outline: none;
        transition: all 0.2s ease; margin-top: 8px;
      }
      .input-field:focus { border-color: var(--sq-gold); box-shadow: 0 0 0 3px rgba(200, 169, 81, 0.15); }
      .label { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: var(--gh-muted); display: block; margin-top: 20px; }

      .grid-2 { display: grid; grid-template-columns: 1fr; gap: 0 16px; }
      @media (min-width: 600px) { .grid-2 { grid-template-columns: 1fr 1fr; } }

      /* Buttons */
      .btn-primary {
        background: var(--sq-gold); color: #010409; border: none; padding: 14px 28px;
        border-radius: 8px; font-family: 'IBM Plex Mono', monospace; font-weight: 600;
        font-size: 13px; letter-spacing: 0.5px; text-transform: uppercase; cursor: pointer;
        display: flex; align-items: center; justify-content: center; gap: 10px;
        transition: all 0.2s; box-shadow: 0 0 20px rgba(200, 169, 81, 0.2);
      }
      .btn-primary:hover { background: var(--sq-gold-hover); box-shadow: 0 0 25px rgba(200, 169, 81, 0.4); transform: translateY(-1px); }

      .btn-outline {
        background: var(--gh-surface); color: var(--gh-text); border: 1px solid var(--gh-border);
        padding: 14px 20px; border-radius: 8px; font-family: 'IBM Plex Mono', monospace;
        font-size: 13px; text-transform: uppercase; font-weight: 500; cursor: pointer;
        display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s;
      }
      .btn-outline:hover { border-color: var(--gh-muted); background: rgba(255,255,255,0.03); }

      .btn-ghost {
        background: transparent; color: var(--sq-gold); border: none; font-family: 'IBM Plex Mono', monospace;
        font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; cursor: pointer;
        display: flex; align-items: center; gap: 6px; padding: 8px; border-radius: 6px; transition: all 0.2s;
      }
      .btn-ghost:hover { background: rgba(200, 169, 81, 0.1); }

      /* Progress Bar */
      .progress-container { width: 100%; height: 3px; background: var(--gh-border); position: absolute; bottom: 0; left: 0; }
      .progress-fill { height: 100%; background: var(--sq-gold); transition: width 0.4s ease; box-shadow: 0 0 10px var(--sq-gold); }
      .gradient-text { background: linear-gradient(to right, #F2F2F6, #C8A951); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      .fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

      @media print {
        body * { visibility: hidden; }
        .a4-print, .a4-print * { visibility: visible; }
        .a4-print { position: absolute; left: 0; top: 0; width: 210mm; height: 297mm; transform: none !important; box-shadow: none !important; margin: 0; }
        @page { size: A4; margin: 0; }
      }
    `;
    document.head.appendChild(l);
  }, []);

  const upP = (k, v) => setData(d => ({ ...d, personal: { ...d.personal, [k]: v } }));
  const updExp = (id, k, v) => setData(d => ({ ...d, experience: d.experience.map(e => e.id === id ? { ...e, [k]: v } : e) }));
  const updEdu = (id, k, v) => setData(d => ({ ...d, education: d.education.map(e => e.id === id ? { ...e, [k]: v } : e) }));

  // Photo Crop Logic
  const handlePhoto = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setPhotoPreview(ev.target.result);
      offsetRef.current = { x: 0, y: 0 };
      setOffsetDisplay({ x: 0, y: 0 });
      setPhotoScale(1);
      setPhotoCropMode(true);
    };
    reader.readAsDataURL(f);
  };
  const applyCrop = () => {
    const SIZE = 400; const canvas = document.createElement('canvas'); canvas.width = SIZE; canvas.height = SIZE;
    const ctx = canvas.getContext('2d'); const img = new Image();
    img.onload = () => {
      ctx.beginPath(); ctx.arc(SIZE/2, SIZE/2, SIZE/2, 0, Math.PI*2); ctx.clip();
      const DISPLAY = 240;
      const renderedW = img.naturalWidth * photoScale * (DISPLAY / Math.max(img.naturalWidth, img.naturalHeight));
      const renderedH = img.naturalHeight * photoScale * (DISPLAY / Math.max(img.naturalWidth, img.naturalHeight));
      const imgX_display = DISPLAY/2 - renderedW/2 + offsetRef.current.x;
      const imgY_display = DISPLAY/2 - renderedH/2 + offsetRef.current.y;
      const scale = SIZE / DISPLAY;
      ctx.drawImage(img, imgX_display * scale, imgY_display * scale, renderedW * scale, renderedH * scale);
      setData(d => ({ ...d, personal: { ...d.personal, photo: canvas.toDataURL('image/jpeg', 0.92) } }));
      setPhotoCropMode(false);
    };
    img.src = photoPreview;
  };
  const onCropMouseDown = e => { e.preventDefault(); dragStartRef.current = { mx: e.clientX, my: e.clientY, ox: offsetRef.current.x, oy: offsetRef.current.y }; setPhotoDragging(true); };
  const onCropMouseMove = e => {
    if (!dragStartRef.current.mx && dragStartRef.current.mx !== 0) return;
    if (e.buttons === 0) { setPhotoDragging(false); return; }
    const nx = dragStartRef.current.ox + (e.clientX - dragStartRef.current.mx);
    const ny = dragStartRef.current.oy + (e.clientY - dragStartRef.current.my);
    offsetRef.current = { x: nx, y: ny }; setOffsetDisplay({ x: nx, y: ny });
  };
  const onCropTouchStart = e => { const t = e.touches[0]; dragStartRef.current = { mx: t.clientX, my: t.clientY, ox: offsetRef.current.x, oy: offsetRef.current.y }; };
  const onCropTouchMove = e => {
    e.preventDefault(); const t = e.touches[0];
    const nx = dragStartRef.current.ox + (t.clientX - dragStartRef.current.mx);
    const ny = dragStartRef.current.oy + (t.clientY - dragStartRef.current.my);
    offsetRef.current = { x: nx, y: ny }; setOffsetDisplay({ x: nx, y: ny });
  };

  const exportPDF = () => {
    const content = previewRef.current?.innerHTML;
    if (!content) return;
    const w = window.open('', '_blank');
    w.document.write(`<!DOCTYPE html><html><head><title>Resume — SCALVIQ</title>
<style>*{box-sizing:border-box;}body{margin:0;}@media print{@page{margin:0;size:A4;}body{margin:0;}}</style>
</head><body>${content}<script>window.onload=()=>setTimeout(()=>window.print(),500);</script></body></html>`);
    w.document.close();
  };

  const TopNav = () => (
    <div style={{ padding: '20px 24px', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(13, 17, 23, 0.8)', backdropFilter: 'blur(12px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: 6 }}>
          SCALVI<span style={{ color: 'var(--sq-gold)' }}>Q</span>
        </div>
        {/* Step 6 or preview overlay shown */}
      </div>
      {!showPreview && step > 0 && step < 6 && (
        <div className="progress-container">
          <div className="progress-fill" style={{ width: `${(step / 5) * 100}%` }}></div>
        </div>
      )}
    </div>
  );

  const BottomNav = ({ onNext, onBack, nextText = "Continue" }) => (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px 20px', paddingBottom: 'calc(16px + env(safe-area-inset-bottom))', background: 'rgba(22, 27, 34, 0.95)', borderTop: '1px solid var(--gh-border)', backdropFilter: 'blur(10px)', display: 'flex', gap: 12, zIndex: 40 }}>
      {onBack && (
        <button className="btn-outline" style={{ flex: 1 }} onClick={onBack}>
          <ChevronLeft size={16}/> Back
        </button>
      )}
      <button className="btn-primary" style={{ flex: onBack ? 2 : 1 }} onClick={onNext}>
        {nextText} {nextText === 'View Resume' ? <Eye size={18}/> : <ChevronRight size={18}/>}
      </button>
    </div>
  );

  return (
    <>
      <div className="bg-grid"></div>
      <div className="glow-orb"></div>
      <div className="glow-line"></div>
      
      {/* Galaxy Stars Rendered Behind Everything */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -3, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position:'absolute', top:'45%', left:'58%', width:800, height:600, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(200,169,81,.055) 0%,transparent 60%)', transform:'translate(-50%,-50%)', animation:'nebulaPulse 9s ease-in-out infinite' }} />
        {goldStars.map(st => (
          <div key={st.id} style={{ position:'absolute', left:`${st.x}%`, top:`${st.y}%`, width:st.size, height:st.size, borderRadius:'50%', background:`rgba(200,169,81,${st.opacity})`, animation:`twinkle ${st.dur}s ease-in-out infinite ${st.delay}s`, boxShadow: st.size>2 ? `0 0 5px rgba(200,169,81,.5)` : 'none' }} />
        ))}
        {whiteStars.map(st => (
          <div key={`w${st.id}`} style={{ position:'absolute', left:`${st.x}%`, top:`${st.y}%`, width:st.size, height:st.size, borderRadius:'50%', background:`rgba(255,255,255,${st.opacity})`, animation:`twinkle ${st.dur}s ease-in-out infinite ${st.delay}s` }} />
        ))}
      </div>
      
      <TopNav />

      {/* Main Wizard Content - hidden if showing preview */}
      <div style={{ display: showPreview ? 'none' : 'block', padding: '24px 20px', maxWidth: 650, margin: '0 auto', paddingBottom: 120 }}>
        
        {step === 0 && (
          <div className="fade-in" style={{ textAlign: 'center', marginTop: '15vh' }}>
            <div style={{ display: 'inline-flex', padding: 24, borderRadius: '50%', background: 'linear-gradient(180deg, rgba(200,169,81,0.1) 0%, transparent 100%)', border: '1px solid rgba(200,169,81,0.2)', marginBottom: 32 }}>
              <LayoutTemplate size={56} color="var(--sq-gold)" />
            </div>
            <h1 className="gradient-text" style={{ fontSize: 36, marginBottom: 16, fontWeight: 700, letterSpacing: '-0.5px' }}>Build your perfect resume.</h1>
            <p style={{ color: 'var(--gh-muted)', fontSize: 18, lineHeight: 1.6, marginBottom: 48, maxWidth: '80%', margin: '0 auto 48px' }}>
              Answer a few simple questions. Let our intelligent engine structure, format, and design your professional career.
            </p>
            <button className="btn-primary" style={{ maxWidth: 320, margin: '0 auto' }} onClick={() => setStep(1)}>
              Start Building Now <ChevronRight size={18}/>
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="fade-in">
            <h2 style={{ fontSize: 26, marginBottom: 8, fontWeight: 600 }}>Personal Details</h2>
            <p style={{ color: 'var(--gh-muted)', fontSize: 16, marginBottom: 32 }}>Let recruiters know who you are and how to reach you.</p>
            
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div onClick={() => fileRef.current?.click()} style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--gh-bg)', border: '1px dashed var(--sq-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', flexShrink: 0 }}>
                {data.personal.photo ? <img src={data.personal.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Profile" /> : <ImageIcon size={24} color="var(--sq-gold)" />}
              </div>
              <div style={{ flex: 1 }}>
                <input type="file" ref={fileRef} accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
                <button className="btn-outline" style={{ padding: '8px 16px', marginBottom: 8 }} onClick={() => fileRef.current?.click()}>{data.personal.photo ? 'Change Photo' : 'Upload Photo'}</button>
                <div style={{ fontSize: 11, color: 'var(--gh-muted)', fontFamily: "'IBM Plex Mono', monospace" }}>Optional. JPG or PNG.</div>
              </div>
            </div>

            <div className="card">
              <label className="label" style={{marginTop: 0}}>Full Name</label>
              <input className="input-field" placeholder="E.g. Priya Sharma" value={data.personal.name} onChange={e => upP('name', e.target.value)} />
              <label className="label">Job Title</label>
              <input className="input-field" placeholder="E.g. Senior Software Engineer" value={data.personal.role} onChange={e => upP('role', e.target.value)} />
              <div className="grid-2">
                <div><label className="label">Email Address</label><input className="input-field" placeholder="you@email.com" value={data.personal.email} onChange={e => upP('email', e.target.value)} /></div>
                <div><label className="label">Phone Number</label><input className="input-field" placeholder="+91 98765..." value={data.personal.phone} onChange={e => upP('phone', e.target.value)} /></div>
              </div>
              <label className="label">Location</label>
              <input className="input-field" placeholder="City, Country" value={data.personal.location} onChange={e => upP('location', e.target.value)} />
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="label" style={{marginTop: 0}}>Professional Summary</label>
                <button className="btn-ghost" onClick={() => upP('summary', generateSmartSummary(data))}><Sparkles size={14}/> Smart Write</button>
              </div>
              <textarea className="input-field" rows={5} placeholder="Briefly describe your professional background..." value={data.personal.summary} onChange={e => upP('summary', e.target.value)} />
            </div>
            <BottomNav onBack={() => setStep(0)} onNext={() => setStep(2)} />
          </div>
        )}

        {step === 2 && (
          <div className="fade-in">
            <h2 style={{ fontSize: 26, marginBottom: 8, fontWeight: 600 }}>Work Experience</h2>
            <p style={{ color: 'var(--gh-muted)', fontSize: 16, marginBottom: 32 }}>Add your most relevant professional experience.</p>
            {data.experience.map((exp, index) => (
              <div className="card" key={exp.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--sq-gold)' }}>Role {String(index + 1).padStart(2, '0')}</span>
                  {data.experience.length > 1 && <button className="btn-ghost" style={{ color: '#f85149', padding: 0 }} onClick={() => setData(d => ({...d, experience: d.experience.filter(e => e.id !== exp.id)}))}><Trash2 size={16}/></button>}
                </div>
                <label className="label" style={{marginTop: 0}}>Job Title</label>
                <input className="input-field" placeholder="E.g. Senior Developer" value={exp.role} onChange={e => updExp(exp.id, 'role', e.target.value)} />
                <div className="grid-2">
                  <div><label className="label">Company Name</label><input className="input-field" placeholder="E.g. TechCorp" value={exp.company} onChange={e => updExp(exp.id, 'company', e.target.value)} /></div>
                  <div><label className="label">Date Range</label><input className="input-field" placeholder="Jan 2021 - Present" value={exp.date} onChange={e => updExp(exp.id, 'date', e.target.value)} /></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                  <label className="label" style={{marginTop: 0}}>Description</label>
                  <button className="btn-ghost" onClick={() => updExp(exp.id, 'desc', generateSmartBullets(exp.role, exp.company))}><Sparkles size={14}/> Smart Bullets</button>
                </div>
                <textarea className="input-field" rows={5} placeholder="• Led a team of...&#10;• Increased revenue by..." value={exp.desc} onChange={e => updExp(exp.id, 'desc', e.target.value)} />
              </div>
            ))}
            <button className="btn-outline" style={{ width: '100%', padding: '20px', borderStyle: 'dashed', borderColor: 'var(--gh-border)' }} onClick={() => setData(d => ({ ...d, experience: [...d.experience, { id: Date.now(), company: '', role: '', date: '', desc: '' }] }))}>
              <Plus size={18}/> Add Another Experience
            </button>
            <BottomNav onBack={() => setStep(1)} onNext={() => setStep(3)} />
          </div>
        )}

        {step === 3 && (
          <div className="fade-in">
            <h2 style={{ fontSize: 26, marginBottom: 8, fontWeight: 600 }}>Education</h2>
            <p style={{ color: 'var(--gh-muted)', fontSize: 16, marginBottom: 32 }}>Where did you study?</p>
            {data.education.map((edu, index) => (
              <div className="card" key={edu.id}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--sq-gold)' }}>Degree {String(index + 1).padStart(2, '0')}</span>
                  {data.education.length > 1 && <button className="btn-ghost" style={{ color: '#f85149', padding: 0 }} onClick={() => setData(d => ({...d, education: d.education.filter(e => e.id !== edu.id)}))}><Trash2 size={16}/></button>}
                </div>
                <label className="label" style={{marginTop: 0}}>Institution / School Name</label>
                <input className="input-field" placeholder="E.g. IIT Delhi" value={edu.school} onChange={e => updEdu(edu.id, 'school', e.target.value)} />
                <div className="grid-2">
                  <div><label className="label">Degree</label><input className="input-field" placeholder="E.g. B.Tech" value={edu.degree} onChange={e => updEdu(edu.id, 'degree', e.target.value)} /></div>
                  <div><label className="label">Field of Study</label><input className="input-field" placeholder="E.g. Computer Science" value={edu.field} onChange={e => updEdu(edu.id, 'field', e.target.value)} /></div>
                </div>
                <div className="grid-2">
                  <div><label className="label">Graduation Year</label><input className="input-field" placeholder="E.g. 2023" value={edu.date} onChange={e => updEdu(edu.id, 'date', e.target.value)} /></div>
                  <div><label className="label">Grade / CGPA</label><input className="input-field" placeholder="E.g. 9.2 CGPA" value={edu.grade} onChange={e => updEdu(edu.id, 'grade', e.target.value)} /></div>
                </div>
              </div>
            ))}
             <button className="btn-outline" style={{ width: '100%', padding: '20px', borderStyle: 'dashed', borderColor: 'var(--gh-border)' }} onClick={() => setData(d => ({ ...d, education: [...d.education, { id: Date.now(), school: '', degree: '', field: '', date: '', grade: '' }] }))}>
              <Plus size={18}/> Add Another Degree
            </button>
            <BottomNav onBack={() => setStep(2)} onNext={() => setStep(4)} />
          </div>
        )}

        {step === 4 && (
          <div className="fade-in">
            <h2 style={{ fontSize: 26, marginBottom: 8, fontWeight: 600 }}>Skills</h2>
            <p style={{ color: 'var(--gh-muted)', fontSize: 16, marginBottom: 32 }}>What tools and technologies do you know?</p>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="label" style={{marginTop: 0}}>Key Skills</label>
                <button className="btn-ghost" onClick={() => {
                  const suggestions = { engineer: 'JavaScript, React, Node.js, Python, SQL, REST APIs, Git, Docker, AWS, Agile', teacher: 'Curriculum Design, Classroom Management, Assessment, Communication', driver: 'Commercial License, GPS Navigation, Route Planning, Safety Compliance', manager: 'Team Leadership, Project Management, Budgeting, Agile, PMP', designer: 'Figma, Adobe XD, Illustrator, Photoshop, UX Research', default: 'Communication, Team Collaboration, Problem Solving, Project Management' };
                  setData(d => ({ ...d, skills: suggestions[detectCategory(data.personal.role)] || suggestions.default }));
                }}><Sparkles size={14}/> Smart Suggest</button>
              </div>
              <textarea className="input-field" rows={6} placeholder="Comma separated. E.g. React, Node.js, Agile, Python" value={data.skills} onChange={e => setData(d => ({...d, skills: e.target.value}))} />
              <p style={{ fontSize: 13, color: 'var(--gh-muted)', marginTop: 12 }}>Every skill separated by a comma will appear as a badge.</p>
            </div>
            <BottomNav onBack={() => setStep(3)} onNext={() => setStep(5)} />
          </div>
        )}

        {step === 5 && (
          <div className="fade-in">
            <h2 style={{ fontSize: 26, marginBottom: 8, fontWeight: 600 }}>Additional Info</h2>
            <p style={{ color: 'var(--gh-muted)', fontSize: 16, marginBottom: 32 }}>Stand out with certifications, languages, or awards.</p>
            <div className="card">
              <label className="label" style={{marginTop: 0}}>Languages</label>
              <input className="input-field" placeholder="English (Fluent), Hindi (Native)" value={data.languages} onChange={e => setData(d => ({...d, languages: e.target.value}))} />
              <label className="label">Certifications</label>
              <textarea className="input-field" rows={3} placeholder="AWS Certified Developer, PMP..." value={data.certifications} onChange={e => setData(d => ({...d, certifications: e.target.value}))} />
              <label className="label">Achievements & Awards</label>
              <textarea className="input-field" rows={3} placeholder="Hackathon Winner 2023..." value={data.achievements} onChange={e => setData(d => ({...d, achievements: e.target.value}))} />
            </div>
            <BottomNav onBack={() => setStep(4)} onNext={() => setStep(6)} nextText="View Resume" />
          </div>
        )}

      </div>

      {/* PERSISTENT FLOATING PREVIEW BUTTON (Visible Steps 1 to 5) */}
      {!showPreview && step > 0 && step < 6 && (
        <button
          onClick={() => setShowPreview(true)}
          style={{
            position: 'fixed', bottom: 90, right: 20, zIndex: 150, background: 'var(--sq-gold)', color: '#010409',
            border: 'none', borderRadius: 30, padding: '12px 20px', fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 700, fontSize: 11, textTransform: 'uppercase', boxShadow: '0 8px 24px rgba(200,169,81,0.4)',
            display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer'
          }}
        >
          <Eye size={16}/> Preview
        </button>
      )}

      {/* FULL SCREEN PREVIEW OVERLAY (Active on Step 6 OR when showPreview is true) */}
      {(step === 6 || showPreview) && (
        <div className="fade-in" style={{ position: 'fixed', top: 60, left: 0, right: 0, bottom: 0, background: 'var(--gh-bg)', zIndex: 60, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* MS Word style Formatting Toolbar */}
          <div style={{ position: 'sticky', top: 0, width: '100%', background: 'rgba(22, 27, 34, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--gh-border)', padding: '12px 20px', display: 'flex', justifyContent: 'center', gap: 16, zIndex: 70 }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--gh-bg)', border: '1px solid var(--gh-border)', borderRadius: 6 }}>
              <button className="btn-ghost" onClick={() => setDocFormat(f => ({...f, fontSize: Math.max(10, f.fontSize - 1)}))}><ZoomOut size={16}/></button>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: 'var(--gh-text)', padding: '0 8px' }}>{docFormat.fontSize}px</span>
              <button className="btn-ghost" onClick={() => setDocFormat(f => ({...f, fontSize: Math.min(20, f.fontSize + 1)}))}><ZoomIn size={16}/></button>
            </div>
            <div style={{ width: 1, background: 'var(--gh-border)' }} />
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--gh-bg)', border: '1px solid var(--gh-border)', borderRadius: 6 }}>
              {[['left', <AlignLeft size={16} />], ['center', <AlignCenter size={16} />], ['justify', <AlignJustify size={16} />]].map(([a, icon]) => (
                <button key={a} className="btn-ghost" onClick={() => setDocFormat(f => ({...f, align: a}))} style={{ background: docFormat.align === a ? 'rgba(200,169,81,0.1)' : 'transparent', color: docFormat.align === a ? 'var(--sq-gold)' : 'var(--gh-text)' }}>{icon}</button>
              ))}
            </div>
          </div>

          <div style={{ padding: '20px', width: '100%', display: 'flex', justifyContent: 'center', paddingBottom: 140 }}>
            <div 
              ref={previewRef}
              className="a4-print"
              style={{
                width: 794, minHeight: 1123, background: '#fff', boxShadow: '0 12px 60px rgba(0,0,0,.5)',
                transform: `scale(${zoom})`, transformOrigin: 'top center',
                marginBottom: zoom < 1 ? `${-(1123 * (1 - zoom))}px` : 0,
              }}
            >
              <ResumeDocument data={data} tpl={tpl} docFormat={docFormat} />
            </div>
          </div>

          {/* Floating Action Bar for Preview */}
          <div style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', background: 'rgba(22, 27, 34, 0.95)', backdropFilter: 'blur(10px)', border: '1px solid var(--gh-border)', padding: '10px', borderRadius: 50, display: 'flex', gap: 10, boxShadow: '0 12px 30px rgba(0,0,0,0.6)', zIndex: 100, width: 'max-content' }}>
            <button className="btn-outline" style={{ border: 'none', borderRadius: 40, padding: '12px 24px', background: 'transparent' }} onClick={() => setShowTemplates(true)}>
              <Palette size={18} color="var(--sq-gold)"/> <span style={{ marginLeft: 8, color: 'var(--gh-text)' }}>Design</span>
            </button>
            <div style={{ width: 1, background: 'var(--gh-border)', margin: '0 4px' }} />
            {showPreview && step < 6 ? (
              <button className="btn-primary" style={{ borderRadius: 40, padding: '12px 28px' }} onClick={() => setShowPreview(false)}>
                <Edit3 size={18}/> <span style={{ marginLeft: 8 }}>Back to Edit</span>
              </button>
            ) : (
              <button className="btn-primary" style={{ borderRadius: 40, padding: '12px 28px' }} onClick={exportPDF}>
                <Download size={18}/> <span style={{ marginLeft: 8 }}>Download PDF</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* PHOTO CROP MODAL (Absolute Overlay) */}
      {photoCropMode && (
        <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(13,17,23,0.96)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)' }}>
          <div style={{ fontFamily:"'Josefin Sans',sans-serif", fontWeight:700, fontSize:16, letterSpacing:6, color:'#F2F2F6', marginBottom:8 }}>
            SCALVI<span style={{color:'var(--sq-gold)'}}>Q</span>
          </div>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:11, letterSpacing:3, color:'var(--sq-gold)', textTransform:'uppercase', marginBottom:6 }}>Position Your Photo</div>
          <div style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:14, color:'var(--gh-muted)', marginBottom:32 }}>Drag inside circle to adjust</div>

          <div
            ref={cropContainerRef}
            style={{
              width:260, height:260, borderRadius:'50%', overflow:'hidden', border:`3px solid var(--sq-gold)`, position:'relative',
              cursor: photoDragging ? 'grabbing' : 'grab', boxShadow:'0 0 50px rgba(200,169,81,0.2)', flexShrink:0, userSelect:'none', touchAction:'none',
            }}
            onMouseDown={onCropMouseDown} onMouseMove={onCropMouseMove} onMouseUp={() => setPhotoDragging(false)} onMouseLeave={() => setPhotoDragging(false)}
            onWheel={e=>{ e.preventDefault(); setPhotoScale(s=>parseFloat(Math.max(.3,Math.min(3.5,s-(e.deltaY*.003))).toFixed(3))); }}
            onTouchStart={onCropTouchStart} onTouchMove={onCropTouchMove} onTouchEnd={() => setPhotoDragging(false)}
          >
            {photoPreview && (
              <img
                src={photoPreview} draggable={false} alt="crop"
                style={{
                  position:'absolute', width: `${100 * photoScale}%`, height: `${100 * photoScale}%`, objectFit:'cover',
                  left: `calc(50% + ${offsetDisplay.x}px)`, top:  `calc(50% + ${offsetDisplay.y}px)`, transform:'translate(-50%,-50%)',
                  userSelect:'none', pointerEvents:'none', maxWidth:'none', maxHeight:'none',
                }}
              />
            )}
            <div style={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:'linear-gradient(rgba(200,169,81,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(200,169,81,.1) 1px,transparent 1px)', backgroundSize:'86px 86px' }} />
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:16, marginTop:32 }}>
            <button onClick={()=>setPhotoScale(s=>parseFloat(Math.max(.3,s-.08).toFixed(3)))} className="btn-ghost" style={{ border:'1px solid var(--gh-border)', padding:'8px 16px', fontSize:16 }}>−</button>
            <input type="range" min={0.3} max={3.5} step={0.01} value={photoScale} onChange={e=>setPhotoScale(parseFloat(e.target.value))} style={{ width:200, accentColor:'var(--sq-gold)' }} />
            <button onClick={()=>setPhotoScale(s=>parseFloat(Math.min(3.5,s+.08).toFixed(3)))} className="btn-ghost" style={{ border:'1px solid var(--gh-border)', padding:'8px 16px', fontSize:16 }}>+</button>
          </div>

          <div style={{ display:'flex', gap:16, marginTop:40 }}>
            <button className="btn-outline" onClick={()=>{ setPhotoCropMode(false); setPhotoPreview(null); }}>Cancel</button>
            <button className="btn-primary" onClick={applyCrop}>Apply Photo</button>
          </div>
        </div>
      )}

      {/* TEMPLATE SELECTION MODAL */}
      {showTemplates && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(1,4,9,0.85)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ background: 'var(--gh-surface)', borderTop: '1px solid var(--gh-border)', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 48, maxHeight: '85vh', overflowY: 'auto', animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>Select Template</h3>
              <button className="btn-ghost" style={{ background: 'var(--gh-bg)', borderRadius: '50%', padding: 8 }} onClick={() => setShowTemplates(false)}><X size={20} color="var(--gh-text)"/></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
              {TEMPLATES.map(t => (
                <div key={t.id} onClick={() => { setTpl(t); setShowTemplates(false); }}
                  style={{ border: `2px solid ${tpl.id === t.id ? 'var(--sq-gold)' : 'var(--gh-border)'}`, borderRadius: 12, padding: 10, cursor: 'pointer', background: 'var(--gh-bg)', transition: 'all 0.2s', transform: tpl.id === t.id ? 'translateY(-2px)' : 'none', boxShadow: tpl.id === t.id ? '0 8px 20px rgba(200,169,81,0.15)' : 'none' }}>
                  <div style={{ height: 80, borderRadius: 6, background: `linear-gradient(135deg, ${t.sidebar} ${t.layout === 'sidebar' ? '35%' : '55%'}, ${t.accent})`, marginBottom: 12 }}></div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gh-text)', marginBottom: 2 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--gh-muted)', fontFamily: "'IBM Plex Mono', monospace" }}>{t.cat}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
