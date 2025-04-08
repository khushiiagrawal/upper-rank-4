import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI('AIzaSyAiboOEzf7IJhuuL99QYnTNOdjA9R0UsCY');

export async function POST(req: Request) {
  try {
    const { prompt, image, audio } = await req.json();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let response;
    if (image) {
      // Handle image-based queries
      const imageData = await fetch(image).then(res => res.arrayBuffer());
      const imageMimeType = image.split(';')[0].split(':')[1];
      
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: Buffer.from(imageData).toString('base64'),
            mimeType: imageMimeType
          }
        }
      ]);
      response = result.response;
    } else if (audio) {
      // Handle audio-based queries
      const audioData = await fetch(audio).then(res => res.arrayBuffer());
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: Buffer.from(audioData).toString('base64'),
            mimeType: 'audio/wav'
          }
        }
      ]);
      response = result.response;
    } else {
      // Handle text-only queries
      const result = await model.generateContent(prompt);
      response = result.response;
    }

    return NextResponse.json({ response: response.text() });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 