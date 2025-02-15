import { ScrapybaraClient } from "scrapybara";
import { anthropic } from "scrapybara/anthropic";
import { UBUNTU_SYSTEM_PROMPT } from "scrapybara/prompts";
import { bashTool, computerTool, editTool } from "scrapybara/tools";
import { z } from "zod";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function main() {
  // Initialize client
  const client = new ScrapybaraClient({
    apiKey: process.env.SCRAPYBARA_API_KEY,
  });
  const instance = await client.startUbuntu();

  try {
    // Get the stream URL
    const streamUrl = await instance.getStreamUrl();
    console.log('Stream URL:', streamUrl);

    // Execute action
    const { output } = await client.act({
      model: anthropic(),
      tools: [bashTool(instance), computerTool(instance), editTool(instance)],
      system: UBUNTU_SYSTEM_PROMPT,
      prompt: "Visit the NY Times  login page. Agree to any terms of service and scross down to the login page, make sure its not the login of the browser and the app only. Then login using the following credentials. <robot_credentials><username>myposthuman@gmail.com</username><password>myposthuman@1234</password></robot_credentials> Then go to account, in the top right corner. Next, click Account Settings. Followed by delete your account, all the way at the bottom. The goal is to delete the NYTimes account, follow the necessary steps until you finally delete your account. if this doesnt work, try going directly to the login url and then deleting the account from there. You dont need to ask me any permissions you can act on my behalf for all tasks. Remember to scroll through the entirety of each page, to get in its full context.",
      schema: z.object({
        posts: z.array(
          z.object({
            title: z.string(),
            url: z.string(),
            points: z.number(),
          })
        ),
      }),
      onStep: (step) => console.log(step.text),
    });

    // Access structured output
    const posts = output?.posts;
    console.log(posts);
  } finally {
    // Cleanup
    await instance.stop();
  }
}

main().catch(console.error);
