import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, AlertTriangle, Info, ShieldCheck, BarChart3, Map, Briefcase, Download, Loader2, Presentation } from 'lucide-react';

type Tab = 'accounting' | 'compliance' | 'financial' | 'roadmap' | 'proposal';

interface Issue {
  id: string;
  severity: 'CRIT' | 'HIGH' | 'MED';
  title: string;
  meta: string;
  description: string;
  solutions: string[];
}

const accountingIssues: Issue[] = [
  {
    id: 'a1',
    severity: 'CRIT',
    title: 'Revenue Recognition under IFRS 15',
    meta: 'Multi-element IT arrangements · SaaS · Implementation fees · Licenses',
    description: 'IT companies bundle software licenses, implementation, maintenance, and SaaS subscriptions into complex contracts. Under IFRS 15, each performance obligation must be identified and revenue allocated using standalone selling prices (SSP). Many Saudi IT firms either recognize revenue upfront or spread incorrectly, creating material misstatements and SOCPA audit qualifications.',
    solutions: [
      'Implement a 5-step IFRS 15 contract review process for all IT arrangements above SAR 50K',
      'Establish an SSP matrix for each product/service line (SaaS, licensing, implementation, support)',
      'Deploy NetSuite / Oracle Cloud with IFRS 15 revenue recognition automation modules',
      'Create deferred revenue waterfall schedules reviewed monthly by finance team'
    ]
  },
  {
    id: 'a2',
    severity: 'CRIT',
    title: 'Cost Capitalisation vs. Expensing (IAS 38)',
    meta: 'In-house software development · R&D costs · Agile environments',
    description: 'IT companies frequently misclassify software development costs — either expensing capitalisable assets (inflating costs, deflating profit) or capitalising all dev costs including research phase (overstating assets). ZATCA and SOCPA auditors specifically scrutinise this area, especially for GOSI-registered tech employees.',
    solutions: [
      'Implement a Capitalisation Policy with clear "research phase" vs "development phase" criteria aligned to IAS 38 paras 21–23',
      'Use project-tracking tools (Jira/Azure DevOps) linked to timesheets to split capitalizable vs opex hours',
      'Establish an intangible asset register with amortisation schedules (typically 3–5 years)',
      'Quarterly impairment testing protocol for internal-use software'
    ]
  },
  {
    id: 'a3',
    severity: 'HIGH',
    title: 'Multi-Currency & FX Exposure',
    meta: 'USD billings · EUR vendor payments · SAR reporting',
    description: 'Most Saudi IT companies invoice government/semi-government clients in SAR but procure global cloud services (AWS, Azure, Microsoft 365) in USD/EUR. FX translation under IAS 21 is frequently misapplied — particularly spot rate vs closing rate treatment, and recycling of foreign currency gains/losses through OCI vs P&L.',
    solutions: [
      'Implement an FX policy: designate functional currency (SAR), document monetary vs non-monetary items',
      'Monthly FX revaluation of foreign-currency denominated payables with journal entries',
      'Evaluate natural hedging opportunities (match USD revenues with USD cloud costs)',
      'Set up bank accounts in USD for pass-through FX to avoid unnecessary conversion losses'
    ]
  },
  {
    id: 'a4',
    severity: 'HIGH',
    title: 'Related Party Transactions & Transfer Pricing',
    meta: 'Group structures · Intercompany licensing · Management fees',
    description: 'Many Saudi IT companies are subsidiaries of larger groups or have related-party arrangements for IP licensing, shared services, or technical support from parent entities. ZATCA has significantly intensified transfer pricing scrutiny since 2021. IAS 24 disclosures are frequently incomplete or non-existent.',
    solutions: [
      'Prepare ZATCA-compliant Transfer Pricing documentation (Master File + Local File)',
      'Benchmark intercompany transactions using comparability analysis (OECD guidelines)',
      'Document all related party transactions in board minutes and statutory accounts',
      'Implement arm\'s-length pricing reviews annually with external TP advisors'
    ]
  },
  {
    id: 'a5',
    severity: 'MED',
    title: 'Lease Accounting (IFRS 16)',
    meta: 'Office leases · Data centre co-location · Equipment rentals',
    description: 'IFRS 16 requires all leases >12 months to be recognised on-balance sheet as right-of-use assets. IT companies often lease office space in premium business districts, co-location facilities, and IT equipment — frequently kept off-balance sheet. SOCPA-registered auditors flag this as a high-risk area for Saudi IT firms.',
    solutions: [
      'Conduct a full lease inventory and apply low-value and short-term exemptions correctly',
      'Calculate right-of-use assets and lease liabilities using incremental borrowing rate (IBR) from Saudi banks',
      'Use lease accounting software (e.g. CoStar, LeaseAccelerator, or ERP modules) for automated amortisation'
    ]
  }
];

