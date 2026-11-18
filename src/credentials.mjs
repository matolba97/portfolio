/**
 * @typedef {Object} Credential
 * @property {string} id
 * @property {string} title
 * @property {string} issuer
 * @property {string} issuedAt Issue month in YYYY-MM format.
 * @property {string} [credentialId]
 * @property {string} [verificationUrl]
 * @property {string} [documentUrl] Public issuer-hosted certificate image.
 * @property {'certification' | 'professionalCertificate' | 'completion' | 'assessment' | 'nanodegree'} [type]
 * @property {number} [featuredOrder]
 * @property {{ file: string, width: number, height: number }} [image] Issuer badge.
 */

/** @type {Credential[]} */
export const credentials = [
  {
    id: "data-analyst-associate", title: "Data Analyst Associate",
    issuer: "DataCamp", issuedAt: "2026-09",
    credentialId: "DAA0010862851412",
    verificationUrl: "https://www.datacamp.com/certificate/DAA0010862851412",
    type: "certification", featuredOrder: 1,
    image: { file: "data-analyst-associate.png", width: 196, height: 240 },
  },
  {
    id: "power-bi-365", title: "Certificate of completion - Power BI",
    issuer: "365 Data Science", issuedAt: "2025-11",
    credentialId: "CC-18298D638C",
    verificationUrl: "https://learn.365datascience.com/certificates/CC-18298D638C/",
    documentUrl: "https://365datascience.com/resources/certificates/CC-18298D638C.jpg",
    type: "completion", featuredOrder: 4,
  },
  {
    id: "sql-associate", title: "SQL Associate",
    issuer: "DataCamp", issuedAt: "2025-11",
    credentialId: "SQA0015337745586",
    verificationUrl: "https://www.datacamp.com/certificate/SQA0015337745586",
    type: "certification", featuredOrder: 2,
    image: { file: "sql-associate.png", width: 196, height: 240 },
  },
  {
    id: "driving-sustainability", title: "Driving Sustainability at Your Organization",
    issuer: "LinkedIn", issuedAt: "2025-10",
    verificationUrl: "https://www.linkedin.com/learning/certificates/a0ad063526a2d4d5999f2137834caea258b5123f0724297814f3f3f8f466753b/",
  },
  {
    id: "understanding-prompt-engineering", title: "Understanding Prompt Engineering",
    issuer: "DataCamp", issuedAt: "2025-10",
    credentialId: "UPE0016817648736",
    verificationUrl: "https://www.datacamp.com/skill-verification/UPE0016817648736",
  },
  {
    id: "intermediate-sql-2025", title: "Intermediate SQL",
    issuer: "DataCamp", issuedAt: "2025-10",
    credentialId: "ISQL0019858977693",
    verificationUrl: "https://www.datacamp.com/skill-verification/ISQL0019858977693",
  },
  {
    id: "generative-ai", title: "Generative AI",
    issuer: "DataCamp", issuedAt: "2025-10",
    credentialId: "GAIC0017969584967",
    verificationUrl: "https://www.datacamp.com/skill-verification/GAIC0017969584967",
  },
  {
    id: "ai-ethics", title: "AI Ethics",
    issuer: "DataCamp", issuedAt: "2025-10",
    credentialId: "AIE0024427782631",
    verificationUrl: "https://www.datacamp.com/skill-verification/AIE0024427782631",
  },
  {
    id: "understanding-artificial-intelligence", title: "Understanding Artificial Intelligence",
    issuer: "DataCamp", issuedAt: "2025-10",
    credentialId: "UAI2731764316",
    verificationUrl: "https://www.datacamp.com/skill-verification/UAI2731764316",
  },
  {
    id: "ai-fundamentals", title: "AI Fundamentals",
    issuer: "DataCamp", issuedAt: "2025-10",
    credentialId: "AIF0028876082569",
    verificationUrl: "https://www.datacamp.com/skill-verification/AIF0028876082569",
  },
  {
    id: "business-analysis", title: "Business Analysis",
    issuer: "HPA", issuedAt: "2024-06",
  },
  {
    id: "power-bi-fundamentals", title: "Power BI Fundamentals",
    issuer: "DataCamp", issuedAt: "2025-06",
    verificationUrl: "https://www.datacamp.com/completed/statement-of-accomplishment/track/f1fff84f9baa46bbc152f43b717fcee9f04186ee",
  },
  {
    id: "sql-intermediate-hackerrank", title: "SQL (Intermediate)",
    issuer: "HackerRank", issuedAt: "2025-01",
    credentialId: "cab36d152380",
    verificationUrl: "https://www.hackerrank.com/certificates/cab36d152380",
    type: "assessment", featuredOrder: 5,
  },
  {
    id: "foundations-of-generative-ai", title: "Nano Degree, Foundations of Generative AI",
    issuer: "Udacity", issuedAt: "2024-12",
    credentialId: "900ec89c-b7bc-11ef-a8ee-97354d5dae26",
    verificationUrl: "https://www.udacity.com/certificate/e/900ec89c-b7bc-11ef-a8ee-97354d5dae26",
    type: "nanodegree", featuredOrder: 6,
  },
  {
    id: "postgresql-summary-stats", title: "PostgreSQL Summary Stats and Window Functions",
    issuer: "DataCamp", issuedAt: "2024-11",
    credentialId: "#36,894,866",
    verificationUrl: "https://www.datacamp.com/statement-of-accomplishment/course/95d13a5061407ddb44322fd6706d5ce3cd16d4e4",
  },
  {
    id: "postgresql-data-manipulation", title: "Functions for Manipulating Data in PostgreSQL",
    issuer: "DataCamp", issuedAt: "2024-12",
    credentialId: "#37,198,883",
    verificationUrl: "https://www.datacamp.com/statement-of-accomplishment/course/1748db78b3967c3e12658c856e51931294328a51",
  },
  {
    id: "intermediate-sql-2024", title: "Intermediate SQL",
    issuer: "DataCamp", issuedAt: "2024-10",
    verificationUrl: "https://www.datacamp.com/statement-of-accomplishment/course/b2dfdf21dfac0e9d998d0683f2ee6e25a3bbbc18",
  },
  {
    id: "ibm-data-analyst", title: "IBM Data Analyst Professional Certificate",
    issuer: "IBM (via Coursera)", issuedAt: "2024-09",
    credentialId: "YMLMCOF7S2KB",
    verificationUrl: "https://www.coursera.org/account/accomplishments/specialization/YMLMCOF7S2KB",
    documentUrl: "https://s3.amazonaws.com/coursera_assets/meta_images/generated/CERTIFICATE_LANDING_PAGE/CERTIFICATE_LANDING_PAGE~YMLMCOF7S2KB/CERTIFICATE_LANDING_PAGE~YMLMCOF7S2KB.jpeg",
    type: "professionalCertificate", featuredOrder: 3,
  },
  {
    id: "excel-basics", title: "Excel Basics for Data Analysis",
    issuer: "IBM (via Coursera)", issuedAt: "2024-02",
    credentialId: "2QK9APVG8FMM",
    verificationUrl: "https://www.coursera.org/account/accomplishments/verify/2QK9APVG8FMM",
    documentUrl: "https://s3.amazonaws.com/coursera_assets/meta_images/generated/CERTIFICATE_LANDING_PAGE/CERTIFICATE_LANDING_PAGE~2QK9APVG8FMM/CERTIFICATE_LANDING_PAGE~2QK9APVG8FMM.jpeg",
  },
  {
    id: "sql-basic-hackerrank", title: "SQL (Basic) Certificate",
    issuer: "HackerRank", issuedAt: "2024-08",
    credentialId: "5793840835ce",
    verificationUrl: "https://www.hackerrank.com/certificates/5793840835ce",
  },
  {
    id: "basic-data-descriptors", title: "Basic Data Descriptors, Statistical Distributions, and Application to Business Decisions",
    issuer: "Rice University (via Coursera)", issuedAt: "2024-01",
    credentialId: "4P6EEZ66N8XW",
    verificationUrl: "https://www.coursera.org/account/accomplishments/verify/4P6EEZ66N8XW",
  },
  {
    id: "data-visualization-excel-cognos", title: "Data Visualization and Dashboards with Excel and Cognos",
    issuer: "IBM (via Coursera)", issuedAt: "2024-02",
    credentialId: "SQC9XV99LJXC",
    verificationUrl: "https://www.coursera.org/account/accomplishments/verify/SQC9XV99LJXC",
  },
  {
    id: "python-for-data-science", title: "Python for Data Science, AI & Development",
    issuer: "IBM (via Coursera)", issuedAt: "2024-05",
    credentialId: "LPFB3W2DFKWH",
    verificationUrl: "https://www.coursera.org/account/accomplishments/verify/LPFB3W2DFKWH",
    documentUrl: "https://s3.amazonaws.com/coursera_assets/meta_images/generated/CERTIFICATE_LANDING_PAGE/CERTIFICATE_LANDING_PAGE~LPFB3W2DFKWH/CERTIFICATE_LANDING_PAGE~LPFB3W2DFKWH.jpeg",
  },
  {
    id: "databases-and-sql", title: "Databases and SQL for Data Science with Python",
    issuer: "IBM (via Coursera)", issuedAt: "2024-07",
    credentialId: "BFPT5H2EGZZK",
    verificationUrl: "https://www.coursera.org/account/accomplishments/verify/BFPT5H2EGZZK",
  },
  {
    id: "data-analysis-with-python", title: "Data Analysis with Python",
    issuer: "IBM (via Coursera)", issuedAt: "2024-08",
    credentialId: "KZ1045BAJYE1",
    verificationUrl: "https://www.coursera.org/account/accomplishments/verify/KZ1045BAJYE1",
  },
];
