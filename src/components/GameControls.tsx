import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";

interface GameControlsProps {
  currentQuestion: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onTimerComplete?: () => void;
}

const GameControls = ({
  currentQuestion = 1,
  totalQuestions = 20,
  onPrevious = () => {},
  onNext = () => {},
  onTimerComplete = () => {},
}: GameControlsProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      onTimerComplete();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isRunning, timeLeft, onTimerComplete]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(60);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="w-full p-4 bg-background shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onPrevious}
            disabled={currentQuestion <= 1}
            aria-label="Previous question"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="text-lg font-medium">
            Question {currentQuestion} of {totalQuestions}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={onNext}
            disabled={currentQuestion >= totalQuestions}
            aria-label="Next question"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-xl font-bold">{formatTime(timeLeft)}</div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={startTimer}
              disabled={isRunning}
              aria-label="Start timer"
            >
              <Play className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={pauseTimer}
              disabled={!isRunning}
              aria-label="Pause timer"
            >
              <Pause className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={resetTimer}
              aria-label="Reset timer"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GameControls;
