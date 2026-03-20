// @ts-nocheck
import { useState, useRef, useCallback, useEffect } from "react";

const FONT_URL = "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&family=Josefin+Sans:wght@300;400;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap";

const G = {
  bg:"#0d1117",surface:"#161b22",card:"#1c2128",
  border:"#30363d",border2:"#21262d",
  text:"#e6edf3",muted:"#8b949e",dim:"#484f58",
  green:"#238636",greenH:"#2ea043",greenT:"#3fb950",
  blue:"#1f6feb",blueT:"#58a6ff",
  purple:"#6e40c9",purpleT:"#a371f7",
  red:"#da3633",redT:"#f85149",
  gold:"#C8A951",goldD:"#7A6530",
  inp:"#0d1117",
};

/* ── MONTHS / YEARS ── */
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const CUR_YEAR = new Date().getFullYear();
const YEARS = Array.from({length:50},(_,i)=>String(CUR_YEAR-i));

/* ── LANGUAGE OPTIONS ── */
const LANG_OPTIONS = ["English","Hindi","Urdu","Tamil","Telugu","Kannada","Malayalam","Bengali","Marathi","Gujarati","Punjabi","Odia","Arabic","French","German","Spanish","Portuguese","Chinese","Japanese","Korean","Russian","Italian","Dutch","Turkish","Persian","Swahili","Other"];
const LANG_LEVELS = ["Native","Fluent","Advanced","Intermediate","Basic","Elementary"];

/* ── JOB-BASED SMART SUGGESTIONS ── */
const SMART_SUMMARIES={
  driver:["Professional driver with {exp} years operating commercial vehicles safely. Clean driving record, expertise in route optimization and vehicle maintenance. Committed to punctual, safe delivery."],
  teacher:["Dedicated educator with {exp} years teaching {subject}. Passionate about inclusive learning environments, curriculum design, and student success. Skilled in assessment and parent communication."],
  engineer:["Results-driven software engineer with {exp}+ years building scalable systems using {skills}. Strong problem-solver, experienced in full-stack development, system design, and Agile delivery."],
  doctor:["Medical professional with {exp} years in {specialty}. Committed to evidence-based patient care, accurate diagnosis, and compassionate treatment. Strong clinical and communication skills."],
  designer:["Creative designer with {exp} years crafting visually compelling experiences. Proficient in {skills}. Blends aesthetic sensibility with user-centered thinking and data-driven iteration."],
  manager:["Strategic leader with {exp} years managing cross-functional teams. Skilled in stakeholder communication, process optimization, budget management, and driving measurable business results."],
  accountant:["Detail-oriented accountant with {exp} years managing financial records and compliance. Proficient in {skills}. Known for accuracy, integrity, and deadline-driven performance."],
  nurse:["Compassionate registered nurse with {exp} years of clinical experience. Skilled in patient assessment, care planning, and multi-disciplinary team collaboration in fast-paced environments."],
  lawyer:["Experienced legal professional with {exp} years in {specialty}. Strong research, negotiation, and advocacy skills. Committed to ethical practice and client-centered representation."],
  sales:["Dynamic sales professional with {exp} years consistently exceeding targets. Skilled in client relationship management, solution selling, and CRM tools. Proven track record of revenue growth."],
  default:["Results-driven professional with {exp}+ years in {field}. Exceptional outcomes through strategic thinking, cross-team collaboration, and a commitment to continuous improvement."],
};
function detectCat(role=""){
  const r=role.toLowerCase();
  if(/driv|chauffeur|transport|truck|delivery/.test(r))return"driver";
  if(/teach|instruct|educat|professor|tutor/.test(r))return"teacher";
  if(/engineer|developer|programmer|coder|architect|devops|frontend|backend|software/.test(r))return"engineer";
  if(/doctor|physician|medical|surgeon|clinic/.test(r))return"doctor";
  if(/nurs|ward|icu|rn\b/.test(r))return"nurse";
  if(/lawyer|attorney|legal|advocate|solicitor/.test(r))return"lawyer";
  if(/sales|business dev|account exec|bdm/.test(r))return"sales";
  if(/design|ui|ux|graphic|visual|creative/.test(r))return"designer";
  if(/manager|director|head|chief|lead|supervisor/.test(r))return"manager";
  if(/account|financ|audit|bookkeep|cpa|tax/.test(r))return"accountant";
  return"default";
}
function smartSummary(data){
  const cat=detectCat(data.personal.role),tpl=SMART_SUMMARIES[cat][0];
  const sk=data.skills.map(s=>s.name).filter(Boolean);
  const exp=Math.max(1,data.experience.length*2);
  return tpl.replace(/{exp}/g,exp).replace(/{skills}/g,sk.slice(0,4).join(", ")||"industry tools").replace(/{field}/g,data.personal.role||"their field").replace(/{specialty}/g,sk[0]||"their specialty").replace(/{subject}/g,sk[0]||"core subjects");
}
function smartBulletsFor(role="",company=""){
  const cat=detectCat(role);
  const b={
    engineer:[`Built scalable services at ${company||"the company"}, improving system performance by 30%.`,`Collaborated with cross-functional teams to ship new product features on schedule.`,`Reduced technical debt, cutting bug reports by 25%.`,`Mentored junior developers and conducted thorough code reviews.`],
    manager:[`Led a team of 8+ at ${company||"the org"}, achieving 120% of quarterly targets.`,`Designed process improvements that reduced operational costs by 18%.`,`Managed stakeholder relationships across departments and leadership.`,`Spearheaded hiring initiatives, growing the team by 40% in one year.`],
    teacher:[`Designed engaging lesson plans for 35+ students at ${company||"the institution"}.`,`Improved student assessment scores by 22% through differentiated instruction.`,`Maintained regular parent-teacher communication ensuring student progress.`,`Introduced technology-based learning tools, increasing student engagement.`],
    driver:[`Safely transported goods/passengers across assigned routes with 100% punctuality.`,`Performed daily pre-shift safety inspections, maintaining zero incident record.`,`Navigated efficiently using GPS, reducing average route time by 15%.`],
    nurse:[`Provided compassionate care to 20+ patients daily at ${company||"the facility"}.`,`Administered medications and treatments per physician orders accurately.`,`Collaborated with multi-disciplinary teams to develop effective care plans.`],
    lawyer:[`Represented clients in ${company||"cases"} with a 90%+ success rate.`,`Conducted comprehensive legal research and drafted accurate case documents.`,`Negotiated settlements saving clients significant time and legal expenses.`],
    sales:[`Exceeded quarterly sales targets by 35% at ${company||"the company"}.`,`Built and maintained a portfolio of 50+ key client accounts.`,`Implemented CRM workflows that improved lead conversion rate by 22%.`],
    designer:[`Designed user interfaces for ${company||"the product"} used by 100K+ users.`,`Conducted UX research and usability testing, improving task completion by 40%.`,`Collaborated with product and engineering teams to ship pixel-perfect designs.`],
    accountant:[`Managed financial records and monthly reporting for ${company||"the company"}.`,`Streamlined invoicing processes, reducing payment delays by 30%.`,`Ensured tax compliance and prepared accurate annual filings.`],
    default:[`Delivered key projects on time and within budget at ${company||"the org"}.`,`Identified workflow inefficiencies, saving the team 20% in processing time.`,`Collaborated cross-functionally to drive organizational objectives.`],
  };
  return(b[cat]||b.default);
}
function smartSkillsFor(role){
  const cat=detectCat(role);
  const m={engineer:["JavaScript","React","Node.js","Python","SQL","REST APIs","Git","Docker","AWS","Agile"],teacher:["Curriculum Design","Classroom Management","Differentiated Instruction","Student Assessment","Communication","Google Workspace"],driver:["Commercial License","GPS Navigation","Vehicle Maintenance","Route Planning","Safety Compliance","Time Management"],manager:["Team Leadership","Project Management","Budgeting","Stakeholder Communication","Agile","PowerPoint","Excel"],designer:["Figma","Adobe XD","Illustrator","Photoshop","UX Research","Wireframing","Prototyping","CSS"],nurse:["Patient Assessment","Medication Administration","IV Therapy","Care Planning","Electronic Health Records","BLS/ACLS"],lawyer:["Legal Research","Case Management","Contract Drafting","Negotiation","Client Advisory","Litigation","Compliance"],sales:["Lead Generation","CRM (Salesforce)","Client Relationship Management","Negotiation","Cold Calling","Pipeline Management"],accountant:["Tally","QuickBooks","MS Excel","Tax Filing","Financial Reporting","Auditing","GST"],default:["Communication","Team Collaboration","Problem Solving","Microsoft Office","Project Management","Time Management"]};
  return(m[cat]||m.default).map((name,i)=>({id:Date.now()+i,name,level:""}));
}
function suggestInterests(role){
  const cat=detectCat(role);
  const m={engineer:["Open Source Contribution","Competitive Programming","Tech Blogging","Chess","Reading"],teacher:["Reading","Educational Technology","Community Volunteering","Creative Writing","Yoga"],designer:["Photography","Digital Art","UI/UX Blogs","Travel","Music"],manager:["Leadership Podcasts","Golf","Networking Events","Reading Business Books","Mentoring"],default:["Reading","Travelling","Volunteering","Music","Sports"]};
  return(m[cat]||m.default).join(", ");
}

/* ── DATE HELPERS ── */
function fmtDate(m,y,present){if(present)return"Present";if(!m&&!y)return"";if(m&&y)return`${m} ${y}`;return m||y;}
function mkDateRange(sm,sy,em,ey,present){const s=fmtDate(sm,sy,false);const e=fmtDate(em,ey,present);if(!s&&!e)return"";if(s&&e)return`${s} – ${e}`;return s||e;}

