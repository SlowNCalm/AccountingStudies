// ============================================================
// AFM 291 — The Ledger Trail — content data
// All scenario numbers are drawn from / consistent with the
// course's own PBL case facts (paraphrased into original wording).
// ============================================================

const ACCOUNT_TYPES = {
  "Cash": "asset", "Accounts Receivable": "asset", "Contract Asset (Unbilled Revenue)": "asset",
  "Inventory": "asset", "Inventory — Clothing": "asset", "Parts Inventory": "asset",
  "Note Receivable": "asset", "Long-term Note Receivable": "asset",
  "Construction in Progress": "asset", "Land": "asset", "Equipment": "asset",
  "Accounts Payable": "liability", "Wages Payable": "liability", "Contract Liability (Deferred Revenue)": "liability",
  "Warranty Provision": "liability", "Billings on Construction Contract": "liability",
  "Provision for Onerous Contract": "liability",
  "Unearned Revenue": "liability", "Interest Payable": "liability", "Note Payable": "liability",
  "Common Shares": "equity", "Retained Earnings": "equity",
  "Revenue — Clothing": "revenue", "Revenue — Training Services": "revenue",
  "Revenue — Treadmills": "revenue", "Revenue — Extended Warranty": "revenue",
  "Revenue — Construction": "revenue", "Interest Income": "revenue", "Revenue": "revenue",
  "Cost of Goods Sold — Clothing": "expense", "Cost of Goods Sold — Training": "expense",
  "Cost of Goods Sold — Treadmills": "expense", "Warranty Expense": "expense",
  "Repair Labour Expense": "expense", "Repair Parts Expense": "expense",
  "Construction Costs Incurred": "expense", "Loss on Onerous Contract": "expense",
  "Cost of Goods Sold": "expense"
};

const ALL_ACCOUNTS = Object.keys(ACCOUNT_TYPES);

// ---------- LEVEL 1: Problem Solving Process ----------
const PSP_STAGES = [
  {
    tag: "Stage 1",
    title: "Assess the Situation",
    body: `Before touching a single debit, read the facts twice — once broad, once closely. Then pin down: <b>who</b> reads these statements and what did they specifically ask you to do? Is the entity public (IFRS) or private (ASPE, unless a lender or a near-term IPO calls for IFRS)? What's the business model — what do "typical assets" look like here? Is anyone in the room quietly hoping for a particular answer (an earnings target, a covenant)? And finally — build the timeline of what actually happened, in order.`
  },
  {
    tag: "Stage 2",
    title: "Identify the Issue(s)",
    body: `Say, in one sentence per issue, <i>what</i> the financial reporting question is and <i>why</i> the specific facts of this case make it uncertain. A good issue statement names the account and the judgment call — not just "revenue recognition" but "whether control of the clothing has transferred given the FOB terms and the delivery delay."`
  },
  {
    tag: "Stage 3",
    title: "Analyze the Issue(s)",
    body: `Find the standard that governs (and lean on the Conceptual Framework too, if it helps — or *only* the Framework if no standard applies). Apply it to the specific facts, arguing both sides where the case is genuinely ambiguous. Flag every spot where estimate or judgment is doing the work. Then sanity-check your answer against the context from Stage 1 — does it actually fit the story?`
  },
  {
    tag: "Stage 4",
    title: "Conclude, Justify & Recommend",
    body: `Think before you write. For each issue: state your specific position and the reasoning behind it (that's the <b>conclusion</b> — a comment), then translate it into the balance sheet / income statement impact and the actual journal entries (that's the <b>recommendation</b> — an action). A conclusion without an entry is unfinished; an entry without reasoning is a guess.`
  }
];

// ---------- LEVEL 2: Asset criteria flashcards ----------
const ASSET_FLASHCARDS = [
  { tag: "IFRS · Criterion 1", q: "What must an asset represent, under the IFRS Conceptual Framework?", a: "A right that has the potential to produce future economic benefits / future cash flows." },
  { tag: "IFRS · Criterion 2", q: "Who must hold the benefit?", a: "The entity must control the right to those future economic benefits." },
  { tag: "IFRS · Criterion 3", q: "How did that control arise?", a: "As the result of a past event — not something still to happen." },
  { tag: "ASPE · Criterion 1", q: "What must an asset represent, under ASPE 1000?", a: "A future benefit that contributes, directly or indirectly, to future net cash flows." },
  { tag: "ASPE · Criterion 2", q: "Who must hold the benefit?", a: "The entity can control access to that benefit." },
  { tag: "ASPE · Criterion 3", q: "How did control arise?", a: "The transaction or event giving the entity its right to, or control of, the benefit has already occurred." },
  { tag: "IFRS · Recognition", q: "Once something meets the definition of an asset, when is it actually recognized on the balance sheet?", a: "Only if recognizing it gives relevant information (probability of inflow/outflow) AND a faithful representation (measurement isn't too uncertain)." },
  { tag: "ASPE · Recognition", q: "What are ASPE's two recognition tests?", a: "(a) There's an appropriate basis of measurement and a reasonable estimate can be made, and (b) it's probable the future benefit will be obtained or given up." }
];

