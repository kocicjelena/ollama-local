import ollama from 'ollama'

const message = { role: 'user', content: 'Why is the sky blue?' }
const response = await ollama.chat({
  model: 'llama3.1',
  messages: [message],
  stream: false,
})
//console.log(response.message.content)
const chatNPM = async (message:any) => {
  const response = await ollama.chat({
  model: 'llama3.1',
  messages: [message],
  stream: false,
})
  return response.message.content
}
// for await (const part of response) {
//   process.stdout.write(part.message.content)
// }
// import { Ollama } from 'ollama'
// //import ollama from 'ollama/browser';

// const run = async (model: string, input: string) => {
// //const ollama = new Ollama()
// const response = await ollama.chat({
//   model: 'llama3.1',
//   messages: [{ role: 'user', content: 'Why is the sky blue?' }],
// })
// //console.log(response.message.content)
// }