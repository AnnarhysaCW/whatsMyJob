import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import GameBoard from "./GameBoard";
import GameControls from "./GameControls";
import ResultsBoard from "./ResultsBoard";
import DescriptionList from "./DescriptionList";
import ReactDOM from "react-dom";
import { AnimatePresence } from "framer-motion";

interface JobData {
  id: number;
  title: string;
  descriptions: {
    id: string;
    text: string;
    contributor: string;
    votes: number;
  }[];
}

const Home = () => {
  // Mock data for job titles and descriptions
  const initialJobs = [
    { id: 1, title: "Software Engineer", descriptions: [] },
    { id: 2, title: "UI/UX Designer", descriptions: [] },
    { id: 3, title: "Product Manager", descriptions: [] },
    { id: 4, title: "QA Engineer", descriptions: [] },
    { id: 5, title: "SDET", descriptions: [] },
    { id: 6, title: "TechOps Engineer", descriptions: [] },
    { id: 7, title: "Data Analyst", descriptions: [] },
    { id: 8, title: "DevOps Engineer", descriptions: [] },
    { id: 9, title: "Frontend Developer", descriptions: [] },
    { id: 10, title: "Backend Developer", descriptions: [] },
    { id: 11, title: "Full Stack Developer", descriptions: [] },
    { id: 12, title: "Scrum Master", descriptions: [] },
    { id: 13, title: "Business Analyst", descriptions: [] },
    { id: 14, title: "Content Strategist", descriptions: [] },
    { id: 15, title: "SEO Specialist", descriptions: [] },
    { id: 16, title: "Social Media Manager", descriptions: [] },
    { id: 17, title: "Customer Success Manager", descriptions: [] },
    { id: 18, title: "Sales Executive", descriptions: [] },
    { id: 19, title: "Technical Writer", descriptions: [] },
    { id: 20, title: "HR Manager", descriptions: [] },
  ];

  const [jobs, setJobs] = useState<JobData[]>(() => {
    const saved = localStorage.getItem('jobs');
    return saved ? JSON.parse(saved) : initialJobs;
  });
  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [showAddDescription, setShowAddDescription] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);
  // Add state for timer duration and editing
  const [timerDuration, setTimerDuration] = useState(60);
  const [editingTimer, setEditingTimer] = useState(false);

  // Timer countdown effect
  useEffect(() => {
    if (!timerRunning) return;
    if (timeRemaining <= 0) {
      setTimerRunning(false);
      return;
    }
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, timeRemaining]);

  // Handle navigation between questions
  const handleNextQuestion = () => {
    if (currentQuestionIndex < jobs.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeRemaining(timerDuration); // Always reset timer
      if (timerRunning) {
        setTimerRunning(true);
      }
    } else {
      setIsGameComplete(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setTimeRemaining(timerDuration); // Always reset timer
      if (timerRunning) {
        setTimerRunning(true);
      }
    }
  };

  // Timer controls
  const startTimer = () => setTimerRunning(true);
  const pauseTimer = () => setTimerRunning(false);
  // Update timer reset to use timerDuration
  const resetTimer = () => setTimeRemaining(timerDuration);

  // Update timer duration globally
  const handleTimerDurationChange = (newDuration: number) => {
    setTimerDuration(newDuration);
    setTimeRemaining(newDuration);
  };

  // Handle description ranking
  const handleVote = (
    jobId: number,
    descriptionId: string,
    direction: "up" | "down",
  ) => {
    setJobs(
      jobs.map((job) => {
        if (job.id === jobId) {
          return {
            ...job,
            descriptions: job.descriptions.map((desc) => {
              if (desc.id === descriptionId) {
                return {
                  ...desc,
                  votes: desc.votes + (direction === "up" ? 1 : -1),
                };
              }
              return desc;
            }),
          };
        }
        return job;
      }),
    );
  };

  // Handle description deletion
  const handleDeleteDescription = (jobId: number, descriptionId: string) => {
    setJobs(
      jobs.map((job) => {
        if (job.id === jobId) {
          return {
            ...job,
            descriptions: job.descriptions.filter(
              (desc) => desc.id !== descriptionId,
            ),
          };
        }
        return job;
      }),
    );
  };

  // Handle adding a new description
  const handleAddDescription = (
    jobId: number,
    text: string,
    contributor: string,
  ) => {
    setJobs(
      jobs.map((job) => {
        if (job.id === jobId) {
          return {
            ...job,
            descriptions: [
              ...job.descriptions,
              {
                id: `${jobId}-${Date.now()}`,
                text,
                contributor,
                votes: 0,
              },
            ],
          };
        }
        return job;
      }),
    );
  };

  // Handle restarting the game
  const handleRestartGame = () => {
    setJobs(initialJobs.map(job => ({ ...job, descriptions: [] })));
    setCurrentQuestionIndex(0);
    setIsGameComplete(false);
    setTimerRunning(false);
    setTimeRemaining(60);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {isGameComplete ? (
          <ResultsBoard
            results={jobs.map(job => ({
              ...job,
              id: String(job.id),
              descriptions: job.descriptions.map((desc, i) => ({ ...desc, rank: i + 1 }))
            }))}
            onPlayAgain={handleRestartGame}
          />
        ) : (
          <>
            <header className="text-center mb-8">
              <h1 className="text-4xl font-bold text-[#495057] mb-2">
                WhatsMyJob (The bad edition)
              </h1>
              <p className="text-[#6c757d]">Describe your job as badly as you can to win the game!</p>
            </header>
            {/* <div className="mb-4 flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  localStorage.removeItem('jobs');
                  window.location.reload();
                }}
              >
                Reset Jobs (Dev Only)
              </Button>
            </div> */}
            <GameControls
              currentQuestion={currentQuestionIndex + 1}
              totalQuestions={jobs.length}
              onPrevious={handlePreviousQuestion}
              onNext={handleNextQuestion}
              timerDuration={timerDuration}
              editingTimer={editingTimer}
              setEditingTimer={setEditingTimer}
              handleTimerDurationChange={handleTimerDurationChange}
              currentQuestionIndex={currentQuestionIndex}
            />
            <div className="flex items-center justify-between mb-10 mt-6">
              <h2 className="text-4xl font-extrabold text-black">
                {jobs[currentQuestionIndex]?.title}
              </h2>
              <div className="flex gap-2">
                <Button
                  className="flex items-center gap-2 bg-[#6c5ce7] text-white hover:bg-[#5a49d8]"
                  style={{ minWidth: 80 }}
                  onClick={() => setShowConfirmEnd(true)}
                >
                  End
                </Button>
                <Button
                  variant="destructive"
                  className="flex items-center gap-2"
                  onClick={() => setShowConfirmReset(true)}
                >
                  Reset Page
                </Button>
              </div>
            </div>
            {ReactDOM.createPortal(
              <AnimatePresence>
                {showAddDescription && (
                  <>
                    <motion.div
                      className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setShowAddDescription(false)}
                    />
                    <motion.div
                      className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 p-8 flex flex-col"
                      initial={{ x: '100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '100%' }}
                      transition={{ type: 'tween', duration: 0.3 }}
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-[#495057]">Add Description</h2>
                        <Button variant="ghost" onClick={() => setShowAddDescription(false)}>
                          ✕
                        </Button>
                      </div>
                      <AddDescriptionForm
                        onSubmit={(text, contributor) => {
                          handleAddDescription(
                            jobs[currentQuestionIndex].id,
                            text,
                            contributor,
                          );
                          setShowAddDescription(false);
                        }}
                      />
                    </motion.div>
                  </>
                )}
                {showConfirmEnd && (
                  <>
                    <motion.div
                      className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setShowConfirmEnd(false)}
                    />
                    <motion.div
                      className="fixed left-1/2 top-1/2 z-50 bg-white rounded-lg shadow-2xl p-8 flex flex-col items-center"
                      style={{ transform: 'translate(-50%, -50%)' }}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ type: 'spring', duration: 0.25 }}
                    >
                      <h2 className="text-xl font-bold mb-4">Are you sure you want to end the game?</h2>
                      <div className="flex gap-4 mt-4">
                        <Button className="bg-[#6c5ce7] text-white hover:bg-[#5a49d8]" onClick={() => {
                          setIsGameComplete(true);
                          setShowConfirmEnd(false);
                        }}>
                          Yes, End Game
                        </Button>
                        <Button variant="outline" onClick={() => setShowConfirmEnd(false)}>
                          Cancel
                        </Button>
                      </div>
                    </motion.div>
                  </>
                )}
                {showConfirmReset && (
                  <>
                    <motion.div
                      className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setShowConfirmReset(false)}
                    />
                    <motion.div
                      className="fixed left-1/2 top-1/2 z-50 bg-white rounded-lg shadow-2xl p-8 flex flex-col items-center"
                      style={{ transform: 'translate(-50%, -50%)' }}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ type: 'spring', duration: 0.25 }}
                    >
                      <h2 className="text-xl font-bold mb-4">Confirm Reset</h2>
                      <p className="mb-6 text-center">Are you sure you want to delete all jobs and descriptions? This cannot be undone.</p>
                      <div className="flex gap-4">
                        <Button variant="destructive" onClick={() => {
                          setJobs(jobs => jobs.map((job, idx) => idx === currentQuestionIndex ? { ...job, descriptions: [] } : job));
                          setShowConfirmReset(false);
                        }}>
                          Yes, Delete All
                        </Button>
                        <Button variant="outline" onClick={() => setShowConfirmReset(false)}>
                          Cancel
                        </Button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>,
              document.body
            )}
            <div>
              <DescriptionList
                descriptions={(jobs[currentQuestionIndex]?.descriptions || []).map((desc, i) => ({ ...desc, rank: i + 1 }))}
                onUpvote={id => {
                  setJobs(jobs => jobs.map(job => {
                    if (job.id !== jobs[currentQuestionIndex].id) return job;
                    const idx = job.descriptions.findIndex(desc => desc.id === id);
                    if (idx > 0) {
                      const newDescs = [...job.descriptions];
                      [newDescs[idx - 1], newDescs[idx]] = [newDescs[idx], newDescs[idx - 1]];
                      return { ...job, descriptions: newDescs };
                    }
                    return job;
                  }));
                }}
                onDownvote={id => {
                  setJobs(jobs => jobs.map(job => {
                    if (job.id !== jobs[currentQuestionIndex].id) return job;
                    const idx = job.descriptions.findIndex(desc => desc.id === id);
                    if (idx < job.descriptions.length - 1 && idx !== -1) {
                      const newDescs = [...job.descriptions];
                      [newDescs[idx + 1], newDescs[idx]] = [newDescs[idx], newDescs[idx + 1]];
                      return { ...job, descriptions: newDescs };
                    }
                    return job;
                  }));
                }}
                onDelete={id => {
                  setJobs(jobs => jobs.map(job =>
                    job.id === jobs[currentQuestionIndex].id ? {
                      ...job,
                      descriptions: job.descriptions.filter(desc => desc.id !== id)
                    } : job
                  ));
                }}
                onEdit={(id, newText, newContributor) => {
                  setJobs(jobs => jobs.map(job =>
                    job.id === jobs[currentQuestionIndex].id ? {
                      ...job,
                      descriptions: job.descriptions.map(desc =>
                        desc.id === id ? { ...desc, text: newText, contributor: newContributor } : desc
                      )
                    } : job
                  ));
                }}
                onAddDescription={() => setShowAddDescription(true)}
              />
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

interface AddDescriptionFormProps {
  onSubmit: (text: string, contributor: string) => void;
}

const AddDescriptionForm = ({ onSubmit }: AddDescriptionFormProps) => {
  const [text, setText] = useState("");
  const [contributor, setContributor] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && contributor.trim()) {
      onSubmit(text, contributor);
      setText("");
      setContributor("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-[#495057] mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-md border border-[#ced4da] p-2 text-sm"
          rows={4}
          placeholder="Enter a description for this job..."
          required
        />
      </div>

      <div>
        <label
          htmlFor="contributor"
          className="block text-sm font-medium text-[#495057] mb-1"
        >
          Your Name
        </label>
        <input
          id="contributor"
          type="text"
          value={contributor}
          onChange={(e) => setContributor(e.target.value)}
          className="w-full rounded-md border border-[#ced4da] p-2 text-sm"
          placeholder="Enter your name"
          required
        />
      </div>

      <Button type="submit" className="w-full bg-[#6c5ce7] hover:bg-[#5a49d8]">
        Add Description
      </Button>
    </form>
  );
};

export default Home;
