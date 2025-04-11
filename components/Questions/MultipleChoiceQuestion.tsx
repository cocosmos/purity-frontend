import { useState } from "react";
import {
  Button,
  YStack,
  RadioGroup,
  XStack,
  Paragraph,
  Text,
  Label,
  Group,
  Separator,
} from "tamagui";
import { Question, Option } from "@/types/Question";

interface MultipleChoiceQuestionProps {
  question: Question;
  onAnswer: (questionAnswerId: number, value: null) => void;
  isAnswering: boolean;
}

export function MultipleChoiceQuestion({
  question,
  onAnswer,
  isAnswering,
}: MultipleChoiceQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  return (
    <YStack marginTop="$4" alignItems="center" padding="$2">
      <Group orientation="vertical" separator={<Separator />}>
        {question.options.map((option) => (
          <Group.Item key={option.id}>
            <Button
              size="$4"
              theme={selectedOption === option.id ? "active" : "blue"}
              onPress={() => {
                setSelectedOption(option.id);
                onAnswer(option.id, null);
              }}
            >
              {option.label}
            </Button>
          </Group.Item>
        ))}
      </Group>
    </YStack>
  );
}
