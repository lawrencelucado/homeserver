/**
 * Seed Plan Data for FE + SCADA Dashboard
 * Used for deployment and initial setup
 */

export const dailyPlan = {
  learn: [
    "THIEVES pass (Title, Headings, Introduction, Every first sentence, Visuals, End questions, Summary)",
    "KWL (Know, Want to know, Learned) - 3 bullets each",
    "3–5 sentence summary in own words",
    "1 diagram or concept map",
  ],
  apply: [
    "SQ3R 1 example problem (Survey, Question, Read, Recite, Review)",
    "FE Questions (20–40 practice problems)",
    "Feynman technique x2 (explain concepts simply)",
    "Why this method? (justify approach)",
  ],
  reinforce: [
    "Leitner system: add new flashcards",
    "2-3-5-7 day spacing schedule",
    "Blurting (7 min brain dump)",
    "Error log - analyze mistakes",
  ],
};

export const weeks = [
  {
    w: 1,
    fe: "Foundations (Math/Stats/Econ/Ethics)",
    scada: "Overview, Signals, HMI",
    goals: [
      "Understand engineering units and conversions",
      "Learn SCADA system layers (field → control → supervisory)",
      "Introduce HMI screen concepts"
    ]
  },
  {
    w: 2,
    fe: "Statics",
    scada: "Sensors & Conditioning",
    goals: [
      "Master free-body diagrams and equilibrium",
      "Learn pressure, temperature, and flow sensors",
      "Understand 4–20 mA signal scaling"
    ]
  },
  {
    w: 3,
    fe: "Mechanics of Materials",
    scada: "Actuators & Panels",
    goals: [
      "Study stress, strain, and material behavior",
      "Learn relay and motor control basics",
      "Read P&ID symbols and panel wiring"
    ]
  },
  {
    w: 4,
    fe: "Circuits",
    scada: "PLC Logic",
    goals: [
      "Apply Ohm's and Kirchhoff's laws",
      "Master ladder logic (AND/OR/timers)",
      "Understand PLC scan cycle"
    ]
  },
  {
    w: 5,
    fe: "Thermodynamics & Heat Transfer",
    scada: "PID Control",
    goals: [
      "Learn energy balance and thermodynamic cycles",
      "Understand PID control loops",
      "Configure analog control in simulator"
    ]
  },
  {
    w: 6,
    fe: "Fluid Mechanics",
    scada: "Instrumentation (HART/Modbus)",
    goals: [
      "Apply Bernoulli and continuity equations",
      "Learn HART and Modbus protocols",
      "Configure flow and level transmitters"
    ]
  },
  {
    w: 7,
    fe: "Probability, Statistics & Numerical Methods",
    scada: "DAQ, OPC UA/MQTT",
    goals: [
      "Review measurement uncertainty",
      "Learn OPC UA and MQTT protocols",
      "Set up data historian logging"
    ]
  },
  {
    w: 8,
    fe: "Reliability & Engineering Ethics",
    scada: "Security & Redundancy",
    goals: [
      "Study system reliability and safety factors",
      "Design redundant SCADA architectures",
      "Implement cybersecurity zones"
    ]
  },
  {
    w: 9,
    fe: "Mixed Practice & Integration",
    scada: "Integration Project",
    goals: [
      "Combine FE theory with SCADA practice",
      "Build complete system (P&ID → PLC → HMI)",
      "Write technical documentation"
    ]
  },
  {
    w: 10,
    fe: "Mock Exams & Review",
    scada: "Career & Certification Prep",
    goals: [
      "Take full-length FE practice exams",
      "Prepare SCADA interview responses",
      "Update resume and portfolio"
    ]
  },
];

/**
 * Metrics template for initial dashboard
 */
export const metricsTemplate = [
  { key: "Hours Today", value: 0, unit: "hrs" },
  { key: "FE Accuracy", value: 0, unit: "%" },
  { key: "Flashcards Due", value: 0, unit: "cards" },
  { key: "Current Streak", value: 0, unit: "days" },
];

/**
 * Study methods and techniques
 */
