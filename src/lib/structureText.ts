// lib/aiStructuring.js
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

// Zod schemas for type safety and validation
const CategoryOutputSchema = z.object({
  title: z.string().describe("The name of the category"),
  description: z
    .string()
    .describe("One sentence explaining what this category covers"),
  insights: z
    .array(z.string())
    .describe("Specific insights or ideas from the session"),
});

const StructuredOutputSchema = z.object({
  summary: z.string().describe("Brief 2-3 sentence overview of the session"),
  categories: z
    .array(CategoryOutputSchema)
    .describe("3-6 natural categories/themes that emerged"),
});

// TypeScript types inferred from Zod schemas
type StructuredOutput = z.infer<typeof StructuredOutputSchema>;

interface SessionData {
  name: string;
  description: string;
  objective: string;
}

// Format instructions for the JSON output
const formatInstructions = `Du må svare kun med gyldig JSON. JSON-objektet du returnerer må følge følgende skjema:
{
  "summary": "string",
  "categories": [
    {
      "title": "string",
      "description": "string", 
      "insights": ["string", "string", ...]
    }
  ]
}

Hvor:
- summary er et kort sammendrag på 2-3 setninger
- categories er en liste med 3-6 kategori-objekter
- hver kategori har en tittel, beskrivelse og liste med innsikter

ALL TEKST MÅ VÆRE PÅ NORSK!`;

export async function structureText(
  transcription: string,
  sessionData: SessionData,
): Promise<StructuredOutput> {
  try {
    // Set up the parser with our schema
    const parser = new JsonOutputParser<StructuredOutput>();

    // Create the prompt template
    const prompt = await ChatPromptTemplate.fromMessages([
      [
        "system",
        `Du er en ekspert forretningskonsulent som hjelper entreprenører med å strukturere brainstorming-sesjonene sine. 

        Analyser forretningsidé brainstorming-sesjoner og lag strukturerte utdata som hjelper deltakerne å forstå ideene sine bedre.

        VIKTIG: ALLE SVAR MÅ VÆRE PÅ NORSK!

        INSTRUKSJONER:
        1. Gi et kort sammendrag av hele sesjonen (2-3 setninger)
        2. Identifiser 3-6 naturlige kategorier/temaer som kom frem fra diskusjonen. Disse skal være:
           - Spesifikke for det som faktisk ble diskutert (ikke generiske forretningskategorier)
           - Relevante for sesjonens mål
           - Nyttige for å organisere ideene som kom opp
           - Navngitt på en måte som gir mening for deltakerne
        3. For hver kategori, trekk ut 3-7 spesifikke innsikter, ideer eller poeng som ble nevnt:
           - Bruk det faktiske språket og terminologien fra sesjonen når det er mulig
           - Fokuser på innsikter som kan handles på, ikke bare emner som ble diskutert
           - Inkluder både ideer og bekymringer/utfordringer som ble tatt opp

        Husk: Basér alt på det som faktisk ble diskutert, ikke det som typisk diskuteres i forretnings-brainstorming. Gjør det personlig og spesifikt for denne sesjonen.

        ALLE SVAR MÅ VÆRE PÅ NORSK!
        
        {format_instructions}`,
      ],
      [
        "human",
        `BRAINSTORMING-SESJON KONTEKST:
        - Sesjonsnavn: "{sessionName}"
        - Beskrivelse: "{sessionDescription}"
        - Mål: "{sessionObjective}"

        TRANSKRIPSJON:
        {transcription}

        Vennligst analyser denne sesjonen og gi en strukturert output PÅ NORSK.`,
      ],
    ]).partial({
      format_instructions: formatInstructions,
    });

    // Initialize the ChatOpenAI model
    const model = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.1,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // Create the chain
    const chain = prompt.pipe(model).pipe(parser);

    // Execute the chain
    const result = await chain.invoke({
      sessionName: sessionData.name,
      sessionDescription: sessionData.description,
      sessionObjective: sessionData.objective,
      transcription: transcription,
    });

    // Validate the result with Zod
    const validatedResult = StructuredOutputSchema.parse(result);

    return validatedResult;
  } catch (error) {
    console.error("Error generating structured output:", error);

    // Fallback response if AI fails - also in Norwegian
    return {
      summary:
        "Kunne ikke generere sammendrag på grunn av behandlingsfeil. Vennligst gå gjennom transkripsjonen manuelt.",
      categories: [
        {
          title: "Sesjonsinnhold",
          description: "Råe innsikter fra brainstorming-sesjonen",
          insights: [
            "Behandlingsfeil oppstod - vennligst gå gjennom transkripsjonen manuelt for viktige innsikter",
            "Vurder å kjøre analysen på nytt eller sjekke lydkvaliteten",
          ],
        },
      ],
    };
  }
}

// Helper function to validate session data
export function validateSessionData(data: unknown): SessionData {
  const SessionDataSchema = z.object({
    name: z.string().min(1, "Session name is required"),
    description: z.string().min(1, "Session description is required"),
    objective: z.string().min(1, "Session objective is required"),
  });

  return SessionDataSchema.parse(data);
}
