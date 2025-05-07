import OpenAI from "openai";
import { OPENAI_API_KEY } from '$env/static/private';

const client = new OpenAI({
    apiKey: OPENAI_API_KEY
});

export let POST = async ({request}) => {
let body = await request.json()

const response = await client.responses.create({
    model: "gpt-4.1",
    input: body.message
});
console.log(response);

return new Response(JSON.stringify({ message: response.output_text }), {
    headers: { 'Content-Type': 'application/json' }
});
}