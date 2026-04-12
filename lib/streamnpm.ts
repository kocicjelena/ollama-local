import ollama from 'ollama'


export const streamnpm = async function* (model: string, role: string, input: string) {
    
const message = { role: role, content: input }
const response = await ollama.chat({
  model: model,
  messages: [message],
  stream: true,
})
for await (const part of response) {
  process.stdout.write(part.message.content)
}
}

export const chatnpm = async function* (model: string, role: string, input: string) {
    
const message = { role: role, content: input }
// const response = await ollama.chat({
//   model: 'llama3.1',
//   messages: [message],
//   stream: false,
// })
//console.log(response.message.content)
const response = async (message:any) => {
  const response = await ollama.chat({
  model: 'llama3.1',
  messages: [message],
  stream: false,
})
 
}
console.log(response,'respose')
return response;
 //return response.message.content
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