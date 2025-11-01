export interface DailyProgress {
  learn: boolean;
  apply: boolean;
  reinforce: boolean;
}

export const WEEKS_PLAN = [
  {
    week: 1,
    theme: "Engineering Foundations + SCADA Overview",
    goal: "Understand units, math, and how SCADA systems gather data.",
    daily_goals: [
      { day: "Mon", fe_focus: "Units & Conversions", scada_focus: "What is SCADA (system layers)", integration_task: "Draw block diagram: field → control → supervisory" },
      { day: "Tue", fe_focus: "Basic Math & Sig. Figures", scada_focus: "SCADA components (RTU, PLC, HMI)", integration_task: "Label diagram with functions" },
      { day: "Wed", fe_focus: "Probability & Statistics", scada_focus: "Communication types (fieldbus, Ethernet/IP)", integration_task: "Table: sensor type vs data rate" },
      { day: "Thu", fe_focus: "Engineering Economics – TVM", scada_focus: "Data flow & signal types (analog/digital)", integration_task: "Simulate scaling 4–20 mA input" },
      { day: "Fri", fe_focus: "Ethics & Codes review", scada_focus: "HMI screens overview", integration_task: "Create mock dashboard layout" },
      { day: "Sat", fe_focus: "40 mixed FE Qs + review", scada_focus: "Explore Ignition or TinkerCAD", integration_task: "Connect virtual sensor to display" },
      { day: "Sun", fe_focus: "Flashcards + concept review", scada_focus: "None – rest and plan", integration_task: "Write 1-page summary of Week 1" },
    ]
  },
  {
    week: 2,
    theme: "Statics & Sensors",
    goal: "Learn equilibrium & how to measure forces physically.",
    daily_goals: [
      { day: "Mon", fe_focus: "Free-body diagrams", scada_focus: "Pressure sensors (4–20 mA)", integration_task: "Convert psi→mA scaling calc" },
      { day: "Tue", fe_focus: "Moments & Friction", scada_focus: "Temperature sensors (RTD, Thermocouple)", integration_task: "Create sensor lookup table" },
      { day: "Wed", fe_focus: "Centroids & Distributed Loads", scada_focus: "Flow meters (ultrasonic, orifice)", integration_task: "Match FE flow eqns to sensor types" },
      { day: "Thu", fe_focus: "20 timed Qs (Statics)", scada_focus: "Signal conditioning (basic amp/filter)", integration_task: "Diagram sensor signal chain" },
      { day: "Fri", fe_focus: "Review + mini-mock (30 Qs)", scada_focus: "Combine signals in PLC", integration_task: "Ladder logic to sum two inputs" },
      { day: "Sat/Sun", fe_focus: "Error log + flashcards", scada_focus: "Weekend mini-project – simulate tank level sensor", integration_task: "Graph pressure vs height in Excel" },
    ]
  },
  {
    week: 3,
    theme: "Mechanics of Materials & Field Devices",
    goal: "Connect mechanical stress → electrical control of machines.",
    daily_goals: [
      { day: "Mon", fe_focus: "Stress & Strain", scada_focus: "Relays and Solenoids", integration_task: "Design relay control for load test" },
      { day: "Tue", fe_focus: "Axial Deformation", scada_focus: "Motor Control (VFD intro)", integration_task: "Diagram PLC → VFD → Motor" },
      { day: "Wed", fe_focus: "Bending & Torsion", scada_focus: "Digital Outputs & Safety Interlocks", integration_task: "Write interlock logic" },
      { day: "Thu", fe_focus: "Mohr’s Circle Basics", scada_focus: "Control panel wiring symbols", integration_task: "Read P&ID symbols quiz" },
      { day: "Fri", fe_focus: "40 mixed Qs", scada_focus: "Troubleshoot relay logic", integration_task: "Annotate error causes" },
      { day: "Sat/Sun", fe_focus: "Review + flashcards", scada_focus: "Mini-lab: simulate motor start/stop", integration_task: "Record PLC state chart" },
    ]
  },
  {
    week: 4,
    theme: "Circuits & PLC Logic",
    goal: "Relate electric laws to automation logic.",
    daily_goals: [
      { day: "Mon", fe_focus: "Ohm’s & Kirchhoff’s laws", scada_focus: "PLC I/O modules", integration_task: "Match analog vs digital I/O" },
      { day: "Tue", fe_focus: "Power & Energy", scada_focus: "Ladder logic (AND/OR)", integration_task: "Write 2-input lamp control" },
      { day: "Wed", fe_focus: "AC/DC fundamentals", scada_focus: "Timers & Counters", integration_task: "Time-delay motor start sequence" },
      { day: "Thu", fe_focus: "20 Qs (Circuits)", scada_focus: "PLC Scan Cycle", integration_task: "Explain order of execution" },
      { day: "Fri", fe_focus: "Mini-mock (40 Qs)", scada_focus: "Fault diagnostics", integration_task: "Debug logic errors" },
      { day: "Sat/Sun", fe_focus: "Summary review", scada_focus: "Small PLC simulation project", integration_task: "Pump control based on tank level" },
    ]
  },
  {
    week: 5,
    theme: "Thermodynamics & Control Systems",
    goal: "Understand energy flow and PID control.",
    daily_goals: [
      { day: "Mon", fe_focus: "1st Law & Energy Balance", scada_focus: "Control loop basics", integration_task: "Block diagram of closed loop" },
      { day: "Tue", fe_focus: "Efficiency & Cycles", scada_focus: "PID concepts", integration_task: "Tune Kp/Ki/Kd in simulator" },
      { day: "Wed", fe_focus: "Heat Transfer modes", scada_focus: "Analog PID loop config", integration_task: "Compare manual vs auto mode" },
      { day: "Thu", fe_focus: "25 Qs (Thermo)", scada_focus: "Data logging of process values", integration_task: "Plot trend graphs" },
      { day: "Fri", fe_focus: "Review + quiz", scada_focus: "Alarm setup & thresholds", integration_task: "Define high/low alarms" },
      { day: "Sat/Sun", fe_focus: "Mini-project: temperature control loop", scada_focus: "Combine FE calc with SCADA control", integration_task: "Submit report snapshot" },
    ]
  },
  {
    week: 6,
    theme: "Fluid Mechanics & Instrumentation",
    goal: "Measure and control fluids.",
    daily_goals: [
      { day: "Mon", fe_focus: "Bernoulli & Continuity", scada_focus: "Flow transmitters", integration_task: "Compute flow vs signal output" },
      { day: "Tue", fe_focus: "Head Loss (Darcy-Weisbach)", scada_focus: "Level transmitters", integration_task: "Draw tank level signal diagram" },
      { day: "Wed", fe_focus: "Pumps & Turbines", scada_focus: "HART protocol basics", integration_task: "Configure device address" },
      { day: "Thu", fe_focus: "30 Qs (Fluids)", scada_focus: "Modbus Registers", integration_task: "Read/write test values" },
      { day: "Fri", fe_focus: "Mixed set (40 Qs)", scada_focus: "Troubleshoot signal loss", integration_task: "Root cause log" },
      { day: "Sat/Sun", fe_focus: "Review + flashcards", scada_focus: "Build small flow loop simulation", integration_task: "Add trending display" },
    ]
  },
  {
    week: 7,
    theme: "Data Acquisition & Networking",
    goal: "Move data from sensor to dashboard.",
    daily_goals: [
      { day: "Mon", fe_focus: "Probability Review", scada_focus: "DAQ basics", integration_task: "Map signal to database table" },
      { day: "Tue", fe_focus: "Stats for measurement error", scada_focus: "OPC UA & MQTT", integration_task: "Compare protocols" },
      { day: "Wed", fe_focus: "Numerical methods recap", scada_focus: "Historian logging", integration_task: "Configure data tags" },
      { day: "Thu", fe_focus: "20 Qs (Mixed)", scada_focus: "Network topology (DMZ, LAN)", integration_task: "Draw SCADA network" },
      { day: "Fri", fe_focus: "Review + mock", scada_focus: "Cybersecurity zones", integration_task: "Mark trust boundaries" },
      { day: "Sat/Sun", fe_focus: "Flashcards + P&ID review", scada_focus: "Simulate sensor→PLC→HMI", integration_task: "Document data path" },
    ]
  },
  {
    week: 8,
    theme: "Cybersecurity & Reliability",
    goal: "Design safe, robust systems.",
    daily_goals: [
      { day: "Mon", fe_focus: "Safety factors & Reliability", scada_focus: "Redundancy design", integration_task: "Dual server layout" },
      { day: "Tue", fe_focus: "Risk analysis methods", scada_focus: "Alarm management", integration_task: "Priority levels" },
      { day: "Wed", fe_focus: "Ethics case study", scada_focus: "Firewall rules & zones", integration_task: "Draw secure architecture" },
      { day: "Thu", fe_focus: "30 Qs (Ethics/Reliability)", scada_focus: "Event logging", integration_task: "Interpret audit log" },
      { day: "Fri", fe_focus: "Review session", scada_focus: "Back-up & restore testing", integration_task: "Verify data recovery" },
      { day: "Sat/Sun", fe_focus: "Recap all security concepts", scada_focus: "Harden network config practice", integration_task: "Write 2-page reflection" },
    ]
  },
  {
    week: 9,
    theme: "Integration Project",
    goal: "Combine FE theory + SCADA skills into one system.",
    daily_goals: [
      { day: "Mon", task: "Choose scenario (Water plant / HVAC / Pipeline)" },
      { day: "Tue", task: "Draw P&ID with sensors and actuators" },
      { day: "Wed", task: "Write PLC logic for main loop" },
      { day: "Thu", task: "Build HMI screens and alarms" },
      { day: "Fri", task: "Test data flow and simulate process" },
      { day: "Sat", task: "Record results + screenshots" },
      { day: "Sun", task: "Write technical summary report (2 pages)" },
    ]
  },
  {
    week: 10,
    theme: "Exam & Career Preparation",
    goal: "Certification and real-world readiness.",
    daily_goals: [
      { day: "Mon", focus: "FE mock exam #1", deliverable: "Score & analyze weak topics" },
      { day: "Tue", focus: "SCADA mock interview questions", deliverable: "Prepare 3 STAR stories" },
      { day: "Wed", focus: "FE mock exam #2", deliverable: "Review formula lookup times" },
      { day: "Thu", focus: "Resume & Portfolio update", deliverable: "Add project screenshots" },
      { day: "Fri", focus: "LinkedIn profile optimization", deliverable: "Write project summary" },
      { day: "Sat", focus: "Final review + rest", deliverable: "Light flashcard check" },
      { day: "Sun", focus: "Exam readiness checklist", deliverable: "Sleep + relaxation routine" },
    ]
  },
];

export const DAILY_PLAN_TEMPLATE = {
  learn: {
    time: "30-40 min",
    text: "THIEVES + KWL + summary",
  },
  apply: {
    time: "60-90 min",
    text: "FE problem set (20–40 Qs) + SCADA build/test",
  },
  reinforce: {
    time: "30 min",
    text: "Flashcards + error log + diagram from memory",
  },
};