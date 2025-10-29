'use server';

/**
 * @fileOverview A personalized game recommendation AI agent.
 *
 * - getPersonalizedGameRecommendations - A function that generates personalized game recommendations.
 * - PersonalizedGameRecommendationsInput - The input type for the getPersonalizedGameRecommendations function.
 * - PersonalizedGameRecommendationsOutput - The return type for the getPersonalizedGameRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedGameRecommendationsInputSchema = z.object({
  purchaseHistory: z
    .array(z.string())
    .describe('A list of game titles the user has purchased.'),
  wishlist: z.array(z.string()).describe("A list of game titles in the user's wishlist."),
  browsingBehavior: z
    .array(z.string())
    .describe(
      'A list of game titles or genres the user has recently viewed or shown interest in.'
    ),
});
export type PersonalizedGameRecommendationsInput = z.infer<
  typeof PersonalizedGameRecommendationsInputSchema
>;

const PersonalizedGameRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('A list of game titles recommended to the user.'),
  reasoning: z
    .string()
    .describe(
      "A brief explanation of why these games were recommended based on the user's data."
    ),
});
export type PersonalizedGameRecommendationsOutput = z.infer<
  typeof PersonalizedGameRecommendationsOutputSchema
>;

export async function getPersonalizedGameRecommendations(
  input: PersonalizedGameRecommendationsInput
): Promise<PersonalizedGameRecommendationsOutput> {
  return personalizedGameRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedGameRecommendationsPrompt',
  input: {schema: PersonalizedGameRecommendationsInputSchema},
  output: {
    schema: PersonalizedGameRecommendationsOutputSchema,
    format: 'json',
  },
  prompt: `You are an expert game recommender. Given a user's purchase history, wishlist, and browsing behavior, you will recommend games that they might enjoy.

Purchase History: {{#if purchaseHistory}}{{{purchaseHistory}}}{{else}}None{{/if}}
Wishlist: {{#if wishlist}}{{{wishlist}}}{{else}}None{{/if}}
Browsing Behavior: {{#if browsingBehavior}}{{{browsingBehavior}}}{{else}}None{{/if}}

Based on this information, recommend a few games and explain why they would like them.

Your response must be a valid JSON object that conforms to the output schema.
`,
});

const personalizedGameRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedGameRecommendationsFlow',
    inputSchema: PersonalizedGameRecommendationsInputSchema,
    outputSchema: PersonalizedGameRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