const ASSET_QUIZ = [
  {
    q: "A company signs a contract today to receive equipment next month. Under IFRS, is this equipment an asset today?",
    opts: [
      "No — control hasn't transferred yet; the past event that gives rise to control hasn't occurred.",
      "Yes — the contract itself is proof of a past event."
    ], correct: 0,
    explain: "Signing a contract for a future delivery is a future event from the buyer's perspective — control (and the asset) doesn't exist until the triggering past event (delivery / transfer of control) actually happens."
  },
  {
    q: "\"For items involving future economic benefits, it is probable that such benefits will be obtained\" — whose recognition wording is this closest to?",
    opts: ["ASPE", "IFRS"], correct: 0,
    explain: "This is the ASPE 1000 recognition test — a direct probability threshold. IFRS instead frames recognition around relevance and faithful representation, with probability as one input to relevance."
  },
  {
    q: "Under IFRS, high measurement uncertainty about an item mainly threatens which recognition criterion?",
    opts: ["Faithful representation", "Relevance"], correct: 0,
    explain: "IFRS recognition asks: does recognizing this give a faithful representation? Heavy estimation uncertainty is exactly the kind of thing that can undermine faithful representation, even when the item is clearly relevant."
  }
];

// ---------- LEVEL 3: Revenue 5-step story — Clothing Technology Ltd ----------
const CTL = {
  intro: `You're a co-op student in the financial reporting group at Clothing Technology Ltd. (CTL), a TSX-listed maker of "smart clothing" — premium athletic wear that tracks stride, cadence and heart rate. CTL also sells retail-staff sales training completely separately from any clothing purchase — customers can and do buy just the training. Management has told the team plainly that they want to hit an analyst-forecast 5% revenue growth target for 2025.`,
  contractCard: `<span class="who">The Vancouver Sports Inc. contract</span>
  On <b>November 3, 2025</b>, CTL signed a $2,000,000 contract with a long-standing customer, Vancouver Sports Inc. (VSI), to supply clothing inventory for VSI's new stores <i>and</i> train all 1,000 of VSI's new sales associates. Regular selling price of the clothing alone would be $1,760,000; the training alone would normally sell for $440,000. VSI has always paid CTL on time.<br><br>
  300 associates were trained in <b>December 2025</b>; the remaining 700 were trained in the <b>first two weeks of January 2026</b>. The clothing shipment (terms: FOB destination) was scheduled for late December 2025 but an ice storm delayed it — it actually arrived at VSI on <b>January 8, 2026</b>. Payment of the full $2,000,000 is due February 20, 2026.<br><br>
  Both clothing and training services cost CTL 60% of their normal selling price to deliver (training cost is entirely labour, paid monthly).`,
  wrongEntry: `On December 20, 2025 — right after the 300 associates finished training — the accounting manager booked:<br><br>
  <span style="font-family:'IBM Plex Mono',monospace;">Dr Accounts Receivable — VSI &nbsp;&nbsp;2,000,000<br>&nbsp;&nbsp;&nbsp;&nbsp;Cr Revenue — Training Services &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2,000,000</span>`,
  step1: {
    title: "Step 1 — Identify the Contract",
    criteria: [
      { text: "Approved in writing / orally / per customary practice?", met: true, note: "Signed contract, Nov 3, 2025." },
      { text: "Rights to goods & services identifiable?", met: true, note: "Clothing quantity/spec and training scope are both specified." },
      { text: "Payment terms identifiable?", met: true, note: "$2,000,000 due Feb 20, 2026." },
      { text: "Commercial substance?", met: true, note: "Timing and amount of CTL's future cash flows clearly change." },
      { text: "Collection probable?", met: true, note: "VSI has a perfect payment history with CTL." }
    ],
    conclude: "All five criteria are met — a valid contract exists as of November 3, 2025."
  },
  step2: {
    title: "Step 2 — Identify the Performance Obligations",
    body: `Two promises sit inside this contract: <b>clothing</b> (a good) and <b>training</b> (a service). Are they distinct?`,
    q: "Is the training a distinct performance obligation, separate from the clothing?",
    opts: [
      "Yes — VSI can benefit from the training on its own (CTL sells it stand-alone to other customers), and the promise to train is separately identifiable — it's generic sales training, not customized to the smart-clothing product and not highly interdependent with the clothing delivery.",
      "No — training only exists to support the clothing sale, so it should be bundled with the clothing as one performance obligation."
    ], correct: 0,
    explain: "Capable of being distinct: satisfied — CTL has a track record of customers buying training alone. Distinct in context: satisfied — the techniques aren't smart-clothing-specific, and nothing about the clothing requires the training (or vice versa) to function. <b>Conclusion: 2 performance obligations</b> — clothing and training."
  },
  step3: {
    title: "Step 3 — Determine the Transaction Price",
    body: `No variable consideration, no financing component, no non-cash consideration is described here — the transaction price is simply the fixed contract price.`,
    value: 2000000
  },
  step4: {
    title: "Step 4 — Allocate the Transaction Price",
    body: `Allocate using relative stand-alone selling prices.`,
    rows: [
      { name: "Clothing", standalone: 1760000 },
      { name: "Training", standalone: 440000 }
    ],
    total: 2000000
  },
  step5: {
    title: "Step 5 — Recognize Revenue",
    body: `Each performance obligation is assessed <i>separately</i> for its transfer-of-control pattern.
    <ul class="tight">
      <li><b>Clothing:</b> terms are FOB destination, so control (and risk) transfers only on arrival at VSI. This is a point-in-time obligation — satisfied only on <b>January 8, 2026</b>, not in December 2025.</li>
      <li><b>Training:</b> the customer (VSI) simultaneously receives and consumes the benefit as each associate is trained — a classic over-time performance obligation, measured with the output method (associates trained ÷ total associates).</li>
    </ul>`
  },
  spotError: {
    q: "The December 20, 2025 entry booked the full $2,000,000 to Revenue — Training Services. List what's wrong with it (pick the best summary).",
    opts: [
      "It recognizes training revenue that hasn't been earned yet (only 300 of 1,000 trained), mislabels clothing revenue as training revenue, and recognizes revenue for the clothing before control has transferred — while also omitting any related cost of goods sold or wage expense.",
      "It's basically fine — the amounts will average out once the rest of the training and the shipment happen in January."
    ], correct: 0,
    explain: "This single entry violates step 4 (wrong allocation — everything hit Training), step 5 (clothing wasn't yet delivered; only 30% of training was performed), and skips matching COGS/expense entirely. In a real close, you'd reverse it before booking the correct entries below."
  },
  dec2025JE: {
    title: "December 31, 2025 — correct entries",
    note: "Training: 300 / 1,000 associates trained → 30% of the $400,000 allocated to training is earned.",
    lines: [
      { account: "Contract Asset (Unbilled Revenue)", side: "DR", amount: 120000 },
      { account: "Revenue — Training Services", side: "CR", amount: 120000 },
      { account: "Cost of Goods Sold — Training", side: "DR", amount: 79200 },
      { account: "Cash", side: "CR", amount: 79200 }
    ],
    hint: "Training cost = 60% × $440,000 standalone price × 300/1000 trained = $79,200 (paid monthly, so credit Cash, not a payable). No clothing entry yet — control has not transferred (FOB destination, not yet delivered)."
  },
  jan2026JE: {
    title: "January 2026 — remaining performance",
    lines: [
      { account: "Accounts Receivable", side: "DR", amount: 280000 },
      { account: "Revenue — Training Services", side: "CR", amount: 280000 },
      { account: "Cost of Goods Sold — Training", side: "DR", amount: 184800 },
      { account: "Cash", side: "CR", amount: 184800 },
      { account: "Accounts Receivable", side: "DR", amount: 1600000 },
      { account: "Revenue — Clothing", side: "CR", amount: 1600000 },
      { account: "Cost of Goods Sold — Clothing", side: "DR", amount: 1056000 },
      { account: "Inventory — Clothing", side: "CR", amount: 1056000 }
    ],
    hint: "Remaining 700/1000 training = $280,000 revenue, cost 60%×440,000×0.7=$184,800. Clothing delivered Jan 8 → all $1,600,000 recognized, cost = 60%×$1,760,000=$1,056,000."
  }
};

