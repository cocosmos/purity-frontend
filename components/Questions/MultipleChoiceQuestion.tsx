import { useState } from "react";
import {
  Button,
  YStack,
  RadioGroup,
  XStack,
  Paragraph,
  Text,
  Label,
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
    <YStack space="$4" marginTop="$4" alignItems="center">
      <RadioGroup
        name="options"
        value={selectedOption?.toString() || ""}
        onValueChange={(value) => onAnswer(Number(value), null)}
      >
        {question.options.map((option) => (
          <XStack width={300} alignItems="center" space="$4" key={option.id}>
            <RadioGroup.Item
              value={option.id.toString()}
              id={`option-${option.id}`}
              size="$4"
            >
              <RadioGroup.Indicator />
            </RadioGroup.Item>

            <Label size="$4" htmlFor={`option-${option.id}`}>
              {option.label}
            </Label>
          </XStack>
        ))}
      </RadioGroup>

      {/*  <Button
        theme="active"
        size="$4"
        marginTop="$2"
        disabled={isAnswering || selectedOption === null}
        loading={isAnswering}
        onPress={() => {
          if (selectedOption !== null) {
            onAnswer(selectedOption, null);
          }
        }}
      >
        Submit Answer
      </Button> */}
    </YStack>
  );
}
