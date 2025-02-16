import { ScrapybaraClient } from "scrapybara";
import { anthropic } from "scrapybara/anthropic";
import { UBUNTU_SYSTEM_PROMPT } from "scrapybara/prompts";
import { bashTool, computerTool, editTool } from "scrapybara/tools";
import { z } from "zod";

interface Step {
  text: string;
}

export async function main() {
  // Initialize client with API key from environment variable
  const client = new ScrapybaraClient({
    apiKey:
      process.env.NEXT_PUBLIC_SCRAPYBARA_API_KEY ||
      "scrapy-ca6aafb8-49aa-4ecf-977d-539ea7e76a58",
  });

  const instance = await client.startUbuntu();

  try {
    const streamUrl = await instance.getStreamUrl();
    console.log("Stream URL:", streamUrl);

    const { output } = await client.act({
      model: anthropic(),
      tools: [bashTool(instance), computerTool(instance), editTool(instance)],
      system: UBUNTU_SYSTEM_PROMPT,
      prompt:
        "Visit the CNN main page at cnn.com . Agree to any terms of service and click the WHITE sign in button to the right of the RED subscribe button on the main page. Then login using the following credentials. <robot_credentials><username>myposthuman@gmail.com</username><password>myposthuman@1234</password></robot_credentials> Then go to https://www.cnn.com/account/settings . Scroll down to the bottom of the page then click delete account, all the way at the bottom, and then click delete account on the popup. The goal is to delete the CNN account, follow the necessary steps until you finally delete your account. if this doesnt work, try going directly to the login url and then deleting the account from there. You dont need to ask me any permissions you can act on my behalf for all tasks. Remember to scroll through the entirety of each page, to get in its full context. Do not click out of CNN, do not go to HBO, stay on CNN",
      schema: z.object({
        posts: z.array(
          z.object({
            title: z.string(),
            url: z.string(),
            points: z.number(),
          })
        ),
      }),
      onStep: (step: Step) => console.log(step.text),
    });

    return output?.posts;
  } catch (error) {
    console.error("Error during Scrapybara operation:", error);
    throw error; // Rethrow or handle as needed
  } finally {
    await instance.stop();
  }
}
