import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI('AIzaSyAiboOEzf7IJhuuL99QYnTNOdjA9R0UsCY');

// Load the bot instructions from the MD file
const getBotInstructions = () => {
  // Read the file from the public directory
  const filePath = path.join(process.cwd(), 'public', '3RVision-AI-Bot-Instructions.md');
  const instructionsText = fs.readFileSync(filePath, 'utf8');
  return instructionsText;
};

export async function POST(req: Request) {
  try {
    const { prompt, image, audio } = await req.json();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Get the bot instructions
    const instructions = getBotInstructions();
    
    // Create an enhanced prompt with the instructions as context
    const enhancedPrompt = `
You are 3RVision AI, an eco-friendly waste management assistant.
Use the following instruction manual to guide your responses:

${instructions}

Now, please respond to the user's query:
${prompt}
`;

    let response;
    if (image) {
      // Handle image-based queries
      const imageData = await fetch(image).then(res => res.arrayBuffer());
      const imageMimeType = image.split(';')[0].split(':')[1];
      
      const result = await model.generateContent([
        enhancedPrompt,
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
        enhancedPrompt,
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
      const result = await model.generateContent(enhancedPrompt);
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