const financialIssues: Issue[] = [
  {
    id: 'f1',
    severity: 'CRIT',
    title: 'Government Contract Cash Flow & Receivables',
    meta: 'MONSHA\'AT · Aramco · NEOM · Government tender projects',
    description: 'Saudi government and semi-government entities (Saudi Aramco, SEC, MOH, NEOM) represent a large proportion of IT revenues but are notoriously slow payers — often 90–180 days. Performance bonds and retention holdbacks (typically 5–10%) further strain cash flow. IT companies often lack a formal credit control and escalation process for government receivables.',
    solutions: [
      'Build a government receivables ageing dashboard with automated escalation at 60/90/120 days',
      'Negotiate advance payments (10–30%) and milestone billing structures in all new government contracts',
      'Use SAMA-regulated invoice discounting / factoring facilities (Al Rajhi, SNB, Riyad Bank)',
      'Model retention release timelines into cash flow forecasts; apply AAOIFI standards if Islamic finance used'
    ]
  },
  {
    id: 'f2',
    severity: 'CRIT',
    title: 'Working Capital & Liquidity Management',
    meta: 'Payroll · Cloud costs · License renewals · Seasonal projects',
    description: 'IT companies face a structural mismatch: cloud infrastructure costs (AWS/Azure) are charged monthly in advance, while government clients pay quarterly in arrears. Combined with monthly payroll (GOSI + WPS compliance), this creates recurring liquidity gaps of 30–60 days that are rarely modelled or managed proactively. WPS (Wage Protection System) failures risk immediate visa bans.',
    solutions: [
      'Implement a 13-week rolling cash flow forecast model updated weekly',
      'Establish a SAR 500K–2M revolving credit facility with a Saudi commercial bank for WC smoothing',
      'Negotiate annual payment plans with AWS/Azure (3–5% discount + improved cash terms)',
      'Create a WPS funding reserve (2× monthly payroll) as a non-negotiable cash buffer'
    ]
  },
  {
    id: 'f3',
    severity: 'HIGH',
    title: 'Budget & Financial Planning (FP&A Maturity)',
    meta: 'No formal FP&A · Spreadsheet-driven · No scenario models',
    description: 'Most sub-scale Saudi IT companies lack formal Financial Planning & Analysis (FP&A) processes. Annual budgets (when they exist) are static and not linked to operational KPIs. Revenue forecasts ignore pipeline weighted probability, and cost models do not capture headcount-driven growth. This makes it impossible to present credible plans to banks, investors, or KACST/MCIT for grant funding.',
    solutions: [
      'Build a driver-based financial model (revenue per project, cost per FTE, utilisation rates)',
      'Implement quarterly re-forecasting (rolling 4-quarter forecast to replace static annual budget)',
      'Set up a monthly management accounts pack (P&L, BS, CF, KPIs) delivered by the 10th working day',
      'Use Power BI / Tableau connected to ERP for real-time financial dashboards for leadership'
    ]
  },
  {
    id: 'f4',
    severity: 'HIGH',
    title: 'Project Profitability Tracking',
    meta: 'Contract costing · Resource utilisation · Margin leakage',
    description: 'IT project contracts are priced at 20–30% gross margins, but actual margins are routinely eroded to 5–10% due to scope creep, untracked employee overtime, and cloud cost overruns. Without project-level P&L accounts, management cannot identify which clients and projects are destroying value. Time-and-material contracts are especially vulnerable.',
    solutions: [
      'Implement project accounting in ERP (NetSuite, SAP B1, or Microsoft Dynamics) — cost centres per project',
      'Monthly project profitability reports to CEO/PM — flag any project below 15% gross margin',
      'Build a project pricing model including GOSI, overhead allocation, and cloud cost attribution',
      'Define contract change order (variation order) approval process to capture scope changes commercially'
    ]
  },
  {
    id: 'f5',
    severity: 'MED',
    title: 'Investor Readiness & MCIT/KACST Grant Management',
    meta: 'Vision 2030 funding · Monsha\'at · MCIT programmes',
    description: 'Saudi Arabia\'s Vision 2030 technology agenda has created substantial grant and incentive programmes (MCIT Digital Economy Fund, KACST innovation grants, Monsha\'at SME support). IT companies frequently miss these opportunities due to lack of audit-ready financial statements, inadequate grant management processes, or failure to meet Saudisation ratios required for eligibility.',
    solutions: [
      'Maintain IFRS-compliant audited financials — prerequisite for most grant applications',
      'Appoint a dedicated grants manager or assign vCFO to monitor Vision 2030 incentive programmes',
      'Structure R&D spending to qualify for KACST / MCIT R&D tax incentives',
      'Build an investor-ready data room: cap table, 3-year financials, pipeline, team bios, compliance certificates'
    ]
  }
];

const roadmap = [
  {
    phase: 'Days 1–30 · Triage & Stabilise',
    title: 'Critical Compliance & Accounting Remediation',
    items: [
      'ZATCA VAT audit & FATOORAH integration',
      'Withholding tax register setup',
      'GOSI reconciliation',
      'Revenue recognition policy (IFRS 15)',
      'WPS funding buffer established',
      'Lease liability schedule (IFRS 16)'
    ]
  },
  {
    phase: 'Days 31–60 · Build Foundation',
    title: 'Financial Reporting & Systems Infrastructure',
    items: [
      'ERP evaluation & deployment plan',
      'Monthly management accounts pack',
      '13-week cash flow model',
      'Project profitability tracking',
      'Transfer pricing documentation',
      'Zakat base computation',
      'IAS 38 capitalisation policy'
    ]
  },
  {
    phase: 'Days 61–90 · Strategic Positioning',
    title: 'Growth, Governance & Investor Readiness',
    items: [
      'Driver-based financial model',
      'Banking relationships & credit facilities',
      'MCIT/KACST grant applications',
      'Nitaqat compliance programme',
      'PDPL gap assessment',
      'Board-level financial KPI dashboard',
      'Investor data room preparation'
    ]
  },
  {
    phase: 'Ongoing · Steady State',
    title: 'Continuous vCFO Oversight',
    items: [
      'Monthly management accounts',
      'Quarterly ZATCA VAT filing',
      'Annual Zakat & CIT filing',
      'Board reporting package',
      'Audit liaison & SOCPA support',
      'Budget & reforecast cycles'
    ],
    isSteady: true
  }
];

