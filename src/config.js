/**
 * ╔══════════════════════════════════════════════════════╗
 * ║         PORTFOLIO CONTENT CONFIGURATION              ║
 * ║  Edit this file to update all portfolio content.     ║
 * ║  Changes here automatically reflect on the site.    ║
 * ╚══════════════════════════════════════════════════════╝
 */

export const CONFIG = {

  // ─── Personal Info ──────────────────────────────────────────────────────────
  personal: {
    name:      'Adithyan S Pillai',
    initials:  'ASP',
    title:     'Software Engineer',
    dob:       '20 June 2003',
    address:   'Kuzhikkattu Kizhakkathil, Ramapuram, Keerikad PO, Alappuzha, Kerala, India 690508',
    phone:     '+91 96059 87219',
    email:     'adithyanspillaiofficial@gmail.com',
    github:    'https://github.com/AdithyanSPillaiOfficial',
    linkedin:  'https://www.linkedin.com/in/adithyan-s-pillai',
    // Place your resume PDF in the /public folder and update this path:
    resume:    '/resume.pdf',
    languages: ['Malayalam', 'English'],
    location:  'Alappuzha, Kerala, India',
  },

  // ─── About ──────────────────────────────────────────────────────────────────
  about: {
    tagline:     'Crafting experiences\nthrough code.',
    bio:         'I am Adithyan S Pillai, currently in my final year of B.Tech in Computer Science at Carmel College of Engineering and Technology, under the esteemed APJ Abdul Kalam Technological University. With a passion for technology and a keen interest in software development, I have honed my skills in various programming languages, web development frameworks, and software tools.',
    university:  'Carmel College of Engineering and Technology',
    degree:      'B.Tech in Computer Science and Engineering',
  },

  // ─── Education ──────────────────────────────────────────────────────────────
  education: [
    {
      year:        '2021 – 2025',
      degree:      'B.Tech in Computer Science and Engineering',
      institution: 'Carmel College of Engineering and Technology, Alappuzha',
      board:       'APJ Abdul Kalam Technological University (KTU)',
      grade:       '6.91 CGPA',
      status:      'Completed', //'Final Year / Pursuing',
      highlights:  ['Data Structures & Algorithms', 'Database Systems', 'AI & Neural Networks', 'Web Technologies', 'Operating Systems'],
      icon:        'graduation',
    },
    {
      year:        '2019 – 2021',
      degree:      'Higher Secondary Education (Computer Science)',
      institution: 'Govt. Model Boys Higher Secondary School, Haripad',
      board:       'Directorate of Higher Secondary Education, Kerala',
      grade:       '89.0%',
      status:      'Completed',
      highlights:  ['Computer Science', 'Mathematics', 'Physics', 'Chemistry'],
      icon:        'school',
    },
    {
      year:        '2019',
      degree:      'Secondary School Leaving Certificate (SSLC)',
      institution: 'Sree Narayana English Medium HSS, Oachira',
      board:       'General Education Department, Kerala',
      grade:       '85.0%',
      status:      'Completed',
      highlights:  ['Mathematics', 'General Science', 'Social Studies', 'English'],
      icon:        'certificate',
    },
  ],

  // ─── Projects ───────────────────────────────────────────────────────────────
  projects: [
    {
      year:        '2024 – 2025',
      title:       'Realtime Interview Analysis & Adaptive Questioning Engine',
      subtitle:    'B.Tech Main Project',
      description: 'An AI-enabled tool to assess participant confidence via audio/video cues, featuring real-time analysis and adaptive question suggestions for interviewers based on responses.',
      tags:        ['AI / ML', 'Audio Analysis', 'Video Processing', 'Real-time'],
      accent:      '#2563eb',
      github:      '', // optional: link to repo
    },
    {
      year:        '2024',
      title:       'EXamin — Exam Software',
      subtitle:    'Web Application',
      description: 'A computer-based testing platform with a user-friendly interface, section-based MCQ division, and a question palette for easy navigation.',
      tags:        ['React JS', 'Node JS', 'Express', 'MongoDB'],
      accent:      '#7c3aed',
      github:      '',
    },
    {
      year:        '2024',
      title:       'EduCCET',
      subtitle:    'Mobile Application',
      description: 'A mobile application for CCET students to explore B.Tech syllabus, credits, and course criteria, enhancing accessibility and academic planning.',
      tags:        ['Android', 'Mobile Dev', 'UI / UX'],
      accent:      '#059669',
      github:      '',
    },
    {
      year:        '2023',
      title:       'Digital Library System',
      subtitle:    'B.Tech Mini Project',
      description: 'A digital library system for college, providing search and access to books, notes, and previous year question papers — improving study material availability anytime, anywhere.',
      tags:        ['PHP', 'SQL', 'Web', 'Database'],
      accent:      '#d97706',
      github:      '',
    },
  ],

  // ─── Experience ─────────────────────────────────────────────────────────────
  experience: [
    {
      year:        '2023',
      title:       'Android Development Internship',
      company:     'Shrishti Innovative',
      location:    'Trivandrum',
      description: 'Worked on Android app development, gaining practical skills in mobile application design and implementation during a structured internship.',
    },
  ],

  // ─── Workshops ──────────────────────────────────────────────────────────────
  workshops: [
    {
      year:        '2024',
      title:       'Data Mining Workshop',
      organizer:   'NIT Calicut',
      description: 'Attended a workshop on data mining techniques, enhancing knowledge in data analysis and pattern recognition.',
    },
  ],

  // ─── Skills ─────────────────────────────────────────────────────────────────
  skills: {
    // name: display name, level: 0–100 for progress bar
    technical: [
      { name: 'React',        level: 85 },
      { name: 'Node JS',      level: 80 },
      { name: 'HTML / CSS',   level: 90 },
      { name: 'Python',       level: 75 },
      { name: 'MongoDB',      level: 75 },
      { name: 'C / C++',      level: 70 },
      { name: 'SQL',          level: 70 },
      { name: 'Linux',        level: 65 },
      { name: 'PHP',          level: 60 },
      { name: 'Apache / DNS', level: 60 },
    ],
    creative: ['Premiere Pro', 'After Effects', 'Photoshop'],
    soft:     ['Team Player', 'Smart Worker', 'Quick Debugging'],
    other:    ['Linux', 'Windows', 'Apache', 'DNS'],
  },

  // ─── Theme ──────────────────────────────────────────────────────────────────
  // Swap accent to change the highlight color across the entire site.
  theme: {
    accent:     '#2563eb',
    accentGlow: 'rgba(37, 99, 235, 0.25)',
    bg:         '#050a14',
    bgAlt:      '#080f1f',
  },
};
