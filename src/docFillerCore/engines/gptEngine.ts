import { Ollama } from '@langchain/ollama';
import { ChatOpenAI, OpenAI } from '@langchain/openai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { StringOutputParser } from '@langchain/core/output_parsers';
import LLMEngineType from '@utils/llmEngineTypes';
import process from 'process';
import { DEFAULT_LLM_MODEL } from '@utils/constant';

export class LLMEngine {
  private static instance: LLMEngine;
  private static engine: LLMEngineType;
  private static openai?: ChatOpenAI;
  private static ollama?: Ollama;
  private static gemini?: ChatGoogleGenerativeAI;

  private constructor(engine?: LLMEngineType) {
    if (engine) {
      LLMEngine.engine = engine;
    } else {
      LLMEngine.engine = DEFAULT_LLM_MODEL; // Default engine
    }

    switch (LLMEngine.engine) {
      case LLMEngineType.ChatGPT:
        LLMEngine.openai = new ChatOpenAI({
          model: 'gpt-4',
          apiKey: process.env.CHATGPT_API_KEY as string,
        });
        break;
      case LLMEngineType.Gemini:
        LLMEngine.gemini = new ChatGoogleGenerativeAI({
          model: 'gemini-pro',
          temperature: 0,
          maxRetries: 2,
          apiKey: process.env.GEMINI_API_KEY as string,
        });
        break;
      case LLMEngineType.Ollama:
        LLMEngine.ollama = new Ollama({
          model: 'llama3', // Default value
          temperature: 0,
          maxRetries: 2,
        });
        break;

      default:
        break;
    }
  }

  public static getInstance(engine?: LLMEngineType): LLMEngine {
    if (LLMEngine.instance && LLMEngine.engine === engine) {
      return LLMEngine.instance;
    }

    LLMEngine.instance = new LLMEngine(engine);
    return LLMEngine.instance;
  }

  public async getResponse(promptText: string): Promise<string | null> {
    let item = {
      type: 'API_CALL',
      prompt: promptText,
    };
    return await chrome.runtime.sendMessage(item).then((response) => {
      return response.value;
    });
  }

  async invokeLLM(promptText: string): Promise<string | null> {
    if (promptText !== null) {
      try {
        let response;
        if (LLMEngine.engine === LLMEngineType.ChatGPT) {
          response = await LLMEngine.openai?.invoke(promptText);
        } else if (LLMEngine.engine === LLMEngineType.Gemini) {
          response = await LLMEngine.gemini?.invoke(promptText);
        } else if (LLMEngine.engine === LLMEngineType.Ollama) {
          response = await LLMEngine.ollama?.invoke(promptText);
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
