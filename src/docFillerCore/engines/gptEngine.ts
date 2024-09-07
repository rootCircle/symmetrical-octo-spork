import { Ollama } from '@langchain/ollama';
import { ChatOpenAI } from '@langchain/openai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import {
  StructuredOutputParser,
  StringOutputParser,
} from '@langchain/core/output_parsers';
import LLMEngineType from '@utils/llmEngineTypes';
import { RunnableSequence } from '@langchain/core/runnables';
import { PromptTemplate } from '@langchain/core/prompts';
import process from 'process';
import { DEFAULT_LLM_MODEL } from '@utils/constant';
import { QType } from '@utils/questionTypes';
import { DatetimeOutputParser } from 'langchain/output_parsers';
import { z } from 'zod';

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
          model: 'gemma2:2b',
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

  public async getResponse(
    promptText: string,
    questionType: QType
  ): Promise<string | null> {
    let item = {
      type: 'API_CALL',
      prompt: promptText,
      questionType: questionType,
    };
    try {
      return await chrome.runtime.sendMessage(item).then((response) => {
        return response.value;
      });
    } catch (error) {
      console.error('Error getting response:', error);
      return null;
    }
  }

  async invokeLLM(
    promptText: string,
    questionType: QType
  ): Promise<object | null> {
    if (promptText !== null) {
      try {
        let response = null;
        const parser = LLMEngine.getParser(questionType);
        switch (LLMEngine.engine) {
          case LLMEngineType.ChatGPT: {
            if (LLMEngine.openai) {
              const chain = RunnableSequence.from([
                PromptTemplate.fromTemplate(
                  'Answer the users question as best as possible.\n{format_instructions}\n{question}'
                ),
                LLMEngine.openai,
                parser,
              ]);
              response = await chain.invoke({
                question: promptText,
                format_instructions: parser.getFormatInstructions(),
              });
            }
            break;
          }
          case LLMEngineType.Gemini: {
            if (LLMEngine.gemini) {
              const chain = RunnableSequence.from([
                PromptTemplate.fromTemplate(
                  'Answer the users question as best as possible.\n{format_instructions}\n{question}'
                ),
                LLMEngine.gemini,
                parser,
              ]);
              response = await chain.invoke({
                question: promptText,
                format_instructions: parser.getFormatInstructions(),
              });
            }
            break;
          }
          case LLMEngineType.Ollama: {
            if (LLMEngine.ollama) {
              const chain = RunnableSequence.from([
                PromptTemplate.fromTemplate(
                  'Answer the users question as best as possible.\n{format_instructions}\n{question}'
                ),
                LLMEngine.ollama,
                parser,
              ]);
              response = await chain.invoke({
                question: promptText,
                format_instructions: parser.getFormatInstructions(),
              });
            }
            break;
          }
        }
        return response;
      } catch (error) {
        console.error('Error getting response:', error);
      }
    }
    return null;
  }

  private static getParser(
    questionType: QType
  ): StructuredOutputParser<any> | DatetimeOutputParser | StringOutputParser {
    switch (questionType) {
      case QType.TEXT:
      case QType.TEXT_EMAIL:
      case QType.TEXT_URL:
        return new StringOutputParser();

      case QType.DATE:
      case QType.TIME:
      case QType.DATE_AND_TIME:
      case QType.DURATION:
      case QType.DATE_TIME_WITHOUT_YEAR:
      case QType.DATE_TIME_WITH_MERIDIEM:
      case QType.DATE_TIME_WITH_MERIDIEM_WITHOUT_YEAR:
      case QType.DATE_WITHOUT_YEAR:
      case QType.TIME_WITH_MERIDIEM:
        return new DatetimeOutputParser();

      case QType.LINEAR_SCALE:
      case QType.DROPDOWN:
        return StructuredOutputParser.fromNamesAndDescriptions({
          answer: "answer to the user's question",
        });
      case QType.PARAGRAPH:
        return new StringOutputParser();

      case QType.CHECKBOX_GRID: {
        const checkboxGridColSchema = z.object({
          data: z
            .string()
            .describe(
              "The name or label of the column in the checkbox grid which is correct as per user's question"
            ),
        });

        const checkboxGridRowSchema = z.object({
          row: z
            .string()
            .describe('The label or name of the row in the checkbox grid'),
          cols: z
            .array(checkboxGridColSchema)
            .describe(
              'The list of correct columns associated with the row to be marked as checked'
            ),
        });

        const checkboxGridArraySchema = z
          .array(checkboxGridRowSchema)
          .describe(
            'An array of rows for the checkbox grid, each with a list of columns'
          );

        return StructuredOutputParser.fromZodSchema(checkboxGridArraySchema);
      }

      case QType.MULTIPLE_CHOICE_GRID: {
        const multipleChoiceGridRowSchema = z.object({
          row: z
            .string()
            .describe(
              'The label or name of the row in the multiple-choice grid'
            ),
          selectedColumn: z
            .string()
            .describe(
              'The column selected for the given row in the multiple-choice grid that is correct as per user question'
            ),
        });

        const multipleChoiceGridArraySchema = z
          .array(multipleChoiceGridRowSchema)
          .describe(
            'An array of rows for the multiple-choice grid, each with a selected column'
          );

        return StructuredOutputParser.fromZodSchema(
          multipleChoiceGridArraySchema
        );
      }

      case QType.MULTIPLE_CHOICE:
      case QType.MULTIPLE_CHOICE_WITH_OTHER:
      case QType.MULTI_CORRECT:
      case QType.MULTI_CORRECT_WITH_OTHER: {
        const multiCorrectOrMultipleOptionSchema = z
          .object({
            optionText: z
              .string()
              .optional()
              .describe(
                "The text of the option. Optional if 'isOther' is true."
              ),
            isOther: z
              .boolean()
              .describe(
                "Indicates if this is an 'other' option. This field is required."
              ),
            otherOptionValue: z
              .string()
              .optional()
              .describe(
                "The value for the 'other' option. Must be provided if 'isOther' is true."
              ),
          })
          .refine(
            (data) => !data.isOther || (data.isOther && data.otherOptionValue),
            {
              message:
                "'otherOptionValue' must be provided if 'isOther' is true",
              path: ['otherOptionValue'],
            }
          );

        if (
          questionType === QType.MULTI_CORRECT ||
          questionType === QType.MULTI_CORRECT_WITH_OTHER
        ) {
          const multiCorrectOptionsArraySchema = z
            .array(multiCorrectOrMultipleOptionSchema)
            .describe(
              "An array of options for multi-correct or multiple-choice with optional 'other' option"
            );

          return StructuredOutputParser.fromZodSchema(
            multiCorrectOptionsArraySchema
          );
        } else {
          // For multiple-choice with optional 'other' option
          return StructuredOutputParser.fromZodSchema(
            multiCorrectOrMultipleOptionSchema.describe(
              "Schema for a single option in multiple-choice with an optional 'other' option"
            )
          );
        }
      }
    }
  }
}
