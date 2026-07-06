# Testing Guide: Protegrity Data Protection Plugin for Agentic AI Workflows

This guide provides comprehensive testing methods for protecting sensitive data across all layers of agentic AI workflows in Cursor IDE.

## 📋 Prerequisites for Testing

Before running tests, ensure:

1. **Cursor IDE** is installed and latest version
2. **Plugin installed** via Marketplace search "Protegrity Data Protection"
3. **Protegrity services running** (Docker Compose or cloud API)
4. **Environment variables set** (for protection APIs):
   ```bash
   export DEV_EDITION_EMAIL='your-email@example.com'
   export DEV_EDITION_PASSWORD='your-password'
   export DEV_EDITION_API_KEY='your-api-key'
   ```
5. **Python 3.12+** installed for agentic workflows
6. **`protegrity-ai-developer-python`** SDK installed for protect/unprotect (`pip install protegrity-ai-developer-python`)

---

## 🤖 Understanding Agentic AI Workflows

Agentic AI systems involve multiple layers where sensitive data must be protected:

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: USER INPUT & PROMPTS (Secure Agent Creation)      │
│ - User messages containing PII                              │
│ - Sensitive context/instructions                            │
│ - Authentication credentials                                │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 2: AGENT REASONING & PLANNING                         │
│ - Agent thinking process                                    │
│ - Tool selection and parameters                             │
│ - Data passed to tools                                      │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 3: TOOL EXECUTION & API CALLS                         │
│ - External API calls with sensitive data                    │
│ - Database queries with PII                                 │
│ - File operations with restricted data                      │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 4: TOOL OUTPUTS & DATA PROCESSING                     │
│ - API responses containing PII                              │
│ - Intermediate processing results                           │
│ - Cached or stored responses                                │
└─────────────────────────────────────────────────────────��───┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 5: AGENT OUTPUT & USER RESPONSE                       │
│ - Final agent response to user                              │
│ - Potential data leakage in output                          │
│ - Logging and audit trails                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧪 Test Methods for Agentic Workflows

### Method 1: Secure Agent Creation & Initialization

**Test Focus:** Protecting agent prompts and system instructions

**Steps:**
1. Create a new agent in Cursor
2. Include sensitive context/instructions
3. Use Privacy Reviewer Agent to analyze
4. Apply protections before deployment

**Test File:** `secure-agent-creation.md`

---

### Method 2: Input Layer Protection

**Test Focus:** Protecting user inputs before agent processing

**Steps:**
1. Prepare user message with PII
2. Apply data discovery
3. Redact/protect sensitive fields
4. Pass sanitized input to agent

---

### Method 3: Agent Reasoning Layer Protection

**Test Focus:** Protecting agent's internal reasoning process

**Steps:**
1. Test agent with protected input tokens
2. Verify agent can reason with tokens
3. Check intermediate outputs for leakage
4. Use semantic guardrails for multi-turn conversations

---

### Method 4: Tool Integration & API Call Protection

**Test Focus:** Protecting data sent to external tools/APIs

**Steps:**
1. Define tools that require sensitive data
2. Protect data before tool execution
3. Validate API calls with hook
4. Process returned data safely

---

### Method 5: Output Layer Protection

**Test Focus:** Protecting agent's final output

**Steps:**
1. Run agent and collect output
2. Scan output for data leakage
3. Redact/mask sensitive data in response
4. Return sanitized output to user

---

## 🎯 Complete Agentic Workflow Test Cases

### Test Case 1: Secure Customer Service Agent

**Scenario:** Building a customer support agent that handles sensitive customer data

#### **Layer 1: User Input Protection**

**Raw User Message:**
```
Hello, I'm calling about my account. 
My name is Jennifer Williams and my account number is ACC-2024-98765. 
I'm worried someone accessed it from my email account at jen.williams@corporate.com. 
My phone is 555-234-5678.
```

**Command:** `Protegrity: Analyze Data Sensitivity`

**Expected Output:**
```
Sensitivity Level: HIGH

Detected Entities:
- PERSON: Jennifer Williams (confidence: 0.98)
- ACCOUNT_NUMBER: ACC-2024-98765 (confidence: 0.95)
- EMAIL_ADDRESS: jen.williams@corporate.com (confidence: 0.96)
- PHONE_NUMBER: 555-234-5678 (confidence: 0.92)

Recommended Protection: Tokenization for database lookups
```

