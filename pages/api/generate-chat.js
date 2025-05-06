// /pages/api/generate.js or /app/api/generate/route.js (Next.js App Router)
import axios from 'axios';


export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { message } = req.body;

    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Invalid message format' });
    }

    try {
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'openai/gpt-3.5-turbo', // You can change to mistralai/mixtral-8x7b or others
                messages: [{ role: 'user', content: message }],
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost:3000', // Or your deployed site
                    'X-Title': 'My App',
                },
            }
        );

        const story = response.data.choices?.[0]?.message?.content;

        if (!story) {
            return res.status(500).json({ error: 'No story generated' });
        }
        
        res.status(200).json({ story });
    } catch (error) {
        console.error('OpenRouter Error:', error?.response?.data || error.message);
        res.status(500).json({ error: 'Failed to generate story via OpenRouter' });
    }
}
