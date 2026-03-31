import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, AlertTriangle, Info, ShieldCheck, BarChart3, Map, Briefcase } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-cream font-sans text-text-saudi">
      {/* Cover Section */}
      <header className="relative overflow-hidden bg-navy px-10 pt-12 pb-9 text-white">
        <div className="absolute -top-15 -right-15 h-75 w-75 rounded-full border border-gold/15" />
        <div className="absolute -bottom-20 left-30 h-100 w-100 rounded-full border border-gold/8" />
        
        <div className="relative z-10">
          <p className="mb-4 text-[10px] font-medium tracking-[3px] uppercase text-gold">
            Confidential | Strategic Advisory
          </p>
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