**Protect Sensitive Fields:**

**Command:** `Protegrity: Protect Text`

Protected message:
```
Hello, I'm calling about my account. 
My name is <TOKEN_person_001> and my account number is <TOKEN_account_001>. 
I'm worried someone accessed it from my email account at <TOKEN_email_001>. 
My phone is <TOKEN_phone_001>.
```

#### **Layer 2: Secure Agent Definition**

**Create Agent Prompt (Protected):**

```markdown
---
name: secure-customer-support-agent
description: Customer support agent with data protection safeguards
---

# Secure Customer Support Agent

You are a customer support agent with strict data protection protocols.

## CRITICAL: Data Handling Rules

1. **NEVER** display full account numbers, SSNs, or email addresses
2. **ALWAYS** use customer tokens for lookups
3. **VERIFY** request authorization before accessing sensitive data
4. **LOG** all data access operations
5. **SANITIZE** responses before returning to customer

## Customer Information Available (Protected)

- Customer Name: <TOKEN_person_001>
- Account Number: <TOKEN_account_001>
- Email: <TOKEN_email_001>
- Phone: <TOKEN_phone_001>

## Tools Available

1. **verify-account-token** - Verify account using token
2. **get-account-history-token** - Retrieve history using token
3. **update-security-token** - Update security using tokens
4. **log-interaction** - Log interaction with PII protection

## Response Format

Always respond with:
1. Acknowledgment (no PII)
2. Verification status (token-based)
3. Solution (using protected references)
4. Confirmation (without exposing original data)

Example safe response:
"Thank you for contacting us. I've verified your account using 
your token reference. I can help you update your security settings. 
To proceed, I'll send a verification code to your registered email."
```

**Command:** `Protegrity: Privacy Reviewer Agent`

**Review Focus:**
- ✅ No unprotected PII in agent instructions
- ✅ Tools accept tokens not raw data
- ✅ Response format prevents data leakage
- ✅ Logging includes audit trails

#### **Layer 3: Agent Reasoning Protection**

**Tool Definition (Protected):**

```python
# tools/verify_account.py (Protected)

def verify_account_token(customer_token: str) -> dict:
    """
    Verify account using protected token.
    
    Args:
        customer_token: Protected customer token (e.g., <TOKEN_account_001>)
    
    Returns:
        Verification result with masked data
    """
    # Call Protegrity API to unprotect token
    # Only within secure environment
    
    result = {
        "status": "verified",
        "account_display": "ACC-****-98765",  # Masked display
        "last_activity": "2024-06-15 14:30 UTC",
        "token_reference": customer_token
    }
    
    return result
```

**Agent Reasoning Prompt:**

```
User Request (Protected): 
"I'm concerned about unauthorized access to account <TOKEN_account_001>"

Agent Reasoning (Internal):
1. Receive protected token: <TOKEN_account_001>
2. Call verify_account_token(<TOKEN_account_001>)
3. Receive: {status: verified, account_display: "ACC-****-98765"}
4. Assess concern (token-based, no exposure)
5. Prepare response (masked references only)

Agent Output Planning:
- DO NOT reveal full account number
- DO reference token for database operations
- DO log interaction with tokens
- DO ask for additional verification if needed
```

**Command:** `Protegrity: Semantic Guardrails Skill`

**Multi-Turn Conversation:**
```
User: "I need to check my account ACC-2024-98765"
Agent Thought: Receive protected token in input sanitization layer
Agent Response: "I can help check your account. 
                I have your account reference secured."

Risk Assessment: 0.15 (Low - proper token usage)
```

#### **Layer 4: Tool Execution & API Protection**

**Before Tool Call - Data Protection:**

```bash
# Hook: validate-api-calls.sh triggers before execution

API Call (BEFORE PROTECTION - UNSAFE):
curl -X POST https://api.banking.com/verify \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "account_number": "ACC-2024-98765",
    "customer_name": "Jennifer Williams",
    "email": "jen.williams@corporate.com"
  }'

❌ ERROR: Raw PII detected in API call!
Use protected tokens instead.
```

**After Tool Call - Safe Protected Version:**

