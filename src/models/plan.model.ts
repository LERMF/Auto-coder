
export interface PlanStep {
  step_id: number;
  description: string;
  type: 'shell' | 'code' | 'write_file' | 'validate' | 'review' | 'report';
  command: string;
  content?: string;
  failure_remediation: string;
  status: 'pending' | 'running' | 'success' | 'failure';
}