// ---------- LEVEL 4: Significant financing — Barnett Corp ----------
const BARNETT = {
  intro: `Barnett Corp. manufactures welding machinery, is publicly traded, and has a December 31 year-end. On <b>January 1, 2025</b>, Barnett delivered a machine to a long-standing, excellent-credit customer. The customer paid a <b>$20,000 cash down payment</b> on delivery, with the balance settled through <b>four annual instalments of $40,000</b>, the first due December 31, 2025. No separate interest is stated anywhere in the note — but the appropriate market rate for a deal like this is <b>9%</b>.`,
  q1: {
    q: "Total cash Barnett will collect is $180,000 ($20,000 + 4×$40,000). Should Barnett recognize $180,000 of revenue on January 1, 2025?",
    opts: [
      "No — deferred payment terms like this typically contain a significant financing component. Revenue should be measured at the cash-equivalent (present value) price; the rest is interest income earned over time.",
      "Yes — $180,000 is exactly what will be collected, so that is the transaction price."
    ], correct: 0,
    explain: `IFRS 15 requires revenue to reflect the price the customer would have paid in cash today — recognizing the full $180,000 upfront would overstate 2025 revenue and understate future interest income.`
  },
  pvCalc: {
    body: `Use the ordinary annuity PV factor at 9%, n=4 (interpolated ≈ 3.2397):`,
    deposit: 20000,
    pvFactor: 3.2397, // approx from table interpolation between 8% and 9%... using given precise value below
    pvFactorExact: 3.2397,
    pvDeferred: 129588.80,
    price: 149588.80
  },
  initialJE: {
    title: "January 1, 2025 — initial recognition",
    lines: [
      { account: "Cash", side: "DR", amount: 20000 },
      { account: "Long-term Note Receivable", side: "DR", amount: 129588.80 },
      { account: "Revenue", side: "CR", amount: 149588.80 }
    ]
  },
  effInterest2025: {
    title: "December 31, 2025 — Effective interest method (IFRS & ASPE)",
    interest: 11662.99,
    principal: 28337.01,
    lines: [
      { account: "Cash", side: "DR", amount: 40000 },
      { account: "Interest Income", side: "CR", amount: 11662.99 },
      { account: "Long-term Note Receivable", side: "CR", amount: 28337.01 }
    ],
    hint: "Interest = opening receivable $129,588.80 × 9% = $11,662.99. The rest of the $40,000 reduces principal."
  },
  straightLine: {
    title: "ASPE alternative — Straight-line method",
    body: `ASPE also permits straight-line allocation of the total $30,411.20 interest ($180,000 − $149,588.80) evenly over the 4 years: $30,411.20 ÷ 4 = <b>$7,602.80</b> interest income each year, every year — a flat amount instead of a declining one. IFRS does not allow this shortcut; only the effective-interest method is used.`
  }
};

