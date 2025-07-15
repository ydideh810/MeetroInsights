import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Database, Tag, Calendar, User, Trash2, Eye } from "lucide-react";
import { MeetingAnalysis } from "@shared/schema";
import LoadingScreen from "@/components/ui/loading-screen";

interface Meeting {
  id: number;
  title: string;
  category?: string;
  transcript: string;
  topic?: string;
  attendees?: string;
  knownInfo?: string;
  analysis: MeetingAnalysis;
  shinraiMode?: string;
  createdAt: string;
  tags: Tag[];
}

interface Tag {
  id: number;
  name: string;
  color: string;
  createdAt: string;
}

interface SaveMeetingDialogProps {
  analysis: MeetingAnalysis | null;
  transcript: string;
  topic: string;
  attendees: string;
  knownInfo: string;
  shinraiMode?: string;
  onSave: () => void;
}

function SaveMeetingDialog({ analysis, transcript, topic, attendees, knownInfo, shinraiMode, onSave }: SaveMeetingDialogProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#ff4500");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tagsData } = useQuery({
    queryKey: ["/api/memory-bank/tags"],
    enabled: isOpen,
  });

  const tags = tagsData?.tags || [];

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/memory-bank/save', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Meeting saved",
        description: "Your meeting has been saved to the Memory Bank",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/memory-bank/meetings"] });
      setIsOpen(false);
      setTitle("");
      setCategory("");
      setSelectedTags([]);
      onSave();
    },
    onError: (error) => {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Failed to save meeting",
        variant: "destructive",
      });
    },
  });

  const createTagMutation = useMutation({
    mutationFn: async (tag: { name: string; color: string }) => {
      const response = await apiRequest('POST', '/api/memory-bank/tags', tag);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memory-bank/tags"] });
      setNewTagName("");
      setNewTagColor("#ff4500");
    },
  });

  const handleSave = () => {
    if (!title) {
      toast({
        title: "Title required",
        description: "Please enter a title for your meeting",
        variant: "destructive",
      });
      return;
    }

    const newTags = newTagName ? [{ name: newTagName, color: newTagColor }] : [];

    saveMutation.mutate({
      title,
      category: category || undefined,
      transcript,
      topic,
      attendees,
      knownInfo,
      analysis,
      shinraiMode,
      tagIds: selectedTags,
      newTags,
    });
  };

  const handleCreateTag = () => {
    if (newTagName) {
      createTagMutation.mutate({ name: newTagName, color: newTagColor });
    }
  };

  if (!analysis) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-cyber-teal text-black hover:bg-cyan-400 font-bold">
          <Database className="w-4 h-4 mr-2" />
          SAVE TO MEMORY BANK
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-cyber-dark-panel border-cyber-orange text-cyber-cyan max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-cyber-orange">Save to Memory Bank</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter meeting title..."
              className="bg-cyber-panel border-cyber-orange text-cyber-cyan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-cyber-panel border-cyber-orange text-cyber-cyan">
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standup">Daily Standup</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="retrospective">Retrospective</SelectItem>
                <SelectItem value="client">Client Meeting</SelectItem>
                <SelectItem value="team">Team Meeting</SelectItem>
                <SelectItem value="project">Project Review</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag: Tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-cyber-orange"
                  style={{ backgroundColor: selectedTags.includes(tag.id) ? tag.color : undefined }}
                  onClick={() => {
                    setSelectedTags(prev => 
                      prev.includes(tag.id) 
                        ? prev.filter(id => id !== tag.id)
                        : [...prev, tag.id]
                    );
                  }}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag.name}
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-2 mt-2">
              <Input
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="New tag name..."
                className="bg-cyber-panel border-cyber-orange text-cyber-cyan flex-1"
              />
              <Input
                type="color"
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
                className="w-12 h-10 p-1 bg-cyber-panel border-cyber-orange"
              />
              <Button
                onClick={handleCreateTag}
                disabled={!newTagName || createTagMutation.isPending}
                className="bg-cyber-orange text-black hover:bg-orange-600"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="bg-cyber-orange text-black hover:bg-orange-600 font-bold flex-1"
            >
              {saveMutation.isPending ? "SAVING..." : "SAVE TO MEMORY BANK"}
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="border-cyber-orange text-cyber-cyan hover:bg-cyber-orange hover:text-black"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function MemoryBank() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all-categories");
  const [selectedTag, setSelectedTag] = useState("all");
  const [viewingMeeting, setViewingMeeting] = useState<Meeting | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: meetingsData, isLoading } = useQuery({
    queryKey: ["/api/memory-bank/meetings"],
  });

  const { data: tagsData } = useQuery({
    queryKey: ["/api/memory-bank/tags"],
  });

  const searchMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest('GET', `/api/memory-bank/search?q=${encodeURIComponent(query)}`);
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/memory-bank/meetings/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Meeting deleted",
        description: "Meeting has been removed from Memory Bank",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/memory-bank/meetings"] });
    },
  });

  const meetings = meetingsData?.meetings || [];
  const tags = tagsData?.tags || [];
  const searchResults = searchMutation.data?.meetings || [];

  const displayMeetings = searchQuery ? searchResults : meetings;

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchMutation.mutate(searchQuery);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-cyber-dark-panel border-2 border-cyber-orange rounded-lg p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Database className="w-8 h-8 text-cyber-orange" />
          <div>
            <h2 className="text-2xl font-bold text-cyber-orange cyber-glow">MEMORY BANK</h2>
            <p className="text-sm text-cyber-cyan">CYBERPUNK MEETING ARCHIVE</p>
          </div>
        </div>
        <div className="text-sm text-cyber-cyan">
          {meetings.length} RECORDS STORED
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-cyber-cyan" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search meetings..."
              className="pl-10 bg-cyber-panel border-cyber-orange text-cyber-cyan"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={searchMutation.isPending}
            className="bg-cyber-orange text-black hover:bg-orange-600"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-cyber-panel border-cyber-orange text-cyber-cyan">
              <SelectValue placeholder="Filter by category..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-categories">All Categories</SelectItem>
              <SelectItem value="standup">Daily Standup</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="retrospective">Retrospective</SelectItem>
              <SelectItem value="client">Client Meeting</SelectItem>
              <SelectItem value="team">Team Meeting</SelectItem>
              <SelectItem value="project">Project Review</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="bg-cyber-panel border-cyber-orange text-cyber-cyan">
              <SelectValue placeholder="Filter by tag..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {tags.map((tag: Tag) => (
                <SelectItem key={tag.id} value={tag.id.toString()}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Meetings List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {isLoading ? (
          <LoadingScreen 
            variant="neural" 
            message="ACCESSING MEMORY BANK"
            className="relative"
          />
        ) : displayMeetings.length === 0 ? (
          <div className="text-center py-8 text-cyber-cyan">
            <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
            {searchQuery ? "NO SEARCH RESULTS" : "NO MEETINGS STORED"}
          </div>
        ) : (
          displayMeetings.map((meeting: Meeting) => (
            <Card key={meeting.id} className="bg-cyber-panel border-cyber-orange hover:border-cyber-cyan transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-cyber-orange text-lg">{meeting.title}</CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-xs text-cyber-cyan">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(meeting.createdAt)}
                      </div>
                      {meeting.category && (
                        <Badge variant="outline" className="text-cyber-cyan border-cyber-cyan">
                          {meeting.category}
                        </Badge>
                      )}
                      {meeting.shinraiMode && (
                        <Badge variant="outline" className="text-cyber-orange border-cyber-orange">
                          {meeting.shinraiMode.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setViewingMeeting(meeting)}
                      className="border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-black"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteMutation.mutate(meeting.id)}
                      className="border-cyber-red text-cyber-red hover:bg-cyber-red hover:text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1 mb-2">
                  {meeting.tags.map((tag: Tag) => (
                    <Badge
                      key={tag.id}
                      className="text-xs"
                      style={{ backgroundColor: tag.color + '33', color: tag.color, borderColor: tag.color }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-cyber-cyan line-clamp-2">
                  {meeting.analysis.summary}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* View Meeting Dialog */}
      <Dialog open={!!viewingMeeting} onOpenChange={() => setViewingMeeting(null)}>
        <DialogContent className="bg-cyber-dark-panel border-cyber-orange text-cyber-cyan max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-cyber-orange text-xl">
              {viewingMeeting?.title}
            </DialogTitle>
            <div className="flex gap-2 mt-2">
              {viewingMeeting?.category && (
                <Badge variant="outline" className="text-cyber-cyan border-cyber-cyan">
                  {viewingMeeting.category}
                </Badge>
              )}
              {viewingMeeting?.shinraiMode && (
                <Badge variant="outline" className="text-cyber-orange border-cyber-orange">
                  {viewingMeeting.shinraiMode.toUpperCase()}
                </Badge>
              )}
            </div>
          </DialogHeader>
          
          {viewingMeeting && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {viewingMeeting.tags.map((tag: Tag) => (
                  <Badge
                    key={tag.id}
                    style={{ backgroundColor: tag.color + '33', color: tag.color, borderColor: tag.color }}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyber-orange mb-2">Summary</h3>
                <p className="text-cyber-cyan">{viewingMeeting.analysis.summary}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyber-orange mb-2">Key Decisions</h3>
                <ul className="space-y-1">
                  {viewingMeeting.analysis.keyDecisions.map((decision, idx) => (
                    <li key={idx} className="text-cyber-cyan">• {decision}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyber-orange mb-2">Action Items</h3>
                <ul className="space-y-1">
                  {viewingMeeting.analysis.actionItems.map((item, idx) => (
                    <li key={idx} className="text-cyber-cyan">
                      • {item.task}
                      {item.assignee && <span className="text-cyber-teal"> ({item.assignee})</span>}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyber-orange mb-2">Follow-ups</h3>
                <ul className="space-y-1">
                  {viewingMeeting.analysis.followUps.map((followUp, idx) => (
                    <li key={idx} className="text-cyber-cyan">• {followUp}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { SaveMeetingDialog };