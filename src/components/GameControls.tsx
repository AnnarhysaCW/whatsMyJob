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
  timerDuration: number;
  editingTimer: boolean;
  setEditingTimer: (editing: boolean) => void;
  handleTimerDurationChange: (newDuration: number) => void;
  currentQuestionIndex: number;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const GameControls = ({
  currentQuestion = 1,
  totalQuestions = 20,
  onPrevious = () => {},
  onNext = () => {},
  onTimerComplete = () => {},
  timerDuration,
  editingTimer,
  setEditingTimer,
  handleTimerDurationChange,
  currentQuestionIndex,
}: GameControlsProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(timerDuration);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState(formatTime(timerDuration));
  const [inputError, setInputError] = useState<string>("");

  useEffect(() => {
    setTimeLeft(timerDuration);
    setInputValue(formatTime(timerDuration));
  }, [timerDuration]);

  useEffect(() => {
    setTimeLeft(timerDuration);
    setInputValue(formatTime(timerDuration));
    setIsRunning(false); // Stop timer after question change
  }, [currentQuestionIndex, timerDuration]);

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
    setTimeLeft(timerDuration);
  };

  const parseTimeInput = (value: string): number | null => {
    // Accept mm:ss or seconds
    const trimmed = value.trim();
    if (/^\d+$/.test(trimmed)) {
      // Only digits, treat as seconds
      return parseInt(trimmed, 10);
    }
    const match = trimmed.match(/^(\d+):(\d{1,2})$/);
    if (match) {
      const mins = parseInt(match[1], 10);
      const secs = parseInt(match[2], 10);
      if (secs < 60) {
        return mins * 60 + secs;
      }
    }
    return null;
  };

  const handleSave = () => {
    const newDuration = parseTimeInput(inputValue);
    if (newDuration && newDuration > 0) {
      handleTimerDurationChange(newDuration);
      setEditingTimer(false);
      setInputError("");
    } else {
      setInputError("Please enter a valid time (mm:ss or seconds)");
    }
  };

  const handleCancel = () => {
    setInputValue(formatTime(timerDuration));
    setEditingTimer(false);
    setInputError("");
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
          {editingTimer ? (
            <div className="flex flex-col items-start space-y-1">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  className="w-20 px-2 py-1 border rounded text-xl font-bold text-center"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  autoFocus
                  placeholder="mm:ss or sec"
                />
                <Button size="sm" variant="outline" onClick={handleSave}>Save</Button>
                <Button size="sm" variant="ghost" onClick={handleCancel}>Cancel</Button>
              </div>
              {inputError && (
                <span className="text-xs text-red-500 ml-1">{inputError}</span>
              )}
            </div>
          ) : (
            <div
              className="text-xl font-bold cursor-pointer select-none"
              title="Click to edit timer limit"
              onClick={() => setEditingTimer(true)}
            >
              {formatTime(timeLeft)}
            </div>
          )}
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
