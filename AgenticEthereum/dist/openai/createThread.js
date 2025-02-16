export async function createThread(client, message) {
    const thread = await client.beta.threads.create();
    if (message) {
        await client.beta.threads.messages.create(thread.id, {
            role: "user",
            content: message,
        });
    }
    return thread;
}