// ---------- LEVEL 5: Long-term contracts — Sun Technology Inc / VRE ----------
const STI = {
  intro: `Sun Technology Inc. (STI) is a private Canadian solar panel manufacturer, planning to go public in three to four years — so management has chosen to prepare its financial statements under <b>IFRS</b> already. STI designs, manufactures and installs custom panel arrays; the design, manufacturing and installation are so interlinked (and never sold separately) that your colleague has already concluded there is exactly <b>one</b> performance obligation, satisfied <b>over time</b> (STI's work creates/enhances an asset — the installed array — that the customer controls as it's built).`,
  contractCard: `<span class="who">The Vancouver Real Estate Ltd. (VRE) contract</span>
  Signed <b>June 30, 2024</b>. Contract price: <b>$4,200,000</b>. Original estimated total cost: <b>$2,720,000</b> (design $630,000 + manufacturing $1,320,000 + installation $770,000). STI uses the <b>input method</b> (cost-to-cost) to measure progress.<br><br>
  <b>2024 actuals:</b> design/engineering fully done, actual cost $700,000. Panels for several buildings were manufactured and installed (actual cost: $797,000 manufacturing + $510,000 installation = $1,307,000). Total 2024 actual costs incurred: <b>$2,007,000</b>. At Dec 31, 2024, the estimated <i>remaining</i> cost to finish was revised to <b>$1,000,000</b> — so total estimated contract cost is now $3,007,000.<br><br>
  <b>2025 actuals:</b> remaining panels manufactured and installed; all work finished May 15, 2025. Actual 2025 costs to complete: <b>$1,300,000</b>.<br><br>
  <b>Billing/payment:</b> $1,200,000 billed Dec 1, 2024 (paid Jan 5, 2025); the balance billed on completion (paid June 30, 2025).`,
  pctComplete2024: {
    formula: "% complete = costs incurred to date ÷ total estimated contract cost",
    calc: "$2,007,000 ÷ $3,007,000 = 66.744%",
    revenue: 2803259.06,
    cost: 2007000,
    grossProfit: 796259.06
  },
  pctComplete2025: {
    body: "By May 15, 2025 the contract is 100% complete. Recognize whatever revenue wasn't already recognized in 2024.",
    revenue: 1396740.94,
    cost: 1300000,
    grossProfit: 96740.94
  },
  je2024: {
    title: "2024 journal entries",
    lines: [
      { label: "Record costs incurred", entries: [
        { account: "Construction in Progress", side: "DR", amount: 2007000 },
        { account: "Cash", side: "CR", amount: 2007000 }
      ]},
      { label: "Record billing", entries: [
        { account: "Accounts Receivable", side: "DR", amount: 1200000 },
        { account: "Billings on Construction Contract", side: "CR", amount: 1200000 }
      ]},
      { label: "Recognize revenue & gross profit (input method)", entries: [
        { account: "Construction Costs Incurred", side: "DR", amount: 2007000 },
        { account: "Construction in Progress", side: "DR", amount: 796259.06 },
        { account: "Revenue — Construction", side: "CR", amount: 2803259.06 }
      ]}
    ]
  },
  je2025: {
    title: "2025 journal entries",
    lines: [
      { label: "Collect Dec 2024 billing", entries: [
        { account: "Cash", side: "DR", amount: 1200000 },
        { account: "Accounts Receivable", side: "CR", amount: 1200000 }
      ]},
      { label: "Record remaining costs incurred", entries: [
        { account: "Construction in Progress", side: "DR", amount: 1300000 },
        { account: "Cash", side: "CR", amount: 1300000 }
      ]},
      { label: "Final billing & collection", entries: [
        { account: "Accounts Receivable", side: "DR", amount: 3000000 },
        { account: "Billings on Construction Contract", side: "CR", amount: 3000000 }
      ]},
      { label: "Recognize remaining revenue & gross profit", entries: [
        { account: "Construction Costs Incurred", side: "DR", amount: 1300000 },
        { account: "Construction in Progress", side: "DR", amount: 96740.94 },
        { account: "Revenue — Construction", side: "CR", amount: 1396740.94 }
      ]},
      { label: "Close out CIP against Billings on completion", entries: [
        { account: "Billings on Construction Contract", side: "DR", amount: 4200000 },
        { account: "Construction in Progress", side: "CR", amount: 4200000 }
      ]}
    ]
  },
  recommendation: {
    q: "STI's supervisor asks: for this specific contract, would you recommend a different revenue recognition method for performance obligations satisfied over time?",
    opts: [
      "No — the input (cost-to-cost) method is appropriate here: STI's costs (design, manufacturing, installation) directly correspond to the transfer of value to VRE, and there's no better output measure (like units delivered) since this is one bundled, customized performance obligation rather than a series of identical/discrete outputs.",
      "Yes — switch to the output method, since it's always more objective than cost-based estimates."
    ], correct: 0,
    explain: "The output method works best when there's a directly observable measure of value transferred to the customer (units produced, milestones reached, surveys of work performed). Here the deliverable is one indivisible customized array — costs incurred are a faithful proxy for progress, so cost-to-cost remains the better choice."
  }
};