```bash
# Use protected tokens

API Call (AFTER PROTECTION - SAFE):
curl -X POST https://api.banking.com/verify \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "account_token": "<TOKEN_account_001>",
    "customer_token": "<TOKEN_person_001>",
    "email_token": "<TOKEN_email_001>",
    "timestamp": "2024-06-17T10:30:00Z"
  }'

✅ SAFE: Only tokens sent, original data protected
```

**Command:** `Protegrity: Scan Conversation Risk`

**Validate Tool Execution:**
```
Tool Call Risk Assessment:
Message 1 (Tool Parameters): 
  Risk Score: 0.05 (Very Low)
  PII Detected: None (all tokenized)
  Status: SAFE TO EXECUTE ✅

Recommendation: Proceed with API call
```

#### **Layer 5: Tool Output Processing**

**API Response (May Contain Sensitive Data):**

```json
{
  "status": "verified",
  "account_number": "ACC-2024-98765",
  "customer_name": "Jennifer Williams",
  "email": "jen.williams@corporate.com",
  "phone": "555-234-5678",
  "balance": "$15,432.50",
  "recent_activity": [
    {
      "date": "2024-06-17",
      "description": "Online Transfer",
      "amount": "$500.00"
    }
  ],
  "security_status": "COMPROMISED",
  "last_login": "2024-06-17 09:15 UTC from IP: 192.168.1.100"
}
```

**Command:** `Protegrity: Redact Sensitive Data`

**Configuration:**
- Method: `mask`
- Entity Types: PERSON, EMAIL_ADDRESS, PHONE_NUMBER, ACCOUNT_NUMBER

**Protected Response:**

```json
{
  "status": "verified",
  "account_number": "ACC-****-98765",
  "customer_name": "[MASKED]",
  "email": "[MASKED]@[MASKED].com",
  "phone": "[MASKED]",
  "balance": "$15,432.50",
  "recent_activity": [
    {
      "date": "2024-06-17",
      "description": "Online Transfer",
      "amount": "$500.00"
    }
  ],
  "security_status": "COMPROMISED",
  "last_login": "2024-06-17 09:15 UTC from IP: 192.168.1.100"
}
```

#### **Layer 6: Agent Output Protection**

**Agent Response Before Protection:**

```
Hello Jennifer,

I've verified your account ACC-2024-98765. 
Your email jen.williams@corporate.com shows as the primary contact.
Your phone on file is 555-234-5678.

I can confirm your security concern is valid. 
There was a login from an unexpected IP: 192.168.1.100
on 2024-06-17 at 09:15 UTC, which is not your usual location.

Balance on account: $15,432.50
```

**Command:** `Protegrity: Redact Sensitive Data`

**Agent Response After Protection:**

```
Hello [MASKED],

I've verified your account reference. 
The email and phone on file appear secure.

I can confirm your security concern is valid. 
There was a login from an unexpected IP at 09:15 UTC, 
which is not your usual location.

Account balance shows no unauthorized transactions.
```

**Command:** `Protegrity: Scan Conversation Risk`

**Final Response Risk Assessment:**
```
Response Risk Score: 0.12 (Low)
Detected PII: None (all redacted/masked)
Status: SAFE TO RETURN TO USER ✅

Recommendation: Send response to customer
```

#### **Complete Workflow Summary:**

```
┌─────────────────────────────────────────────────────┐
│ User Input: Raw message with PII                    │
│ ↓ PROTECT (Analyze + Tokenize)                      │
│ Sanitized Input: Protected tokens                   │
├─────────────────────────────────────────────────────┤
│ Agent Reasoning: Uses tokens for processing         │
│ ↓ VALIDATE (Semantic Guardrails)                    │
│ Risk Score: 0.15 (Low)                              │
├───────────────────────────────��─────────────────────┤
│ Tool Execution: API call with tokens                │
│ ↓ VALIDATE (beforeShellExecution hook)              │
│ Status: SAFE - Only tokens sent                     │
├─────────────────────────────────────────────────────┤
│ Tool Output: Response with sensitive data           │
│ ↓ REDACT (Mask sensitive fields)                    │
│ Protected Output: Masked/referenced data            │
├─────────────────────────────────────────────────────┤
│ Final Response: Agent output to user                │
│ ↓ SCAN (Conversation Risk)                          │
│ Risk Score: 0.12 (Low - Safe)                       │
│ ↓ RETURN                                            │
│ User receives masked, safe response ✅              │
└─────────────────────────────────────────────────────┘
```

