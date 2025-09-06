import { PlanStep } from './plan.model';
import { AppMode, ExecutionStatus } from './types.model';

export interface AppState {
  mode: AppMode;
  goal: string;
  codeToReview: string;
  plan: PlanStep[];
  reviewResult: string;
  executionStatus: ExecutionStatus;
  errorMessage: string | null;
  executionLog: string[];
}
