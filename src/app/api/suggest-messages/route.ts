import { openai } from '@ai-sdk/openai';
import { StreamingTextResponse, streamText } from 'ai';
import OpenAI from 'openai/index.mjs';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try{
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be seperated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be an suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output shoulkd be structured like this : 'what's a hobby you;ve recently started? || If you could have a dinner with any historical figure, who would it be? || what's a simple thing makes you happy?. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."

  const result = await streamText({
    model: openai('gpt-3.5-turbo'),
    maxTokens: 100,
    prompt,
  });

  return result.toAIStreamResponse();
  }
  catch(error){
   
    if(error instanceof OpenAI.APIError){
        const {name, status, headers, message} = error

        return new Response(
            JSON.stringify({name, status, headers, message}),
            {
                status: 400
            }
        )
    }

    console.log(error)
  }
}