---

### Test Case 2: Secure Data Analysis Agent

**Scenario:** Building an agent that analyzes sensitive datasets

#### **Layer 1: Data Input Protection**

**Raw Dataset:**
```csv
employee_id,name,salary,ssn,email,department
E001,John Smith,$95000,123-45-6789,john.smith@company.com,Engineering
E002,Sarah Johnson,$87500,987-65-4321,sarah.j@company.com,Marketing
E003,Michael Chen,$105000,456-78-9012,m.chen@company.com,Engineering
```

**Command:** `Protegrity: Analyze Data Sensitivity`

**Expected Output:**
```
Sensitivity Level: RESTRICTED (Salary + SSN + PII)

Detected Entities:
- PERSON: John Smith, Sarah Johnson, Michael Chen (0.99)
- SOCIAL_SECURITY_ID: Multiple SSNs (0.99)
- EMAIL_ADDRESS: Multiple emails (0.96)
- ACCOUNT_NUMBER (Salary equivalent) (0.92)

Compliance: SOX, GDPR, CCPA
Recommended Protection: Full encryption + Tokenization
```

#### **Layer 2: Secure Analysis Agent**

**Agent Definition:**

```markdown
---
name: secure-data-analysis-agent
description: Analyzes sensitive datasets with automatic PII protection
---

# Secure Data Analysis Agent

## Protected Dataset Schema

You will analyze a dataset with the following structure:
- employee_token: <TOKEN_emp_001>
- salary_token: <TOKEN_sal_001>
- ssn_token: <TOKEN_ssn_001>
- email_token: <TOKEN_email_001>

## Analysis Tools (Token-Based)

1. **analyze-salary-distribution-token** - Uses salary tokens
2. **find-salary-outliers-token** - Uses anonymized salary tokens
3. **generate-department-report-token** - Uses department + tokens
4. **export-analysis-anonymized** - Exports with masked data

## Constraints

- NEVER operate on unprotected PII
- ALWAYS use tokens for database queries
- GENERATE reports with redacted/masked PII
- LOG all data access operations
- SANITIZE all outputs before return
```

**Command:** `Protegrity: Security Compliance Auditor Agent`

**Agent Audit Checklist:**
- ✅ Agent uses tokens for data operations
- ✅ No unprotected PII in agent definition
- ✅ All outputs are anonymized
- ✅ Compliance with data protection regulations
- ✅ Audit logging enabled

#### **Layer 3: Input Transformation to Tokens**

**Transform Dataset:**

```python
# Before: Raw CSV
employee_id,name,salary,ssn,email,department
E001,John Smith,$95000,123-45-6789,john.smith@company.com,Engineering

# After: Tokenized CSV
employee_id,name_token,salary_token,ssn_token,email_token,department
E001,<TOKEN_name_001>,<TOKEN_sal_001>,<TOKEN_ssn_001>,<TOKEN_email_001>,Engineering
E002,<TOKEN_name_002>,<TOKEN_sal_002>,<TOKEN_ssn_002>,<TOKEN_email_002>,Marketing
E003,<TOKEN_name_003>,<TOKEN_sal_003>,<TOKEN_ssn_003>,<TOKEN_email_003>,Engineering
```

**Command:** `Protegrity: Protect Text` (Batch)

For each sensitive field:
1. Protect name → name_token
2. Protect salary → salary_token
3. Protect SSN → ssn_token
4. Protect email → email_token

#### **Layer 4: Agent Analysis with Tokens**

**Agent Analysis Request:**

```
Analyze the salary distribution across departments using the protected dataset.
Focus on:
1. Average salary by department (using salary_token)
2. Salary outliers (using salary_token)
3. Retention risk analysis (using ssn_token for employee tracking)

Provide summary statistics only, no employee identification.
```

**Agent Processing (Protected):**

```
Analysis Results (Tokenized):
Department: Engineering
- Avg Salary (Token-based): $100,000
- Outliers: 2 (using salary_token analysis)
- Tokens used: <TOKEN_sal_001>, <TOKEN_sal_003>

Department: Marketing
- Avg Salary (Token-based): $87,500
- Outliers: None
- Tokens used: <TOKEN_sal_002>

Data Access Log:
- Operation: salary_distribution_analysis
- Tokens Accessed: 3
- PII Exposure: None
- Status: COMPLIANT ✅
```

