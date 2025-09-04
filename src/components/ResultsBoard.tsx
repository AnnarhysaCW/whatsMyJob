import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, Trophy } from "lucide-react";

interface Description {
  id: string;
  text: string;
  contributor: string;
  rank: number;
}

interface JobResult {
  id: string;
  title: string;
  descriptions: Description[];
}

interface ResultsBoardProps {
  results: JobResult[];
  onPlayAgain: () => void;
}

const ResultsBoard = ({
  results = [],
  onPlayAgain = () => {},
}: ResultsBoardProps) => {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  // Mock data for preview if no results are provided
  const mockResults: JobResult[] = [
    {
      id: "1",
      title: "Software Engineer",
      descriptions: [
        {
          id: "1-1",
          text: "Writes code and solves complex problems",
          contributor: "Alex",
          rank: 1,
        },
        {
          id: "1-2",
          text: "Builds applications and websites",
          contributor: "Jamie",
          rank: 2,
        },
        {
          id: "1-3",
          text: "Turns coffee into code",
          contributor: "Taylor",
          rank: 3,
        },
      ],
    },
    {
      id: "2",
      title: "Graphic Designer",
      descriptions: [
        {
          id: "2-1",
          text: "Creates visual concepts using computer software",
          contributor: "Jordan",
          rank: 1,
        },
        {
          id: "2-2",
          text: "Designs logos, layouts, and marketing materials",
          contributor: "Casey",
          rank: 2,
        },
        {
          id: "2-3",
          text: "Combines art and technology",
          contributor: "Riley",
          rank: 3,
        },
      ],
    },
    {
      id: "3",
      title: "Teacher",
      descriptions: [
        {
          id: "3-1",
          text: "Educates students on various subjects",
          contributor: "Morgan",
          rank: 1,
        },
        {
          id: "3-2",
          text: "Creates lesson plans and grades assignments",
          contributor: "Quinn",
          rank: 2,
        },
        {
          id: "3-3",
          text: "Inspires the next generation",
          contributor: "Avery",
          rank: 3,
        },
      ],
    },
  ];

  const displayResults = results.length > 0 ? results : mockResults;

  return (
    <div className="bg-background min-h-screen p-6 flex flex-col items-center">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-6xl text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-primary mb-2">Final Results</h1>
        <p className="text-muted-foreground text-lg">
          Here are the top descriptions for each job title
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        {displayResults.map((job) => (
          <motion.div key={job.id} variants={itemVariants}>
            <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="bg-accent/30 pb-2">
                <CardTitle className="text-xl font-bold text-center">
                  {job.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {job.descriptions
                  .sort((a, b) => a.rank - b.rank)
                  .slice(0, 3)
                  .map((desc, index) => (
                    <div key={desc.id} className="mb-4 last:mb-0">
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 mt-1">
                          {index === 0 ? (
                            <Trophy className="h-5 w-5 text-yellow-500" />
                          ) : (
                            <Badge
                              variant="outline"
                              className="h-5 w-5 flex items-center justify-center p-0"
                            >
                              {index + 1}
                            </Badge>
                          )}
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm">{desc.text}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            by {desc.contributor}
                          </p>
                        </div>
                      </div>
                      {index < 2 && <Separator className="my-3" />}
                    </div>
                  ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-6xl flex justify-center"
      >
        <Button
          size="lg"
          onClick={onPlayAgain}
          className="px-8 py-6 text-lg flex items-center gap-2"
        >
          <RefreshCw className="h-5 w-5" />
          Play Again
        </Button>
      </motion.div>
    </div>
  );
};

export default ResultsBoard;
