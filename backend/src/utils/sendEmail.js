import fetch from 'node-fetch';  // npm i node-fetch

const sendEmail = async (to, subject, html) => {
  const apiKey = process.env.BREVO_API_KEY;
  
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'NewsNova', email: 'harshitgoel885@gmail.com' },
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
  console.log('✅ Brevo sent:', data.messageId);
  return data;
};

export default sendEmail;