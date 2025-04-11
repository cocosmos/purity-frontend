import React, { useEffect, useState } from "react";
import {
  Card,
  H3,
  Paragraph,
  YStack,
  XStack,
  Progress,
  Text,
  Image,
  ScrollView,
  H2,
} from "tamagui";
import { GameSession } from "@/types/GameSession";
import { Category } from "@/types/Category";
import { getGameSessionScores } from "@/api/gameSession";

interface CategoryScore extends Category {
  score: number;
  max_score: number;
}

interface GameResultsCardProps {
  gameSession: GameSession | null;
}

export function GameResultsCard({ gameSession }: GameResultsCardProps) {
  const [categoryScores, setCategoryScores] = useState<CategoryScore[]>([]);
  const [loading, setLoading] = useState(false);

  // Calculate scores for each category
  useEffect(() => {
    const fetchScores = async () => {
      if (gameSession) {
        setLoading(true);
        try {
          const { data } = await getGameSessionScores(gameSession.id);
          setCategoryScores(data.categories);
        } catch (error) {
          console.error("Error fetching scores:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchScores();
  }, [gameSession]);

  // Calculate total score and max possible score
  const totalScore = categoryScores.reduce(
    (acc, cat) => acc + (cat.score || 0),
    0
  );
  const maxPossibleScore = categoryScores.reduce(
    (acc, cat) => acc + (cat.max_score || 0),
    0
  );
  const percentageScore =
    maxPossibleScore > 0
      ? Math.round((totalScore / maxPossibleScore) * 100)
      : 0;

  const isPure = percentageScore < 10;

  return (
    <ScrollView>
      <Card width="100%" marginVertical="$4" padding="$4" bordered>
        <YStack space="$4">
          <YStack alignItems="center" marginBottom="$2">
            <H3>Your Purity Results</H3>
            <Paragraph theme="alt1">Session #{gameSession?.id}</Paragraph>

            <YStack alignItems="center" marginTop="$4" marginBottom="$2">
              <Text
                fontSize="$9"
                fontWeight="bold"
                color={isPure ? "$green10" : "$red10"}
                textTransform="capitalize"
                textAlign="center"
              >
                You are {gameSession?.level_name}
              </Text>
              <Text
                fontSize="$8"
                fontWeight="bold"
                color={isPure ? "$green10" : "$red10"}
                marginTop="$2"
              >
                {totalScore} points
              </Text>
              <Paragraph theme="alt2" marginTop="$2" textAlign="center">
                {isPure
                  ? "Congratulations on your purity! Lower scores mean you're more pure."
                  : "Oh my! Higher scores indicate less purity."}
              </Paragraph>
            </YStack>
          </YStack>

          <YStack gap={"$4"} padding="$4" borderRadius="$4">
            <H3 fontSize="$5">Breakdown by Category</H3>

            {categoryScores.map((category) => {
              let categoryPercentage = Math.min(
                (category.score / (category.max_score || 1)) * 100,
                100
              );
              const isCategoryPure = categoryPercentage < 50;

              return (
                <Card key={category.id} padding="$3" bordered>
                  <YStack space="$2">
                    <XStack
                      alignItems="center"
                      justifyContent="space-between"
                      space="$2"
                    >
                      <XStack alignItems="center" space="$2">
                        <Image
                          source={{ uri: category.image }}
                          width={40}
                          height={40}
                          borderRadius="$8"
                          alt={category.name}
                        />
                        <Text fontSize="$4" fontWeight="bold">
                          {category.name}
                        </Text>
                      </XStack>
                      <Text
                        fontSize="$4"
                        color={isCategoryPure ? "$green10" : "$red10"}
                      >
                        {categoryPercentage.toFixed(0)}%
                      </Text>
                    </XStack>

                    <Progress
                      value={categoryPercentage}
                      backgroundClip={isCategoryPure ? "$green10" : "$red10"}
                    >
                      <Progress.Indicator
                        backgroundClip={isCategoryPure ? "$green10" : "$red10"}
                        animation="bouncy"
                      />
                    </Progress>
                  </YStack>
                </Card>
              );
            })}
          </YStack>
        </YStack>
      </Card>
    </ScrollView>
  );
}