// ---------- LEVEL 6: Onerous contracts ----------
const ONEROUS = {
  concept: `A contract turns <b>onerous</b> when the unavoidable cost of fulfilling it exceeds the economic benefit it will bring — the unavoidable cost being the lower of (a) the cost to finish the job or (b) any penalty for walking away. The moment total expected contract costs are projected to exceed total contract revenue, the <i>entire</i> expected loss is expensed immediately — regardless of how much work is done, how far along the contract is, or profits on unrelated contracts. This rule is essentially identical under IFRS and ASPE.`,
  example: {
    card: `<span class="who">Harborview Construction Ltd.</span> is 40% through a fixed-price contract. Contract price: <b>$500,000</b>. Costs incurred to date: <b>$200,000</b>. A supplier price spike means the <i>remaining</i> costs to finish are now estimated at <b>$350,000</b> (up from an original estimate of $270,000).`,
    q: "What should Harborview do?",
    opts: [
      "Recognize the full loss immediately: total estimated cost is now $550,000 ($200,000 + $350,000) against $500,000 of revenue — a $50,000 total expected loss, expensed right away (reversing any profit already booked and then some, if applicable).",
      "Do nothing yet — wait until the contract is closer to completion before recognizing any loss."
    ], correct: 0,
    explain: "Total estimated cost ($550,000) now exceeds total contract revenue ($500,000) by $50,000. That entire loss is recognized now, in the period the estimate changed — you never spread an onerous-contract loss out over the remaining periods."
  }
};

// ---------- LEVEL 7: Provisions & Contingencies ----------
const IAS37_TREE = {
  scenario: `<span class="who">Torque Auto Parts Inc.</span> is being sued after a part it manufactured allegedly malfunctioned and caused property damage. Legal counsel advises that a court loss is <b>probable</b>, but the lawyers genuinely cannot put a number on the potential penalty — the case is too novel.`,
  steps: [
    { q: "Is there a present obligation as the result of a past (obligating) event?", opts: [
        { label: "Yes", next: 1 },
        { label: "No", next: "possible" }
      ]},
    { q: "Is the outflow of resources to settle the obligation probable?", opts: [
        { label: "Yes", next: 2 },
        { label: "No", next: "possible" }
      ]},
    { q: "Can a reliable estimate of the amount be made?", opts: [
        { label: "Yes", next: "provide" },
        { label: "No (rare)", next: "disclose" }
      ]}
  ],
  possible: { q: "Is a possible obligation involved, and is it remote?", opts: [
      { label: "Not remote", next: "disclose" },
      { label: "Remote", next: "nothing" }
    ]},
  outcomes: {
    provide: { title: "Recognize a Provision", cls: "provide", body: "All three IFRS recognition criteria are met: present obligation, probable outflow, reliable estimate. Record a liability and an expense/loss for the best estimate." },
    disclose: { title: "Disclose Only — Contingent Liability", cls: "disclose", body: "This matches Torque Auto Parts: a probable, present obligation exists, but no reliable estimate can be made (the rare exception) — so instead of recording a provision, disclose the contingent liability in the notes." },
    nothing: { title: "Do Nothing", cls: "nothing", body: "The possible obligation is remote — no recognition and no disclosure required." }
  }
};

