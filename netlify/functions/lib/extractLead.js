/**
 * Extract lead data from AI response (primary method)
 * Looks for ***JSON_START*** markers in AI reply
 * @param {string} reply - AI response text
 * @returns {Object|null} - { name, email, company, summary } or null
 */
function extractLeadFromAI(reply) {
  if (!reply || !reply.includes("***JSON_START***")) {
    return null;
  }

  try {
    const parts = reply.split("***JSON_START***");
    const jsonStr = parts[1].split("***JSON_END***")[0];
    const leadData = JSON.parse(jsonStr);
    
    // Validate required fields
    if (leadData.email && leadData.company) {
      console.log("[extractLead] AI extraction successful:", leadData.email);
      return leadData;
    }
    return null;
  } catch (e) {
    console.error("[extractLead] AI JSON parse failed:", e.message);
    return null;
  }
}

/**
 * Extract lead data from user message using regex (fallback method)
 * Catches leads when AI doesn't output JSON markers
 * @param {string} userMessage - The user's chat message
 * @returns {Object|null} - { name, email, company, summary } or null
 */
function extractLeadFromRegex(userMessage) {
  if (!userMessage) return null;

  // Email regex - standard pattern
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
  const emailMatch = userMessage.match(emailRegex);
  
  // Company patterns - common phrases
  const companyPatterns = [
    /(?:from|at|with|for)\s+([A-Z][A-Za-z0-9\s&.,'-]+(?:Inc|LLC|Corp|Co|Ltd|Company|Solutions|Tech|Group)?)/i,
    /([A-Z][A-Za-z0-9\s&.,'-]+(?:Inc|LLC|Corp|Co|Ltd|Company|Solutions|Tech|Group))/i,
    /company[:\s]+([A-Za-z0-9\s&.,'-]+)/i
  ];

  // Name patterns
  const namePatterns = [
    /(?:I'm|I am|my name is|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
    /^([A-Z][a-z]+)\s+(?:from|at|here)/i
  ];

  let email = null;
  let company = null;
  let name = null;

  // Extract email
  if (emailMatch && emailMatch.length > 0) {
    email = emailMatch[0].toLowerCase();
  }

  // Extract company
  for (const pattern of companyPatterns) {
    const match = userMessage.match(pattern);
    if (match && match[1]) {
      company = match[1].trim();
      // Clean up common suffixes
      company = company.replace(/[,.]$/, '').trim();
      if (company.length > 2 && company.length < 50) {
        break;
      }
      company = null;
    }
  }

  // Extract name
  for (const pattern of namePatterns) {
    const match = userMessage.match(pattern);
    if (match && match[1]) {
      name = match[1].trim();
      break;
    }
  }

  // Only return if we have BOTH email AND company (minimum viable lead)
  if (email && company) {
    console.log("[extractLead] Regex extraction successful:", email, company);
    return {
      name: name || 'Chat User',
      email: email,
      company: company,
      summary: 'Lead captured via regex fallback'
    };
  }

  return null;
}

/**
 * Clean AI reply by removing JSON markers
 * @param {string} reply - Raw AI response
 * @returns {string} - Clean reply for user
 */
function cleanReply(reply) {
  if (!reply) return '';
  
  if (reply.includes("***JSON_START***")) {
    return reply.split("***JSON_START***")[0].trim();
  }
  return reply;
}

/**
 * Combined lead extraction: AI first, then regex fallback
 * @param {string} aiReply - AI response text
 * @param {string} userMessage - Original user message
 * @returns {Object|null} - Lead data or null
 */
function extractLead(aiReply, userMessage) {
  // Try AI extraction first (structured data)
  const aiLead = extractLeadFromAI(aiReply);
  if (aiLead) {
    return aiLead;
  }

  // Fallback to regex extraction
  const regexLead = extractLeadFromRegex(userMessage);
  if (regexLead) {
    return regexLead;
  }

  return null;
}

module.exports = { 
  extractLead, 
  extractLeadFromAI, 
  extractLeadFromRegex, 
  cleanReply 
};
