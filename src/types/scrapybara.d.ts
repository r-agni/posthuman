declare module "scrapybara" {
  export class ScrapybaraClient {
    constructor(config: { apiKey: string });
    startUbuntu(): any;
    act(config: any): any;
  }
}

declare module "scrapybara/anthropic" {
  export function anthropic(): any;
}

declare module "scrapybara/prompts" {
  export const UBUNTU_SYSTEM_PROMPT: string;
}

declare module "scrapybara/tools" {
  export function bashTool(instance: any): any;
  export function computerTool(instance: any): any;
  export function editTool(instance: any): any;
}
