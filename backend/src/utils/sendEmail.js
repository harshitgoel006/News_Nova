import fetch from 'node-fetch';  // npm i node-fetch

const maskEmail = (email = '') => {
  const [name, domain] = email.split('@');
  return domain ? `${name.slice(0, 2)}***@${domain}` : '[invalid-email]';
};

const sendEmail = async (to, subject, html) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'harshitgoel885@gmail.com';
  const senderName = process.env.BREVO_SENDER_NAME || 'NewsNova';

  if (!apiKey) {
    throw new Error('BREVO_API_KEY is not configured');
  }
  if (!to) {
    throw new Error('Recipient email is required');
  }
  
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Brevo: ${error.message}`);
  }

  const data = await response.json();
  console.log('Brevo accepted email:', {
    to: maskEmail(to),
    from: maskEmail(senderEmail),
    subject,
    messageId: data.messageId,
  });
  return data;
};

export default sendEmail;
