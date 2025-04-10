import React, { useEffect, useState } from "react";
import { Card, H3, Paragraph, YStack, XStack, Progress, Text } from "tamagui";
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

  return (
    <Card width="100%" marginVertical="$4" padding="$4" bordered>
      <YStack space="$4">
        <YStack alignItems="center" marginBottom="$2">
          <H3>Your Results</H3>
          <Paragraph theme="alt1">Session #{gameSession?.id}</Paragraph>

          <YStack alignItems="center" marginTop="$4" marginBottom="$2">
            <Text
              fontSize="$8"
              fontWeight="bold"
              color={percentageScore > 50 ? "$green10" : "$red10"}
            >
              {percentageScore}%
            </Text>
            <Paragraph>
              {totalScore} out of {maxPossibleScore} points
            </Paragraph>
          </YStack>
        </YStack>

        <YStack space="$3">
          <H3 fontSize="$5">Breakdown by Category</H3>

          {categoryScores.map((category) => (
            <Card key={category.id} padding="$3" bordered>
              <XStack justifyContent="space-between" marginBottom="$2">
                <Text fontWeight="bold">{category.name}</Text>
                <Text>
                  {category.score}/{category.max_score}
                </Text>
              </XStack>

              <Progress
                value={(category.score / (category.max_score || 1)) * 100}
                backgroundClip="$gray5"
              >
                <Progress.Indicator
                  backgroundClip="$blue10"
                  animation="bouncy"
                />
              </Progress>
            </Card>
          ))}
        </YStack>
      </YStack>
    </Card>
  );
}
