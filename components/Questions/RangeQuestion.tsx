import { useState } from "react";
import { Button, YStack, XStack, Paragraph, Slider } from "tamagui";
import { Question } from "@/types/Question";

interface RangeQuestionProps {
  question: Question;
  minValue: number;
  maxValue: number;
  onAnswer: (questionAnswerId: number | null, value: number) => void;
  isAnswering: boolean;
}

export function RangeQuestion({
  question,
  minValue,
  maxValue,
  onAnswer,
  isAnswering,
}: RangeQuestionProps) {
  const [rangeValue, setRangeValue] = useState(
    Math.floor((minValue + maxValue) / 2)
  );

  return (
    <YStack space="$4" marginTop="$4">
      <Slider
        size="$4"
        defaultValue={[rangeValue]}
        value={[rangeValue]}
        min={minValue}
        max={maxValue}
        step={1}
        onValueChange={([value]) => setRangeValue(value)}
        disabled={isAnswering}
      >
        <Slider.Track>
          <Slider.TrackActive />
        </Slider.Track>
        <Slider.Thumb circular index={0} />
      </Slider>

      <XStack justifyContent="space-between">
        <Paragraph>{minValue}</Paragraph>
        <Paragraph size="$8" fontWeight="bold">
          {rangeValue}
        </Paragraph>
        <Paragraph>{maxValue}</Paragraph>
      </XStack>

      <Button
        theme="active"
        size="$4"
        marginTop="$2"
        disabled={isAnswering}
        loading={isAnswering}
        onPress={() => onAnswer(null, rangeValue)}
      >
        Submit Answer
      </Button>
    </YStack>
  );
}
