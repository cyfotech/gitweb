export type EditorialBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'callout'; title: string; text: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'faq'; items: { question: string; answer: string }[] }
  | { type: 'references'; items: { label: string; url: string; description: string; internal?: boolean }[] };

export interface EditorialSection {
  id: string;
  title: string;
  blocks: EditorialBlock[];
}

export interface BlogEditorial {
  dek: string;
  takeaways: string[];
  sections: EditorialSection[];
}

export const BLOG_EDITORIAL: Record<string, BlogEditorial> = {
  'irs-inflation-adjustments-2025': {
    dek: 'What the IRS announced for 2025, what later legislation changed, and how to use the correct tax-year figures when preparing a return in 2026.',
    takeaways: [
      'Tax year 2025 covers income earned during 2025; most individual returns are filed in 2026.',
      'The IRS first announced standard deductions of $15,000, $30,000, and $22,500; later 2025 legislation raised the amounts for 2025 returns to $15,750, $31,500, and $23,625.',
      'The 2025 federal tax brackets remain marginal: a higher rate applies only to the taxable income within that band.',
      'Filing status, credits, deductions, and later law changes all affect a taxpayer’s final result.',
    ],
    sections: [
      {
        id: 'what-changed',
        title: 'What the IRS announced',
        blocks: [
          { type: 'paragraph', text: 'On October 22, 2024, the IRS announced annual inflation adjustments for more than 60 federal tax provisions for tax year 2025. Revenue Procedure 2024-40 contains the original detailed figures. They were intended for income and events in 2025, with most individual returns filed during the 2026 filing season.' },
          { type: 'paragraph', text: 'The announcement is a historical snapshot, not the last word on every 2025 tax provision. Later 2025 legislation (the One, Big, Beautiful Bill) increased the basic 2025 standard deduction. The federal income-tax brackets shown below are the IRS-published 2025 brackets.' },
          { type: 'callout', title: 'Tax year is not filing year', text: 'Tax year 2025 generally means income earned from January 1 through December 31, 2025. A return filed in 2026 can report tax year 2025; use the forms and instructions for the tax year shown on the return.' },
        ],
      },
      {
        id: 'standard-deduction',
        title: 'Standard deduction amounts for tax year 2025',
        blocks: [
          { type: 'paragraph', text: 'The standard deduction reduces taxable income for taxpayers who do not itemize deductions. The first IRS announcement listed the amounts in the middle column. Later legislation raised the basic standard deduction amounts that apply to tax year 2025, shown in the final column.' },
          { type: 'table', headers: ['Filing status', 'Original IRS announcement (Oct. 2024)', 'Tax year 2025 amount after 2025 legislation'], rows: [['Single', '$15,000', '$15,750'], ['Married filing separately', '$15,000', '$15,750'], ['Married filing jointly', '$30,000', '$31,500'], ['Head of household', '$22,500', '$23,625']] },
          { type: 'paragraph', text: 'These are the basic standard deduction amounts. An additional standard-deduction amount may apply based on age or blindness; separate deductions enacted in 2025 are not included in this table. A taxpayer who can itemize should compare allowable itemized deductions with the applicable standard deduction and follow the current Form 1040 instructions.' },
          { type: 'callout', title: 'Use the updated 2025 amount', text: 'For a 2025 return filed in 2026, do not stop at the amounts in the October 2024 announcement. The IRS later confirmed that 2025 legislation raised the basic standard deductions to $15,750 for single and married-filing-separately filers, $31,500 for joint filers, and $23,625 for heads of household.' },
        ],
      },
      {
        id: 'tax-brackets',
        title: 'Federal income tax brackets for 2025',
        blocks: [
          { type: 'paragraph', text: 'The IRS 2025 rate schedules set different thresholds by filing status. The table shows the top of each taxable-income band. The 37% rate applies to taxable income above the last listed threshold.' },
          { type: 'table', headers: ['Rate', 'Single', 'Married filing jointly', 'Married filing separately', 'Head of household'], rows: [['10%', 'Up to $11,925', 'Up to $23,850', 'Up to $11,925', 'Up to $17,000'], ['12%', '$11,926–$48,475', '$23,851–$96,950', '$11,926–$48,475', '$17,001–$64,850'], ['22%', '$48,476–$103,350', '$96,951–$206,700', '$48,476–$103,350', '$64,851–$103,350'], ['24%', '$103,351–$197,300', '$206,701–$394,600', '$103,351–$197,300', '$103,351–$197,300'], ['32%', '$197,301–$250,525', '$394,601–$501,050', '$197,301–$250,525', '$197,301–$250,500'], ['35%', '$250,526–$626,350', '$501,051–$751,600', '$250,526–$375,800', '$250,501–$626,350'], ['37%', 'Over $626,350', 'Over $751,600', 'Over $375,800', 'Over $626,350']] },
          { type: 'callout', title: 'These are taxable-income thresholds', text: 'Taxable income is not the same as salary or gross income. It is determined after accounting for applicable adjustments and deductions. The table is a rate schedule, not a complete calculation of an individual return.' },
        ],
      },
      {
        id: 'marginal-brackets',
        title: 'How marginal tax brackets work',
        blocks: [
          { type: 'paragraph', text: 'The United States uses a progressive marginal-rate system for ordinary federal income tax. Each rate applies only to the slice of taxable income in its band. Crossing into a higher bracket does not move all of a person’s income to that higher rate; the lower slices remain taxed under the lower bands.' },
          { type: 'paragraph', text: 'For example, for a single filer, the 22% band begins above $48,475 of taxable income in 2025. If taxable income crosses that threshold, only the dollars above the threshold enter the 22% band, until the next threshold. This explains the rate schedule only; deductions, credits, preferential income rates, and other tax rules can change a complete return calculation.' },
        ],
      },
      {
        id: 'other-provisions',
        title: 'Other inflation-adjusted provisions',
        blocks: [
          { type: 'paragraph', text: 'Beyond individual income-tax brackets, the IRS announcement and Revenue Procedure 2024-40 covered provisions affecting workers, families, benefit plans, and estates. Examples include the following 2025 limits; eligibility requirements and related rules still apply.' },
          { type: 'table', headers: ['Provision', '2025 amount (calendar year where applicable)', 'Important qualification'], rows: [['Earned Income Tax Credit', 'Maximum $8,046 for eligible taxpayers with 3 or more qualifying children', 'The credit amount depends on earned income, filing status, and qualifying-child rules.'], ['Health FSA salary reductions', '$3,300', 'Applies to employee salary reductions for health flexible spending arrangements.'], ['Health FSA carryover', 'Up to $660', 'Only where the employer cafeteria plan permits a carryover.'], ['Annual gift-tax exclusion', '$19,000 per recipient', 'This is an annual exclusion; gift-tax reporting and other rules can still apply.'], ['Estate-tax basic exclusion', '$13,990,000', 'For estates of decedents who died in 2025.']] },
          { type: 'paragraph', text: 'The revenue procedure also covers the alternative minimum tax, medical savings accounts, transportation benefits, and many other provisions. Check the original procedure and current IRS instructions for the full details, especially where eligibility, phaseouts, or later legislation may affect the rule.' },
        ],
      },
      {
        id: 'taxpayer-impact',
        title: 'How the changes may affect individual taxpayers',
        blocks: [
          { type: 'paragraph', text: 'A higher standard deduction can reduce taxable income for a taxpayer who claims it, but it does not automatically produce a refund or a particular tax saving. The result depends on the taxpayer’s income, filing status, itemized deductions, credits, withholding, and other facts. A taxpayer who itemizes should compare eligible deductions under the current rules rather than assuming the standard deduction is always preferable.' },
          { type: 'paragraph', text: 'The same inflation adjustment can affect withholding and estimated-tax planning as well as a filed return. Households with a new job, changed income, marriage, a dependent, or other major life event may want to review their estimates. State tax rules do not necessarily follow federal changes.' },
        ],
      },
      {
        id: 'planning-considerations',
        title: 'Practical tax planning considerations',
        blocks: [
          { type: 'list', items: ['Start with the correct tax year and filing status; do not use a 2025 amount for a 2024 return.', 'For a 2025 return, use current IRS instructions and the updated basic standard deduction rather than relying only on the October 2024 announcement.', 'Compare the standard deduction with eligible itemized deductions and account for any additional deductions for which you qualify.', 'Review withholding or estimated payments when income, household circumstances, or deductions change.', 'Check the applicable plan documents and eligibility rules for FSA elections, credits, and other benefit limits.', 'Treat state tax calculations separately and verify whether the state conforms to the relevant federal provision.'] },
          { type: 'callout', title: 'A tax bracket is not a tax estimate', text: 'The rate schedule alone cannot determine a person’s tax due or refund. A complete estimate requires the taxpayer’s income types, deductions, credits, payments, filing status, and any other applicable federal and state rules.' },
        ],
      },
      {
        id: 'frequently-asked-questions',
        title: 'Frequently asked questions',
        blocks: [
          { type: 'faq', items: [
            { question: 'Does tax year 2025 mean I file in 2025?', answer: 'Usually not. Tax year 2025 generally covers income earned during calendar year 2025. Most individual taxpayers file that return during the 2026 filing season.' },
            { question: 'Which 2025 standard deduction should I use?', answer: 'The October 2024 IRS announcement listed $15,000 for single and married-filing-separately filers, $30,000 for joint filers, and $22,500 for heads of household. Later 2025 legislation raised the basic tax year 2025 amounts to $15,750, $31,500, and $23,625, respectively. Follow the current IRS instructions for the return.' },
            { question: 'Does entering a higher tax bracket mean all my income is taxed at that rate?', answer: 'No. Under the marginal rate schedule, only the portion of taxable income within a higher band is taxed at that band’s rate. The lower portions remain subject to the rates for their bands.' },
            { question: 'Should I take the standard deduction or itemize?', answer: 'It depends on your eligible itemized deductions, filing status, and circumstances. Compare the amounts using current IRS rules and consider additional deductions or limitations that may apply.' },
            { question: 'Do these federal figures automatically apply to my state return?', answer: 'No. States set their own tax rules and may or may not conform to federal changes. Check the tax agency guidance for each state where you must file.' },
          ] },
        ],
      },
      {
        id: 'official-irs-references',
        title: 'Official IRS references and further reading',
        blocks: [
          { type: 'paragraph', text: 'The figures in this article are summarized from official IRS materials. The October 2024 release describes the original inflation adjustments; later IRS guidance describes the change to the tax year 2025 standard deduction. Consult the current forms and instructions before filing.' },
          { type: 'references', items: [
            { label: 'IRS: Tax inflation adjustments for tax year 2025 (IR-2024-273)', url: 'https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2025', description: 'The October 22, 2024 announcement and its summary of original adjustments.' },
            { label: 'Revenue Procedure 2024-40', url: 'https://www.irs.gov/pub/irs-drop/rp-24-40.pdf', description: 'Official procedure with detailed tax year 2025 inflation-adjusted provisions.' },
            { label: 'IRS: Federal income tax rates and brackets', url: 'https://www.irs.gov/filing/federal-income-tax-rates-and-brackets', description: 'IRS-published 2025 rate thresholds for each filing status.' },
            { label: 'IRS: Tax year 2026 adjustments and 2025 amendments', url: 'https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill', description: 'Confirms the updated 2025 standard deduction amounts following 2025 legislation.' },
            { label: 'IRS Publication 17 (2025)', url: 'https://www.irs.gov/publications/p17', description: 'IRS guidance for individuals preparing 2025 federal income tax returns.' },
            { label: 'Explore tax resources', url: '/tax-resources', description: 'Browse additional tax-planning references on our website.', internal: true },
          ] },
        ],
      },
    ],
  },
  'accounting-firms-offshore-talent-strategy': {
    dek: 'A practical operating model for accounting firms evaluating external capacity while protecting review quality, client service, and confidential information.',
    takeaways: [
      'Outsourcing is most useful when it addresses a defined capacity or workflow constraint.',
      'Document scope, review responsibility, communication rules, and escalation paths before work begins.',
      'Client confidentiality, professional obligations, and data safeguards remain the firm’s responsibility.',
      'Measure quality and turnaround alongside capacity; volume alone is not a success measure.',
    ],
    sections: [
      {
        id: 'capacity-problem',
        title: 'Start with the capacity problem',
        blocks: [
          { type: 'paragraph', text: 'Hiring pressure, seasonal demand, and limited reviewer time can make it difficult for a practice to accept work consistently. Before considering outside support, identify where work is accumulating: document intake, bookkeeping close, return preparation, reconciliation, or review.' },
          { type: 'paragraph', text: 'A clear workload map prevents the common mistake of treating outsourcing as a general solution. Some bottlenecks are caused by incomplete client records, unclear ownership, or review availability rather than a lack of preparers.' },
        ],
      },
      {
        id: 'choose-work',
        title: 'Choose work that can be defined',
        blocks: [
          { type: 'list', items: ['Select repeatable tasks with clear inputs, outputs, and acceptance criteria.', 'Keep professional judgment, client advice, and final sign-off with appropriately authorized firm personnel.', 'Document which accounting platform, tax software, workpaper conventions, and client communication channels are approved.', 'Pilot a limited scope before expanding to additional engagements or busy-season volumes.'] },
        ],
      },
      {
        id: 'controls',
        title: 'Build control into the workflow',
        blocks: [
          { type: 'paragraph', text: 'A reliable operating model pairs every assigned task with an accountable reviewer. Define how source documents are received, how questions are raised, how changes are tracked, and what evidence is required to support completed work.' },
          { type: 'callout', title: 'The firm retains responsibility', text: 'Delegating production does not transfer a CPA firm’s professional, confidentiality, data-protection, or client-service obligations. Confirm applicable professional standards and state requirements for each engagement.' },
        ],
      },
      {
        id: 'security',
        title: 'Protect client information',
        blocks: [
          { type: 'paragraph', text: 'Evaluate the provider’s access controls, workforce training, incident response, subcontractors, data location, retention, and secure deletion practices. Limit access to the information needed for the assigned work and use approved secure transfer and storage tools.' },
          { type: 'list', items: ['Use written confidentiality and security terms.', 'Apply least-privilege access and multi-factor authentication where available.', 'Agree on incident notification and evidence-preservation procedures.', 'Reassess access when a worker changes roles or an engagement ends.'] },
        ],
      },
      {
        id: 'measure',
        title: 'Measure quality, not just throughput',
        blocks: [
          { type: 'paragraph', text: 'Track practical indicators such as first-pass acceptance, reopened items, review notes, on-time completion, and unresolved client questions. Review results with the team and use them to improve instructions and training.' },
          { type: 'paragraph', text: 'A sustainable model gives partners more room for client relationships and technical decisions without weakening the review trail or creating new coordination costs.' },
        ],
      },
    ],
  },
  'aicpa-top-tax-priorities-for-firms': {
    dek: 'A firm-level framework for monitoring tax changes, coordinating state obligations, and handling client information securely.',
    takeaways: [
      'Separate enacted law and official guidance from proposals and practitioner commentary.',
      'Maintain an entity-by-entity and jurisdiction-by-jurisdiction compliance calendar.',
      'Evaluate multistate filing obligations based on current law and each client’s facts.',
      'Treat secure client-data exchange as part of tax compliance operations.',
    ],
    sections: [
      {
        id: 'monitor-authoritatively',
        title: 'Build a reliable tax-update process',
        blocks: [
          { type: 'paragraph', text: 'Tax teams work across statutes, regulations, agency guidance, court decisions, and professional analysis. A useful update process records the source, publication date, effective date, affected client groups, and whether a proposal has become law.' },
          { type: 'list', items: ['Monitor primary authorities such as the IRS, Treasury, state revenue agencies, and enacted legislation.', 'Assign a reviewer to determine which clients may be affected.', 'Update written procedures and client communications only after the change is verified.', 'Retain the prior procedure and the date the new treatment became effective.'] },
        ],
      },
      {
        id: 'state-nexus',
        title: 'Treat state nexus as a facts-and-law question',
        blocks: [
          { type: 'paragraph', text: 'A company can have obligations in a state where it has no traditional office or employees. Sales, payroll, property, marketplace activity, entity structure, and the particular state’s rules may all matter. There is no single nationwide threshold that resolves every income-tax, sales-tax, or registration question.' },
          { type: 'callout', title: 'Avoid a one-size-fits-all threshold', text: 'Evaluate each tax type and jurisdiction separately. Economic-nexus standards, filing thresholds, apportionment, and local rules change and may differ by state.' },
        ],
      },
      {
        id: 'corporate-provisions',
        title: 'Coordinate corporate and pass-through provisions',
        blocks: [
          { type: 'paragraph', text: 'Corporate alternative minimum tax rules and individual pass-through provisions apply to different taxpayers and have distinct tests. Confirm the entity classification, ownership, tax year, applicable elections, and current guidance before modeling exposure.' },
          { type: 'paragraph', text: 'For multistate businesses, align federal tax work with state filings, estimated payments, apportionment data, and any state-level elections. A federal conclusion should not be assumed to control state treatment.' },
        ],
      },
      {
        id: 'technology-and-data',
        title: 'Make technology and data handling part of compliance',
        blocks: [
          { type: 'paragraph', text: 'Tax teams exchange highly sensitive identity, payroll, banking, and financial records. The tools used for portals, e-signatures, document storage, and remote work should be included in the firm’s written security program and vendor review.' },
          { type: 'list', items: ['Use approved client portals instead of ordinary email attachments for sensitive files.', 'Limit user access and promptly remove access that is no longer needed.', 'Train staff to recognize phishing and report suspected incidents.', 'Document retention, deletion, and incident-response responsibilities.'] },
        ],
      },
      {
        id: 'implementation',
        title: 'Turn priorities into a repeatable calendar',
        blocks: [
          { type: 'paragraph', text: 'A practical tax calendar assigns an owner, deadline, source, and escalation path to each recurring task. Review it when laws change, when a client expands to a new state, and before each filing season.' },
          { type: 'paragraph', text: 'Professional resources, including AICPA tax materials, can help identify issues. They do not replace the governing law, official guidance, or advice tailored to a client’s facts.' },
        ],
      },
    ],
  },
  '2025-state-business-tax-climate-index': {
    dek: 'How to use a comparative state-tax index as a screening tool—without mistaking a ranking for a business-specific tax estimate.',
    takeaways: [
      'A state index compares tax structures using a defined methodology; it does not calculate an individual company’s tax bill.',
      'A headline rank can conceal differences among corporate, individual, sales, property, and unemployment-tax components.',
      'Entity type, industry, employees, property, customers, and elections affect actual obligations.',
      'Use current state authority and client-specific modeling before making location or entity decisions.',
    ],
    sections: [
      {
        id: 'what-index-measures',
        title: 'What a state tax index can tell you',
        blocks: [
          { type: 'paragraph', text: 'The Tax Foundation’s State Business Tax Climate Index is a comparative research tool. It organizes state tax systems into components and uses a stated methodology to compare how tax structures are designed. It is not a forecast of the tax a particular company will owe.' },
          { type: 'paragraph', text: 'The index is most useful as an initial lens for asking better questions: which taxes drive the comparison, how does a state define its base, and what rules should be reviewed before operating there?' },
        ],
      },
      {
        id: 'read-components',
        title: 'Read the components, not only the overall rank',
        blocks: [
          { type: 'list', items: ['Review the separate tax categories and the methodology used to score them.', 'Check the underlying state rules, including rates, bases, exemptions, credits, and filing requirements.', 'Distinguish a state-level comparison from city, county, and special-district obligations.', 'Confirm the index edition and the effective date of each provision it discusses.'] },
        ],
      },
      {
        id: 'business-specific',
        title: 'Translate the comparison to a business',
        blocks: [
          { type: 'paragraph', text: 'A service firm with remote employees, a retailer with multistate sales, and a manufacturer with property and payroll can face very different state-tax profiles. Entity structure, apportionment, customer locations, payroll, inventory, and state elections all change the analysis.' },
          { type: 'callout', title: 'A ranking is not a tax quote', text: 'Do not infer that a business will pay less tax merely because a state ranks favorably overall. Model the relevant tax types using the company’s facts and current law.' },
        ],
      },
      {
        id: 'ptet-and-local',
        title: 'Consider elections and local rules separately',
        blocks: [
          { type: 'paragraph', text: 'Pass-through entity tax elections can affect the federal and state reporting of eligible owners, but availability, deadlines, payment mechanics, credits, and treatment differ by jurisdiction. Local taxes and registration obligations may also sit outside a statewide index comparison.' },
        ],
      },
      {
        id: 'decision-process',
        title: 'A practical decision process',
        blocks: [
          { type: 'list', items: ['Use the index to identify candidate jurisdictions and issues for review.', 'Map where the business has people, property, customers, and economic activity.', 'Compare current state and local rules for each relevant tax type.', 'Model total compliance and operating costs, not just headline tax rates.', 'Revisit the analysis when the business footprint or law changes.'] },
        ],
      },
    ],
  },
  'maximizing-section-199a-qbi-deduction': {
    dek: 'A careful overview of the Section 199A deduction, the records it requires, and why eligibility depends on taxable income, business type, and detailed limitations.',
    takeaways: [
      'Section 199A may allow eligible noncorporate taxpayers a deduction of up to 20% of qualified business income, subject to statutory limits.',
      'SSTB rules, taxable-income thresholds, W-2 wages, and qualified property can affect the calculation.',
      'An LLC or S corporation label alone does not establish eligibility or maximize the deduction.',
      'Model the deduction using current-year law and maintain records that support each component.',
    ],
    sections: [
      {
        id: 'section-199a',
        title: 'What Section 199A does',
        blocks: [
          { type: 'paragraph', text: 'Section 199A of the Internal Revenue Code may provide a deduction for qualified business income to eligible individuals and certain trusts and estates. Depending on the taxpayer and income, the calculation may also consider qualified REIT dividends and qualified publicly traded partnership income.' },
          { type: 'callout', title: '“Up to 20%” is not a guaranteed result', text: 'The deduction is limited by the statute and may be reduced or unavailable. It is not automatically 20% of a business’s profit or a guaranteed tax saving.' },
        ],
      },
      {
        id: 'eligibility',
        title: 'Eligibility depends on more than entity type',
        blocks: [
          { type: 'paragraph', text: 'Sole proprietors, partners, and S corporation shareholders may need to evaluate the deduction, but the relevant income, activity, and reporting rules differ. A C corporation does not claim a Section 199A deduction for its own corporate income.' },
          { type: 'paragraph', text: 'Specified service trade or business rules can restrict the deduction at higher income levels. The definition is technical; a business name or broad industry label alone may not resolve whether an activity qualifies.' },
        ],
      },
      {
        id: 'calculation-limits',
        title: 'Understand the calculation and limitations',
        blocks: [
          { type: 'list', items: ['Determine qualified business income separately for each eligible trade or business.', 'Apply taxable-income thresholds and the applicable phase-in or phaseout rules for the tax year.', 'Where required, evaluate the W-2 wage and qualified-property limitation.', 'Consider aggregation rules only when their requirements are met and the election is documented.', 'Apply the overall taxable-income limitation and account for qualified REIT or PTP components where applicable.'] },
          { type: 'paragraph', text: 'Threshold amounts and procedures are tax-year specific. Use current IRS instructions and the governing statute rather than carrying a prior-year worksheet forward without review.' },
        ],
      },
      {
        id: 'records-and-planning',
        title: 'Records and planning considerations',
        blocks: [
          { type: 'paragraph', text: 'A defensible calculation depends on reliable books and allocation records. Separate business income from investment items, reconcile entity-level amounts to owner reporting, and retain support for wages, property basis, and any aggregation position.' },
          { type: 'list', items: ['Review reasonable compensation and owner payments under the rules applicable to the entity.', 'Do not create artificial entities or shift income without economic substance and a valid business purpose.', 'Coordinate retirement-plan, state-tax, and entity decisions independently; a QBI result should not be assumed to control them.', 'Have a qualified tax professional test the calculation against the current tax-year instructions.'] },
        ],
      },
      {
        id: 'conclusion',
        title: 'A fact-specific deduction',
        blocks: [
          { type: 'paragraph', text: 'Section 199A planning is a calculation exercise, not a one-size-fits-all entity strategy. Review eligibility, limitations, and documentation each year as income and law change.' },
        ],
      },
    ],
  },
  'busy-season-workpaper-standardization-handbook': {
    dek: 'A practical workpaper standard for hybrid accounting teams: consistent file structure, traceable review, clear handoffs, and secure client-document handling.',
    takeaways: [
      'Standard templates reduce ambiguity but do not replace professional judgment.',
      'Every workpaper should make the source, preparer, period, procedure, conclusion, and reviewer trail clear.',
      'Use consistent naming, indexing, and open-item ownership across the team.',
      'A firm should set service targets based on its capacity and engagement requirements rather than assuming one turnaround fits every file.',
    ],
    sections: [
      {
        id: 'why-standardize',
        title: 'Why workpaper consistency matters',
        blocks: [
          { type: 'paragraph', text: 'Hybrid teams can lose time when files are organized differently, client support is hard to locate, or an unresolved question has no owner. Standardization makes the engagement’s status visible and helps reviewers trace a conclusion back to evidence.' },
          { type: 'paragraph', text: 'A strong standard is simple enough to use during peak periods and flexible enough for unusual client facts. It defines what “complete” means for common work without forcing every engagement into an identical judgment.' },
        ],
      },
      {
        id: 'workpaper-anatomy',
        title: 'Create a consistent workpaper anatomy',
        blocks: [
          { type: 'list', items: ['Use a predictable folder structure and file-naming convention.', 'Identify the client, entity, period, preparer, and preparation date.', 'Link each material amount or conclusion to source support.', 'Describe the procedure performed and the result, not only the number copied.', 'Record reviewer notes, resolution, and final sign-off in the approved system.'] },
        ],
      },
      {
        id: 'intake-handoffs',
        title: 'Make document intake and handoffs explicit',
        blocks: [
          { type: 'paragraph', text: 'A prepared-by-client list should specify the requested document, relevant period, due date, and secure submission channel. When information is missing or unreadable, log the question with an owner and status rather than burying it in informal messages.' },
          { type: 'callout', title: 'No silent assumptions', text: 'If source information is incomplete, record the gap and escalate it. A standardized workpaper should make uncertainty visible to the reviewer.' },
        ],
      },
      {
        id: 'review-and-security',
        title: 'Keep review and information security in the workflow',
        blocks: [
          { type: 'paragraph', text: 'A reviewer should be able to identify what was prepared, what remains open, and which evidence supports the work. Use approved access controls and client portals for sensitive records, and avoid moving client data into unapproved storage or messaging tools.' },
          { type: 'list', items: ['Define reviewer responsibilities and escalation points.', 'Use a consistent way to flag unresolved items and review notes.', 'Separate draft work from final deliverables.', 'Restrict engagement access to authorized team members and remove it when no longer needed.'] },
        ],
      },
      {
        id: 'rollout',
        title: 'Roll out standards incrementally',
        blocks: [
          { type: 'paragraph', text: 'Pilot the checklist on representative engagements, collect reviewer feedback, and revise the standard before broad adoption. Monitor rework, unresolved items, and on-time completion to identify process problems without substituting a volume target for quality.' },
          { type: 'paragraph', text: 'Documented procedures, training, and periodic review help a hybrid team work consistently while preserving the engagement partner’s responsibility for the final work.' },
        ],
      },
    ],
  },
  'navigating-section-174-rd-amortization': {
    dek: 'A guide to identifying research and experimental expenditures and documenting the tax treatment that applied when this article was published.',
    takeaways: [
      'Section 174 treatment depends on the nature of the activity and the tax year.',
      'The rules discussed in the original March 2025 article are a dated snapshot, not a statement of current law.',
      'Software development and other technical projects require a documented cost-identification process.',
      'Review current legislation, IRS guidance, and transition rules before preparing a return or amending a prior year.',
    ],
    sections: [
      {
        id: 'scope',
        title: 'Start by identifying the activity',
        blocks: [
          { type: 'paragraph', text: 'Section 174 applies to specified research or experimental expenditures, a category that depends on the work performed rather than the label used in the general ledger. A software or technology business should document project objectives, technical uncertainty, development activities, and the people and costs involved.' },
          { type: 'paragraph', text: 'Not every technology expense is automatically a research expenditure, and not every cost connected to a project has the same tax treatment. Maintain project-level records that allow the tax team to make and explain the classification.' },
        ],
      },
      {
        id: 'march-2025-rules',
        title: 'The rules as understood in March 2025',
        blocks: [
          { type: 'paragraph', text: 'At the date of the original March 15, 2025 publication, Section 174 generally required specified research and experimental expenditures for tax years beginning after December 31, 2021 to be capitalized and amortized over a prescribed period, with different periods for domestic and foreign research and a midyear convention.' },
          { type: 'callout', title: 'This is a historical snapshot', text: 'Federal law changed after this article’s March 2025 publication. Do not use this summary to determine a current return. Confirm the law, effective dates, elections, and transition rules that apply to the taxpayer and tax year.' },
        ],
      },
      {
        id: 'identify-costs',
        title: 'Build a supportable cost inventory',
        blocks: [
          { type: 'list', items: ['Map research projects, development stages, and locations.', 'Identify employee time and related costs using a consistent method.', 'Separate research activities from production, maintenance, marketing, and other work where the facts support different treatment.', 'Retain invoices, time records, project documentation, and the rationale for allocations.', 'Reconcile the tax workpapers to financial reporting without assuming the accounting treatment controls tax treatment.'] },
        ],
      },
      {
        id: 'software-operations',
        title: 'Coordinate tax and engineering teams',
        blocks: [
          { type: 'paragraph', text: 'Tax teams often need technical context that is not apparent from payroll codes or invoice descriptions. A repeatable questionnaire for engineering and product leaders can capture project purpose, uncertainty, testing, release milestones, and work performed by contractors.' },
          { type: 'paragraph', text: 'For cross-border groups, distinguish where activities are performed and who bears the costs. Related-party arrangements, contract terms, and transfer-pricing documentation may affect the analysis.' },
        ],
      },
      {
        id: 'next-steps',
        title: 'What technology firms should do next',
        blocks: [
          { type: 'list', items: ['Identify every affected tax year before applying a treatment.', 'Review enacted law and current IRS guidance rather than relying on an older article or worksheet.', 'Ask a tax professional to evaluate elections, amended-return options, and transition requirements.', 'Keep a dated record of the position taken and the authorities considered.'] },
        ],
      },
    ],
  },
  'maximizing-state-savings-ptet-elections': {
    dek: 'How pass-through entity tax elections work at a high level, and the state-by-state details owners should verify before making one.',
    takeaways: [
      'A PTET election is available only where a state or locality provides one and the entity meets its rules.',
      'Election deadlines, tax base, payment mechanics, owner credits, and treatment vary by jurisdiction.',
      'IRS Notice 2020-75 addresses the federal treatment of certain state and local income taxes paid by a partnership or S corporation.',
      'An election can change cash flow and owner reporting; it does not guarantee net tax savings.',
    ],
    sections: [
      {
        id: 'ptet-overview',
        title: 'What a PTET election is',
        blocks: [
          { type: 'paragraph', text: 'Some states allow eligible partnerships or S corporations to elect to pay income tax at the entity level. The owners may receive a state credit, exclusion, or other adjustment under that state’s rules. This structure arose in part as states responded to the federal individual deduction limitation for state and local taxes.' },
          { type: 'paragraph', text: 'For federal purposes, IRS Notice 2020-75 describes the treatment of certain state and local income taxes imposed on and paid by a partnership or S corporation. The notice does not make every state election identical or ensure that every owner benefits.' },
        ],
      },
      {
        id: 'state-variation',
        title: 'Why state details matter',
        blocks: [
          { type: 'table', headers: ['Decision point', 'Questions to verify'], rows: [['Eligibility', 'Which entity types, owners, and income qualify?'], ['Election', 'Is the election annual, irrevocable, or subject to a deadline?'], ['Payment', 'When is tax due, and are estimated payments required?'], ['Owner relief', 'How are credits or adjustments allocated and claimed?'], ['Multistate impact', 'How do resident and nonresident owners receive relief?']] },
          { type: 'paragraph', text: 'State programs can differ significantly and may change from year to year. A federal deduction at the entity level does not necessarily mean every owner receives an equivalent state benefit.' },
        ],
      },
      {
        id: 'model-election',
        title: 'Model the election before making it',
        blocks: [
          { type: 'list', items: ['Estimate entity-level tax and the timing of cash payments.', 'Calculate owner-level credits and any limitations or carryforwards.', 'Compare the result with the owners’ federal and state positions under current law.', 'Consider nonresident owners, tiered partnerships, and members who may not benefit equally.', 'Review how the election affects basis, distributions, and accounting records under the applicable rules.'] },
        ],
      },
      {
        id: 'records',
        title: 'Document the decision and payment',
        blocks: [
          { type: 'paragraph', text: 'Retain the election confirmation, state instructions, payment evidence, allocation schedule, and owner statements. Reconcile amounts reported by the entity with credits claimed by each owner and identify any differences that require follow-up.' },
          { type: 'callout', title: 'No automatic savings', text: 'PTET is a planning choice, not a universal workaround. The outcome depends on current federal law, state rules, owner facts, and payment timing.' },
        ],
      },
      {
        id: 'review-cycle',
        title: 'Review every year',
        blocks: [
          { type: 'paragraph', text: 'Because state programs and federal rules evolve, revisit eligibility, deadlines, and modeled results before each election period. Use current state authority and professional tax advice for the entity’s actual ownership and operating footprint.' },
        ],
      },
    ],
  },
  'irs-publication-4557-cpa-cybersecurity-standards': {
    dek: 'A practical reading of IRS Publication 4557 for tax practices: understand the data at risk, build safeguards, and make incident response part of the written security program.',
    takeaways: [
      'Tax professionals hold sensitive identity, financial, and tax-return information that merits layered protection.',
      'Publication 4557 is IRS guidance; firms must distinguish its recommendations from separately applicable legal requirements.',
      'Access control, multifactor authentication, secure backups, workforce training, and vendor oversight are practical safeguards.',
      'A written incident-response process should define who acts, what systems to isolate, and which authorities or affected parties must be notified.',
    ],
    sections: [
      {
        id: 'why-tax-data',
        title: 'Why tax practices are high-value targets',
        blocks: [
          { type: 'paragraph', text: 'A tax practice may hold Social Security numbers, bank details, wage records, identity documents, and business financial statements. A compromised mailbox or document portal can expose information that enables identity theft and financial fraud.' },
          { type: 'paragraph', text: 'Publication 4557, Safeguarding Taxpayer Data, helps tax professionals think through security risks and safeguards. It should be read alongside the firm’s obligations under applicable federal, state, and professional rules.' },
        ],
      },
      {
        id: 'safeguards',
        title: 'Use layered safeguards',
        blocks: [
          { type: 'list', items: ['Require multifactor authentication for email, remote access, and systems holding taxpayer data.', 'Use unique credentials and least-privilege access; remove access promptly when roles change.', 'Encrypt sensitive data in transit and at rest using approved tools.', 'Maintain secure, tested backups and keep systems and software updated.', 'Train staff to identify phishing, suspicious login prompts, and unusual requests for payment or client data.'] },
        ],
      },
      {
        id: 'written-plan',
        title: 'Make the written security plan operational',
        blocks: [
          { type: 'paragraph', text: 'A written information security plan should describe the firm’s information, likely threats, safeguards, responsible personnel, vendor oversight, and review cycle. A document that is never tested or updated will not guide staff during an incident.' },
          { type: 'paragraph', text: 'Inventory where taxpayer data is stored and how it moves among tax software, portals, email, backups, and service providers. Use that map to define access, retention, and secure disposal.' },
        ],
      },
      {
        id: 'vendors',
        title: 'Review vendors and remote workflows',
        blocks: [
          { type: 'paragraph', text: 'A firm’s risk includes the tools and service providers that can access its systems or data. Confirm security commitments, incident notification timelines, subcontractor controls, data return or deletion, and the evidence available after an event.' },
          { type: 'callout', title: 'Guidance is not the whole legal analysis', text: 'Publication 4557 is an IRS resource. The FTC Safeguards Rule and other federal, state, contractual, or professional obligations may separately apply; determine which requirements govern the specific practice.' },
        ],
      },
      {
        id: 'incident-response',
        title: 'Prepare for an incident before it happens',
        blocks: [
          { type: 'list', items: ['Name the incident lead and identify technical, legal, insurance, and communications contacts.', 'Document how to isolate affected accounts and systems while preserving evidence.', 'Set a process for evaluating notices to the IRS, law enforcement, regulators, clients, and other parties as required.', 'Test the plan and update it after changes in systems, vendors, or staffing.'] },
          { type: 'paragraph', text: 'A tested response plan reduces confusion during a high-pressure event. Review IRS Publication 4557 and current agency instructions as part of the firm’s broader security program.' },
        ],
      },
    ],
  },
};
