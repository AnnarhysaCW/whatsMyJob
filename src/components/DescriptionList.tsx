import React from "react";
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Avatar } from "./ui/avatar";
import { AvatarFallback, AvatarImage } from "./ui/avatar";
import { motion } from "framer-motion";

export interface Description {
  id: string;
  text: string;
  contributor: string;
  rank: number;
}

interface DescriptionListProps {
  descriptions: Description[];
  onUpvote: (id: string) => void;
  onDownvote: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string, newContributor: string) => void;
  onAddDescription?: () => void;
}

const DescriptionList = ({
  descriptions = [],
  onUpvote = () => {},
  onDownvote = () => {},
  onDelete = () => {},
  onEdit = () => {},
  onAddDescription = undefined,
}: DescriptionListProps) => {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editText, setEditText] = React.useState("");
  const [editContributor, setEditContributor] = React.useState("");
  const nameInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (editingId && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [editingId]);

  const startEdit = (desc: Description) => {
    setEditingId(desc.id);
    setEditText(desc.text);
    setEditContributor(desc.contributor);
  };
  const saveEdit = (id: string) => {
    onEdit(id, editText, editContributor);
    setEditingId(null);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (editingId) saveEdit(editingId);
    }
  };
  // Sort descriptions by rank
  const sortedDescriptions = [...descriptions].sort((a, b) => a.rank - b.rank);

  return (
    <div
      className="w-full space-y-4 bg-white p-4 rounded-lg cursor-pointer"
      onClick={onAddDescription}
      title={descriptions.length === 0 && onAddDescription ? 'Click to add description' : ''}
    >
      <h3 className="text-lg font-medium mb-4">Descriptions</h3>

      {sortedDescriptions.map((description) => (
        <motion.div
          key={description.id}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-4 relative hover:shadow-md transition-shadow cursor-default">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full p-0 h-8 w-8"
                  onClick={() => onUpvote(description.id)}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">{description.rank}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full p-0 h-8 w-8"
                  onClick={() => onDownvote(description.id)}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1">
                {editingId === description.id ? (
                  <div className="bg-gray-50 p-2 rounded border mb-2">
                    <label className="block text-xs font-semibold mb-1 text-gray-700">Name</label>
                    <input
                      ref={editingId === description.id ? nameInputRef : undefined}
                      className="text-sm mb-2 border rounded px-2 py-1 w-full"
                      value={editContributor}
                      onChange={e => setEditContributor(e.target.value)}
                      placeholder="Name"
                      style={{ marginBottom: 8 }}
                    />
                    <label className="block text-xs font-semibold mb-1 text-gray-700">Description</label>
                    <textarea
                      className="text-base mb-2 border rounded px-2 py-1 w-full"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      rows={3}
                      placeholder="Description"
                      style={{ resize: 'vertical' }}
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-semibold"
                        onClick={() => saveEdit(description.id)}
                        type="button"
                      >
                        Save
                      </button>
                      <button
                        className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-xs font-semibold"
                        onClick={() => setEditingId(null)}
                        type="button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-base mb-2">{description.text}</p>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${description.contributor}`}
                          alt={description.contributor}
                        />
                        <AvatarFallback>
                          {description.contributor.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        {description.contributor}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full p-0 h-8 w-8"
                onClick={() => onDelete(description.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full p-0 h-8 w-8"
                onClick={() => startEdit(description)}
                aria-label="Edit description"
              >
                ✏️
              </Button>
            </div>
          </Card>
        </motion.div>
      ))}

      {descriptions.length === 0 && (
        <div
          className="text-center py-8 text-muted-foreground hover:text-[#6c5ce7] rounded transition-colors cursor-pointer"
        >
          <p className="text-base italic">Click to add a description</p>
        </div>
      )}
    </div>
  );
};

export default DescriptionList;