#### **Layer 5: Output Report Generation**

**Generated Report (Safe):**

```markdown
# Salary Analysis Report - Q2 2024

## Executive Summary
Analysis of compensation across departments using anonymized data.

## By Department

### Engineering (3 employees)
- Average Compensation: $100,000
- Range: $95,000 - $105,000
- Variance: Medium

### Marketing (1 employee)
- Average Compensation: $87,500

## Key Findings
1. Engineering team has higher average compensation
2. One outlier in Engineering at $105,000
3. No anomalies detected in compensation policy

## Compliance Status
✅ No PII in report
✅ All analysis done with protected tokens
✅ Original employee data never exposed
✅ Audit trail: Available in system logs

Date: 2024-06-17
Analyst (Token): <ANALYST_TOKEN>
Reviewed: True
```

**Command:** `Protegrity: Scan Conversation Risk`

**Report Risk Assessment:**
```
Report Content Risk: 0.08 (Very Low)
Detected PII: None
Masked/Tokenized: All sensitive fields
Status: SAFE TO DISTRIBUTE ✅
```

---

### Test Case 3: Secure Document Processing Agent

**Scenario:** Agent processes customer documents containing sensitive information

#### **Layer 1: Document Input**

**Input Document:**

```
LOAN APPLICATION FORM

Applicant Information:
Name: Robert Williams
Date of Birth: 03/15/1978
Social Security Number: 567-89-0123
Email: robert.williams@email.com
Phone: 202-555-0198

Employment Information:
Employer: TechCorp Inc.
Position: Senior Engineer
Annual Income: $125,000
Employer Phone: 202-555-0199

Financial Information:
Bank Name: First National Bank
Account Number: 9876543210
Routing Number: 021000021
Monthly Expenses: $4,200

Collateral:
Property Address: 456 Maple Drive, Washington, DC 20001
Property Value: $650,000
```

**Command:** `Protegrity: Analyze Data Sensitivity`

**Output:**
```
Sensitivity Level: RESTRICTED (Loan PII + Financial Data)

Detected Entities:
- PERSON: Robert Williams (0.99)
- DATE (DOB): 03/15/1978 (0.98)
- SOCIAL_SECURITY_ID: 567-89-0123 (0.99)
- EMAIL_ADDRESS: robert.williams@email.com (0.96)
- PHONE_NUMBER: Multiple (0.92)
- ACCOUNT_NUMBER: 9876543210 (0.94)
- LOCATION: Washington, DC 20001 (0.91)

Compliance: FCRA, GLBA, FDIC, GDPR
Recommended: Full encryption + Tokenization
```

#### **Layer 2: Protect Document**

**Command:** `Protegrity: Protect Text` (Systematically)

**Protected Document:**

```
LOAN APPLICATION FORM

Applicant Information:
Name: <TOKEN_applicant_name>
Date of Birth: <TOKEN_applicant_dob>
Social Security Number: <TOKEN_applicant_ssn>
Email: <TOKEN_applicant_email>
Phone: <TOKEN_applicant_phone>

Employment Information:
Employer: TechCorp Inc.
Position: Senior Engineer
Annual Income: <TOKEN_applicant_income>
Employer Phone: 202-555-0199

Financial Information:
Bank Name: First National Bank
Account Number: <TOKEN_applicant_account>
Routing Number: <TOKEN_applicant_routing>
Monthly Expenses: $4,200

Collateral:
Property Address: <TOKEN_applicant_address>
Property Value: $650,000
```

#### **Layer 3: Document Analysis Agent**

**Secure Agent Definition:**

```markdown
---
name: secure-document-processor-agent
description: Processes loan documents with full data protection
---

# Secure Document Processor Agent

## Document Processing Rules

1. **TOKENIZATION**: All PII fields are tokenized
2. **VERIFICATION**: Verify tokens match application requirements
3. **ASSESSMENT**: Analyze loan-to-value using protected references
4. **REPORTING**: Generate reports without exposing PII

## Available Operations

- verify_applicant_token(applicant_token)
- check_credit_history_token(ssn_token)
- validate_income_token(income_token)
- assess_collateral_token(property_token)
- generate_decision_report_anonymized()

## Output Format

All outputs must:
- Use token references instead of actual values
- Include only decision-relevant information
- Mask or omit sensitive details
- Include audit trail with tokens
```

