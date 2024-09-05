import { Ollama } from '@langchain/ollama';
import { ChatOpenAI, OpenAI } from '@langchain/openai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { StringOutputParser } from '@langchain/core/output_parsers';
import LLMEngineType from '@utils/llmEngineTypes';

export class LLMEngine {
  private engine: LLMEngineType;
  private openai?: ChatOpenAI;
  private ollama?: Ollama;
  private gemini?: ChatGoogleGenerativeAI;

  constructor(engine?: LLMEngineType) {
    if (engine) {
      this.engine = engine;
    } else {
      this.engine = LLMEngineType.ChatGPT; // Default engine
    }

    switch (this.engine) {
      case LLMEngineType.ChatGPT:
        this.openai = new ChatOpenAI({
          model: 'gpt-4',
          apiKey: process.env.CHATGPT_API_KEY as string,
        });
        break;
      case LLMEngineType.Gemini:
        this.gemini = new ChatGoogleGenerativeAI({
          model: 'gemini-1.5-pro',
          temperature: 0,
          maxRetries: 2,
          apiKey: process.env.GEMINI_API_KEY as string,
        });
        break;
      case LLMEngineType.Ollama:
        this.ollama = new Ollama({
          model: 'llama3', // Default value
          temperature: 0,
          maxRetries: 2,
        });
        break;

      default:
        break;
    }
  }

  async getResponse(promptText: string): Promise<string | null> {
    if (promptText !== null) {
      try {
        let response;
        if (this.engine === LLMEngineType.ChatGPT) {
          response = await this.openai?.invoke(promptText);
        } else if (this.engine === LLMEngineType.Gemini) {
          response = await this.gemini?.invoke(promptText);
        } else if (this.engine === LLMEngineType.Ollama) {
          response = await this.ollama?.invoke(promptText);
        } else {
          throw new Error('UNSUPPORTED MODEL');
        }

        const parser = new StringOutputParser();
        const parsedResponse = await parser.invoke(response as string);
        return parsedResponse;
      } catch (error) {
        console.error('Error getting response:', error);
      }
    }
    return null;
  }
}