export const studyMethods = {
  thieves: {
    name: "THIEVES",
    description: "Pre-reading strategy for textbook chapters",
    steps: [
      "Title - what is the main topic?",
      "Headings - what are the key sections?",
      "Introduction - what's the overview?",
      "Every first sentence - what are the main ideas?",
      "Visuals - what do the diagrams show?",
      "End questions - what should I be able to answer?",
      "Summary - what are the key takeaways?",
    ]
  },
  kwl: {
    name: "KWL",
    description: "Before/during/after reading framework",
    steps: [
      "K (Know) - What do I already know? (3 bullets)",
      "W (Want) - What do I want to learn? (3 questions)",
      "L (Learned) - What did I learn? (3 takeaways)",
    ]
  },
  sq3r: {
    name: "SQ3R",
    description: "Active reading method for problem-solving",
    steps: [
      "Survey - scan the problem",
      "Question - what is being asked?",
      "Read - carefully analyze given information",
      "Recite - explain solution steps aloud",
      "Review - check answer and method",
    ]
  },
  feynman: {
    name: "Feynman Technique",
    description: "Explain complex concepts simply",
    steps: [
      "Choose a concept",
      "Explain it to a child (simple language)",
      "Identify gaps in your explanation",
      "Review and simplify further",
    ]
  },
  leitner: {
    name: "Leitner System",
    description: "Spaced repetition for flashcards",
    steps: [
      "Box 1: Daily review (new cards)",
      "Box 2: Every 2 days (getting familiar)",
      "Box 3: Every 3 days (know it well)",
      "Box 5: Every 5 days (mastered)",
      "Box 7: Every 7 days (long-term memory)",
    ]
  },
  blurting: {
    name: "Blurting",
    description: "Active recall without notes",
    steps: [
      "Set timer for 7 minutes",
      "Write everything you remember about topic",
      "No notes or resources allowed",
      "Review gaps and re-study weak areas",
    ]
  }
};

/**
 * FE Civil exam topics (quick reference)
 */
export const feTopics = [
  "Mathematics (probability, statistics, calculus)",
  "Engineering Economics (time value of money, cost analysis)",
  "Ethics and Professional Practice",
  "Statics (equilibrium, moments, friction)",
  "Dynamics (kinematics, work-energy)",
  "Mechanics of Materials (stress, strain, torsion)",
  "Materials (properties, selection)",
  "Fluid Mechanics (Bernoulli, head loss, pumps)",
  "Thermodynamics (cycles, heat transfer)",
  "Electric Circuits (Ohm's law, AC/DC)",
  "Surveying (measurements, leveling)",
  "Construction (scheduling, contracts)",
  "Geotechnical (soil mechanics, foundations)",
  "Structural (loads, analysis, design)",
  "Transportation (traffic, geometric design)",
  "Environmental (water, wastewater)",
  "Water Resources (hydrology, hydraulics)",
];

/**
 * SCADA topics (quick reference)
 */
export const scadaTopics = [
  "System Architecture (RTU, PLC, HMI, SCADA server)",
  "Sensors (pressure, temperature, flow, level)",
  "Signal Conditioning (4–20 mA, 0–10 V scaling)",
  "Actuators (relays, solenoids, VFDs)",
  "PLC Programming (ladder logic, function blocks)",
  "Control Systems (PID, open/closed loop)",
  "Industrial Protocols (Modbus, HART, OPC UA, MQTT)",
  "Data Acquisition (historians, trending)",
  "Networking (Ethernet/IP, DMZ, VLANs)",
  "Cybersecurity (zones, firewalls, authentication)",
  "Alarm Management (priorities, suppression)",
  "Redundancy (failover, backup servers)",
  "HMI Design (graphics, navigation, usability)",
  "P&ID Symbols (ISA standards)",
  "Troubleshooting (signal tracing, diagnostics)",
];

/**
 * Default tasks for Learn/Apply/Reinforce sections
 */
export const defaultTasks = {
  learn: [
    { title: "THIEVES pass on chapter", done: false, section: "Learn" },
    { title: "KWL (3 bullets each)", done: false, section: "Learn" },
    { title: "3–5 sentence summary", done: false, section: "Learn" },
    { title: "Draw 1 diagram or concept map", done: false, section: "Learn" },
  ],
  apply: [
    { title: "SQ3R 1 example problem", done: false, section: "Apply" },
    { title: "Complete 20–40 FE questions", done: false, section: "Apply" },
    { title: "Feynman technique x2", done: false, section: "Apply" },
    { title: "Explain why this method works", done: false, section: "Apply" },
  ],
  reinforce: [
    { title: "Add new cards to Leitner system", done: false, section: "Reinforce" },
    { title: "Review 2-3-5-7 schedule", done: false, section: "Reinforce" },
    { title: "Blurting session (7 min)", done: false, section: "Reinforce" },
    { title: "Update error log", done: false, section: "Reinforce" },
  ],
};