const complianceData = [
  {
    area: 'VAT (ZATCA)',
    sub: '15% Standard Rate',
    issue: 'Incorrect VAT treatment on international software/SaaS (reverse charge mechanism misapplied); wrong zero-rating for exported services',
    status: 'CRITICAL',
    penalty: 'Up to 100% of unpaid VAT + penalties',
    solution: 'Engage a ZATCA-registered tax agent; implement B2B zero-rating flowchart for export services'
  },
  {
    area: 'Zakat',
    sub: 'For Saudi shareholders',
    issue: 'Zakat base calculation errors; failure to adjust for deductible liabilities; incorrect treatment of accumulated losses',
    status: 'CRITICAL',
    penalty: '2.5% of Zakat base + surcharges',
    solution: 'Annual Zakat base computation with a specialist; file within 120 days of year-end'
  },
  {
    area: 'Withholding Tax',
    sub: '5–20% rates',
    issue: 'IT companies paying foreign vendors (AWS, Microsoft, consultants) fail to deduct and remit WHT. Especially on royalties (15%) and technical services (5–20%)',
    status: 'CRITICAL',
    penalty: 'Liable for tax + 1% p.m. penalty',
    solution: 'WHT register for all foreign payments; apply double-tax treaties (DTT) where applicable'
  },
  {
    area: 'FATOORAH e-Invoicing',
    sub: 'Phase 2: Integration',
    issue: 'ERP/billing systems not integrated with ZATCA Fatoorah API; manual invoice uploads; Phase 2 clearance failures',
    status: 'CRITICAL',
    penalty: 'SAR 10,000–40,000 per violation',
    solution: 'Implement FATOORAH-compliant billing software (Zoho, SAP B1, Odoo ZATCA module); API integration testing'
  },
  {
    area: 'Corporate Income Tax',
    sub: '20% on foreign ownership',
    issue: 'Incorrect split of Zakat vs. CIT for mixed-ownership structures; missed deductions for R&D, training, and tech investment',
    status: 'HIGH',
    penalty: '20% CIT on net profits + 25% markup',
    solution: 'Annual tax computation with ownership structure analysis; claim Vision 2030 R&D incentives'
  },
  {
    area: 'GOSI',
    sub: 'Social Insurance',
    issue: 'Incorrect GOSI contributions (Saudi vs. expat rates); misclassification of tech contractors as employees or vice versa',
    status: 'HIGH',
    penalty: 'GOSI arrears + fines + criminal liability',
    solution: 'Monthly GOSI reconciliation; proper employment contract classification; HRMS integration with GOSI portal'
  },
  {
    area: 'Nitaqat / Saudisation',
    sub: 'IT sector: ~20–30%',
    issue: 'Failure to meet Saudisation quotas in IT sector; "ghost employee" risks; reliance on visa workers for technical roles',
    status: 'HIGH',
    penalty: 'Work visa bans, operating licence suspension',
    solution: 'Nitaqat tracking dashboard; Saudi tech talent pipeline (TUSDEER, HRDF co-funding); graduate programmes'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('accounting');
  const [openIssueId, setOpenIssueId] = useState<string | null>('a1');

  const toggleIssue = (id: string) => {
    setOpenIssueId(openIssueId === id ? null : id);
  };

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingPPTX, setIsGeneratingPPTX] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    // Primary method: window.print()
    // This is the most reliable way to get a high-quality PDF in the browser
    // The @media print styles in index.css will handle the deck formatting
    window.print();
  };

  const handleDownloadPPTX = async () => {
    setIsGeneratingPPTX(true);
    try {
      const PptxGenJS = (await import('pptxgenjs')).default;
      const pptx = new PptxGenJS();

      // Set Layout to 16:9 (Native for Google Slides)
      pptx.layout = 'LAYOUT_16x9';

      // Set Presentation Properties
      pptx.title = "vCFO Saudi IT Proposal";
      pptx.subject = "Strategic Financial Advisory";
      pptx.author = "Strategic Financial Advisory Services";

      // Define Theme Colors
      const NAVY = "0A1628";
      const GOLD = "C9A84C";
      const CREAM = "FAF7F0";
      const WHITE = "FFFFFF";

      // 1. Cover Page
      let slide = pptx.addSlide();
      slide.background = { color: NAVY };
      slide.addText("Confidential | Strategic Advisory", { x: 0.5, y: 0.5, w: "90%", fontSize: 10, color: GOLD, charSpacing: 3 });
      slide.addText("Virtual CFO Proposal\nfor IT Companies in KSA", { 
        x: 0.5, y: 2.0, w: "90%", h: 2.0, 
        fontSize: 44, fontFace: "Georgia", bold: true, color: WHITE, 
        align: "left" 
      });
      slide.addText("Accounting · Compliance · Financial Management · VAT · Zakat · Vision 2030", { 
        x: 0.5, y: 4.0, w: "90%", fontSize: 18, color: "A0A0A0", fontFace: "Arial" 
      });
      slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 5.0, w: 3.5, h: 0.5, fill: { color: GOLD, transparency: 80 }, line: { color: GOLD, width: 1 } });
      slide.addText("BIG 4 + McKINSEY FRAMEWORK", { x: 0.6, y: 5.1, w: 3.3, fontSize: 12, color: GOLD, bold: true });

      // 2-6. Accounting Issues & Solutions (5 Slides)
      accountingIssues.forEach((issue, idx) => {
        let s = pptx.addSlide();
        s.background = { color: CREAM };
        s.addText(`Accounting Issue ${idx + 1}: ${issue.title}`, { x: 0.5, y: 0.5, w: "90%", fontSize: 24, fontFace: "Georgia", bold: true, color: NAVY });
        s.addText(issue.meta, { x: 0.5, y: 1.0, w: "90%", fontSize: 12, italic: true, color: "5A5A7A" });
        s.addText(issue.description, { x: 0.5, y: 1.5, w: "90%", fontSize: 14, color: "333333" });
        
        s.addShape(pptx.ShapeType.rect, { x: 0.5, y: 2.5, w: "90%", h: 2.5, fill: { color: "E8F5EE" }, line: { color: "1A6B3C", width: 2 } });
        s.addText("STRATEGIC SOLUTIONS", { x: 0.7, y: 2.7, w: "80%", fontSize: 12, bold: true, color: "1A6B3C" });
        issue.solutions.forEach((sol, sIdx) => {
          s.addText(`• ${sol}`, { x: 0.7, y: 3.1 + (sIdx * 0.4), w: "80%", fontSize: 12, color: "1A4A2E" });
        });
      });

      // 7. Compliance (1 Slide)
      let compSlide = pptx.addSlide();
      compSlide.background = { color: CREAM };
      compSlide.addText("Regulatory & Tax Compliance", { x: 0.5, y: 0.5, w: "90%", fontSize: 28, fontFace: "Georgia", bold: true, color: NAVY });
      
      const tableHeaderOptions = { bold: true, fill: { color: "F0EBE0" }, color: NAVY, align: "center" as const };
      const tableCellOptions = { color: "333333", fontSize: 10 };
      const tablePenaltyOptions = { color: "8B1A1A", bold: true, fontSize: 10 };

      const rows: any[] = [
        [
          { text: "Compliance Area", options: tableHeaderOptions },
          { text: "Critical Issue", options: tableHeaderOptions },
          { text: "Penalty Risk", options: tableHeaderOptions }
        ]
      ];

      complianceData.forEach(row => {
        rows.push([
          { text: row.area, options: { ...tableCellOptions, bold: true } },
          { text: row.issue, options: tableCellOptions },
          { text: row.penalty, options: tablePenaltyOptions }
        ]);
      });

      compSlide.addTable(rows, { x: 0.5, y: 1.5, w: 9.0, border: { type: "solid", color: "E0D8C8" } });

      // 8-13. Financial Management (6 Slides)
      financialIssues.forEach((issue, idx) => {
        let s = pptx.addSlide();
        s.background = { color: CREAM };
        s.addText(`Financial Management Issue ${idx + 1}: ${issue.title}`, { x: 0.5, y: 0.5, w: "90%", fontSize: 24, fontFace: "Georgia", bold: true, color: NAVY });
        s.addText(issue.description, { x: 0.5, y: 1.5, w: "90%", fontSize: 16, color: "333333" });
        
        s.addShape(pptx.ShapeType.rect, { x: 0.5, y: 3.0, w: "90%", h: 2.0, fill: { color: WHITE }, line: { color: GOLD, width: 1 } });
        s.addText("RECOMMENDED ACTIONS", { x: 0.7, y: 3.2, w: "80%", fontSize: 12, bold: true, color: NAVY });
        issue.solutions.forEach((sol, sIdx) => {
          s.addText(`• ${sol}`, { x: 0.7, y: 3.6 + (sIdx * 0.4), w: "80%", fontSize: 12, color: "5A5A7A" });
        });
      });

      // 14. Roadmap (1 Slide)
      let roadSlide = pptx.addSlide();
      roadSlide.background = { color: CREAM };
      roadSlide.addText("90-Day Implementation Roadmap", { x: 0.5, y: 0.5, w: "90%", fontSize: 28, fontFace: "Georgia", bold: true, color: NAVY });
      
      const roadmapItems = [
        { day: "Day 1-30", title: "Assessment & Foundation", desc: "Diagnostic review, ZATCA integration audit, and compliance gap analysis." },
        { day: "Day 31-60", title: "Optimization & Control", desc: "Cash flow modeling, internal controls implementation, and IFRS alignment." },
        { day: "Day 61-90", title: "Strategic Advisory", desc: "Budgeting, strategic planning, and ongoing vCFO performance management." }
      ];

      roadmapItems.forEach((item, idx) => {
        roadSlide.addShape(pptx.ShapeType.rect, { x: 0.5 + (idx * 3.1), y: 1.5, w: 3.0, h: 3.5, fill: { color: WHITE }, line: { color: GOLD, width: 1 } });
        roadSlide.addText(item.day, { x: 0.6 + (idx * 3.1), y: 1.7, w: 2.8, fontSize: 14, bold: true, color: GOLD });
        roadSlide.addText(item.title, { x: 0.6 + (idx * 3.1), y: 2.1, w: 2.8, fontSize: 16, bold: true, color: NAVY });
        roadSlide.addText(item.desc, { x: 0.6 + (idx * 3.1), y: 2.7, w: 2.8, fontSize: 12, color: "5A5A7A" });
      });

      // 15. vCFO Scope (1 Slide)
      let scopeSlide = pptx.addSlide();
      scopeSlide.background = { color: NAVY };
      scopeSlide.addText("vCFO Engagement Scope", { x: 0.5, y: 0.5, w: "90%", fontSize: 32, fontFace: "Georgia", bold: true, color: GOLD });
      
      const scopeItems = [
        { title: "Compliance & Tax", desc: "VAT, Zakat, WHT, GOSI, Nitaqat, PDPL, FATOORAH." },
        { title: "Financial Reporting", desc: "IFRS monthly accounts, board packs, annual statements." },
        { title: "Financial Planning", desc: "Annual budget, rolling forecasts, 3-year strategic model." },
        { title: "Strategic Finance", desc: "Fundraising, grant management, Vision 2030 alignment." }
      ];

      scopeItems.forEach((item, idx) => {
        let xPos = idx < 2 ? 0.5 : 5.2;
        let yPos = idx % 2 === 0 ? 1.5 : 3.5;
        scopeSlide.addText(item.title, { x: xPos, y: yPos, w: 4.5, fontSize: 20, bold: true, color: GOLD });
        scopeSlide.addText(item.desc, { x: xPos, y: yPos + 0.5, w: 4.5, fontSize: 14, color: "D0D0D0" });
      });

      scopeSlide.addText('"Big 4 technical rigour with McKinsey strategic insight"', { 
        x: 0.5, y: 6.0, w: "90%", fontSize: 18, italic: true, color: GOLD, align: "center" 
      });

      // 16. Engagement Models & Pricing (New Slide)
      let pricingSlide = pptx.addSlide();
      pricingSlide.background = { color: CREAM };
      pricingSlide.addText("Engagement Models & Pricing", { x: 0.5, y: 0.5, w: "90%", fontSize: 28, fontFace: "Georgia", bold: true, color: NAVY });
      
      const pricingHeaderOptions = { bold: true, fill: { color: "F0EBE0" }, color: NAVY, align: "center" as const, fontSize: 10 };
      const pricingCellOptions = { color: "333333", fontSize: 10, valign: "middle" as const };

      const pricingRows: any[] = [
        [
          { text: "ENGAGEMENT MODEL", options: pricingHeaderOptions },
          { text: "HOURS/MONTH", options: pricingHeaderOptions },
          { text: "BEST FOR", options: pricingHeaderOptions },
          { text: "EST. MONTHLY FEE", options: pricingHeaderOptions }
        ],
        [
          { text: "Essentials\n(Compliance-focused)", options: { ...pricingCellOptions, bold: true } },
          { text: "20–30 hrs", options: pricingCellOptions },
          { text: "Early-stage IT companies (SAR 5–20M revenue)", options: pricingCellOptions },
          { text: "SAR 8,000–15,000", options: { ...pricingCellOptions, bold: true, align: "right" } }
        ],
        [
          { text: "Growth\n(Full vCFO function)", options: { ...pricingCellOptions, bold: true } },
          { text: "40–60 hrs", options: pricingCellOptions },
          { text: "Growing IT firms (SAR 20–100M revenue)", options: pricingCellOptions },
          { text: "SAR 18,000–35,000", options: { ...pricingCellOptions, bold: true, align: "right" } }
        ],
        [
          { text: "Strategic\n(Investor/IPO ready)", options: { ...pricingCellOptions, bold: true } },
          { text: "80–100 hrs", options: pricingCellOptions },
          { text: "Scale-up IT companies (SAR 100M+ or pre-Series A)", options: pricingCellOptions },
          { text: "SAR 40,000–70,000", options: { ...pricingCellOptions, bold: true, align: "right" } }
        ]
      ];

      pricingSlide.addTable(pricingRows, { x: 0.5, y: 1.5, w: 9.0, border: { type: "solid", color: "E0D8C8" } });

      // 17. Why vCFO Summary (New Slide)
      let whySlide = pptx.addSlide();
      whySlide.background = { color: CREAM };
      
      whySlide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 2.0, w: 9.0, h: 3.5, fill: { color: "F0EBE0" }, line: { color: GOLD, width: 1 } });
      
      whySlide.addText("Why a vCFO beats hiring in-house for Saudi IT companies:", { 
        x: 0.7, y: 2.3, w: 8.6, fontSize: 18, bold: true, color: NAVY 
      });
      
      whySlide.addText(
        "Access to Big 4-trained tax specialists, IFRS experts, and banking advisors across all compliance areas. " +
        "Deep knowledge of Saudi-specific regulations (ZATCA, GOSI, SAMA, NDMO) combined with global best practices. " +
        "Scalable — increases hours during audit season, reduces in quiet periods. " +
        "No recruitment risk, GOSI contributions, or housing allowance obligations.",
        { x: 0.7, y: 3.0, w: 8.6, fontSize: 14, color: "5A5A7A", lineSpacing: 24 }
      );

      pptx.writeFile({ fileName: "vCFO_Saudi_IT_Proposal_Deck.pptx" });
    } catch (error) {
      console.error('PPTX generation failed:', error);
    } finally {
      setIsGeneratingPPTX(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream font-sans text-text-saudi">
      {/* Hidden PDF Content - Optimized for Capture & Print */}
      <div 
        className="print-only pointer-events-none absolute top-0 left-0 -z-50 opacity-0 overflow-hidden" 
        ref={pdfRef}
        aria-hidden="true"
      >
        <div className="pdf-slide flex h-[297mm] w-[210mm] flex-col justify-center bg-navy p-20 text-white">
          <p className="mb-6 text-xs font-medium tracking-[4px] uppercase text-gold">Confidential | Strategic Advisory</p>
          <h1 className="mb-4 font-serif text-5xl font-bold leading-tight">Virtual <span className="text-gold">CFO</span> Proposal<br />for IT Companies in KSA</h1>
          <p className="mb-12 text-xl font-light text-white/65">Accounting · Compliance · Financial Management · VAT · Zakat · Vision 2030</p>
          <div className="flex gap-6">
            <div className="rounded-lg border border-gold/30 bg-gold/12 px-6 py-3 text-sm tracking-wider text-gold-light">BIG 4 + McKINSEY FRAMEWORK</div>
            <div className="rounded-lg border border-gold/30 bg-gold/12 px-6 py-3 text-sm tracking-wider text-gold-light">SAUDI ARABIA 2025</div>
          </div>
          <div className="mt-20 text-[10px] text-white/30 uppercase tracking-widest">© 2025 Strategic Financial Advisory Services</div>
        </div>

        <div className="pdf-slide h-[297mm] w-[210mm] bg-cream p-16">
          <h2 className="mb-8 font-serif text-3xl font-bold text-navy border-b border-border-saudi pb-4">Accounting Issues & Solutions</h2>
          <div className="space-y-6">
            {accountingIssues.map(issue => (
              <div key={issue.id} className="rounded-xl border border-border-saudi bg-white p-6 shadow-sm">
                <div className="mb-1 text-base font-bold text-navy">{issue.title}</div>
                <div className="mb-3 text-xs text-text-muted italic">{issue.meta}</div>
                <p className="mb-4 text-sm text-text-muted leading-relaxed">{issue.description}</p>
                <div className="rounded-r-lg border-l-4 border-green-saudi bg-green-light p-4">
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-green-saudi">Strategic Solutions</div>
                  <ul className="space-y-1 text-xs text-[#1A4A2E]">
                    {issue.solutions.slice(0, 4).map((s, idx) => <li key={idx} className="flex gap-2"><span>•</span> {s}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pdf-slide h-[297mm] w-[210mm] bg-cream p-16">
          <h2 className="mb-8 font-serif text-3xl font-bold text-navy border-b border-border-saudi pb-4">Regulatory & Tax Compliance</h2>
          <div className="mb-6 rounded-lg border border-red-saudi/20 bg-red-light p-4 text-xs text-red-saudi">
            <p className="font-bold">ZATCA FATOORAH Phase 2 Alert:</p>
            <p>Mandatory real-time integration required for all IT B2B transactions. Non-compliance risks significant financial penalties and operational suspension.</p>
          </div>
          <div className="overflow-hidden rounded-xl border border-border-saudi bg-white shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-mid">
                <tr>
                  <th className="p-4 font-bold uppercase tracking-wider">Compliance Area</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Critical Issue</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Penalty Risk</th>
                </tr>
              </thead>
              <tbody>
                {complianceData.map((row, i) => (
                  <tr key={i} className="border-t border-border-saudi">
                    <td className="p-4 font-bold text-navy">{row.area}</td>
                    <td className="p-4 leading-relaxed">{row.issue}</td>
                    <td className="p-4 font-semibold text-red-saudi">{row.penalty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pdf-slide h-[297mm] w-[210mm] bg-cream p-16">
          <h2 className="mb-8 font-serif text-3xl font-bold text-navy border-b border-border-saudi pb-4">Financial Management Strategy</h2>
          <div className="mb-10 grid grid-cols-2 gap-6">
            <div className="rounded-xl border border-border-saudi bg-white p-8 shadow-sm">
              <div className="text-4xl font-bold text-navy mb-2">90–180</div>
              <div className="text-xs font-bold text-text-muted uppercase tracking-widest">Days Gov Payment Cycle</div>
              <p className="mt-4 text-xs text-red-saudi">Severe working capital pressure requires proactive liquidity modeling.</p>
            </div>
            <div className="rounded-xl border border-border-saudi bg-white p-8 shadow-sm">
              <div className="text-4xl font-bold text-navy mb-2">15%</div>
              <div className="text-xs font-bold text-text-muted uppercase tracking-widest">VAT Cash Impact</div>
              <p className="mt-4 text-xs text-red-saudi">Monthly VAT outflows create recurring cash drains on B2B IT billing.</p>
            </div>
          </div>
          <div className="space-y-6">
            {financialIssues.slice(0, 3).map(issue => (
              <div key={issue.id} className="rounded-xl border border-border-saudi bg-white p-6 shadow-sm">
                <div className="text-base font-bold text-navy mb-2">{issue.title}</div>
                <p className="text-sm text-text-muted leading-relaxed">{issue.description}</p>
                <div className="mt-4 flex gap-2">
                  {issue.solutions.slice(0, 2).map((s, idx) => (
                    <div key={idx} className="rounded bg-navy/5 px-3 py-1.5 text-[10px] text-navy font-medium">
                      {s.split(' ').slice(0, 5).join(' ')}...
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pdf-slide flex h-[297mm] w-[210mm] flex-col justify-center bg-navy p-20 text-white">
          <h2 className="mb-10 font-serif text-4xl font-bold text-gold-light">vCFO Engagement Scope</h2>
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <div className="mb-2 text-lg font-bold text-gold">Compliance & Tax</div>
                <p className="text-sm leading-relaxed text-white/70">ZATCA VAT, Zakat/CIT, WHT, GOSI, Nitaqat, PDPL, FATOORAH. Full regulatory oversight.</p>
              </div>
              <div>
                <div className="mb-2 text-lg font-bold text-gold">Financial Reporting</div>
                <p className="text-sm leading-relaxed text-white/70">IFRS-compliant monthly accounts, board packs, annual statements, and audit liaison.</p>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <div className="mb-2 text-lg font-bold text-gold">Financial Planning</div>
                <p className="text-sm leading-relaxed text-white/70">Annual budget, rolling forecasts, 3-year strategic model, and scenario analysis.</p>
              </div>
              <div>
                <div className="mb-2 text-lg font-bold text-gold">Strategic Finance</div>
                <p className="text-sm leading-relaxed text-white/70">Fundraising support, grant management (MCIT/KACST), and Vision 2030 alignment.</p>
              </div>
            </div>
          </div>
          <div className="mt-20 rounded-xl border border-gold/30 bg-gold/5 p-8 text-center">
            <p className="text-lg italic text-gold-light">"Big 4 technical rigour with McKinsey strategic insight"</p>
            <p className="mt-4 text-xs tracking-widest uppercase text-gold/60">Contact for Custom Engagement Plan</p>
          </div>
        </div>

        <div className="pdf-slide h-[297mm] w-[210mm] bg-cream p-16">
          <h2 className="mb-8 font-serif text-3xl font-bold text-navy border-b border-border-saudi pb-4">Implementation Roadmap</h2>
          <div className="space-y-8">
            {roadmap.map((phase, i) => (
              <div key={i} className="relative pl-12 border-l-2 border-gold/30 pb-4 last:pb-0">
                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-gold shadow-sm" />
                <div className="mb-1 text-sm font-bold text-navy uppercase tracking-wider">{phase.phase}</div>
                <div className="mb-2 text-xs font-semibold text-gold">{phase.title}</div>
                <ul className="space-y-1 text-[10px] text-text-muted">
                  {phase.items.slice(0, 5).map((item, idx) => <li key={idx}>• {item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="pdf-slide h-[297mm] w-[210mm] bg-cream p-16">
          <h2 className="mb-8 font-serif text-3xl font-bold text-navy border-b border-border-saudi pb-4">Engagement Models & Pricing</h2>
          <div className="overflow-hidden rounded-xl border border-border-saudi bg-white shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-mid">
                <tr>
                  <th className="p-4 font-bold uppercase tracking-wider">Engagement Model</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Hours/Month</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Best For</th>
                  <th className="p-4 font-bold uppercase tracking-wider text-right">Est. Monthly Fee</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border-saudi">
                  <td className="p-4 font-bold text-navy">Essentials<br/><span className="text-[10px] font-normal text-text-muted">Compliance-focused</span></td>
                  <td className="p-4">20–30 hrs</td>
                  <td className="p-4">Early-stage IT companies (SAR 5–20M revenue)</td>
                  <td className="p-4 font-bold text-right">SAR 8,000–15,000</td>
                </tr>
                <tr className="border-t border-border-saudi">
                  <td className="p-4 font-bold text-navy">Growth<br/><span className="text-[10px] font-normal text-text-muted">Full vCFO function</span></td>
                  <td className="p-4">40–60 hrs</td>
                  <td className="p-4">Growing IT firms (SAR 20–100M revenue)</td>
                  <td className="p-4 font-bold text-right">SAR 18,000–35,000</td>
                </tr>
                <tr className="border-t border-border-saudi">
                  <td className="p-4 font-bold text-navy">Strategic<br/><span className="text-[10px] font-normal text-text-muted">Investor/IPO ready</span></td>
                  <td className="p-4">80–100 hrs</td>
                  <td className="p-4">Scale-up IT companies (SAR 100M+ or pre-Series A)</td>
                  <td className="p-4 font-bold text-right">SAR 40,000–70,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="pdf-slide h-[297mm] w-[210mm] bg-cream p-16 flex flex-col justify-center">
          <div className="rounded-2xl border border-gold/30 bg-white p-12 shadow-lg">
            <h2 className="mb-6 font-serif text-2xl font-bold text-navy">Why a vCFO beats hiring in-house for Saudi IT companies:</h2>
            <p className="text-base text-text-muted leading-relaxed">
              Access to Big 4-trained tax specialists, IFRS experts, and banking advisors across all compliance areas. 
              Deep knowledge of Saudi-specific regulations (ZATCA, GOSI, SAMA, NDMO) combined with global best practices. 
              Scalable — increases hours during audit season, reduces in quiet periods. 
              No recruitment risk, GOSI contributions, or housing allowance obligations.
            </p>
          </div>
          <div className="mt-12 text-center">
            <p className="text-xs font-bold uppercase tracking-[4px] text-gold">Strategic Financial Advisory Services</p>
            <p className="mt-2 text-[10px] text-text-muted">Riyadh · Jeddah · Dammam</p>
          </div>
        </div>
      </div>

      {/* Cover Section */}
      <header className="relative overflow-hidden bg-navy px-10 pt-12 pb-9 text-white no-print">
        <div className="absolute -top-15 -right-15 h-75 w-75 rounded-full border border-gold/15" />
        <div className="absolute -bottom-20 left-30 h-100 w-100 rounded-full border border-gold/8" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <p className="mb-4 text-[10px] font-medium tracking-[3px] uppercase text-gold">
              Confidential | Strategic Advisory
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDownloadPPTX}
                disabled={isGeneratingPPTX}
                className="flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-[11px] font-semibold tracking-wider uppercase text-gold-light transition-all hover:bg-gold/20 disabled:opacity-50"
              >
                {isGeneratingPPTX ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Preparing...
                  </>
                ) : (
                  <>
                    <Presentation className="h-3 w-3" />
                    Download PPTX / Google Slides
                  </>
                )}
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-[11px] font-semibold tracking-wider uppercase text-gold-light transition-all hover:bg-gold/20 disabled:opacity-50"
              >
                {isGeneratingPDF ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Preparing...
                  </>
                ) : (
                  <>
                    <Download className="h-3 w-3" />
                    Print / Save PDF
                  </>
                )}
              </button>
            </div>
          </div>
          <h1 className="mb-2 font-serif text-3xl font-bold leading-tight">
            Virtual <span className="text-gold">CFO</span> Proposal<br />
            for IT Companies in KSA
          </h1>
          <p className="mb-7 text-sm font-light text-white/65">
            Accounting · Compliance · Financial Management · VAT · Zakat · Vision 2030
          </p>
          
          <div className="flex flex-wrap gap-6">
            <div className="rounded border border-gold/30 bg-gold/12 px-3 py-1.5 text-[11px] tracking-wider text-gold-light">
              BIG 4 + McKINSEY FRAMEWORK
            </div>
            <div className="rounded border border-gold/30 bg-gold/12 px-3 py-1.5 text-[11px] tracking-wider text-gold-light">
              SAUDI ARABIA 2025
            </div>
            <div className="rounded border border-gold/30 bg-gold/12 px-3 py-1.5 text-[11px] tracking-wider text-gold-light">
              IT SECTOR FOCUS
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-0 z-20 flex overflow-x-auto border-b border-border-saudi bg-white">
        {(['accounting', 'compliance', 'financial', 'roadmap', 'proposal'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer whitespace-nowrap border-b-2 px-4 py-3 text-[11px] font-medium tracking-wider uppercase transition-all hover:bg-cream hover:text-navy ${
              activeTab === tab ? 'border-gold text-navy' : 'border-transparent text-text-muted'
            }`}
          >
            {tab === 'financial' ? 'Financial Mgmt' : tab === 'proposal' ? 'vCFO Scope' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl p-8 pb-10">
        <AnimatePresence mode="wait">
          {activeTab === 'accounting' && (
            <motion.section
              key="accounting"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="mb-1 font-serif text-2xl font-bold text-navy">Accounting Issues & Solutions</h2>
              <p className="mb-6 border-b border-border-saudi pb-4 text-[13px] text-text-muted">
                Critical accounting challenges specific to IT companies operating in Saudi Arabia — spanning revenue recognition, multi-currency operations, and IFRS compliance.
              </p>
              
              <div className="grid gap-3.5">
                {accountingIssues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    isOpen={openIssueId === issue.id}
                    onToggle={() => toggleIssue(issue.id)}
                  />
                ))}
              </div>
            </motion.section>
          )}

          {activeTab === 'compliance' && (
            <motion.section
              key="compliance"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="mb-1 font-serif text-2xl font-bold text-navy">Regulatory & Tax Compliance</h2>
              <p className="mb-6 border-b border-border-saudi pb-4 text-[13px] text-text-muted">
                Saudi Arabia compliance landscape for IT companies — covering ZATCA, SOCPA, GOSI, Nitaqat, Saudisation, and corporate governance requirements.
              </p>

              <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-saudi/30 bg-red-light p-4 text-xs text-red-saudi">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  <span className="font-bold">⚠ ZATCA Notice:</span> Mandatory e-Invoicing (FATOORAH) Phase 2 integration requirements. Non-compliance penalties reach SAR 10,000–40,000 per violation. All B2B invoices must flow through ZATCA's Fatoorah platform in real-time.
                </p>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border-saudi bg-white">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-cream">
                      <th className="border-b-2 border-border-saudi p-3 text-[10px] font-semibold tracking-widest uppercase text-text-muted">Compliance Area</th>
                      <th className="border-b-2 border-border-saudi p-3 text-[10px] font-semibold tracking-widest uppercase text-text-muted">Issue</th>
                      <th className="border-b-2 border-border-saudi p-3 text-[10px] font-semibold tracking-widest uppercase text-text-muted">Risk</th>
                      <th className="border-b-2 border-border-saudi p-3 text-[10px] font-semibold tracking-widest uppercase text-text-muted">Penalty Exposure</th>
                      <th className="border-b-2 border-border-saudi p-3 text-[10px] font-semibold tracking-widest uppercase text-text-muted">Solution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complianceData.map((row, i) => (
                      <tr key={i} className="hover:bg-cream transition-colors">
                        <td className="border-b border-border-saudi p-3 align-top text-[13px]">
                          <div className="font-bold">{row.area}</div>
                          <div className="text-[11px] text-text-muted">{row.sub}</div>
                        </td>
                        <td className="border-b border-border-saudi p-3 align-top text-[13px]">{row.issue}</td>
                        <td className="border-b border-border-saudi p-3 align-top">
                          <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold tracking-wider ${
                            row.status === 'CRITICAL' ? 'bg-red-light text-red-saudi' : 'bg-amber-light text-amber-saudi'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="border-b border-border-saudi p-3 align-top text-[11px] font-medium text-red-saudi">{row.penalty}</td>
                        <td className="border-b border-border-saudi p-3 align-top text-[13px]">{row.solution}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.section>
          )}

          {activeTab === 'financial' && (
            <motion.section
              key="financial"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="mb-1 font-serif text-2xl font-bold text-navy">Financial Management Issues</h2>
              <p className="mb-6 border-b border-border-saudi pb-4 text-[13px] text-text-muted">
                Strategic financial management challenges for IT companies in the Saudi market — from cash flow to government contract management and banking.
              </p>

              <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <MetricCard val="90–180" unit="days typical government payment cycle" label="DSO Risk" trend="↑ Critical cash pressure" />
                <MetricCard val="15%" unit="VAT on all B2B invoices" label="VAT Cash Impact" trend="↑ Working capital drain" />
                <MetricCard val="20–30%" unit="Saudisation target (IT sector)" label="HR Cost Compliance" trend="↑ Rising wage costs" />
                <MetricCard val="3–5×" unit="EBITDA typical tech valuation multiple" label="Valuation Benchmark" trend="→ Growth opportunity" isOk />
              </div>

              <div className="grid gap-3.5">
                {financialIssues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    isOpen={openIssueId === issue.id}
                    onToggle={() => toggleIssue(issue.id)}
                  />
                ))}
              </div>
            </motion.section>
          )}

          {activeTab === 'roadmap' && (
            <motion.section
              key="roadmap"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="mb-1 font-serif text-2xl font-bold text-navy">90-Day Implementation Roadmap</h2>
              <p className="mb-6 border-b border-border-saudi pb-4 text-[13px] text-text-muted">
                Prioritised action plan to remediate critical issues and build a robust financial management foundation for an IT company in Saudi Arabia.
              </p>

              <div className="relative">
                {roadmap.map((phase, i) => (
                  <div key={i} className="mb-5 flex gap-4">
                    <div className="flex min-w-[40px] flex-col items-center">
                      <div className={`h-3 w-3 shrink-0 rounded-full border-2 border-gold ${phase.isSteady ? 'border-dashed' : 'bg-navy'}`} />
                      {i < roadmap.length - 1 && <div className="h-full min-h-[40px] w-0.5 bg-border-saudi" />}
                    </div>
                    <div className={`flex-1 rounded-lg border border-border-saudi bg-white p-4 shadow-sm ${phase.isSteady ? 'border-dashed' : ''}`}>
                      <div className="mb-1 text-[10px] font-semibold tracking-widest uppercase text-gold">{phase.phase}</div>
                      <div className="mb-1.5 text-sm font-semibold text-navy">{phase.title}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {phase.items.map((item, j) => (
                          <span key={j} className="rounded border border-border-saudi bg-cream-mid px-2 py-0.5 text-[11px] text-text-muted">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {activeTab === 'proposal' && (
            <motion.section
              key="proposal"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="mb-1 font-serif text-2xl font-bold text-navy">Virtual CFO Engagement Scope</h2>
              <p className="mb-6 border-b border-border-saudi pb-4 text-[13px] text-text-muted">
                A structured vCFO engagement model designed specifically for Saudi IT companies — combining Big 4 technical rigour with McKinsey strategic insight at a fraction of the cost of a full-time CFO.
              </p>

              <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-saudi/30 bg-amber-light p-4 text-xs text-amber-saudi">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  <span className="font-bold">💡 Market Insight:</span> A full-time CFO in Riyadh commands SAR 300,000–600,000 annually. A structured vCFO engagement delivers the same strategic and compliance outcome at 20–30% of the cost, with sector-specific Saudi IT expertise from day one.
                </p>
              </div>

              <div className="rounded-xl bg-navy p-7 text-white">
                <h3 className="mb-2 font-serif text-lg text-gold-light">vCFO Deliverables by Pillar</h3>
                <p className="mb-4 text-[13px] text-white/70">Four integrated pillars covering the full CFO mandate for an IT company in the Kingdom</p>
                
                <div className="grid gap-3 sm:grid-cols-2">
                  <PillarItem icon={<ShieldCheck className="h-3 w-3" />} title="Compliance & Tax" desc="ZATCA VAT, Zakat/CIT, WHT, GOSI, Nitaqat, PDPL, FATOORAH, annual statutory audit liaison" />
                  <PillarItem icon={<BarChart3 className="h-3 w-3" />} title="Financial Reporting" desc="IFRS-compliant monthly management accounts, board packs, annual financial statements, audit support" />
                  <PillarItem icon={<Map className="h-3 w-3" />} title="Financial Planning" desc="Annual budget, rolling forecasts, 3-year strategic financial model, scenario analysis, KPI dashboards" />
                  <PillarItem icon={<Briefcase className="h-3 w-3" />} title="Strategic Finance" desc="Fundraising support, grant management (MCIT/KACST), banking relationships, M&A readiness, Vision 2030 alignment" />
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-lg border border-border-saudi bg-white">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-cream">
                      <th className="border-b-2 border-border-saudi p-3 text-[10px] font-semibold tracking-widest uppercase text-text-muted">Engagement Model</th>
                      <th className="border-b-2 border-border-saudi p-3 text-[10px] font-semibold tracking-widest uppercase text-text-muted">Hours/Month</th>
                      <th className="border-b-2 border-border-saudi p-3 text-[10px] font-semibold tracking-widest uppercase text-text-muted">Best For</th>
                      <th className="border-b-2 border-border-saudi p-3 text-[10px] font-semibold tracking-widest uppercase text-text-muted">Est. Monthly Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    <PricingRow model="Essentials" sub="Compliance-focused" hours="20–30 hrs" best="Early-stage IT companies (SAR 5–20M revenue)" fee="SAR 8,000–15,000" />
                    <PricingRow model="Growth" sub="Full vCFO function" hours="40–60 hrs" best="Growing IT firms (SAR 20–100M revenue)" fee="SAR 18,000–35,000" />
                    <PricingRow model="Strategic" sub="Investor/IPO ready" hours="80–100 hrs" best="Scale-up IT companies (SAR 100M+ or pre-Series A)" fee="SAR 40,000–70,000" />
                  </tbody>
                </table>
              </div>

              <div className="mt-4 rounded-lg bg-cream-mid p-4 text-xs leading-relaxed text-text-muted">
                <strong className="text-navy">Why a vCFO beats hiring in-house for Saudi IT companies:</strong><br />
                Access to Big 4-trained tax specialists, IFRS experts, and banking advisors across all compliance areas. Deep knowledge of Saudi-specific regulations (ZATCA, GOSI, SAMA, NDMO) combined with global best practices. Scalable — increases hours during audit season, reduces in quiet periods. No recruitment risk, GOSI contributions, or housing allowance obligations.
              </div>

              <div className="mt-6 flex items-center gap-4 rounded-xl border border-gold/20 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                  <Presentation className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-navy">Google Slides & PowerPoint Ready</h4>
                  <p className="mt-1 text-xs text-text-muted leading-relaxed">
                    The generated 15-slide deck is optimized for both Microsoft PowerPoint and Google Slides. 
                    To use with Google Slides, simply upload the downloaded <code className="rounded bg-cream px-1">.pptx</code> file to your Google Drive and open it — all layouts and branding will be preserved.
                  </p>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

const IssueCard: React.FC<{ issue: Issue; isOpen: boolean; onToggle: () => void }> = ({ issue, isOpen, onToggle }) => {
  return (
    <div className="overflow-hidden rounded-lg border border-border-saudi bg-white shadow-sm">
      <div
        className="flex cursor-pointer items-start gap-3 p-4 transition-colors hover:bg-cream"
        onClick={onToggle}
      >
        <div className={`flex h-8 w-8 min-w-[32px] items-center justify-center rounded-md border text-[11px] font-bold tracking-wider ${
          issue.severity === 'CRIT' ? 'border-[#F5C6C6] bg-red-light text-red-saudi' :
          issue.severity === 'HIGH' ? 'border-[#F0D8A0] bg-amber-light text-amber-saudi' :
          'border-[#C0D8F0] bg-[#F0F8FF] text-[#1A3A6B]'
        }`}>
          {issue.severity}
        </div>
        <div className="flex-1">
          <div className="text-[13px] font-bold text-navy">{issue.title}</div>
          <div className="text-[11px] text-text-muted">{issue.meta}</div>
        </div>
        <ChevronDown className={`h-4 w-4 text-text-light transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="border-t border-cream-mid p-4 pt-0">
              <p className="mt-3 mb-2.5 text-[13px] leading-relaxed text-text-muted">{issue.description}</p>
              <div className="mt-2.5 rounded-r-md border-l-3 border-green-saudi bg-green-light p-3.5">
                <div className="mb-1.5 text-[11px] font-bold tracking-widest uppercase text-green-saudi">Solutions</div>
                <ul className="space-y-1">
                  {issue.solutions.map((sol, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-[#1A4A2E]">
                      <span className="mt-0.5 font-bold text-green-saudi">→</span>
                      {sol}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const MetricCard: React.FC<{ val: string; unit: string; label: string; trend: string; isOk?: boolean }> = ({ val, unit, label, trend, isOk }) => {
  return (
    <div className="rounded-lg border border-border-saudi bg-white p-4 shadow-sm">
      <div className="font-serif text-2xl font-bold text-navy leading-none">{val}</div>
      <div className="mt-1 text-[12px] leading-tight text-text-muted">{unit}</div>
      <div className="mt-2 text-[11px] font-bold tracking-wider uppercase text-text-light">{label}</div>
      <div className={`mt-1 text-[11px] ${isOk ? 'text-green-saudi' : 'text-red-saudi'}`}>{trend}</div>
    </div>
  );
}

const PillarItem: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-gold/20 text-gold">
        {icon}
      </div>
      <div>
        <div className="text-xs font-bold text-gold-light">{title}</div>
        <div className="text-[11px] leading-relaxed text-white/80">{desc}</div>
      </div>
    </div>
  );
}

const PricingRow: React.FC<{ model: string; sub: string; hours: string; best: string; fee: string }> = ({ model, sub, hours, best, fee }) => {
  return (
    <tr className="hover:bg-cream transition-colors">
      <td className="border-b border-border-saudi p-3 align-top text-[13px]">
        <div className="font-bold">{model}</div>
        <div className="text-[11px] text-text-muted">{sub}</div>
      </td>
      <td className="border-b border-border-saudi p-3 align-top text-[13px]">{hours}</td>
      <td className="border-b border-border-saudi p-3 align-top text-[13px]">{best}</td>
      <td className="border-b border-border-saudi p-3 align-top text-[13px] font-bold">{fee}</td>
    </tr>
  );
}
