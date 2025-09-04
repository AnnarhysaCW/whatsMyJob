import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import DescriptionList from "./DescriptionList";

interface Description {
  id: string;
  text: string;
  contributor: string;
  votes: number;
}

interface GameBoardProps {
  currentJob?: string;
  currentQuestionIndex?: number;
  totalQuestions?: number;
  onNextQuestion?: () => void;
  onPrevQuestion?: () => void;
}

const GameBoard = ({
  currentJob = "Software Engineer",
  currentQuestionIndex = 0,
  totalQuestions = 20,
  onNextQuestion = () => {},
  onPrevQuestion = () => {},
}: GameBoardProps) => {
  const [descriptions, setDescriptions] = useState<Description[]>([
    {
      id: "1",
      text: "Writes code and solves problems using computers",
      contributor: "Alex",
      votes: 5,
    },
    {
      id: "2",
      text: "Builds websites and applications that people use every day",
      contributor: "Jamie",
      votes: 3,
    },
    {
      id: "3",
      text: "Turns coffee into code while staring at screens for hours",
      contributor: "Taylor",
      votes: 7,
    },
    {
      id: "4",
      text: "Creates algorithms and fixes bugs in software systems",
      contributor: "Jordan",
      votes: 2,
    },
  ]);

  const [newDescription, setNewDescription] = useState("");
  const [contributor, setContributor] = useState("");

  const handleAddDescription = () => {
    if (newDescription.trim() && contributor.trim()) {
      const newItem: Description = {
        id: Date.now().toString(),
        text: newDescription,
        contributor: contributor,
        votes: 0,
      };

      setDescriptions([...descriptions, newItem]);
      setNewDescription("");
      setContributor("");
    }
  };

  const handleVote = (id: string, increment: number) => {
    setDescriptions(
      descriptions.map((desc) =>
        desc.id === id ? { ...desc, votes: desc.votes + increment } : desc,
      ),
    );
  };

  const handleDelete = (id: string) => {
    setDescriptions(descriptions.filter((desc) => desc.id !== id));
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 bg-background">
      <Card className="shadow-lg border-2 border-muted">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl md:text-4xl font-bold text-primary">
            {currentJob}
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Guess the job based on these descriptions
          </p>
        </CardHeader>

        <CardContent className="pb-6">
          <DescriptionList
            descriptions={descriptions}
            onVote={handleVote}
            onDelete={handleDelete}
          />

          <div className="mt-8 flex justify-between">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Add Description
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Add Your Description</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe this job..."
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contributor">Your Name</Label>
                    <Input
                      id="contributor"
                      placeholder="Enter your name"
                      value={contributor}
                      onChange={(e) => setContributor(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleAddDescription}
                    disabled={!newDescription.trim() || !contributor.trim()}
                    className="mt-4"
                  >
                    Submit Description
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameBoard;
