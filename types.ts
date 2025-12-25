export type AppState =
  | "idle"
  | "uploading"
  | "processing"
  | "success"
  | "error";

export interface ActionItem {
  task: string;
  owner: string;
  deadline: string;
}

export interface MeetingResult {
  summary: string;
  action_items: ActionItem[];
  decisions: string[];
  whatsapp_followup: string;
  email_followup: string;
}

export interface AppError {
  message: string;
}