const ASPE_CONTINGENT_LOSS_TABLE = [
  { measurable: "Measurable — can estimate", likely: "Accrue / recognize (plus disclose any exposure above the accrued amount)", notdet: "Disclose", unlikely: "No accrual / no disclosure" },
  { measurable: "Not measurable — cannot estimate", likely: "Disclose", notdet: "Disclose", unlikely: "No accrual / no disclosure" }
];

const ASPE_LOSS_QUIZ = [
  {
    q: "ASPE: a loss is likely and the amount can be reasonably estimated. Treatment?",
    opts: ["Accrue the loss (and disclose if exposure exceeds the accrued amount)", "Disclose only", "No accrual, no disclosure"], correct: 0
  },
  {
    q: "ASPE: the probability of loss is \"not determinable,\" but a reasonable estimate could be made if it did occur. Treatment?",
    opts: ["Accrue the loss", "Disclose in the notes", "No accrual, no disclosure"], correct: 1
  },
  {
    q: "ASPE: loss is unlikely, regardless of measurability. Treatment?",
    opts: ["Accrue the loss", "Disclose only", "No accrual, no disclosure"], correct: 2
  }
];

const CONTINGENT_ASSETS_GAINS = {
  ifrsTable: [
    { inflow: "Virtually certain", treat: "It's not contingent anymore — recognize the asset normally." },
    { inflow: "Probable, but not virtually certain", treat: "Do not recognize an asset — disclose it in the notes." },
    { inflow: "Not probable", treat: "Do not recognize, and no disclosure is required." }
  ],
  aspeRule: `ASPE is simpler and stricter: <b>contingent gains are never accrued</b> — booking a gain that might never materialize would overstate income. If it's <i>likely</i> a future event will confirm an asset was acquired or a liability reduced, disclose it in the notes. Otherwise, say nothing.`
};

// ---------- LEVEL 8: Subsequent events sorter ----------
const SUBSEQUENT_EVENTS = [
  {
    text: "At year-end a customer owed the company a large receivable, fully within normal collection terms. Three weeks after year-end, that customer files for bankruptcy — a filing triggered by problems that had clearly been building for months before year-end.",
    answer: "adjusting",
    explain: "The customer's deteriorating financial condition existed at year-end; the bankruptcy filing merely confirms a condition that was already present. Adjust the receivable/allowance for doubtful accounts."
  },
  {
    text: "A fire destroys a warehouse two months after year-end. Nothing about the warehouse's condition at year-end pointed to this risk.",
    answer: "nonadjusting",
    explain: "The fire is a new event, unrelated to any condition existing at year-end. Disclose the nature and estimated financial effect (or state that an estimate can't be made) — don't adjust recorded amounts."
  },
  {
    text: "A lawsuit that was already outstanding at year-end — and for which a provision had been recorded based on legal counsel's year-end estimate — is settled for a different amount shortly after year-end.",
    answer: "adjusting",
    explain: "The obligating event (and the underlying condition) existed at year-end; the settlement simply provides better evidence for measuring that already-existing obligation. Adjust the provision to the settled amount."
  },
  {
    text: "The company issues a large batch of new common shares to the public one month after year-end, to fund an unrelated expansion.",
    answer: "nonadjusting",
    explain: "This is a new financing event with no connection to conditions existing at year-end. Disclose it (it can be material to readers assessing dilution/liquidity), but it doesn't change any year-end balances."
  },
  {
    text: "The market value of the company's publicly-traded equity investments declines sharply in the weeks after year-end, driven by a broad market downturn.",
    answer: "nonadjusting",
    explain: "A general decline in market prices after year-end reflects conditions that arose after year-end, not conditions that existed at year-end — even though it relates to an asset already on the books. Disclose only."
  }
];