#### **Layer 4: Agent Processing**

**Agent Analysis Flow:**

```
Step 1: Receive Protected Document
↓
Step 2: Extract and Validate Tokens
  - applicant_name: <TOKEN_applicant_name> ✅
  - applicant_ssn: <TOKEN_applicant_ssn> ✅
  - applicant_income: <TOKEN_applicant_income> ✅
↓
Step 3: Perform Token-Based Analysis
  - Token Verification: Success
  - Credit Check (using ssn_token): Pending
  - Income Verification (using income_token): $125,000
  - Collateral Assessment (using property_token): $650,000
↓
Step 4: Calculate Decision (Token-Based)
  - Loan Amount Requested: $520,000
  - LTV (Loan-to-Value): 80%
  - Income Ratio: 4.2x (within guidelines)
↓
Step 5: Generate Decision
  - Recommendation: APPROVED (based on tokens, no PII exposure)
  - Token References: All maintained
  - Audit Log: Complete
```

**Command:** `Protegrity: Semantic Guardrails Skill`

**Multi-Step Conversation Risk:**
```
Message 1: Receive document with tokens
Risk Score: 0.05 (Very Low)

Message 2: Agent processes tokens
Risk Score: 0.08 (Very Low)

Message 3: Generate report reference tokens
Risk Score: 0.10 (Low)

Conversation Risk: 0.08 (Low - SAFE) ✅
```

#### **Layer 5: Decision Report Generation**

**Generated Report (Protected):**

```markdown
# LOAN APPLICATION DECISION REPORT
Application ID: APP-2024-001234
Date: 2024-06-17

## Applicant Reference
Applicant Token: <TOKEN_applicant_name>
SSN Token: <TOKEN_applicant_ssn>
(Original PII maintained in secure token storage only)

## Financial Assessment
Income (Token Reference): <TOKEN_applicant_income>
Employment Status: Verified via token
Credit Status: Pending external verification

## Collateral Assessment
Property Token: <TOKEN_applicant_address>
Property Value: $650,000
LTV: 80%
Status: Acceptable

## Underwriting Decision
APPROVED

Conditions:
1. Provide recent pay stubs (collect without token exposure)
2. Property appraisal (reference token only)
3. Title insurance policy required

## Compliance & Audit
- All PII Protected: Yes ✅
- Token-Based Processing: Yes ✅
- No Plain-Text PII in Report: Yes ✅
- Audit Trail: Available ✅
- Regulatory Compliance: FCRA, GLBA ✅
```

**Command:** `Protegrity: Scan Conversation Risk`

**Final Output Assessment:**
```
Report Risk Score: 0.05 (Very Low)
Detected PII: None
Masked Fields: All sensitive references
Status: SAFE TO DISTRIBUTE TO APPLICANT ✅
```

---

### Test Case 4: Multi-Agent Secure Coordination

**Scenario:** Multiple agents collaborate on sensitive data processing

#### **Architecture:**

```
┌─────────────────────────────────────────────────────┐
│        User Request (with PII)                      │
└────────────────────┬────────────────────────────────┘
                     ↓
        ┌────────────────────────┐
        │ Input Protection Layer │
        │ - Analyze sensitivity  │
        │ - Tokenize PII        │
        └────────────┬───────────┘
                     ↓
    ┌────────────────────────────────────┐
    │ Agent 1: Data Classification Agent │
    │ - Classify protected data          │
    │ - Validate tokens                  │
    └────┬─────────────────────────┬─────┘
         ↓                         ↓
    ┌────────────────┐    ┌────────────────┐
    │ Agent 2: Query │    │ Agent 3: Report│
    │ Processing Agt │    │ Generation Agt │
    │ (uses tokens)  │    │ (uses tokens)  │
    └────┬───────────┘    └────┬───────────┘
         ↓                      ↓
        ┌────────────────────────┐
        │ Output Protection Layer│
        │ - Redact sensitive     │
        │ - Scan for leakage     │
        └────────────┬───────────┘
                     ↓
        ┌────────────────────────┐
        │ Final Response (Safe)  │
        └────────────────────────┘
```