/* ── 108 TEMPLATES ── */
const TEMPLATES=[
  {id:"t1", name:"Executive",     cat:"Professional",layout:"classic",  accent:"#1e3a8a",sidebar:"#1e3a8a",bg:"#fff",textDark:"#111827",textMid:"#374151",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t2", name:"Minimalist",    cat:"Minimal",     layout:"classic",  accent:"#374151",sidebar:"#374151",bg:"#fff",textDark:"#111827",textMid:"#6b7280",font:"Helvetica,sans-serif",headFont:"Helvetica,sans-serif"},
  {id:"t3", name:"Navy Pro",      cat:"Professional",layout:"classic",  accent:"#0c4a6e",sidebar:"#0c4a6e",bg:"#fff",textDark:"#0f172a",textMid:"#475569",font:"Arial,sans-serif",headFont:"Georgia,serif"},
  {id:"t4", name:"Forest",        cat:"Nature",      layout:"classic",  accent:"#14532d",sidebar:"#14532d",bg:"#fff",textDark:"#14532d",textMid:"#374151",font:"Verdana,sans-serif",headFont:"Georgia,serif"},
  {id:"t5", name:"Maroon Elite",  cat:"Elegant",     layout:"classic",  accent:"#7f1d1d",sidebar:"#7f1d1d",bg:"#fff",textDark:"#1c1917",textMid:"#57534e",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t6", name:"Gold Standard", cat:"Elegant",     layout:"classic",  accent:"#92400e",sidebar:"#92400e",bg:"#fffbeb",textDark:"#451a03",textMid:"#78350f",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t7", name:"Midnight",      cat:"Bold",        layout:"classic",  accent:"#1e1b4b",sidebar:"#1e1b4b",bg:"#fff",textDark:"#1e1b4b",textMid:"#4338ca",font:"Verdana,sans-serif",headFont:"Georgia,serif"},
  {id:"t8", name:"Charcoal",      cat:"Minimal",     layout:"classic",  accent:"#18181b",sidebar:"#18181b",bg:"#fafafa",textDark:"#09090b",textMid:"#52525b",font:"Helvetica,sans-serif",headFont:"Helvetica,sans-serif"},
  {id:"t9", name:"Teal Classic",  cat:"Clean",       layout:"classic",  accent:"#0d9488",sidebar:"#0d9488",bg:"#fff",textDark:"#042f2e",textMid:"#0f766e",font:"Verdana,sans-serif",headFont:"Georgia,serif"},
  {id:"t10",name:"Rose Pro",      cat:"Creative",    layout:"classic",  accent:"#9f1239",sidebar:"#9f1239",bg:"#fff",textDark:"#881337",textMid:"#9f1239",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t11",name:"Slate",         cat:"Professional",layout:"classic",  accent:"#334155",sidebar:"#334155",bg:"#f8fafc",textDark:"#0f172a",textMid:"#475569",font:"Arial,sans-serif",headFont:"Arial,sans-serif"},
  {id:"t12",name:"Copper",        cat:"Elegant",     layout:"classic",  accent:"#b45309",sidebar:"#b45309",bg:"#fffbeb",textDark:"#451a03",textMid:"#92400e",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t13",name:"Ink",           cat:"Bold",        layout:"classic",  accent:"#020617",sidebar:"#020617",bg:"#fff",textDark:"#020617",textMid:"#334155",font:"Helvetica,sans-serif",headFont:"Georgia,serif"},
  {id:"t14",name:"Ocean",         cat:"Clean",       layout:"classic",  accent:"#0369a1",sidebar:"#0369a1",bg:"#f0f9ff",textDark:"#0c4a6e",textMid:"#0369a1",font:"Verdana,sans-serif",headFont:"Verdana,sans-serif"},
  {id:"t15",name:"Sage",          cat:"Nature",      layout:"classic",  accent:"#3f6212",sidebar:"#3f6212",bg:"#f7fee7",textDark:"#1a2e05",textMid:"#3f6212",font:"Verdana,sans-serif",headFont:"Georgia,serif"},
  {id:"t16",name:"Blush",         cat:"Creative",    layout:"classic",  accent:"#be123c",sidebar:"#be123c",bg:"#fff1f2",textDark:"#4c0519",textMid:"#be123c",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t17",name:"Stone",         cat:"Minimal",     layout:"classic",  accent:"#57534e",sidebar:"#57534e",bg:"#fafaf9",textDark:"#1c1917",textMid:"#78716c",font:"Helvetica,sans-serif",headFont:"Helvetica,sans-serif"},
  {id:"t18",name:"Pacific",       cat:"Clean",       layout:"classic",  accent:"#155e75",sidebar:"#155e75",bg:"#ecfeff",textDark:"#083344",textMid:"#155e75",font:"Verdana,sans-serif",headFont:"Georgia,serif"},
  {id:"t19",name:"Modern Blue",   cat:"Professional",layout:"sidebar",  accent:"#1d4ed8",sidebar:"#1e3a8a",bg:"#fff",textDark:"#1e3a8a",textMid:"#3b82f6",font:"Helvetica,sans-serif",headFont:"Helvetica,sans-serif"},
  {id:"t20",name:"Dark Sidebar",  cat:"Bold",        layout:"sidebar",  accent:"#f59e0b",sidebar:"#0f172a",bg:"#fff",textDark:"#111827",textMid:"#374151",font:"Arial,sans-serif",headFont:"Georgia,serif"},
  {id:"t21",name:"Teal Split",    cat:"Creative",    layout:"sidebar",  accent:"#14b8a6",sidebar:"#0d9488",bg:"#fff",textDark:"#0f766e",textMid:"#374151",font:"Verdana,sans-serif",headFont:"Georgia,serif"},
  {id:"t22",name:"Purple Night",  cat:"Creative",    layout:"sidebar",  accent:"#a78bfa",sidebar:"#4c1d95",bg:"#fff",textDark:"#2e1065",textMid:"#374151",font:"Helvetica,sans-serif",headFont:"Georgia,serif"},
  {id:"t23",name:"Forest Side",   cat:"Nature",      layout:"sidebar",  accent:"#86efac",sidebar:"#14532d",bg:"#fff",textDark:"#052e16",textMid:"#374151",font:"Verdana,sans-serif",headFont:"Georgia,serif"},
  {id:"t24",name:"Crimson Side",  cat:"Bold",        layout:"sidebar",  accent:"#fca5a5",sidebar:"#7f1d1d",bg:"#fff",textDark:"#450a0a",textMid:"#374151",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t25",name:"Gold Side",     cat:"Elegant",     layout:"sidebar",  accent:"#fbbf24",sidebar:"#78350f",bg:"#fff",textDark:"#451a03",textMid:"#374151",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t26",name:"Slate Side",    cat:"Minimal",     layout:"sidebar",  accent:"#94a3b8",sidebar:"#1e293b",bg:"#fff",textDark:"#0f172a",textMid:"#374151",font:"Arial,sans-serif",headFont:"Arial,sans-serif"},
  {id:"t27",name:"Rose Side",     cat:"Creative",    layout:"sidebar",  accent:"#fda4af",sidebar:"#881337",bg:"#fff",textDark:"#4c0519",textMid:"#374151",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t28",name:"Jade",          cat:"Nature",      layout:"sidebar",  accent:"#6ee7b7",sidebar:"#065f46",bg:"#fff",textDark:"#022c22",textMid:"#374151",font:"Verdana,sans-serif",headFont:"Georgia,serif"},
  {id:"t29",name:"Cobalt",        cat:"Professional",layout:"sidebar",  accent:"#93c5fd",sidebar:"#1e3a8a",bg:"#fff",textDark:"#1e3a8a",textMid:"#374151",font:"Verdana,sans-serif",headFont:"Verdana,sans-serif"},
  {id:"t30",name:"Amber Side",    cat:"Elegant",     layout:"sidebar",  accent:"#fde68a",sidebar:"#92400e",bg:"#fff",textDark:"#451a03",textMid:"#374151",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t31",name:"Indigo",        cat:"Bold",        layout:"sidebar",  accent:"#a5b4fc",sidebar:"#1e1b4b",bg:"#fff",textDark:"#1e1b4b",textMid:"#374151",font:"Helvetica,sans-serif",headFont:"Georgia,serif"},
  {id:"t32",name:"Noir",          cat:"Minimal",     layout:"sidebar",  accent:"#a1a1aa",sidebar:"#09090b",bg:"#fff",textDark:"#09090b",textMid:"#374151",font:"Helvetica,sans-serif",headFont:"Helvetica,sans-serif"},
  {id:"t33",name:"Ocean Side",    cat:"Clean",       layout:"sidebar",  accent:"#7dd3fc",sidebar:"#0c4a6e",bg:"#fff",textDark:"#083344",textMid:"#374151",font:"Verdana,sans-serif",headFont:"Verdana,sans-serif"},
  {id:"t34",name:"Plum",          cat:"Creative",    layout:"sidebar",  accent:"#e9d5ff",sidebar:"#581c87",bg:"#fff",textDark:"#2e1065",textMid:"#374151",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t35",name:"Saffron",       cat:"Bold",        layout:"sidebar",  accent:"#fef08a",sidebar:"#713f12",bg:"#fff",textDark:"#431407",textMid:"#374151",font:"Verdana,sans-serif",headFont:"Georgia,serif"},
  {id:"t36",name:"Arctic",        cat:"Clean",       layout:"sidebar",  accent:"#cffafe",sidebar:"#0e7490",bg:"#fff",textDark:"#083344",textMid:"#374151",font:"Helvetica,sans-serif",headFont:"Helvetica,sans-serif"},
  {id:"t37",name:"Sky Top",       cat:"Clean",       layout:"topbar",   accent:"#0ea5e9",sidebar:"#0369a1",bg:"#fff",textDark:"#0c4a6e",textMid:"#374151",font:"Arial,sans-serif",headFont:"Georgia,serif"},
  {id:"t38",name:"Onyx Top",      cat:"Minimal",     layout:"topbar",   accent:"#a1a1aa",sidebar:"#09090b",bg:"#fff",textDark:"#09090b",textMid:"#374151",font:"Helvetica,sans-serif",headFont:"Helvetica,sans-serif"},
  {id:"t39",name:"Crimson Top",   cat:"Bold",        layout:"topbar",   accent:"#fca5a5",sidebar:"#9f1239",bg:"#fff",textDark:"#4c0519",textMid:"#374151",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t40",name:"Forest Top",    cat:"Nature",      layout:"topbar",   accent:"#bbf7d0",sidebar:"#14532d",bg:"#fff",textDark:"#052e16",textMid:"#374151",font:"Verdana,sans-serif",headFont:"Georgia,serif"},
  {id:"t41",name:"Violet Top",    cat:"Creative",    layout:"topbar",   accent:"#ddd6fe",sidebar:"#4c1d95",bg:"#fff",textDark:"#2e1065",textMid:"#374151",font:"Helvetica,sans-serif",headFont:"Georgia,serif"},
  {id:"t42",name:"Gold Top",      cat:"Elegant",     layout:"topbar",   accent:"#fef08a",sidebar:"#78350f",bg:"#fff",textDark:"#451a03",textMid:"#374151",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t43",name:"Aqua Top",      cat:"Clean",       layout:"topbar",   accent:"#a5f3fc",sidebar:"#164e63",bg:"#fff",textDark:"#083344",textMid:"#374151",font:"Verdana,sans-serif",headFont:"Verdana,sans-serif"},
  {id:"t44",name:"Terracotta",    cat:"Bold",        layout:"topbar",   accent:"#fed7aa",sidebar:"#7c2d12",bg:"#fff",textDark:"#431407",textMid:"#374151",font:"Verdana,sans-serif",headFont:"Georgia,serif"},
  {id:"t45",name:"Pine Top",      cat:"Nature",      layout:"topbar",   accent:"#d1fae5",sidebar:"#064e3b",bg:"#fff",textDark:"#022c22",textMid:"#374151",font:"Verdana,sans-serif",headFont:"Georgia,serif"},
  {id:"t46",name:"Denim",         cat:"Professional",layout:"topbar",   accent:"#bfdbfe",sidebar:"#1e3a8a",bg:"#eff6ff",textDark:"#1e3a8a",textMid:"#374151",font:"Verdana,sans-serif",headFont:"Verdana,sans-serif"},
  {id:"t47",name:"Magenta",       cat:"Creative",    layout:"topbar",   accent:"#f5d0fe",sidebar:"#701a75",bg:"#fff",textDark:"#4a044e",textMid:"#374151",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t48",name:"Rust",          cat:"Bold",        layout:"topbar",   accent:"#fef3c7",sidebar:"#7c2d12",bg:"#fff",textDark:"#431407",textMid:"#374151",font:"Verdana,sans-serif",headFont:"Georgia,serif"},
  {id:"t49",name:"Blue Timeline", cat:"Creative",    layout:"timeline", accent:"#3b82f6",sidebar:"#1e3a8a",bg:"#fff",textDark:"#1e3a8a",textMid:"#374151",font:"Arial,sans-serif",headFont:"Georgia,serif"},
  {id:"t50",name:"Green Timeline",cat:"Nature",      layout:"timeline", accent:"#22c55e",sidebar:"#14532d",bg:"#fff",textDark:"#14532d",textMid:"#374151",font:"Verdana,sans-serif",headFont:"Georgia,serif"},
  {id:"t51",name:"Purple Timeline",cat:"Creative",   layout:"timeline", accent:"#a855f7",sidebar:"#581c87",bg:"#fff",textDark:"#2e1065",textMid:"#374151",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t52",name:"Red Timeline",  cat:"Bold",        layout:"timeline", accent:"#ef4444",sidebar:"#7f1d1d",bg:"#fff",textDark:"#450a0a",textMid:"#374151",font:"Helvetica,sans-serif",headFont:"Georgia,serif"},
  {id:"t53",name:"Teal Timeline", cat:"Clean",       layout:"timeline", accent:"#14b8a6",sidebar:"#0d9488",bg:"#fff",textDark:"#042f2e",textMid:"#374151",font:"Verdana,sans-serif",headFont:"Georgia,serif"},
  {id:"t54",name:"Gold Timeline", cat:"Elegant",     layout:"timeline", accent:"#eab308",sidebar:"#78350f",bg:"#fff",textDark:"#451a03",textMid:"#374151",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t55",name:"Dark Timeline", cat:"Professional",layout:"timeline", accent:"#60a5fa",sidebar:"#0f172a",bg:"#fff",textDark:"#0f172a",textMid:"#374151",font:"Helvetica,sans-serif",headFont:"Georgia,serif"},
  {id:"t56",name:"Pink Timeline", cat:"Creative",    layout:"timeline", accent:"#f472b6",sidebar:"#831843",bg:"#fff",textDark:"#500724",textMid:"#374151",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t57",name:"Cyan Timeline", cat:"Clean",       layout:"timeline", accent:"#22d3ee",sidebar:"#0e7490",bg:"#fff",textDark:"#083344",textMid:"#374151",font:"Verdana,sans-serif",headFont:"Verdana,sans-serif"},
  {id:"t58",name:"Orange Timeline",cat:"Bold",       layout:"timeline", accent:"#f97316",sidebar:"#7c2d12",bg:"#fff",textDark:"#431407",textMid:"#374151",font:"Helvetica,sans-serif",headFont:"Georgia,serif"},
  {id:"t59",name:"Compact Pro",   cat:"Professional",layout:"compact",  accent:"#2563eb",sidebar:"#1e3a8a",bg:"#fff",textDark:"#0f172a",textMid:"#374151",font:"Arial,sans-serif",headFont:"Arial,sans-serif"},
  {id:"t60",name:"Compact Teal",  cat:"Clean",       layout:"compact",  accent:"#0d9488",sidebar:"#0f766e",bg:"#fff",textDark:"#042f2e",textMid:"#374151",font:"Helvetica,sans-serif",headFont:"Verdana,sans-serif"},
  {id:"t61",name:"Compact Dark",  cat:"Minimal",     layout:"compact",  accent:"#6366f1",sidebar:"#1e1b4b",bg:"#fff",textDark:"#0f172a",textMid:"#374151",font:"Verdana,sans-serif",headFont:"Helvetica,sans-serif"},
  {id:"t62",name:"Compact Red",   cat:"Bold",        layout:"compact",  accent:"#ef4444",sidebar:"#7f1d1d",bg:"#fff",textDark:"#450a0a",textMid:"#374151",font:"Helvetica,sans-serif",headFont:"Helvetica,sans-serif"},
  {id:"t63",name:"Compact Nature",cat:"Nature",      layout:"compact",  accent:"#22c55e",sidebar:"#14532d",bg:"#f7fee7",textDark:"#14532d",textMid:"#374151",font:"Verdana,sans-serif",headFont:"Georgia,serif"},
  {id:"t64",name:"Compact Amber", cat:"Elegant",     layout:"compact",  accent:"#f59e0b",sidebar:"#78350f",bg:"#fffbeb",textDark:"#451a03",textMid:"#374151",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t65",name:"Hero Navy",     cat:"Professional",layout:"banner",   accent:"#fbbf24",sidebar:"#1e3a8a",bg:"#fff",textDark:"#1e3a8a",textMid:"#374151",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t66",name:"Hero Dark",     cat:"Bold",        layout:"banner",   accent:"#60a5fa",sidebar:"#09090b",bg:"#fff",textDark:"#09090b",textMid:"#374151",font:"Helvetica,sans-serif",headFont:"Georgia,serif"},
  {id:"t67",name:"Hero Forest",   cat:"Nature",      layout:"banner",   accent:"#4ade80",sidebar:"#052e16",bg:"#fff",textDark:"#052e16",textMid:"#374151",font:"Verdana,sans-serif",headFont:"Georgia,serif"},
  {id:"t68",name:"Hero Violet",   cat:"Creative",    layout:"banner",   accent:"#e879f9",sidebar:"#3b0764",bg:"#fff",textDark:"#2e1065",textMid:"#374151",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t69",name:"Hero Teal",     cat:"Clean",       layout:"banner",   accent:"#2dd4bf",sidebar:"#134e4a",bg:"#fff",textDark:"#042f2e",textMid:"#374151",font:"Verdana,sans-serif",headFont:"Georgia,serif"},
  {id:"t70",name:"Hero Gold",     cat:"Elegant",     layout:"banner",   accent:"#fcd34d",sidebar:"#78350f",bg:"#fff",textDark:"#451a03",textMid:"#374151",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t71",name:"Executive I",   cat:"Professional",layout:"executive",accent:"#1e3a8a",sidebar:"#1e3a8a",bg:"#fff",textDark:"#0f172a",textMid:"#374151",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t72",name:"Executive II",  cat:"Elegant",     layout:"executive",accent:"#7f1d1d",sidebar:"#7f1d1d",bg:"#fff",textDark:"#0f172a",textMid:"#374151",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t73",name:"Executive III", cat:"Minimal",     layout:"executive",accent:"#374151",sidebar:"#374151",bg:"#fafafa",textDark:"#111827",textMid:"#6b7280",font:"Helvetica,sans-serif",headFont:"Helvetica,sans-serif"},
  {id:"t74",name:"Executive Gold",cat:"Elegant",     layout:"executive",accent:"#b45309",sidebar:"#b45309",bg:"#fffbeb",textDark:"#451a03",textMid:"#92400e",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t75",name:"Executive Navy",cat:"Professional",layout:"executive",accent:"#0c4a6e",sidebar:"#0c4a6e",bg:"#f0f9ff",textDark:"#0c4a6e",textMid:"#374151",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t76",name:"Minimal Line",  cat:"Minimal",     layout:"classic",  accent:"#d1d5db",sidebar:"#9ca3af",bg:"#fff",textDark:"#111827",textMid:"#6b7280",font:"Helvetica,sans-serif",headFont:"Helvetica,sans-serif"},
  {id:"t77",name:"Bold Black",    cat:"Bold",        layout:"classic",  accent:"#000000",sidebar:"#000000",bg:"#fff",textDark:"#000000",textMid:"#374151",font:"Arial,sans-serif",headFont:"Arial,sans-serif"},
  {id:"t78",name:"Sage Clean",    cat:"Nature",      layout:"classic",  accent:"#16a34a",sidebar:"#15803d",bg:"#f0fdf4",textDark:"#14532d",textMid:"#374151",font:"Verdana,sans-serif",headFont:"Georgia,serif"},
  {id:"t79",name:"Dusk",          cat:"Creative",    layout:"sidebar",  accent:"#a5b4fc",sidebar:"#312e81",bg:"#eef2ff",textDark:"#1e1b4b",textMid:"#374151",font:"Helvetica,sans-serif",headFont:"Georgia,serif"},
  {id:"t80",name:"Warm Beige",    cat:"Elegant",     layout:"classic",  accent:"#d97706",sidebar:"#92400e",bg:"#fef3c7",textDark:"#451a03",textMid:"#78350f",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t81",name:"Deep Sea",      cat:"Professional",layout:"sidebar",  accent:"#38bdf8",sidebar:"#0c4a6e",bg:"#fff",textDark:"#0c4a6e",textMid:"#374151",font:"Verdana,sans-serif",headFont:"Georgia,serif"},
  {id:"t82",name:"Sunset",        cat:"Creative",    layout:"topbar",   accent:"#fed7aa",sidebar:"#c2410c",bg:"#fff",textDark:"#431407",textMid:"#374151",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t83",name:"Grayscale",     cat:"Minimal",     layout:"topbar",   accent:"#e5e7eb",sidebar:"#374151",bg:"#fff",textDark:"#111827",textMid:"#6b7280",font:"Helvetica,sans-serif",headFont:"Helvetica,sans-serif"},
  {id:"t84",name:"Emerald",       cat:"Nature",      layout:"sidebar",  accent:"#6ee7b7",sidebar:"#064e3b",bg:"#fff",textDark:"#022c22",textMid:"#374151",font:"Verdana,sans-serif",headFont:"Georgia,serif"},
  {id:"t85",name:"Classic Serif", cat:"Professional",layout:"executive",accent:"#1e3a8a",sidebar:"#1e3a8a",bg:"#fff",textDark:"#0f172a",textMid:"#374151",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t86",name:"Wine",          cat:"Elegant",     layout:"sidebar",  accent:"#fce7f3",sidebar:"#4a0520",bg:"#fff",textDark:"#3b0764",textMid:"#374151",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t87",name:"Corporate",     cat:"Professional",layout:"compact",  accent:"#1d4ed8",sidebar:"#1e3a8a",bg:"#fff",textDark:"#1e3a8a",textMid:"#374151",font:"Arial,sans-serif",headFont:"Arial,sans-serif"},
  {id:"t88",name:"Bright Teal",   cat:"Clean",       layout:"topbar",   accent:"#99f6e4",sidebar:"#0f766e",bg:"#fff",textDark:"#042f2e",textMid:"#374151",font:"Verdana,sans-serif",headFont:"Verdana,sans-serif"},
  {id:"t89",name:"Lavender",      cat:"Creative",    layout:"topbar",   accent:"#e9d5ff",sidebar:"#7c3aed",bg:"#fdf4ff",textDark:"#2e1065",textMid:"#374151",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t90",name:"Ash",           cat:"Minimal",     layout:"classic",  accent:"#6b7280",sidebar:"#4b5563",bg:"#f9fafb",textDark:"#111827",textMid:"#6b7280",font:"Helvetica,sans-serif",headFont:"Helvetica,sans-serif"},
  {id:"t91",name:"Bold Teal",     cat:"Bold",        layout:"banner",   accent:"#5eead4",sidebar:"#0d9488",bg:"#fff",textDark:"#042f2e",textMid:"#374151",font:"Verdana,sans-serif",headFont:"Georgia,serif"},
  {id:"t92",name:"Deep Purple",   cat:"Creative",    layout:"sidebar",  accent:"#c4b5fd",sidebar:"#3b0764",bg:"#fff",textDark:"#2e1065",textMid:"#374151",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t93",name:"Parchment",     cat:"Elegant",     layout:"executive",accent:"#d97706",sidebar:"#92400e",bg:"#fef9c3",textDark:"#451a03",textMid:"#78350f",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t94",name:"Frost",         cat:"Clean",       layout:"compact",  accent:"#bae6fd",sidebar:"#0c4a6e",bg:"#f0f9ff",textDark:"#0c4a6e",textMid:"#374151",font:"Helvetica,sans-serif",headFont:"Helvetica,sans-serif"},
  {id:"t95",name:"Ruby",          cat:"Bold",        layout:"topbar",   accent:"#fda4af",sidebar:"#9f1239",bg:"#fff",textDark:"#881337",textMid:"#374151",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t96",name:"Smoke",         cat:"Minimal",     layout:"sidebar",  accent:"#d4d4d8",sidebar:"#27272a",bg:"#fafafa",textDark:"#09090b",textMid:"#71717a",font:"Helvetica,sans-serif",headFont:"Helvetica,sans-serif"},
  {id:"t97",name:"Mint",          cat:"Nature",      layout:"topbar",   accent:"#a7f3d0",sidebar:"#065f46",bg:"#f0fdf4",textDark:"#022c22",textMid:"#374151",font:"Verdana,sans-serif",headFont:"Georgia,serif"},
  {id:"t98",name:"Mauve",         cat:"Creative",    layout:"classic",  accent:"#d8b4fe",sidebar:"#6d28d9",bg:"#fdf4ff",textDark:"#2e1065",textMid:"#374151",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t99",name:"Sand",          cat:"Elegant",     layout:"compact",  accent:"#fde68a",sidebar:"#b45309",bg:"#fffbeb",textDark:"#451a03",textMid:"#374151",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t100",name:"Carbon",       cat:"Bold",        layout:"sidebar",  accent:"#6366f1",sidebar:"#111827",bg:"#fff",textDark:"#030712",textMid:"#374151",font:"Helvetica,sans-serif",headFont:"Helvetica,sans-serif"},
  {id:"t101",name:"Clay",         cat:"Nature",      layout:"banner",   accent:"#d97706",sidebar:"#451a03",bg:"#fff",textDark:"#1c1917",textMid:"#374151",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t102",name:"Zinc",         cat:"Minimal",     layout:"topbar",   accent:"#a1a1aa",sidebar:"#3f3f46",bg:"#fafafa",textDark:"#09090b",textMid:"#52525b",font:"Helvetica,sans-serif",headFont:"Helvetica,sans-serif"},
  {id:"t103",name:"Coral Side",   cat:"Creative",    layout:"sidebar",  accent:"#fb923c",sidebar:"#9a3412",bg:"#fff",textDark:"#431407",textMid:"#374151",font:"Verdana,sans-serif",headFont:"Georgia,serif"},
  {id:"t104",name:"Baltic",       cat:"Professional",layout:"timeline", accent:"#38bdf8",sidebar:"#0c4a6e",bg:"#f0f9ff",textDark:"#0c4a6e",textMid:"#374151",font:"Verdana,sans-serif",headFont:"Georgia,serif"},
  {id:"t105",name:"Garnet",       cat:"Elegant",     layout:"banner",   accent:"#fca5a5",sidebar:"#7f1d1d",bg:"#fff",textDark:"#450a0a",textMid:"#374151",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t106",name:"Sterling",     cat:"Professional",layout:"executive",accent:"#94a3b8",sidebar:"#334155",bg:"#f8fafc",textDark:"#0f172a",textMid:"#475569",font:"Georgia,serif",headFont:"Georgia,serif"},
  {id:"t107",name:"Volcano",      cat:"Bold",        layout:"topbar",   accent:"#fbbf24",sidebar:"#b45309",bg:"#fff",textDark:"#451a03",textMid:"#374151",font:"Verdana,sans-serif",headFont:"Georgia,serif"},
  {id:"t108",name:"Mist",         cat:"Clean",       layout:"classic",  accent:"#bae6fd",sidebar:"#0ea5e9",bg:"#f0f9ff",textDark:"#0c4a6e",textMid:"#374151",font:"Verdana,sans-serif",headFont:"Verdana,sans-serif"},
];
const ALL_CATS=["All",...new Set(TEMPLATES.map(t=>t.cat))];
const ALL_LAYS=["All",...new Set(TEMPLATES.map(t=>t.layout))];

/* ── STEP META: 0=landing, 1..5=forms, 6=preview ── */
const STEP_META=[
  {id:0,label:"Home",icon:"⌂",key:"landing"},
  {id:1,label:"Personal",icon:"◉",key:"personal"},
  {id:2,label:"Work",icon:"◈",key:"experience"},
  {id:3,label:"Education",icon:"◷",key:"education"},
  {id:4,label:"Skills",icon:"◎",key:"skills"},
  {id:5,label:"Extras",icon:"✦",key:"extras"},
  {id:6,label:"Preview",icon:"▶",key:"preview"},
];

/* ═══════════════════════════════════════════════════════════════
   CSS
═══════════════════════════════════════════════════════════════ */
const CSS=`
@import url('${FONT_URL}');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{height:100%;background:${G.bg};overflow-x:hidden;}
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:${G.bg};}
::-webkit-scrollbar-thumb{background:${G.border};border-radius:3px;}

@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes heroIn{0%{opacity:0;transform:translateY(32px) scale(.97)}100%{opacity:1;transform:translateY(0) scale(1)}}
@keyframes pulseGlow{0%,100%{box-shadow:0 0 0 0 #3fb95055}50%{box-shadow:0 0 0 14px transparent}}
@keyframes spinLogo{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes borderGlow{0%,100%{border-color:#30363d}50%{border-color:#3fb95066}}
@keyframes stepPop{0%{transform:scale(0.8);opacity:0}100%{transform:scale(1);opacity:1}}

.au{animation:fadeUp .28s ease both}
.hero-in{animation:heroIn .6s cubic-bezier(.16,1,.3,1) both}

/* inputs */
.inp{width:100%;background:${G.inp};color:${G.text};border:1px solid ${G.border};border-radius:6px;padding:9px 13px;font-family:'Josefin Sans',sans-serif;font-size:14px;outline:none;transition:border-color .15s,box-shadow .15s;}
.inp:focus{border-color:${G.blue};box-shadow:0 0 0 3px rgba(31,111,235,.2);}
.inp::placeholder{color:${G.dim};}
.inp-sm{padding:6px 10px;font-size:13px;}
select.inp{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%238b949e'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px;}
.ta{resize:vertical;min-height:80px;line-height:1.65;}
.lbl{display:block;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:1.2px;color:${G.muted};margin-bottom:6px;text-transform:uppercase;}

/* buttons */
.btn-g{background:${G.green};color:#fff;border:1px solid rgba(46,160,67,.4);font-family:'IBM Plex Mono',monospace;font-size:12px;padding:9px 18px;border-radius:6px;cursor:pointer;transition:all .15s;display:inline-flex;align-items:center;gap:7px;font-weight:500;}
.btn-g:hover{background:${G.greenH};transform:translateY(-1px);}
.btn-o{background:transparent;color:${G.text};border:1px solid ${G.border};font-family:'IBM Plex Mono',monospace;font-size:11px;padding:7px 14px;border-radius:6px;cursor:pointer;transition:all .15s;}
.btn-o:hover{border-color:${G.muted};background:${G.card};}
.btn-gh{background:transparent;color:${G.greenT};border:1px solid rgba(63,185,80,.25);font-family:'IBM Plex Mono',monospace;font-size:10px;padding:5px 11px;border-radius:5px;cursor:pointer;transition:all .15s;white-space:nowrap;}
.btn-gh:hover{border-color:${G.green};background:rgba(63,185,80,.1);}
.btn-d{background:transparent;color:${G.redT};border:1px solid rgba(218,54,51,.25);font-family:'IBM Plex Mono',monospace;font-size:10px;padding:5px 11px;border-radius:5px;cursor:pointer;transition:all .15s;}
.btn-d:hover{border-color:${G.red};background:rgba(218,54,51,.1);}
.btn-cta{background:${G.green};color:#fff;border:none;font-family:'Josefin Sans',sans-serif;font-size:17px;font-weight:700;letter-spacing:.5px;padding:16px 40px;border-radius:8px;cursor:pointer;transition:all .22s;display:inline-flex;align-items:center;gap:10px;animation:pulseGlow 2.8s ease infinite;}
.btn-cta:hover{background:${G.greenH};transform:translateY(-3px);box-shadow:0 10px 36px rgba(63,185,80,.35);}
.btn-tpl{width:100%;padding:11px 16px;background:${G.green};color:#fff;border:none;border-radius:6px;font-family:'IBM Plex Mono',monospace;font-size:11px;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:7px;margin-top:8px;}
.btn-tpl:hover{background:${G.greenH};}

/* cards */
.card{background:${G.surface};border:1px solid ${G.border};border-radius:8px;padding:16px;}
.card-exp{background:${G.surface};border:1px solid ${G.border};border-radius:8px;padding:14px;margin-bottom:12px;}

/* pills */
.pill{display:inline-flex;align-items:center;background:${G.card};color:${G.muted};border:1px solid ${G.border};padding:2px 10px;border-radius:99px;font-family:'IBM Plex Mono',monospace;font-size:10px;}
.pill-g{background:rgba(63,185,80,.12);color:${G.greenT};border-color:rgba(63,185,80,.3);}
.pill-b{background:rgba(31,111,235,.12);color:${G.blueT};border-color:rgba(31,111,235,.3);}
.pill-p{background:rgba(110,64,201,.12);color:${G.purpleT};border-color:rgba(110,64,201,.3);}

/* step nav */
.snode{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:700;flex-shrink:0;transition:all .2s;}
.snode-done{background:rgba(63,185,80,.18);color:${G.greenT};border:1.5px solid rgba(63,185,80,.45);}
.snode-active{background:rgba(31,111,235,.18);color:${G.blueT};border:1.5px solid ${G.blue};box-shadow:0 0 14px rgba(31,111,235,.35);animation:stepPop .25s ease both;}
.snode-idle{background:${G.surface};color:${G.dim};border:1.5px solid ${G.border};}

/* template card */
.tc{cursor:pointer;border:1.5px solid ${G.border};border-radius:8px;padding:8px;background:${G.surface};transition:all .14s;}
.tc:hover{border-color:${G.muted};background:${G.card};transform:translateY(-1px);box-shadow:0 4px 16px rgba(0,0,0,.3);}
.tc.sel{border-color:${G.greenT};box-shadow:0 0 0 3px rgba(63,185,80,.2);}

/* bullet editor */
.bullet-row{display:flex;gap:8px;align-items:flex-start;margin-bottom:6px;}
.bullet-handle{color:${G.dim};font-family:'IBM Plex Mono',monospace;font-size:12px;padding-top:9px;flex-shrink:0;cursor:grab;}
.bullet-inp{flex:1;background:${G.inp};color:${G.text};border:1px solid ${G.border};border-radius:5px;padding:7px 10px;font-family:'Josefin Sans',sans-serif;font-size:13px;outline:none;transition:border-color .12s;}
.bullet-inp:focus{border-color:${G.blue};}

/* grid helpers */
.g2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;}
.divider{height:1px;background:linear-gradient(90deg,${G.border},transparent);margin:6px 0 20px;}

/* checkbox */
.chk{width:16px;height:16px;accent-color:${G.green};cursor:pointer;flex-shrink:0;}

/* quick-fill chip */
.qchip{display:inline-flex;align-items:center;gap:5px;background:rgba(31,111,235,.1);color:${G.blueT};border:1px solid rgba(31,111,235,.25);padding:3px 10px;border-radius:99px;font-family:'IBM Plex Mono',monospace;font-size:10px;cursor:pointer;transition:all .13s;margin:2px;}
.qchip:hover{background:rgba(31,111,235,.2);border-color:rgba(31,111,235,.5);}

/* skill bar */
.skill-row{display:flex;gap:8px;align-items:center;margin-bottom:7px;}

@media(max-width:580px){.g2{grid-template-columns:1fr!important;}.g3{grid-template-columns:1fr 1fr!important;}.hide-m{display:none!important;}}

/* ── PRINT / PDF (A4 perfect) ── */
@media print{
  *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;}
  @page{size:A4;margin:0;}
  body{margin:0;padding:0;}
  .resume-page{width:210mm;min-height:297mm;page-break-after:always;box-sizing:border-box;}
}
`;

/* ═══════════════════════════════════════════════════════════════
   CANVAS SPACE BG
═══════════════════════════════════════════════════════════════ */
function SpaceBG({mini=false}){
  const cvs=useRef(null);
  useEffect(()=>{
    const c=cvs.current; if(!c)return;
    const ctx=c.getContext("2d");
    let raf,w,h;
    const N=mini?110:280, SN=mini?0:6;
    const stars=[],shoots=[];
    function resize(){w=c.width=c.offsetWidth;h=c.height=c.offsetHeight;}
    function rnd(a,b){return a+Math.random()*(b-a);}
    function mStar(){return{x:rnd(0,w),y:rnd(0,h),r:Math.random()<.06?rnd(1.4,2.4):Math.random()<.25?rnd(.8,1.4):rnd(.3,.8),base:rnd(.15,.75),phase:rnd(0,Math.PI*2),spd:rnd(.3,1.2),col:Math.random()<.12?"#C8A951":Math.random()<.25?"#58a6ff":Math.random()<.08?"#3fb950":"#fff"};}
    function mShoot(){const x=rnd(-100,w*.6),y=rnd(-60,h*.4),a=rnd(20,45)*Math.PI/180,sp=rnd(600,1100);return{ox:x,oy:y,x,y,a,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,len:rnd(120,260),alpha:0,life:0,maxL:rnd(1.2,2.4),nextAt:rnd(0,18),col:Math.random()<.3?"#C8A951":Math.random()<.4?"#58a6ff":"#fff"};}
    resize();
    for(let i=0;i<N;i++)stars.push(mStar());
    for(let i=0;i<SN;i++)shoots.push(mShoot());
    const blobs=[{x:.5,y:.35,rx:.65,ry:.28,r:"rgba(63,185,80,"},{x:.28,y:.68,rx:.48,ry:.22,r:"rgba(31,111,235,"},{x:.78,y:.18,rx:.38,ry:.18,r:"rgba(200,169,81,"}];
    let last=0;
    function frame(ts){
      const dt=Math.min((ts-last)/1000,.05);last=ts;
      ctx.clearRect(0,0,w,h);
      // nebula
      blobs.forEach(b=>{
        const pulse=.5+.5*Math.sin(ts*.0005+b.x*3),op=(.03+.05*pulse).toFixed(3);
        const gx=b.x*w,gy=b.y*h,grd=ctx.createRadialGradient(gx,gy,0,gx,gy,Math.max(w,h)*.45*b.rx);
        grd.addColorStop(0,b.r+op+")");grd.addColorStop(1,b.r+"0)");
        ctx.fillStyle=grd;ctx.beginPath();ctx.ellipse(gx,gy,w*b.rx,h*b.ry,0,0,Math.PI*2);ctx.fill();
      });
      // orbital rings
      if(!mini){
        const rings=[{r:Math.min(w,h)*.22,spd:.0003,op:.07,dr:3.5},{r:Math.min(w,h)*.42,spd:-.0002,op:.04,dr:2.5},{r:Math.min(w,h)*.65,spd:.00015,op:.025,dr:2},{r:Math.min(w,h)*.9,spd:-.0001,op:.014,dr:1.5}];
        const cx=w*.5,cy=h*.5;
        rings.forEach(rg=>{
          const ang=ts*rg.spd;
          ctx.beginPath();ctx.arc(cx,cy,rg.r,0,Math.PI*2);
          ctx.strokeStyle=`rgba(200,169,81,${rg.op})`;ctx.lineWidth=.8;ctx.stroke();
          const dx=cx+Math.cos(ang)*rg.r,dy=cy+Math.sin(ang)*rg.r;
          ctx.beginPath();ctx.arc(dx,dy,rg.dr,0,Math.PI*2);
          ctx.fillStyle="rgba(200,169,81,.85)";ctx.shadowColor="#C8A951";ctx.shadowBlur=10;ctx.fill();ctx.shadowBlur=0;
        });
      }
      // stars
      stars.forEach(st=>{
        const tw=.5+.5*Math.sin(ts*.001*st.spd+st.phase),op=st.base*(.4+.6*tw),glow=st.r>1.2;
        if(glow){ctx.shadowColor=st.col;ctx.shadowBlur=st.r*4;}
        ctx.beginPath();ctx.arc(st.x,st.y,st.r*(glow?.9+.35*tw:1),0,Math.PI*2);
        ctx.fillStyle=st.col;ctx.globalAlpha=op;ctx.fill();ctx.globalAlpha=1;
        if(glow)ctx.shadowBlur=0;
      });
      // shooting stars
      shoots.forEach(sh=>{
        const t=ts/1000;if(t<sh.nextAt)return;
        sh.life+=dt;const prog=sh.life/sh.maxL;
        sh.alpha=prog<.1?prog/.1:prog>.85?(1-prog)/.15:1;
        sh.x=sh.ox+sh.vx*sh.life;sh.y=sh.oy+sh.vy*sh.life;
        if(sh.alpha>0){
          const tx=sh.x-Math.cos(sh.a)*sh.len,ty=sh.y-Math.sin(sh.a)*sh.len;
          const grd=ctx.createLinearGradient(tx,ty,sh.x,sh.y);
          grd.addColorStop(0,"rgba(255,255,255,0)");
          grd.addColorStop(.6,`rgba(255,255,255,${.4*sh.alpha})`);
          grd.addColorStop(1,sh.col==="white"?`rgba(255,255,255,${sh.alpha})`:`${sh.col}${Math.round(sh.alpha*255).toString(16).padStart(2,"0")}`);
          ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(sh.x,sh.y);
          ctx.strokeStyle=grd;ctx.lineWidth=1.6;ctx.shadowColor=sh.col;ctx.shadowBlur=8;ctx.stroke();ctx.shadowBlur=0;
          ctx.beginPath();ctx.arc(sh.x,sh.y,1.8,0,Math.PI*2);
          ctx.fillStyle=`rgba(255,255,255,${sh.alpha})`;ctx.shadowColor="#fff";ctx.shadowBlur=12;ctx.fill();ctx.shadowBlur=0;
        }
        if(sh.life>=sh.maxL){
          sh.ox=rnd(-100,w*.6);sh.oy=rnd(-60,h*.4);sh.x=sh.ox;sh.y=sh.oy;
          sh.a=rnd(20,45)*Math.PI/180;sh.vx=Math.cos(sh.a)*rnd(600,1100);sh.vy=Math.sin(sh.a)*rnd(600,1100);
          sh.len=rnd(120,260);sh.maxL=rnd(1.2,2.4);sh.life=0;sh.alpha=0;
          sh.nextAt=t+rnd(3,18);sh.col=Math.random()<.3?"#C8A951":Math.random()<.4?"#58a6ff":"#fff";
        }
      });
      raf=requestAnimationFrame(frame);
    }
    raf=requestAnimationFrame(frame);
    const ro=new ResizeObserver(resize);ro.observe(c);
    return()=>{cancelAnimationFrame(raf);ro.disconnect();};
  },[mini]);
  return <canvas ref={cvs} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0,display:"block"}}/>;
}

/* ═══════════════════════════════════════════════════════════════
   SMALL UI HELPERS
═══════════════════════════════════════════════════════════════ */
function Lbl({children}){return <label className="lbl">{children}</label>;}
function Row({children,gap=12,style={}}){return <div style={{display:"flex",gap,alignItems:"flex-start",...style}}>{children}</div>;}
function Col({children,style={}}){return <div style={{flex:1,...style}}>{children}</div>;}

/* Date dropdowns: month + year + optional "Present" checkbox */
function DatePick({label,month,year,present,onMonth,onYear,onPresent,showPresent=false}){
  return(
    <div>
      {label&&<Lbl>{label}</Lbl>}
      <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
        <select className="inp inp-sm" style={{flex:"1 1 100px",minWidth:100}} value={month} onChange={e=>onMonth(e.target.value)} disabled={present}>
          <option value="">Month</option>
          {MONTHS.map(m=><option key={m} value={m}>{m}</option>)}
        </select>
        <select className="inp inp-sm" style={{flex:"1 1 80px",minWidth:80}} value={year} onChange={e=>onYear(e.target.value)} disabled={present}>
          <option value="">Year</option>
          {YEARS.map(y=><option key={y} value={y}>{y}</option>)}
        </select>
        {showPresent&&(
          <label style={{display:"flex",alignItems:"center",gap:5,fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:G.muted,whiteSpace:"nowrap",cursor:"pointer"}}>
            <input type="checkbox" className="chk" checked={!!present} onChange={e=>onPresent(e.target.checked)}/>Present
          </label>
        )}
      </div>
    </div>
  );
}

/* Bullet point editor */
function BulletEditor({bullets,onChange}){
  const add=()=>onChange([...bullets,""]);
  const upd=(i,v)=>onChange(bullets.map((b,j)=>j===i?v:b));
  const del=(i)=>onChange(bullets.filter((_,j)=>j!==i));
  return(
    <div>
      {bullets.map((b,i)=>(
        <div key={i} className="bullet-row">
          <span className="bullet-handle">•</span>
          <input className="bullet-inp" value={b} onChange={e=>upd(i,e.target.value)} placeholder={`Achievement or responsibility ${i+1}…`}/>
          {bullets.length>1&&<button className="btn-d" style={{padding:"4px 8px",fontSize:11,marginTop:2}} onClick={()=>del(i)}>✕</button>}
        </div>
      ))}
      <button className="btn-o" style={{fontSize:10,padding:"4px 12px",marginTop:4}} onClick={add}>+ Add point</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RESUME DOCUMENT (PDF RENDERER)
═══════════════════════════════════════════════════════════════ */
function ResumeDoc({data,tpl,align="left",showSig=false}){
  const {personal,experience,education,skills,languages,achievements,certifications,hobbies,signature}=data;
  const skArr=skills.filter(s=>s.name);
  const cl=[personal.email,personal.phone,personal.location].filter(Boolean);
  const lk=[personal.linkedin,personal.website].filter(Boolean);
  const exps=experience.filter(e=>e.company||e.role);
  const edus=education.filter(e=>e.school||e.degree);
  const langs=languages.filter(l=>l.name);

  const Sec=({title,children,c=tpl.accent})=>(
    <div style={{marginBottom:16}}>
      <div style={{fontSize:9,letterSpacing:3,textTransform:"uppercase",fontWeight:700,color:c,borderBottom:`2px solid ${c}`,paddingBottom:3,marginBottom:8,fontFamily:tpl.headFont}}>{title}</div>
      {children}
    </div>
  );
  const Badge=({s})=>(
    <span style={{display:"inline-block",background:`${tpl.accent}15`,color:tpl.textDark,border:`1px solid ${tpl.accent}40`,padding:"2px 9px",borderRadius:99,fontSize:10.5,margin:"2px 2px",fontFamily:tpl.font}}>{s}</span>
  );
  const bulletsText=(desc)=>Array.isArray(desc)?desc.filter(Boolean).map(b=>`• ${b}`).join("\n"):desc||"";
  const ExpBlock=({e})=>(
    <div style={{marginBottom:13}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",flexWrap:"wrap",gap:4}}>
        <div style={{fontWeight:700,fontSize:12.5,color:tpl.textDark,fontFamily:tpl.headFont}}>{e.role}</div>
        <div style={{fontSize:9.5,color:tpl.textMid,fontFamily:"monospace"}}>{mkDateRange(e.startM,e.startY,e.endM,e.endY,e.present)}</div>
      </div>
      <div style={{fontSize:11.5,color:tpl.accent,fontWeight:600,marginBottom:3,fontFamily:tpl.font}}>{e.company}{e.location?` · ${e.location}`:""}</div>
      {bulletsText(e.bullets)&&<div style={{fontSize:11,color:"#444",lineHeight:1.65,whiteSpace:"pre-line",fontFamily:tpl.font}}>{bulletsText(e.bullets)}</div>}
    </div>
  );
  const EduBlock=({e})=>(
    <div style={{marginBottom:10}}>
      <div style={{fontWeight:700,fontSize:12.5,color:tpl.textDark,fontFamily:tpl.headFont}}>{e.degree}{e.field?` in ${e.field}`:""}</div>
      <div style={{fontSize:11,color:tpl.accent,fontFamily:tpl.font}}>{e.school}{e.location?` · ${e.location}`:""}</div>
      <div style={{fontSize:10,color:tpl.textMid}}>{mkDateRange(e.startM,e.startY,e.endM,e.endY,false)}{e.grade?` · ${e.grade}`:""}</div>
    </div>
  );
  const SigBlock=()=>showSig&&(signature?.show)?(
    <div style={{marginTop:28,paddingTop:16,borderTop:`1px solid ${tpl.accent}33`}}>
      <div style={{display:"flex",justifyContent:align==="right"?"flex-end":align==="center"?"center":"flex-start",gap:40,flexWrap:"wrap"}}>
        {signature.place&&<div style={{textAlign:"center"}}><div style={{borderBottom:`1px solid ${tpl.textDark}`,minWidth:120,marginBottom:4,paddingBottom:8}}>&nbsp;</div><div style={{fontSize:10,color:tpl.textMid}}>{signature.place}</div></div>}
        {signature.date&&<div style={{textAlign:"center"}}><div style={{borderBottom:`1px solid ${tpl.textDark}`,minWidth:100,marginBottom:4,paddingBottom:8}}>&nbsp;</div><div style={{fontSize:10,color:tpl.textMid}}>Date</div></div>}
        <div style={{textAlign:"center"}}><div style={{borderBottom:`1px solid ${tpl.textDark}`,minWidth:140,marginBottom:4,paddingBottom:8}}>{signature.name?<span style={{fontFamily:"Georgia,serif",fontSize:13,color:tpl.textDark,fontStyle:"italic"}}>{signature.name}</span>:<>&nbsp;</>}</div><div style={{fontSize:10,color:tpl.textMid}}>Signature</div></div>
      </div>
    </div>
  ):null;

  const photo=personal.photo?<img src={personal.photo} alt="" style={{width:82,height:82,objectFit:"cover",borderRadius:"50%",border:`3px solid ${tpl.accent}`,flexShrink:0}}/>:null;
  const sPhoto=personal.photo?<img src={personal.photo} alt="" style={{width:76,height:76,objectFit:"cover",borderRadius:"50%",border:`3px solid ${tpl.accent}55`,display:"block",margin:"0 auto 12px"}}/>:null;

  const extras=(
    <>
      {langs.length>0&&<Sec title="Languages"><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{langs.map((l,i)=><span key={i} style={{fontSize:11,color:tpl.textDark,fontFamily:tpl.font,marginRight:8}}>{l.name}{l.level?` (${l.level})`:""}</span>)}</div></Sec>}
      {certifications&&<Sec title="Certifications"><div style={{fontSize:11.5,color:"#444",whiteSpace:"pre-line",fontFamily:tpl.font}}>{certifications}</div></Sec>}
      {achievements&&<Sec title="Achievements"><div style={{fontSize:11.5,color:"#444",whiteSpace:"pre-line",fontFamily:tpl.font}}>{achievements}</div></Sec>}
      {hobbies&&<Sec title="Interests"><div style={{fontSize:11.5,color:"#444",fontFamily:tpl.font}}>{hobbies}</div></Sec>}
    </>
  );

  /* ── Classic ── */
  if(tpl.layout==="classic") return(
    <div className="resume-page" style={{fontFamily:tpl.font,background:tpl.bg,padding:"40px 48px",textAlign:align}}>
      <div style={{display:"flex",alignItems:"center",gap:personal.photo?20:0,paddingBottom:16,borderBottom:`3px solid ${tpl.accent}`,marginBottom:18}}>
        {photo}
        <div style={{flex:1}}>
          <div style={{fontSize:26,fontWeight:700,color:tpl.textDark,fontFamily:tpl.headFont,lineHeight:1.1,marginBottom:3}}>{personal.name||"Your Name"}</div>
          <div style={{fontSize:13,color:tpl.accent,fontWeight:600,marginBottom:5}}>{personal.role}</div>
          <div style={{fontSize:10.5,color:"#555"}}>{cl.join("  ·  ")}</div>
          {lk.length>0&&<div style={{fontSize:10,color:"#777",marginTop:2}}>{lk.join("  ·  ")}</div>}
        </div>
      </div>
      {personal.summary&&<Sec title="Professional Summary"><p style={{fontSize:12,color:"#444",lineHeight:1.75,margin:0}}>{personal.summary}</p></Sec>}
      {exps.length>0&&<Sec title="Work Experience">{exps.map((e,i)=><ExpBlock key={i} e={e}/>)}</Sec>}
      {edus.length>0&&<Sec title="Education">{edus.map((e,i)=><EduBlock key={i} e={e}/>)}</Sec>}
      {skArr.length>0&&<Sec title="Skills"><div>{skArr.map((s,i)=><Badge key={i} s={s.name+(s.level?` (${s.level})`:"")}/>)}</div></Sec>}
      {extras}
      <SigBlock/>
    </div>
  );

  /* ── Sidebar ── */
  if(tpl.layout==="sidebar") return(
    <div className="resume-page" style={{fontFamily:tpl.font,display:"flex",background:tpl.bg}}>
      <div style={{width:230,background:tpl.sidebar,color:"#fff",padding:"26px 16px",flexShrink:0}}>
        {sPhoto}
        <div style={{textAlign:"center",marginBottom:14}}>
          <div style={{fontSize:16,fontWeight:700,color:"#fff",fontFamily:tpl.headFont,lineHeight:1.2}}>{personal.name||"Your Name"}</div>
          <div style={{fontSize:10.5,color:tpl.accent,marginTop:3,fontWeight:600}}>{personal.role}</div>
        </div>
        <div style={{fontSize:10.5,lineHeight:1.9,color:"rgba(255,255,255,.8)",borderTop:`1px solid ${tpl.accent}44`,paddingTop:10,marginBottom:14}}>
          {personal.email&&<div>✉ {personal.email}</div>}
          {personal.phone&&<div>✆ {personal.phone}</div>}
          {personal.location&&<div>⊙ {personal.location}</div>}
          {personal.linkedin&&<div>⊕ {personal.linkedin}</div>}
        </div>
        {skArr.length>0&&<div style={{marginBottom:14}}><div style={{fontSize:8,letterSpacing:2,textTransform:"uppercase",color:tpl.accent,borderBottom:`1px solid ${tpl.accent}55`,paddingBottom:3,marginBottom:6,fontWeight:700}}>Skills</div>{skArr.map((s,i)=><div key={i} style={{fontSize:10.5,color:"rgba(255,255,255,.85)",lineHeight:1.8}}>{s.name}{s.level?` — ${s.level}`:""}</div>)}</div>}
        {langs.length>0&&<div style={{marginBottom:14}}><div style={{fontSize:8,letterSpacing:2,textTransform:"uppercase",color:tpl.accent,borderBottom:`1px solid ${tpl.accent}55`,paddingBottom:3,marginBottom:6,fontWeight:700}}>Languages</div>{langs.map((l,i)=><div key={i} style={{fontSize:10.5,color:"rgba(255,255,255,.8)"}}>{l.name}{l.level?` (${l.level})`:""}</div>)}</div>}
        {certifications&&<div><div style={{fontSize:8,letterSpacing:2,textTransform:"uppercase",color:tpl.accent,borderBottom:`1px solid ${tpl.accent}55`,paddingBottom:3,marginBottom:6,fontWeight:700}}>Certifications</div><div style={{fontSize:10,color:"rgba(255,255,255,.8)",lineHeight:1.65}}>{certifications}</div></div>}
      </div>
      <div style={{flex:1,padding:"28px 24px",textAlign:align}}>
        {personal.summary&&<><div style={{fontSize:8.5,letterSpacing:3,textTransform:"uppercase",fontWeight:700,color:"#555",borderBottom:"2px solid #ddd",paddingBottom:3,marginBottom:7}}>Profile</div><p style={{fontSize:12,color:"#444",lineHeight:1.75,marginBottom:16}}>{personal.summary}</p></>}
        {exps.length>0&&<><div style={{fontSize:8.5,letterSpacing:3,textTransform:"uppercase",fontWeight:700,color:"#555",borderBottom:"2px solid #ddd",paddingBottom:3,marginBottom:7}}>Experience</div>{exps.map((e,i)=><ExpBlock key={i} e={e}/>)}</>}
        {edus.length>0&&<><div style={{fontSize:8.5,letterSpacing:3,textTransform:"uppercase",fontWeight:700,color:"#555",borderBottom:"2px solid #ddd",paddingBottom:3,marginBottom:7,marginTop:14}}>Education</div>{edus.map((e,i)=><EduBlock key={i} e={e}/>)}</>}
        {achievements&&<><div style={{fontSize:8.5,letterSpacing:3,textTransform:"uppercase",fontWeight:700,color:"#555",borderBottom:"2px solid #ddd",paddingBottom:3,marginBottom:7,marginTop:14}}>Achievements</div><div style={{fontSize:11,color:"#444",whiteSpace:"pre-line"}}>{achievements}</div></>}
        {hobbies&&<><div style={{fontSize:8.5,letterSpacing:3,textTransform:"uppercase",fontWeight:700,color:"#555",borderBottom:"2px solid #ddd",paddingBottom:3,marginBottom:7,marginTop:14}}>Interests</div><div style={{fontSize:11,color:"#444"}}>{hobbies}</div></>}
        <SigBlock/>
      </div>
    </div>
  );

  /* ── Topbar ── */
  if(tpl.layout==="topbar") return(
    <div className="resume-page" style={{fontFamily:tpl.font,background:tpl.bg,textAlign:align}}>
      <div style={{background:tpl.sidebar,padding:"24px 40px",display:"flex",alignItems:"center",gap:personal.photo?20:0}}>
        {photo}
        <div style={{flex:1}}>
          <div style={{fontSize:24,fontWeight:700,color:"#fff",fontFamily:tpl.headFont}}>{personal.name||"Your Name"}</div>
          <div style={{fontSize:12.5,color:tpl.accent,fontWeight:600,marginTop:3}}>{personal.role}</div>
          <div style={{fontSize:10.5,color:"rgba(255,255,255,.65)",marginTop:5}}>{[...cl,...lk].join("  ·  ")}</div>
        </div>
      </div>
      <div style={{padding:"24px 40px"}}>
        {personal.summary&&<Sec title="Summary"><p style={{fontSize:12,color:"#444",lineHeight:1.75,margin:0}}>{personal.summary}</p></Sec>}
        {exps.length>0&&<Sec title="Work Experience">{exps.map((e,i)=><ExpBlock key={i} e={e}/>)}</Sec>}
        {edus.length>0&&<Sec title="Education">{edus.map((e,i)=><EduBlock key={i} e={e}/>)}</Sec>}
        {skArr.length>0&&<Sec title="Skills"><div>{skArr.map((s,i)=><Badge key={i} s={s.name+(s.level?` (${s.level})`:"")}/>)}</div></Sec>}
        {extras}<SigBlock/>
      </div>
    </div>
  );

  /* ── Timeline ── */
  if(tpl.layout==="timeline") return(
    <div className="resume-page" style={{fontFamily:tpl.font,background:tpl.bg,textAlign:align}}>
      <div style={{background:tpl.sidebar,padding:"24px 40px",display:"flex",alignItems:"center",gap:personal.photo?18:0}}>
        {photo}
        <div>
          <div style={{fontSize:24,fontWeight:700,color:"#fff",fontFamily:tpl.headFont}}>{personal.name||"Your Name"}</div>
          <div style={{fontSize:12.5,color:tpl.accent,fontWeight:600,marginTop:3}}>{personal.role}</div>
          <div style={{fontSize:10.5,color:"rgba(255,255,255,.65)",marginTop:4}}>{cl.join("  ·  ")}</div>
        </div>
      </div>
      <div style={{padding:"24px 40px"}}>
        {personal.summary&&<Sec title="About"><p style={{fontSize:12,color:"#444",lineHeight:1.75,margin:0}}>{personal.summary}</p></Sec>}
        {exps.length>0&&<><div style={{fontSize:9,letterSpacing:3,textTransform:"uppercase",fontWeight:700,color:tpl.accent,borderBottom:`2px solid ${tpl.accent}`,paddingBottom:3,marginBottom:10}}>Experience</div>
          <div style={{borderLeft:`2px solid ${tpl.accent}`,paddingLeft:16,marginBottom:14}}>
            {exps.map((e,i)=><div key={i} style={{position:"relative",marginBottom:14}}><div style={{position:"absolute",left:-21,top:3,width:9,height:9,borderRadius:"50%",background:tpl.accent,border:`2px solid ${tpl.sidebar}`,boxShadow:`0 0 0 3px ${tpl.accent}33`}}/><ExpBlock e={e}/></div>)}
          </div>
        </>}
        {edus.length>0&&<Sec title="Education">{edus.map((e,i)=><EduBlock key={i} e={e}/>)}</Sec>}
        {skArr.length>0&&<Sec title="Skills"><div>{skArr.map((s,i)=><Badge key={i} s={s.name+(s.level?` (${s.level})`:"")}/>)}</div></Sec>}
        {extras}<SigBlock/>
      </div>
    </div>
  );

  /* ── Compact ── */
  if(tpl.layout==="compact") return(
    <div className="resume-page" style={{fontFamily:tpl.font,background:tpl.bg,padding:"30px 38px",textAlign:align}}>
      <div style={{display:"flex",alignItems:"center",gap:personal.photo?16:0,marginBottom:14}}>
        {photo}
        <div style={{flex:1,borderLeft:`4px solid ${tpl.accent}`,paddingLeft:12}}>
          <div style={{fontSize:22,fontWeight:700,color:tpl.textDark,fontFamily:tpl.headFont}}>{personal.name||"Your Name"}</div>
          <div style={{fontSize:12,color:tpl.accent,fontWeight:600}}>{personal.role}</div>
          <div style={{fontSize:10,color:"#777",marginTop:2}}>{[...cl,...lk].join("  ·  ")}</div>
        </div>
      </div>
      <hr style={{border:"none",borderTop:`2px solid ${tpl.accent}`,margin:"0 0 12px"}}/>
      {personal.summary&&<p style={{fontSize:11.5,color:"#444",lineHeight:1.7,margin:"0 0 12px",borderLeft:`3px solid ${tpl.accent}`,paddingLeft:9}}>{personal.summary}</p>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 22px"}}>
        <div>
          {exps.length>0&&<Sec title="Experience">{exps.map((e,i)=><ExpBlock key={i} e={e}/>)}</Sec>}
          {achievements&&<Sec title="Achievements"><div style={{fontSize:11,color:"#444",whiteSpace:"pre-line"}}>{achievements}</div></Sec>}
        </div>
        <div>
          {edus.length>0&&<Sec title="Education">{edus.map((e,i)=><EduBlock key={i} e={e}/>)}</Sec>}
          {skArr.length>0&&<Sec title="Skills"><div>{skArr.map((s,i)=><Badge key={i} s={s.name+(s.level?` (${s.level})`:"")}/>)}</div></Sec>}
          {langs.length>0&&<Sec title="Languages"><div>{langs.map((l,i)=><div key={i} style={{fontSize:11,color:"#444"}}>{l.name}{l.level?` (${l.level})`:""}</div>)}</div></Sec>}
          {certifications&&<Sec title="Certifications"><div style={{fontSize:11,color:"#444"}}>{certifications}</div></Sec>}
          {hobbies&&<Sec title="Interests"><div style={{fontSize:11}}>{hobbies}</div></Sec>}
        </div>
      </div>
      <SigBlock/>
    </div>
  );

  /* ── Banner ── */
  if(tpl.layout==="banner") return(
    <div className="resume-page" style={{fontFamily:tpl.font,background:tpl.bg,textAlign:align}}>
      <div style={{background:`linear-gradient(135deg,${tpl.sidebar} 60%,${tpl.sidebar}bb)`,padding:"34px 44px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:-40,top:-40,width:180,height:180,borderRadius:"50%",background:`${tpl.accent}12`}}/>
        <div style={{display:"flex",alignItems:"center",gap:personal.photo?22:0,position:"relative"}}>
          {photo}
          <div>
            <div style={{fontSize:28,fontWeight:700,color:"#fff",fontFamily:tpl.headFont,lineHeight:1.1,marginBottom:5}}>{personal.name||"Your Name"}</div>
            <div style={{fontSize:12.5,color:tpl.accent,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>{personal.role}</div>
            <div style={{marginTop:9,display:"flex",gap:14,flexWrap:"wrap"}}>{cl.map((c,i)=><span key={i} style={{fontSize:10.5,color:"rgba(255,255,255,.75)"}}>{c}</span>)}</div>
          </div>
        </div>
      </div>
      <div style={{padding:"26px 44px"}}>
        {personal.summary&&<Sec title="Summary"><p style={{fontSize:12,color:"#444",lineHeight:1.75,margin:0}}>{personal.summary}</p></Sec>}
        {exps.length>0&&<Sec title="Experience">{exps.map((e,i)=><ExpBlock key={i} e={e}/>)}</Sec>}
        {edus.length>0&&<Sec title="Education">{edus.map((e,i)=><EduBlock key={i} e={e}/>)}</Sec>}
        {skArr.length>0&&<Sec title="Skills"><div>{skArr.map((s,i)=><Badge key={i} s={s.name+(s.level?` (${s.level})`:"")}/>)}</div></Sec>}
        {extras}<SigBlock/>
      </div>
    </div>
  );

  /* ── Executive ── */
  return(
    <div className="resume-page" style={{fontFamily:tpl.font,background:tpl.bg,padding:"44px 52px",textAlign:"center"}}>
      {personal.photo&&<div style={{display:"flex",justifyContent:"center",marginBottom:12}}>{photo}</div>}
      <div style={{fontSize:30,fontWeight:700,color:tpl.textDark,fontFamily:tpl.headFont,letterSpacing:1,textTransform:"uppercase"}}>{personal.name||"Your Name"}</div>
      <div style={{width:52,height:2,background:tpl.accent,margin:"12px auto"}}/>
      <div style={{fontSize:11,color:"#555",letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>{personal.role}</div>
      <div style={{fontSize:10.5,color:"#888",marginBottom:26}}>{[...cl,...lk].join("  |  ")}</div>
      <div style={{textAlign:align}}>
        {personal.summary&&<Sec title="Executive Profile" c={tpl.accent}><p style={{fontSize:12,color:"#444",lineHeight:1.75,margin:0}}>{personal.summary}</p></Sec>}
        {exps.length>0&&<Sec title="Professional Experience" c={tpl.accent}>{exps.map((e,i)=><ExpBlock key={i} e={e}/>)}</Sec>}
        {edus.length>0&&<Sec title="Education" c={tpl.accent}>{edus.map((e,i)=><EduBlock key={i} e={e}/>)}</Sec>}
        {skArr.length>0&&<Sec title="Core Competencies" c={tpl.accent}><div style={{textAlign:"center"}}>{skArr.map((s,i)=><Badge key={i} s={s.name+(s.level?` (${s.level})`:"")}/>)}</div></Sec>}
        {extras}
      </div>
      <SigBlock/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TEMPLATE MINI CARD (reusable in step bar and preview)
═══════════════════════════════════════════════════════════════ */
function TplCard({t,selected,onSelect}){
  return(
    <div className={`tc ${selected?"sel":""}`} onClick={()=>onSelect(t)}>
      <div style={{height:52,borderRadius:5,overflow:"hidden",marginBottom:6,position:"relative"}}>
        {t.layout==="sidebar"?<><div style={{position:"absolute",inset:0,background:t.bg}}/><div style={{position:"absolute",left:0,top:0,width:"35%",height:"100%",background:t.sidebar}}/></>:<div style={{position:"absolute",inset:0,background:(t.layout==="topbar"||t.layout==="timeline"||t.layout==="banner")?t.sidebar:t.bg}}/>}
        {(t.layout==="classic"||t.layout==="compact"||t.layout==="executive")&&<div style={{position:"absolute",bottom:0,left:0,right:0,padding:"5px 6px"}}><div style={{height:3,background:t.accent,borderRadius:2,width:"56%",marginBottom:2}}/><div style={{height:2,background:t.accent+"77",borderRadius:2,width:"40%",marginBottom:2}}/><div style={{height:2,background:t.accent+"44",borderRadius:2,width:"50%"}}/></div>}
        {(t.layout==="topbar"||t.layout==="timeline"||t.layout==="banner")&&<div style={{position:"absolute",bottom:0,left:0,right:0,padding:"5px 6px",background:t.bg}}><div style={{height:2,background:t.accent+"88",borderRadius:2,width:"56%",marginBottom:3}}/><div style={{height:2,background:t.accent+"55",borderRadius:2,width:"38%"}}/></div>}
        {t.layout==="sidebar"&&<div style={{position:"absolute",top:0,bottom:0,right:0,left:"35%",padding:"5px 6px"}}><div style={{height:2,background:t.accent+"88",borderRadius:2,width:"68%",marginBottom:3,marginTop:5}}/><div style={{height:2,background:t.accent+"55",borderRadius:2,width:"48%"}}/></div>}
        {selected&&<div style={{position:"absolute",top:4,right:4,width:15,height:15,borderRadius:"50%",background:G.greenT,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#000",fontWeight:700}}>✓</div>}
      </div>
      <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:G.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:1}}>{t.name}</div>
      <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:8,color:G.dim,textTransform:"uppercase"}}>{t.layout}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HEADER
═══════════════════════════════════════════════════════════════ */
function Header({step,setStep,onExport}){
  return(
    <div style={{position:"sticky",top:0,zIndex:200,background:`${G.surface}f2`,borderBottom:`1px solid ${G.border}`,backdropFilter:"blur(18px)",padding:"0 16px",height:52,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <button onClick={()=>setStep(0)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:9}}>
        <div style={{width:28,height:28,borderRadius:7,background:`linear-gradient(135deg,${G.green},${G.blue})`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,animation:"spinLogo 14s linear infinite"}}>
          <span style={{fontFamily:"'Josefin Sans',sans-serif",fontWeight:700,fontSize:14,color:G.gold}}>Q</span>
        </div>
        <span style={{fontFamily:"'Josefin Sans',sans-serif",fontWeight:700,fontSize:15,letterSpacing:4,color:G.text}}>SCALVI<span style={{color:G.gold}}>Q</span></span>
      </button>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        {step===6&&<button className="btn-g" style={{fontSize:11}} onClick={onExport}>⬇ Export PDF</button>}
        <button className="btn-o" style={{fontSize:10}} onClick={()=>setStep(6)}>▶ Preview</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STEP PROGRESS BAR
═══════════════════════════════════════════════════════════════ */
function StepBar({step,setStep,done}){
  return(
    <div style={{background:G.surface,borderBottom:`1px solid ${G.border}`,overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
      <div style={{display:"flex",alignItems:"stretch",minWidth:"max-content",height:46}}>
        {STEP_META.slice(1).map(s=>{
          const st=s.id<step?"done":s.id===step?"active":"idle";
          return(
            <button key={s.id} onClick={()=>setStep(s.id)}
              style={{display:"flex",alignItems:"center",gap:7,padding:"0 12px",background:"none",border:"none",cursor:"pointer",borderBottom:st==="active"?`2px solid ${G.blueT}`:"2px solid transparent",marginBottom:-1,opacity:1,transition:"opacity .18s"}}>
              <div className={`snode snode-${st}`}>{st==="done"?"✓":s.icon}</div>
              <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:st==="active"?G.blueT:st==="done"?G.greenT:G.dim,whiteSpace:"nowrap"}}>{s.label}</span>
              {done[s.key]&&st!=="active"&&<span className="pill pill-g" style={{fontSize:8,padding:"1px 5px"}}>✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE SHELL + NAV
═══════════════════════════════════════════════════════════════ */
function Shell({children,title,icon}){
  return(
    <div style={{maxWidth:820,margin:"0 auto",padding:"22px 16px 90px"}}>
      <div className="au" style={{marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:9}}>
          <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:20,color:G.blueT}}>{icon}</span>
          <h2 style={{fontFamily:"'Josefin Sans',sans-serif",fontWeight:700,fontSize:21,color:G.text}}>{title}</h2>
        </div>
        <div style={{height:1,background:`linear-gradient(90deg,${G.border},transparent)`}}/>
      </div>
      {children}
    </div>
  );
}
function Nav({step,setStep,nextLabel}){
  return(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:28,paddingTop:16,borderTop:`1px solid ${G.border}`}}>
      <button className="btn-o" onClick={()=>setStep(s=>Math.max(0,s-1))}>← Back</button>
      {step<6&&<button className="btn-g" onClick={()=>setStep(s=>s+1)}>{nextLabel||"Continue →"}</button>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════════ */
export default function App(){
  const [step,setStep]=useState(0);
  const [tpl,setTpl]=useState(TEMPLATES[0]);
  const [catF,setCatF]=useState("All");
  const [layF,setLayF]=useState("All");
  const [tplSearch,setTplSearch]=useState("");
  const [align,setAlign]=useState("left");
  const [toast,setToast]=useState("");
  const previewRef=useRef(null);
  const fileRef=useRef(null);

  const [data,setData]=useState({
    personal:{name:"",role:"",email:"",phone:"",location:"",linkedin:"",website:"",summary:"",photo:null},
    experience:[{id:1,company:"",role:"",location:"",startM:"",startY:"",endM:"",endY:"",present:false,bullets:[""]}],
    education:[{id:1,school:"",degree:"",field:"",location:"",startM:"",startY:"",endM:"",endY:"",grade:""}],
    skills:[{id:1,name:"",level:""}],
    languages:[{id:1,name:"",level:""}],
    achievements:"",certifications:"",hobbies:"",
    signature:{show:false,name:"",place:"",date:true},
  });

  const notify=useCallback(m=>{setToast(m);setTimeout(()=>setToast(""),2800);},[]);
  const upP=(k,v)=>setData(d=>({...d,personal:{...d.personal,[k]:v}}));

  /* ── smart actions ── */
  const doSmartSummary=()=>{setData(d=>({...d,personal:{...d.personal,summary:smartSummary(d)}}));notify("✦ Summary generated — review and personalise it");};
  const doBullets=(id)=>{
    const e=data.experience.find(x=>x.id===id); if(!e)return;
    const b=smartBulletsFor(e.role,e.company);
    setData(d=>({...d,experience:d.experience.map(x=>x.id===id?{...x,bullets:b}:x)}));
    notify("✦ Smart bullets generated");
  };
  const doSmartSkills=()=>{
    const sk=smartSkillsFor(data.personal.role);
    setData(d=>({...d,skills:sk}));notify("✦ Skills suggested for your role");
  };
  const doSuggestInterests=()=>{
    setData(d=>({...d,hobbies:suggestInterests(d.personal.role)}));
    notify("✦ Interests suggested based on your role");
  };

  /* ── photo ── */
  const handlePhoto=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{setData(d=>({...d,personal:{...d.personal,photo:ev.target.result}}));notify("✦ Photo uploaded");};r.readAsDataURL(f);};

  /* ── experience ── */
  const addExp=()=>setData(d=>({...d,experience:[...d.experience,{id:Date.now(),company:"",role:"",location:"",startM:"",startY:"",endM:"",endY:"",present:false,bullets:[""]}]}));
  const delExp=id=>setData(d=>({...d,experience:d.experience.filter(e=>e.id!==id)}));
  const updExp=(id,k,v)=>setData(d=>({...d,experience:d.experience.map(e=>e.id===id?{...e,[k]:v}:e)}));

  /* ── education ── */
  const addEdu=()=>setData(d=>({...d,education:[...d.education,{id:Date.now(),school:"",degree:"",field:"",location:"",startM:"",startY:"",endM:"",endY:"",grade:""}]}));
  const delEdu=id=>setData(d=>({...d,education:d.education.filter(e=>e.id!==id)}));
  const updEdu=(id,k,v)=>setData(d=>({...d,education:d.education.map(e=>e.id===id?{...e,[k]:v}:e)}));

  /* ── skills ── */
  const addSkill=()=>setData(d=>({...d,skills:[...d.skills,{id:Date.now(),name:"",level:""}]}));
  const delSkill=id=>setData(d=>({...d,skills:d.skills.filter(s=>s.id!==id)}));
  const updSkill=(id,k,v)=>setData(d=>({...d,skills:d.skills.map(s=>s.id===id?{...s,[k]:v}:s)}));

  /* ── languages ── */
  const addLang=()=>setData(d=>({...d,languages:[...d.languages,{id:Date.now(),name:"",level:""}]}));
  const delLang=id=>setData(d=>({...d,languages:d.languages.filter(l=>l.id!==id)}));
  const updLang=(id,k,v)=>setData(d=>({...d,languages:d.languages.map(l=>l.id===id?{...l,[k]:v}:l)}));

  /* ── quick-fill chips after job title typed ── */
  const cat=detectCat(data.personal.role);
  const CHIPS={
    engineer:["10+ years exp","Led 5-person team","Built SaaS product","Open to relocation","Remote preferred"],
    teacher:["15+ years exp","Certified trainer","K-12 experience","Inclusive classrooms","CBSE/ICSE board"],
    designer:["UI/UX specialist","Brand identity expert","5+ years exp","Freelance portfolio","Remote preferred"],
    manager:["P&L responsibility","Team of 20+","Growth stage startup","Fortune 500 exp","MBA graduate"],
    default:["5+ years exp","Team player","Open to relocation","Remote preferred","Leadership experience"],
  };
  const chips=(CHIPS[cat]||CHIPS.default);

  /* ── export PDF ── */
  const exportPDF=()=>{
    const c=previewRef.current?.innerHTML; if(!c)return;
    const w=window.open("","_blank");
    w.document.write(`<!DOCTYPE html><html><head><title>${data.personal.name||"Resume"} — SCALVIQ</title>
<link href="${FONT_URL}" rel="stylesheet"/>
<style>
*{box-sizing:border-box;}
body{margin:0;padding:0;background:#fff;}
@media print{
  @page{size:A4;margin:0;}
  body{margin:0;}
  .resume-page{width:210mm;min-height:297mm;page-break-after:always;}
  *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;}
}
</style></head><body>${c}<script>window.onload=()=>setTimeout(()=>window.print(),600);<\/script></body></html>`);
    w.document.close();
  };

  const filtTpls=TEMPLATES.filter(t=>(catF==="All"||t.cat===catF)&&(layF==="All"||t.layout===layF)&&(!tplSearch||t.name.toLowerCase().includes(tplSearch.toLowerCase())));
  const done={
    landing:true,
    personal:!!(data.personal.name&&data.personal.role),
    experience:data.experience.some(e=>e.company||e.role),
    education:data.education.some(e=>e.school||e.degree),
    skills:data.skills.some(s=>s.name),
    extras:true,
    preview:false,
  };

  /* ══════════════════════════════════════════════════════════
     LANDING
  ══════════════════════════════════════════════════════════ */
  if(step===0) return(
    <>
      <style dangerouslySetInnerHTML={{__html:CSS}}/>
      <div style={{position:"relative",minHeight:"100vh",overflow:"hidden",display:"flex",flexDirection:"column",background:G.bg,color:G.text,fontFamily:"'Josefin Sans',sans-serif"}}>
        <SpaceBG/>
        {/* nav */}
        <div style={{position:"relative",zIndex:10,padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <div style={{width:30,height:30,borderRadius:7,background:`linear-gradient(135deg,${G.green},${G.blue})`,display:"flex",alignItems:"center",justifyContent:"center",animation:"spinLogo 14s linear infinite"}}>
              <span style={{fontFamily:"'Josefin Sans',sans-serif",fontWeight:700,fontSize:16,color:G.gold}}>Q</span>
            </div>
            <span style={{fontFamily:"'Josefin Sans',sans-serif",fontWeight:700,fontSize:15,letterSpacing:4,color:G.text}}>SCALVI<span style={{color:G.gold}}>Q</span></span>
            <span className="pill" style={{fontSize:9}}>AI RESUME</span>
          </div>
          <button className="btn-o" style={{fontSize:11}} onClick={()=>setStep(1)}>Start Building</button>
        </div>
        {/* hero */}
        <div style={{position:"relative",zIndex:1,flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 20px 20px",textAlign:"center"}}>
          <div className="hero-in" style={{animationDelay:"0s",marginBottom:22}}>
            <span className="pill pill-g" style={{fontSize:11,padding:"5px 14px",animation:"borderGlow 3s ease-in-out infinite"}}>✦ Free · No login · 108 Templates</span>
          </div>
          <div className="hero-in" style={{animationDelay:".08s"}}>
            <h1 style={{fontFamily:"'Josefin Sans',sans-serif",fontWeight:700,fontSize:"clamp(28px,7vw,64px)",color:G.text,lineHeight:1.08,marginBottom:16,maxWidth:720}}>
              Build your resume.<br/>
              <span style={{background:`linear-gradient(90deg,${G.greenT},${G.blueT})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Land your dream job.</span>
            </h1>
          </div>
          <div className="hero-in" style={{animationDelay:".16s"}}>
            <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"clamp(14px,2.5vw,18px)",color:G.muted,maxWidth:500,lineHeight:1.75,marginBottom:36}}>
              Professional resumes in minutes. AI writing, 108 templates, instant PDF export. Free forever.
            </p>
          </div>
          <div className="hero-in" style={{animationDelay:".24s",marginBottom:56}}>
            <button className="btn-cta" onClick={()=>setStep(1)}><span style={{fontSize:18}}>⚡</span> Start Building — It's Free</button>
            <p style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:G.dim,marginTop:11}}>~3 min · No sign-up</p>
          </div>
          <div className="hero-in" style={{animationDelay:".32s",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))",gap:10,maxWidth:720,width:"100%",marginBottom:48}}>
            {[
              {icon:"🤖",col:G.greenT,bg:`${G.green}12`,bd:`${G.green}25`,h:"AI Smart Write",b:"Role-aware summaries & bullets"},
              {icon:"⊞",col:G.blueT,bg:`${G.blue}12`,bd:`${G.blue}25`,h:"108 Templates",b:"Classic, Sidebar, Timeline & more"},
              {icon:"📄",col:G.gold,bg:`rgba(200,169,81,.1)`,bd:`rgba(200,169,81,.2)`,h:"A4 PDF Export",b:"Perfect multi-page print-ready PDF"},
              {icon:"🌐",col:G.purpleT,bg:`${G.purple}12`,bd:`${G.purple}25`,h:"Language Support",b:"Multi-language with proficiency levels"},
            ].map((f,i)=>(
              <div key={i} style={{background:G.surface,border:`1px solid ${G.border}`,borderRadius:9,padding:"13px 14px",display:"flex",gap:11,alignItems:"flex-start",textAlign:"left",animation:`fadeUp .4s ease both`,animationDelay:`${.36+i*.07}s`}}>
                <div style={{width:34,height:34,borderRadius:8,background:f.bg,border:`1px solid ${f.bd}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{f.icon}</div>
                <div>
                  <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:G.text,fontWeight:600,marginBottom:3}}>{f.h}</div>
                  <div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:11,color:G.muted,lineHeight:1.5}}>{f.b}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="hero-in" style={{animationDelay:".52s",display:"flex",alignItems:"center",gap:5,flexWrap:"wrap",justifyContent:"center"}}>
            {["Personal","Experience","Education","Skills","Extras","Preview & Export"].map((s,i)=>(
              <span key={i} style={{display:"flex",alignItems:"center",gap:5}}>
                <span className="pill pill-b" style={{fontSize:10}}>{s}</span>
                {i<5&&<span style={{color:G.dim,fontSize:11}}>→</span>}
              </span>
            ))}
          </div>
        </div>
        <div style={{position:"relative",zIndex:1,textAlign:"center",padding:"14px",borderTop:`1px solid rgba(48,54,61,.5)`}}>
          <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:G.dim}}>SCALVI<span style={{color:G.gold}}>Q</span> · Professional Resume Builder · 108 Templates · Always Free</span>
        </div>
      </div>
    </>
  );

  /* ══════════════════════════════════════════════════════════
     FORM PAGES (steps 1-6)
  ══════════════════════════════════════════════════════════ */
  return(
    <>
      <style dangerouslySetInnerHTML={{__html:CSS}}/>
      <div style={{minHeight:"100vh",background:G.bg,color:G.text,fontFamily:"'Josefin Sans',sans-serif",position:"relative"}}>
        <SpaceBG mini/>
        <div style={{position:"relative",zIndex:1}}>
          <Header step={step} setStep={setStep} onExport={exportPDF}/>
          <StepBar step={step} setStep={setStep} done={done}/>

          {/* ── STEP 1: PERSONAL ── */}
          {step===1&&(
            <Shell title="Personal Information" icon="◉">
              {/* photo */}
              <div className="card au" style={{marginBottom:14,display:"flex",alignItems:"center",gap:14}}>
                <div onClick={()=>fileRef.current?.click()} style={{width:68,height:68,borderRadius:"50%",border:`2px dashed ${G.border}`,background:G.card,cursor:"pointer",overflow:"hidden",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",transition:"border-color .15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=G.blueT} onMouseLeave={e=>e.currentTarget.style.borderColor=G.border}>
                  {data.personal.photo?<img src={data.personal.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:24,fontWeight:700,color:G.gold}}>Q</span>}
                </div>
                <input type="file" ref={fileRef} accept="image/*" onChange={handlePhoto} style={{display:"none"}}/>
                <div>
                  <button className="btn-o" style={{display:"block",marginBottom:6,fontSize:11}} onClick={()=>fileRef.current?.click()}>{data.personal.photo?"Change photo":"Upload photo"}</button>
                  {data.personal.photo&&<button className="btn-d" style={{display:"block",fontSize:10}} onClick={()=>setData(d=>({...d,personal:{...d.personal,photo:null}}))}>Remove</button>}
                  <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:G.muted,marginTop:5}}>JPG · PNG · Optional</div>
                </div>
              </div>

              <div className="au g2" style={{marginBottom:12}}>
                <div style={{gridColumn:"1/-1"}}>
                  <Lbl>Full Name *</Lbl>
                  <input className="inp" value={data.personal.name} onChange={e=>upP("name",e.target.value)} placeholder="Priya Sharma"/>
                </div>
                <div style={{gridColumn:"1/-1"}}>
                  <Lbl>Job Title *</Lbl>
                  <input className="inp" value={data.personal.role} onChange={e=>upP("role",e.target.value)} placeholder="Software Engineer · Product Manager · Teacher…"/>
                  {/* Quick fill chips */}
                  {data.personal.role&&(
                    <div style={{marginTop:8}}>
                      <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:G.muted,marginBottom:5}}>QUICK ADD TO SUMMARY →</div>
                      <div>{chips.map((c,i)=><span key={i} className="qchip" onClick={()=>upP("summary",(data.personal.summary?data.personal.summary+" ":"")+c)}>+ {c}</span>)}</div>
                    </div>
                  )}
                </div>
                <div><Lbl>Email</Lbl><input className="inp" value={data.personal.email} onChange={e=>upP("email",e.target.value)} placeholder="you@email.com"/></div>
                <div><Lbl>Phone</Lbl><input className="inp" value={data.personal.phone} onChange={e=>upP("phone",e.target.value)} placeholder="+91 98765 43210"/></div>
                <div><Lbl>Location / City</Lbl><input className="inp" value={data.personal.location} onChange={e=>upP("location",e.target.value)} placeholder="Mumbai, Maharashtra, India"/></div>
                <div><Lbl>LinkedIn URL</Lbl><input className="inp" value={data.personal.linkedin} onChange={e=>upP("linkedin",e.target.value)} placeholder="linkedin.com/in/yourname"/></div>
                <div style={{gridColumn:"1/-1"}}><Lbl>Website / Portfolio</Lbl><input className="inp" value={data.personal.website} onChange={e=>upP("website",e.target.value)} placeholder="yoursite.com or github.com/you"/></div>
                <div style={{gridColumn:"1/-1"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <Lbl>Professional Summary</Lbl>
                    <div style={{display:"flex",gap:6}}>
                      <button className="btn-gh" onClick={doSmartSummary}>✦ Smart Write</button>
                    </div>
                  </div>
                  <textarea className="inp ta" rows={5} value={data.personal.summary} onChange={e=>upP("summary",e.target.value)} placeholder="Write your professional summary here. For best results, fill in all sections first, then come back and click ✦ Smart Write to generate a perfect AI summary tailored to your profile…"/>
                  <p style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:G.muted,marginTop:5}}>💡 <span style={{color:G.greenT}}>Tip:</span> Fill all sections first → then use Smart Write for the most accurate summary</p>
                </div>
              </div>
              <Nav step={step} setStep={setStep}/>
            </Shell>
          )}

          {/* ── STEP 2: EXPERIENCE ── */}
          {step===2&&(
            <Shell title="Work Experience" icon="◈">
              {data.experience.map((e,i)=>(
                <div key={e.id} className="card-exp au" style={{animationDelay:`${i*.05}s`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                    <span className="pill pill-b">Position {String(i+1).padStart(2,"0")}</span>
                    <div style={{display:"flex",gap:6}}>
                      <button className="btn-gh" onClick={()=>doBullets(e.id)}>✦ Smart Bullets</button>
                      {data.experience.length>1&&<button className="btn-d" onClick={()=>delExp(e.id)}>Remove</button>}
                    </div>
                  </div>
                  <div className="g2" style={{marginBottom:10}}>
                    <div><Lbl>Job Title</Lbl><input className="inp" value={e.role} onChange={ev=>updExp(e.id,"role",ev.target.value)} placeholder="Software Engineer"/></div>
                    <div><Lbl>Company</Lbl><input className="inp" value={e.company} onChange={ev=>updExp(e.id,"company",ev.target.value)} placeholder="TechCorp Pvt. Ltd."/></div>
                    <div style={{gridColumn:"1/-1"}}><Lbl>Location</Lbl><input className="inp" value={e.location} onChange={ev=>updExp(e.id,"location",ev.target.value)} placeholder="Bengaluru, India (or Remote)"/></div>
                  </div>
                  <div className="g2" style={{marginBottom:10}}>
                    <DatePick label="Start Date" month={e.startM} year={e.startY} onMonth={v=>updExp(e.id,"startM",v)} onYear={v=>updExp(e.id,"startY",v)}/>
                    <DatePick label="End Date" month={e.endM} year={e.endY} present={e.present} onMonth={v=>updExp(e.id,"endM",v)} onYear={v=>updExp(e.id,"endY",v)} onPresent={v=>updExp(e.id,"present",v)} showPresent/>
                  </div>
                  <div style={{marginBottom:4}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <Lbl>Responsibilities & Achievements</Lbl>
                      <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:G.dim}}>Each line = one bullet point on resume</span>
                    </div>
                    <BulletEditor bullets={Array.isArray(e.bullets)?e.bullets:[e.bullets||""]} onChange={v=>updExp(e.id,"bullets",v)}/>
                  </div>
                </div>
              ))}
              <button className="btn-o" style={{width:"100%",padding:11,borderStyle:"dashed",color:G.muted}} onClick={addExp}>+ Add Another Position</button>
              <Nav step={step} setStep={setStep}/>
            </Shell>
          )}

          {/* ── STEP 3: EDUCATION ── */}
          {step===3&&(
            <Shell title="Education" icon="◷">
              {data.education.map((e,i)=>(
                <div key={e.id} className="card-exp au" style={{animationDelay:`${i*.05}s`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                    <span className="pill pill-b">Qualification {String(i+1).padStart(2,"0")}</span>
                    {data.education.length>1&&<button className="btn-d" onClick={()=>delEdu(e.id)}>Remove</button>}
                  </div>
                  <div className="g2" style={{marginBottom:10}}>
                    <div style={{gridColumn:"1/-1"}}><Lbl>Institution / University</Lbl><input className="inp" value={e.school} onChange={ev=>updEdu(e.id,"school",ev.target.value)} placeholder="IIT Delhi · Mumbai University · AIIMS…"/></div>
                    <div><Lbl>Degree</Lbl><input className="inp" value={e.degree} onChange={ev=>updEdu(e.id,"degree",ev.target.value)} placeholder="B.Tech · MBA · MBBS · B.Com…"/></div>
                    <div><Lbl>Field of Study</Lbl><input className="inp" value={e.field} onChange={ev=>updEdu(e.id,"field",ev.target.value)} placeholder="Computer Science"/></div>
                    <div style={{gridColumn:"1/-1"}}><Lbl>Location</Lbl><input className="inp" value={e.location} onChange={ev=>updEdu(e.id,"location",ev.target.value)} placeholder="New Delhi, India"/></div>
                    <div><Lbl>Grade / CGPA</Lbl><input className="inp" value={e.grade} onChange={ev=>updEdu(e.id,"grade",ev.target.value)} placeholder="9.2 CGPA · First Class · 82%"/></div>
                    <div/>
                  </div>
                  <div className="g2">
                    <DatePick label="Start Year" month={e.startM} year={e.startY} onMonth={v=>updEdu(e.id,"startM",v)} onYear={v=>updEdu(e.id,"startY",v)}/>
                    <DatePick label="End Year" month={e.endM} year={e.endY} onMonth={v=>updEdu(e.id,"endM",v)} onYear={v=>updEdu(e.id,"endY",v)}/>
                  </div>
                </div>
              ))}
              <button className="btn-o" style={{width:"100%",padding:11,borderStyle:"dashed",color:G.muted}} onClick={addEdu}>+ Add Another Qualification</button>
              <Nav step={step} setStep={setStep}/>
            </Shell>
          )}

          {/* ── STEP 4: SKILLS ── */}
          {step===4&&(
            <Shell title="Skills" icon="◎">
              <div className="card au" style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <Lbl>Skills (with optional proficiency level)</Lbl>
                  <button className="btn-gh" onClick={doSmartSkills}>✦ Smart Suggest</button>
                </div>
                {data.skills.map((s,i)=>(
                  <div key={s.id} className="skill-row">
                    <input className="inp inp-sm" style={{flex:"2 1 140px"}} value={s.name} onChange={e=>updSkill(s.id,"name",e.target.value)} placeholder={`Skill ${i+1} e.g. React`}/>
                    <select className="inp inp-sm" style={{flex:"1 1 120px"}} value={s.level} onChange={e=>updSkill(s.id,"level",e.target.value)}>
                      <option value="">Level (opt.)</option>
                      {["Expert","Advanced","Intermediate","Beginner"].map(l=><option key={l} value={l}>{l}</option>)}
                    </select>
                    {data.skills.length>1&&<button className="btn-d" style={{padding:"5px 9px",fontSize:11}} onClick={()=>delSkill(s.id)}>✕</button>}
                  </div>
                ))}
                <button className="btn-o" style={{fontSize:10,padding:"5px 14px",marginTop:4}} onClick={addSkill}>+ Add Skill</button>
                <p style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:G.dim,marginTop:8}}>💡 Skills with levels show as "React (Expert)" on your resume</p>
              </div>

              <div className="card au" style={{marginBottom:14,animationDelay:".05s"}}>
                <Lbl>Languages</Lbl>
                {data.languages.map((l,i)=>(
                  <div key={l.id} className="skill-row">
                    <select className="inp inp-sm" style={{flex:"2 1 140px"}} value={l.name} onChange={e=>updLang(l.id,"name",e.target.value)}>
                      <option value="">Select language…</option>
                      {LANG_OPTIONS.map(lo=><option key={lo} value={lo}>{lo}</option>)}
                    </select>
                    <select className="inp inp-sm" style={{flex:"1 1 120px"}} value={l.level} onChange={e=>updLang(l.id,"level",e.target.value)}>
                      <option value="">Proficiency…</option>
                      {LANG_LEVELS.map(lv=><option key={lv} value={lv}>{lv}</option>)}
                    </select>
                    {data.languages.length>1&&<button className="btn-d" style={{padding:"5px 9px",fontSize:11}} onClick={()=>delLang(l.id)}>✕</button>}
                  </div>
                ))}
                <button className="btn-o" style={{fontSize:10,padding:"5px 14px",marginTop:4}} onClick={addLang}>+ Add Language</button>
              </div>

              <Nav step={step} setStep={setStep} nextLabel="Extras →"/>
            </Shell>
          )}

          {/* ── STEP 5: EXTRAS ── */}
          {step===5&&(
            <Shell title="Extras & Finishing Touches" icon="✦">
              <div className="card au" style={{marginBottom:12}}>
                <Lbl>Certifications</Lbl>
                <textarea className="inp ta" rows={3} value={data.certifications} onChange={e=>setData(d=>({...d,certifications:e.target.value}))} placeholder={"AWS Certified Developer · Google Cloud Professional\nPMP · CFA Level I · CPA…"}/>
              </div>
              <div className="card au" style={{marginBottom:12,animationDelay:".04s"}}>
                <Lbl>Achievements & Awards</Lbl>
                <textarea className="inp ta" rows={3} value={data.achievements} onChange={e=>setData(d=>({...d,achievements:e.target.value}))} placeholder={"Hackathon Winner 2023 (1st of 200 teams)\nForbes 30 Under 30 · Best Employee Q3 2022"}/>
              </div>
              <div className="card au" style={{marginBottom:12,animationDelay:".07s"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <Lbl>Interests & Hobbies</Lbl>
                  <button className="btn-gh" onClick={doSuggestInterests}>✦ Suggest for my role</button>
                </div>
                <textarea className="inp ta" rows={2} value={data.hobbies} onChange={e=>setData(d=>({...d,hobbies:e.target.value}))} placeholder="Photography, Chess, Open-source, Running, Cooking…"/>
              </div>

              {/* ── SMART SUMMARY (final step, all data filled) ── */}
              <div className="card au" style={{marginBottom:12,animationDelay:".1s",border:`1px solid ${G.green}33`,background:`${G.green}08`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div>
                    <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:G.greenT,fontWeight:600}}>✦ Generate Smart Summary</div>
                    <div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:12,color:G.muted,marginTop:3}}>Now that all details are filled, generate a perfect AI summary tailored to your complete profile</div>
                  </div>
                  <button className="btn-g" style={{flexShrink:0}} onClick={doSmartSummary}>Generate Now</button>
                </div>
                {data.personal.summary&&(
                  <div>
                    <Lbl>Current Summary (editable)</Lbl>
                    <textarea className="inp ta" rows={4} value={data.personal.summary} onChange={e=>upP("summary",e.target.value)}/>
                  </div>
                )}
              </div>

              {/* ── SIGNATURE BLOCK ── */}
              <div className="card au" style={{marginBottom:12,animationDelay:".13s"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                  <input type="checkbox" className="chk" checked={data.signature.show} onChange={e=>setData(d=>({...d,signature:{...d.signature,show:e.target.checked}}))}/>
                  <div>
                    <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:G.text,fontWeight:600}}>Add Signature Block (Optional)</div>
                    <div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:12,color:G.muted}}>Adds a professional Date · Place · Signature row at the bottom of your resume</div>
                  </div>
                </div>
                {data.signature.show&&(
                  <div className="g2">
                    <div><Lbl>Your Name (for signature)</Lbl><input className="inp" value={data.signature.name} onChange={e=>setData(d=>({...d,signature:{...d.signature,name:e.target.value}}))} placeholder={data.personal.name||"Your Name"}/></div>
                    <div><Lbl>Place</Lbl><input className="inp" value={data.signature.place} onChange={e=>setData(d=>({...d,signature:{...d.signature,place:e.target.value}}))} placeholder="Mumbai, India"/></div>
                    <div style={{gridColumn:"1/-1"}}><label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontFamily:"'Josefin Sans',sans-serif",fontSize:13,color:G.muted}}><input type="checkbox" className="chk" checked={data.signature.date} onChange={e=>setData(d=>({...d,signature:{...d.signature,date:e.target.checked}}))}/> Include date line</label></div>
                  </div>
                )}
              </div>

              <Nav step={step} setStep={setStep} nextLabel="Preview Resume →"/>
            </Shell>
          )}

          {/* ── STEP 6: PREVIEW ── */}
          {step===6&&(
            <Shell title="Preview & Export" icon="▶">
              {/* template picker inline */}
              <div className="card au" style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <div style={{width:14,height:14,borderRadius:3,background:tpl.sidebar,flexShrink:0}}/>
                    <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12,color:G.text,fontWeight:600}}>{tpl.name}</span>
                    <span className="pill">{tpl.layout}</span>
                    <span className="pill pill-p">{tpl.cat}</span>
                  </div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:G.dim}}>Align:</span>
                    {[["left","⟵"],["center","⟺"],["justify","≡"]].map(([a,ic])=>(
                      <button key={a} className="btn-o" onClick={()=>setAlign(a)} style={{padding:"4px 9px",fontSize:12,borderColor:align===a?G.greenT:G.border,color:align===a?G.greenT:G.muted,background:align===a?`${G.green}11`:"transparent"}}>{ic}</button>
                    ))}
                  </div>
                </div>

                {/* template search + filters */}
                <div style={{marginBottom:8}}>
                  <input className="inp" value={tplSearch} onChange={e=>setTplSearch(e.target.value)} placeholder="Search templates…" style={{maxWidth:240,marginBottom:8,fontSize:12}}/>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:6}}>
                    {ALL_CATS.map(c=><button key={c} className="btn-o" onClick={()=>setCatF(c)} style={{fontSize:9,padding:"3px 9px",borderColor:catF===c?G.greenT:G.border,color:catF===c?G.greenT:G.muted,background:catF===c?`${G.green}11`:"transparent"}}>{c}</button>)}
                  </div>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>
                    {ALL_LAYS.map(l=><button key={l} className="btn-o" onClick={()=>setLayF(l)} style={{fontSize:9,padding:"3px 9px",borderColor:layF===l?G.blueT:G.border,color:layF===l?G.blueT:G.muted,background:layF===l?`${G.blue}11`:"transparent"}}>{l}</button>)}
                  </div>
                  <span className="pill" style={{fontSize:9}}><span style={{color:G.greenT,fontWeight:700}}>{filtTpls.length}</span>&nbsp;templates</span>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:7,maxHeight:280,overflowY:"auto",padding:"2px 2px 8px"}}>
                  {filtTpls.map(t=><TplCard key={t.id} t={t} selected={tpl.id===t.id} onSelect={t=>{setTpl(t);notify(`✦ ${t.name} applied`);}}/>)}
                </div>
              </div>

              {/* A4 preview canvas */}
              <div className="au" style={{overflowX:"auto",WebkitOverflowScrolling:"touch",background:"#090c10",border:`1px solid ${G.border}`,borderRadius:10,padding:"18px 8px",animationDelay:".06s"}}>
                <div style={{display:"flex",justifyContent:"center",minWidth:830}}>
                  <div ref={previewRef} style={{width:794,background:"#fff",boxShadow:"0 12px 64px rgba(0,0,0,.7)",flexShrink:0}}>
                    <ResumeDoc data={data} tpl={tpl} align={align} showSig/>
                  </div>
                </div>
              </div>
              <p style={{textAlign:"center",fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:G.dim,marginTop:11}}>A4 size · Multi-page auto-adjust · Print → Save as PDF for perfect output</p>

              <button className="btn-tpl" onClick={exportPDF}>⬇ Export PDF — Print Ready A4</button>

              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:18,justifyContent:"center"}}>
                {[["Personal",1],["Experience",2],["Education",3],["Skills",4],["Extras",5]].map(([l,s])=>(
                  <button key={s} className="btn-o" style={{fontSize:10}} onClick={()=>setStep(s)}>← {l}</button>
                ))}
              </div>

              <div style={{display:"flex",justifyContent:"flex-start",marginTop:24,paddingTop:16,borderTop:`1px solid ${G.border}`}}>
                <button className="btn-o" onClick={()=>setStep(5)}>← Back</button>
              </div>
            </Shell>
          )}
        </div>
      </div>

      {/* toast */}
      {toast&&<div style={{position:"fixed",bottom:22,left:"50%",transform:"translateX(-50%)",background:G.surface,border:`1px solid rgba(63,185,80,.4)`,color:G.greenT,padding:"10px 22px",borderRadius:8,fontFamily:"'IBM Plex Mono',monospace",fontSize:11,zIndex:9999,boxShadow:`0 4px 30px rgba(63,185,80,.2)`,whiteSpace:"nowrap",animation:"fadeUp .2s ease"}}>{toast}</div>}
    </>
  );
}