// ---------- LEVEL 9: Changes & Errors sorter ----------
const CHANGES_ERRORS = [
  {
    text: "New information becomes available showing that a piece of equipment will last 3 years longer than originally assumed, so depreciation is recalculated going forward.",
    answer: "estimate",
    explain: "A change driven by new information/experience about an asset's future benefits is a change in accounting estimate — accounted for prospectively (no restatement of prior years)."
  },
  {
    text: "Management voluntarily switches from one acceptable inventory costing method to another because the new method will provide more relevant, reliable information to users.",
    answer: "policy",
    explain: "A voluntary switch between acceptable accounting policies, made because it improves relevance/reliability, is a change in accounting policy — applied retrospectively, restating prior periods as if the new policy had always been used."
  },
  {
    text: "While preparing this year's statements, the accounting team discovers a math error in last year's depreciation calculation — reliable information that was available at the time was simply misapplied.",
    answer: "error",
    explain: "This is a prior period error: reliable information available when the prior statements were prepared was used incorrectly. Corrected through retrospective restatement of the prior period(s)."
  },
  {
    text: "A company re-estimates its warranty provision this year because actual claims experience has come in different from what was originally assumed.",
    answer: "estimate",
    explain: "Revising a provision based on new experience is the textbook change in estimate — prospective treatment, adjusting the current and future periods only."
  }
];

// ---------- BOSS LEVEL: Momentum Fitness Inc / TitanFit ----------
const BOSS = {
  intro: `You've been promoted to the co-op student the manager actually trusts. Momentum Fitness Inc. (MFI), a TSX-listed maker of smart fitness equipment, needs a full write-up on its TitanFit contract — and this one pulls together revenue recognition, warranties, and provisions all at once.`,
  contractCard: `<span class="who">The TitanFit contract</span>
  On <b>June 30, 2025</b>, MFI contracted to manufacture and deliver <b>50 smart treadmills</b> to TitanFit. Normal selling price: <b>$3,000/treadmill</b> ($150,000 total). Every treadmill includes a standard <b>1-year manufacturer's warranty</b> against manufacturing defects (free repairs) — this is bundled in, not separately sold. Customers can <i>also</i> buy a <b>2-year extended warranty</b> covering incidental damage, stand-alone priced at <b>$200/treadmill</b> ($10,000 for 50). TitanFit bought the extended warranty for all 50 units, so MFI discounted the whole deal to <b>$158,000</b>, paid in cash on delivery, <b>September 1, 2025</b>.<br><br>
  Historically, manufacturing-defect repair costs run about <b>1% of normal selling price</b>. MFI expects roughly <b>50% of treadmills</b> (25 units) will need a repair at some point under the 2-year extended warranty, and — because time isn't a good indicator of when that value transfers — MFI recognizes the extended warranty's revenue using the <b>output method</b>, based on <i>number of repairs performed</i> (not elapsed time).<br><br>
  On <b>December 1, 2025</b>, 3 treadmills needed repairs from incidental damage (covered by the extended warranty): $500 labour (charged to Wages Payable) + $300 parts (from Parts Inventory). These were the only repairs in 2025.<br><br>
  Treadmill sales carry a <b>40% gross margin</b> on normal selling price.`,
  step2: {
    title: "Step 2 — How many performance obligations, and what about the warranties?",
    q: "How should MFI treat the two warranties?",
    opts: [
      "The 1-year manufacturer's (assurance-type) warranty isn't sold separately and just confirms the treadmill works as promised — account for it under IAS 37 as a provision, not as revenue. The 2-year extended warranty <i>is</i> sold separately with its own stand-alone price and provides a service beyond basic assurance — it's a distinct performance obligation, with its own slice of revenue recognized over time.",
      "Both warranties are just extra insurance products — record both entirely as provisions and recognize no warranty revenue at all."
    ], correct: 0,
    explain: "This is exactly the IFRS 15 (par. B28–B30) distinction: a warranty a customer can't buy separately, that just assures the product works as specified, is a cost provision under IAS 37. A separately-priced warranty that's actually optional is its own performance obligation with its own revenue."
  },
  allocation: {
    title: "Step 4 — Allocate the $158,000",
    rows: [
      { name: "50 Treadmills", standalone: 150000 },
      { name: "Extended Warranty (50 units)", standalone: 10000 }
    ],
    total: 158000
  },
  saleJE: {
    title: "September 1, 2025 — delivery",
    lines: [
      { account: "Cash", side: "DR", amount: 158000 },
      { account: "Revenue — Treadmills", side: "CR", amount: 148125 },
      { account: "Contract Liability (Deferred Revenue)", side: "CR", amount: 9875 },
      { account: "Cost of Goods Sold — Treadmills", side: "DR", amount: 90000 },
      { account: "Inventory", side: "CR", amount: 90000 },
      { account: "Warranty Expense", side: "DR", amount: 1500 },
      { account: "Warranty Provision", side: "CR", amount: 1500 }
    ],
    hint: "Treadmills recognized immediately (point-in-time; 150,000/160,000 × 158,000 = $148,125). Extended warranty consideration ($9,875) deferred as a Contract Liability until repairs establish progress. COGS = 60% × $150,000 = $90,000. Assurance warranty provision = 1% × $150,000 = $1,500 (IAS 37 — expected cost, not revenue)."
  },
  repairJE: {
    title: "December 1, 2025 — 3 repairs performed (extended warranty)",
    lines: [
      { account: "Repair Labour Expense", side: "DR", amount: 500 },
      { account: "Wages Payable", side: "CR", amount: 500 },
      { account: "Repair Parts Expense", side: "DR", amount: 300 },
      { account: "Parts Inventory", side: "CR", amount: 300 },
      { account: "Contract Liability (Deferred Revenue)", side: "DR", amount: 1185 },
      { account: "Revenue — Extended Warranty", side: "CR", amount: 1185 }
    ],
    hint: "Output method: 3 of the 25 total repairs MFI expects over the warranty's life = 12% complete → 12% × $9,875 = $1,185 of extended-warranty revenue earned. Repair costs are expensed as incurred, not deferred."
  },
  inputMethodCompare: {
    body: `Your manager also wants to know what 2025 would have looked like using the <b>input method</b> (cost-to-cost) instead — estimated total repair cost for the whole extended-warranty pool is 30% of its $10,000 stand-alone price = <b>$3,000</b>. Actual 2025 repair cost = $800 ($500 + $300).`,
    q: "Under the input method, how much extended-warranty revenue would MFI recognize in 2025?",
    opts: [
      "$800 ÷ $3,000 = 26.7% complete → 26.7% × $9,875 ≈ $2,633",
      "Still $1,185 — the method doesn't change the answer"
    ], correct: 0,
    explain: "Input and output methods can diverge meaningfully: here, cost-to-cost (26.7%) recognizes more than twice as much 2025 revenue as the repairs-completed output measure (12%), because the 3 early repairs happened to be relatively costly ones. MFI's choice of the output method (based on repair count, since cost doesn't reliably track customer value transferred) is the more defensible measure of progress for a service like this."
  }
};