#### **Test Execution:**

**Step 1: Create Input Protection Agent**

```markdown
# Agent 1: Secure Input Processor

## Responsibility
- Receive raw user input
- Analyze data sensitivity
- Tokenize all PII
- Pass protected tokens to downstream agents
```

**Step 2: Create Classification Agent**

```markdown
# Agent 2: Data Classification Agent

## Responsibility
- Receive protected tokens
- Classify data by sensitivity level
- Validate token integrity
- Route to appropriate processing agents
```

**Step 3: Create Processing Agents**

```markdown
# Agent 3: Query Processing Agent
- Accepts only tokenized data
- Executes queries using tokens
- Returns results without PII exposure

# Agent 4: Report Generation Agent
- Receives query results
- Generates reports using tokens
- Masks/redacts sensitive information
```

**Step 4: Create Output Protection Agent**

```markdown
# Agent 5: Output Protection Agent

## Responsibility
- Receive final agent responses
- Scan for PII leakage
- Redact any exposed information
- Validate risk scores
- Return safe output to user
```

**Test Multi-Agent Workflow:**

```
Input: "Analyze customer data for John Smith (SSN: 123-45-6789)"

Agent 1 Processing:
├─ Detect: PERSON, SOCIAL_SECURITY_ID
├─ Create: <TOKEN_person_001>, <TOKEN_ssn_001>
├─ Output: "Analyze protected customer data <TOKEN_person_001>"
└─ Risk: 0.05 (Low)

Agent 2 Processing:
├─ Receive: Protected tokens
├─ Classify: HIGH SENSITIVITY
├─ Validate: Tokens OK
└─ Route: To Query Agent

Agent 3 Processing:
├─ Query: SELECT * FROM customers WHERE ssn_token = '<TOKEN_ssn_001>'
├─ Return: {name_token: '...', balance: $5000, ...}
└─ Risk: 0.08 (Low)

Agent 4 Processing:
├─ Generate Report: "Customer <TOKEN_person_001> balance: $5000"
├─ Mask PII: Yes
└─ Risk: 0.10 (Low)

Agent 5 Processing:
├─ Scan Output: No unprotected PII detected
├─ Risk Assessment: 0.06 (Low) ✅
└─ Final Output: SAFE TO RETURN ✅

Final Response to User:
"Analysis complete for protected customer reference. 
Account balance verified: $5,000. No PII exposed."
```

---

## ✅ Comprehensive Agentic Workflow Testing Checklist

### Layer 1: Input Protection
- [ ] User input analyzed for PII
- [ ] Sensitive fields tokenized before agent receives
- [ ] Sanitized input passed to agent
- [ ] Original PII not accessible to agent
- [ ] Audit log records tokenization

### Layer 2: Agent Definition & Initialization
- [ ] Agent instructions don't contain unprotected PII
- [ ] Agent prompts reference tokens only
- [ ] Agent system message enforces protection rules
- [ ] Privacy reviewer approves agent design
- [ ] Security compliance auditor validates setup

### Layer 3: Agent Reasoning
- [ ] Agent can reason with protected tokens
- [ ] Agent doesn't attempt to decrypt tokens
- [ ] Intermediate reasoning doesn't leak PII
- [ ] Multi-turn conversations protected
- [ ] Semantic guardrails active on agent thoughts

### Layer 4: Tool Integration & API Calls
- [ ] Tools accept only tokenized parameters
- [ ] API calls validated before execution
- [ ] beforeShellExecution hook prevents PII in requests
- [ ] External APIs receive tokens, not raw data
- [ ] API error responses processed safely

### Layer 5: Tool Output Processing
- [ ] API responses scanned for PII
- [ ] Sensitive fields in responses masked/redacted
- [ ] Processed data passed to agent as safe references
- [ ] Intermediate caching doesn't expose PII
- [ ] Data transformation maintains protection

### Layer 6: Final Output Protection
- [ ] Agent output scanned for data leakage
- [ ] Conversation risk assessment performed
- [ ] Response redacted/masked as needed
- [ ] User receives safe output only
- [ ] Full audit trail maintained

