
import { Note } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { MessageSquare, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface NoteItemProps {
  note: Note;
}

export function NoteItem({ note }: NoteItemProps) {
  const isTranscript = note.type === 'transcript';
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md flex items-center">
            {isTranscript ? (
              <MessageSquare className="h-4 w-4 mr-2" />
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            {isTranscript ? "Call Transcript" : "Note"}
          </CardTitle>
          <span className="text-xs text-muted-foreground">
            {format(new Date(note.creationDate), "MMM d, yyyy")}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap">{note.content}</p>
      </CardContent>
      
      {isTranscript && note.sentimentScore !== undefined && note.dealQualityScore !== undefined && (
        <CardFooter className="flex flex-col gap-4 pt-2">
          <div className="w-full">
            <div className="flex justify-between mb-1 text-xs">
              <span>Sentiment Score</span>
              <span className="font-medium">{note.sentimentScore}%</span>
            </div>
            <Progress value={note.sentimentScore} className="h-2" />
          </div>
          <div className="w-full">
            <div className="flex justify-between mb-1 text-xs">
              <span>Deal Quality</span>
              <span className="font-medium">{note.dealQualityScore}%</span>
            </div>
            <Progress value={note.dealQualityScore} className="h-2" />
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