const LEVELS = [
  { id: "process", num: 1, title: "The Problem-Solving Process", eyebrow: "Field Manual", desc: "The 4-stage method behind every case on this exam.", icon: "①", type: "process", xp: 40 },
  { id: "assets", num: 2, title: "What Counts as an Asset?", eyebrow: "Conceptual Framework", desc: "IFRS vs. ASPE asset & recognition criteria.", icon: "②", type: "flashquiz", xp: 60,
    flashcards: ASSET_FLASHCARDS, quiz: ASSET_QUIZ },
  { id: "revenue5step", num: 3, title: "The Five-Step Revenue Model", eyebrow: "IFRS 15 · Case File", desc: "Walk Clothing Technology Ltd. through all 5 steps.", icon: "③", type: "ctl", xp: 120 },
  { id: "financing", num: 4, title: "Hidden Interest: Significant Financing", eyebrow: "IFRS 15 · Case File", desc: "Barnett Corp. and the present value of a promise.", icon: "④", type: "barnett", xp: 100 },
  { id: "longterm", num: 5, title: "Long-Term Contracts & % of Completion", eyebrow: "Over-Time Revenue", desc: "Sun Technology Inc. builds a solar array — and a P&L.", icon: "⑤", type: "sti", xp: 130 },
  { id: "onerous", num: 6, title: "Onerous Contracts", eyebrow: "When the Deal Turns Sour", desc: "Recognize the full loss the moment you know it.", icon: "⑥", type: "onerous", xp: 60 },
  { id: "contingencies", num: 7, title: "Provisions & Contingencies", eyebrow: "IAS 37 · ASPE 3290", desc: "Provide, disclose, or do nothing? Trace the tree.", icon: "⑦", type: "contingencies", xp: 100 },
  { id: "subsequent", num: 8, title: "Subsequent Events", eyebrow: "The Gap Between Year-End and Sign-Off", desc: "Adjusting or non-adjusting? Sort five real cases.", icon: "⑧", type: "sorter", xp: 70, data: SUBSEQUENT_EVENTS, sortLabels: ["adjusting","nonadjusting"], sortButtonLabels: ["Adjusting","Non-Adjusting"] },
  { id: "changes", num: 9, title: "Estimates, Policies & Errors", eyebrow: "IAS 8", desc: "Prospective, retrospective, or restated?", icon: "⑨", type: "sorter2", xp: 70, data: CHANGES_ERRORS, sortLabels: ["estimate","policy","error"], sortButtonLabels: ["Estimate","Policy","Error"] },
  { id: "boss", num: 10, title: "Boss Case: Momentum Fitness Inc.", eyebrow: "Final Exam Simulation", desc: "Warranties, provisions, and revenue — all at once.", icon: "★", type: "boss", xp: 200, boss: true }
];
