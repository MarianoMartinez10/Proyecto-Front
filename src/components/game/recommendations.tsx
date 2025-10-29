import { getPersonalizedGameRecommendations } from "@/ai/flows/personalized-game-recommendations";
import { allGames } from "@/lib/data";
import { GameCard } from "./game-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bot } from "lucide-react";

export async function GameRecommendations() {
  const mockUserData = {
    purchaseHistory: ["Soccer Pro 2024", "Jungle Adventure"],
    wishlist: ["Star Explorer", "Cyber Odyssey"],
    browsingBehavior: ["Action", "RPG"],
  };

  try {
    const aiResponse = await getPersonalizedGameRecommendations(mockUserData);
    
    // Defensive check for recommendations
    if (!aiResponse || !aiResponse.recommendations) {
        console.error("AI response did not include recommendations.");
        return null;
    }

    const recommendedGames = allGames.filter(game => 
      aiResponse.recommendations.some(rec => game.name.toLowerCase() === rec.toLowerCase())
    );

    if (recommendedGames.length === 0) {
      return null;
    }

    return (
      <section className="py-12 md:py-16">
        <h2 className="font-headline text-3xl font-bold md:text-4xl mb-2">Recommended For You</h2>
        <Alert className="mb-8 bg-primary/5 border-primary/20">
            <Bot className="h-4 w-4 text-primary" />
            <AlertTitle className="font-headline text-primary">AI-Powered Suggestions</AlertTitle>
            <AlertDescription className="text-primary/80">
              {aiResponse.reasoning}
            </AlertDescription>
        </Alert>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {recommendedGames.map((game) => (
              <CarouselItem key={game.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <div className="p-1">
                  <GameCard game={game} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-12" />
          <CarouselNext className="mr-12" />
        </Carousel>
      </section>
    );
  } catch (error) {
    console.error("Failed to get game recommendations:", error);
    // You could render a fallback UI here if needed
    return null;
  }
}
