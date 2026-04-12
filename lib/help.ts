export const host = 'https://ollama.com'


export const run = async (model: string, input: string) => {
    const response = await fetch(`${host}/api/${model}/run`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input })
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
}

export const stream = async function* (model: string, input: string) {
    const response = await fetch(`${host}/api/${model}/stream`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input })
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    const reader = response.body?.getReader();
    if (!reader) {
        throw new Error('No response body');
    }
    const decoder = new TextDecoder();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        yield decoder.decode(value); 
    }
}