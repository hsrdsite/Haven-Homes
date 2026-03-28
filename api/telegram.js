const https = require('https');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function sendTelegramMessage(text) {
  return new Promise((resolve, reject) => {
    if (!BOT_TOKEN || !CHAT_ID) {
      reject(new Error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in environment.'));
      return;
    }

    const payload = JSON.stringify({
      chat_id: CHAT_ID,
      text
    });

    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let responseBody = '';

      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        try {
          const data = JSON.parse(responseBody || '{}');
          resolve(data);
        } catch (error) {
          reject(new Error('Invalid Telegram API response.'));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(payload);
    req.end();
  });
}

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, description: 'Method not allowed.' });
  }

  try {
    const text = (req.body && req.body.text ? String(req.body.text) : '').trim();

    if (!text) {
      return res.status(400).json({ ok: false, description: 'Message text is required.' });
    }

    const telegramResponse = await sendTelegramMessage(text);

    if (telegramResponse.ok) {
      return res.status(200).json({ ok: true });
    }

    return res.status(502).json({
      ok: false,
      description: telegramResponse.description || 'Telegram API rejected the request.'
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      description: error.message || 'Server error while sending message.'
    });
  }
};