### Agent Collaboration (Multi-Agent)
- [ ] Agents communicate using tokens only
- [ ] Inter-agent data protection boundaries enforced
- [ ] Agent-to-agent communication monitored
- [ ] No PII in inter-agent messages
- [ ] Complete audit of agent interactions

---

## 🔒 Security Best Practices for Agentic AI

### DO's ✅

1. **DO Protect Early**
   - Tokenize PII before agent receives input
   - Use tokens throughout agent workflow

2. **DO Validate Tokens**
   - Verify token integrity at each layer
   - Log all token operations

3. **DO Mask Outputs**
   - Redact sensitive information in agent responses
   - Sanitize before returning to user

4. **DO Monitor Conversations**
   - Use semantic guardrails on multi-turn interactions
   - Track conversation risk scores

5. **DO Enforce Constraints**
   - Agent prompts explicitly forbid PII handling
   - Tools only accept tokenized inputs

6. **DO Audit Everything**
   - Log all data protection operations
   - Maintain complete audit trail
   - Regular compliance reviews

### DON'Ts ❌

1. **DON'T Pass Raw PII to Agents**
   - Always tokenize first
   - Never expose credentials in agent context

2. **DON'T Trust Tool Outputs**
   - Always scan API responses for PII
   - Apply redaction/masking to tool results

3. **DON'T Log Sensitive Data**
   - Use token references in logs
   - Never store plain-text PII in logs

4. **DON'T Skip Output Validation**
   - Always check final response for leakage
   - Perform risk assessment on all outputs

5. **DON'T Assume Tool Security**
   - Validate API calls before execution
   - Use hooks to prevent PII in external calls

6. **DON'T Ignore Compliance**
   - Maintain audit logs for regulatory requirements
   - Validate compliance with standards (GDPR, HIPAA, etc.)

---

## 📊 Test Execution Template

### Test Case: [Name]

**Scenario:** [Description]

**Layers Tested:**
- [ ] Layer 1: Input Protection
- [ ] Layer 2: Agent Definition
- [ ] Layer 3: Reasoning
- [ ] Layer 4: Tool Execution
- [ ] Layer 5: Output Processing
- [ ] Layer 6: Final Output

**Test Steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Results:**
- [Result 1]
- [Result 2]
- [Result 3]

**Actual Results:**
- [Result 1]
- [Result 2]
- [Result 3]

**Status:** ✅ PASS / ❌ FAIL

**Issues Found:**
- [Issue 1]
- [Issue 2]

**Audit Log:**
```
[Log entries]
```

**Compliance:** ✅ GDPR / HIPAA / CCPA / SOX

**Signed Off:** [Date] [Reviewer]

---

## 📚 Command Reference for Testing

### Data Protection Commands

```bash
# Analyze sensitivity
Cmd+Shift+P → "Protegrity: Analyze Data Sensitivity"

# Protect (tokenize)
Cmd+Shift+P → "Protegrity: Protect Text"

# Unprotect (retrieve original)
Cmd+Shift+P → "Protegrity: Unprotect Text"

# Redact (remove/mask)
Cmd+Shift+P → "Protegrity: Redact Sensitive Data"

# Scan conversation risk
Cmd+Shift+P → "Protegrity: Scan Conversation Risk"
```

### Agent Commands

```bash
# Privacy review
Cmd+Shift+P → Request "Privacy Reviewer Agent"
Paste: Agent definition or code

# Compliance audit
Cmd+Shift+P → Request "Security Compliance Auditor Agent"
Paste: Workflow definition or agent setup

# Use skill
Cmd+Shift+P → Reference skill by name
Example: "Use data-discovery skill on..."
```

---

## 🚀 Next Steps

1. **Start with Test Case 1** - Secure Customer Service Agent
2. **Progress to Test Case 2** - Data Analysis Agent
3. **Test Case 3** - Document Processing
4. **Advanced: Test Case 4** - Multi-Agent Coordination
5. **Create Custom Test Cases** for your use cases

---

## 📞 Support & Resources

- **Plugin Repository:** https://github.com/Saritha-Pty/cursor-plugin-protegrity-data-protection
- **Setup Guide:** [SETUP.md](SETUP.md)
- **Protegrity Docs:** https://developer.docs.protegrity.com/
- **Report Issues:** GitHub Issues in plugin repository

---

**Protect every layer. Secure your agents. Build with confidence.** 🛡️✨
