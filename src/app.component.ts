import { Component, ChangeDetectionStrategy, signal, inject, computed, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from './services/gemini.service';
import { StateService } from './services/state.service';
import { PlanStep } from './models/plan.model';
import { AppState } from './models/app-state.model';
import { AppMode, ExecutionStatus } from './models/types.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AppComponent implements OnInit {
  private geminiService = inject(GeminiService);
  private stateService = inject(StateService);

  // App State Signals
  mode = signal<AppMode>('develop');
  goal = signal<string>('');
  codeToReview = signal<string>('');
  plan = signal<PlanStep[]>([]);
  reviewResult = signal<string>('');
  executionStatus = signal<ExecutionStatus>('idle');
  errorMessage = signal<string | null>(null);
  executionLog = signal<string[]>([]);

  isProcessing = computed(() => 
    this.executionStatus() === 'planning' || 
    this.executionStatus() === 'executing' || 
    this.executionStatus() === 'reviewing'
  );

  isDevelopMode = computed(() => this.mode() === 'develop');

  constructor() {
    effect(() => {
      const state: AppState = {
        mode: this.mode(),
        goal: this.goal(),
        codeToReview: this.codeToReview(),
        plan: this.plan(),
        reviewResult: this.reviewResult(),
        executionStatus: this.executionStatus(),
        errorMessage: this.errorMessage(),
        executionLog: this.executionLog(),
      };
      this.stateService.saveState(state);
    });
  }

  ngOnInit(): void {
    const savedState = this.stateService.loadState();
    if (savedState) {
      this.mode.set(savedState.mode);
      this.goal.set(savedState.goal);
      this.codeToReview.set(savedState.codeToReview);
      this.plan.set(savedState.plan);
      this.reviewResult.set(savedState.reviewResult);
      
      // Do not restore a processing state on page load
      if (savedState.executionStatus !== 'planning' && savedState.executionStatus !== 'executing' && savedState.executionStatus !== 'reviewing') {
        this.executionStatus.set(savedState.executionStatus);
      } else {
        this.executionStatus.set('idle');
      }
      
      this.errorMessage.set(savedState.errorMessage);
      this.executionLog.set(savedState.executionLog);
    }
  }

  setMode(newMode: AppMode): void {
    this.mode.set(newMode);
    this.resetState();
  }
  
  newSession(): void {
    this.stateService.clearState();
    this.mode.set('develop');
    this.resetState();
  }

  private resetState(): void {
    this.goal.set('');
    this.codeToReview.set('');
    this.plan.set([]);
    this.reviewResult.set('');
    this.executionStatus.set('idle');
    this.errorMessage.set(null);
    this.executionLog.set([]);
  }

  async startProject(): Promise<void> {
    // Clear previous results but keep goal/code
    this.plan.set([]);
    this.reviewResult.set('');
    this.executionStatus.set('idle');
    this.errorMessage.set(null);
    this.executionLog.set([]);

    if (this.isDevelopMode()) {
      await this.generatePlan();
    } else {
      await this.performReview();
    }
  }

  private async generatePlan(): Promise<void> {
    if (!this.goal().trim()) {
      this.errorMessage.set('Por favor, insira um objetivo para o projeto.');
      return;
    }

    this.executionStatus.set('planning');
    this.executionLog.set(['Iniciando Gênesis... Recebendo objetivo.']);
    this.executionLog.update(log => [...log, 'Analisando o objetivo e criando um plano estratégico...']);

    try {
      const generatedPlan = await this.geminiService.generatePlan(this.goal());
      this.plan.set(generatedPlan.map(p => ({ ...p, status: 'pending' })));
      this.executionStatus.set('idle');
      this.executionLog.update(log => [...log, 'Plano de execução recebido da IA. Pronto para execução.']);
    } catch (error) {
      console.error('Error generating plan:', error);
      const message = error instanceof Error ? error.message : 'A IA pode estar indisponível ou a requisição foi inválida.';
      this.errorMessage.set(`Falha ao gerar o plano. ${message}`);
      this.executionLog.update(log => [...log, 'ERRO: Falha na fase de planejamento.']);
      this.executionStatus.set('error');
    }
  }

  async executePlan(): Promise<void> {
    this.executionStatus.set('executing');
    this.executionLog.update(log => [...log, '--- INÍCIO DA EXECUÇÃO DO PLANO ---']);

    for (let i = 0; i < this.plan().length; i++) {
      this.plan.update(currentPlan => {
        const newPlan = [...currentPlan];
        newPlan[i] = { ...newPlan[i], status: 'running' };
        this.executionLog.update(log => [...log, `[Passo ${newPlan[i].step_id}] EXECUTANDO: ${newPlan[i].description}`]);
        return newPlan;
      });
      
      await this.delay(1000 + Math.random() * 1000); // Simulate work

      this.plan.update(currentPlan => {
        const newPlan = [...currentPlan];
        newPlan[i] = { ...newPlan[i], status: 'success' };
        this.executionLog.update(log => [...log, `[Passo ${newPlan[i].step_id}] SUCESSO.`]);
        return newPlan;
      });
    }
    this.executionStatus.set('finished');
    this.executionLog.update(log => [...log, '--- PLANO EXECUTADO COM SUCESSO ---', 'Projeto Gênesis concluído.']);
  }

  private async performReview(): Promise<void> {
    if (!this.codeToReview().trim()) {
      this.errorMessage.set('Por favor, insira o código para ser revisado.');
      return;
    }

    this.executionStatus.set('reviewing');
    this.executionLog.set(['Iniciando modo de revisão...']);
    this.executionLog.update(log => [...log, 'Analisando o código com a IA...']);
    try {
      const result = await this.geminiService.reviewCode(this.codeToReview());
      this.reviewResult.set(result);
      this.executionStatus.set('finished');
      this.executionLog.update(log => [...log, 'Revisão de código concluída.']);
    } catch (error) {
      console.error('Error performing review:', error);
      const message = error instanceof Error ? error.message : 'A IA pode estar indisponível ou a requisição foi inválida.';
      this.errorMessage.set(`Falha ao revisar o código. ${message}`);
      this.executionLog.update(log => [...log, 'ERRO: Falha durante a revisão do código.']);
      this.executionStatus.set('error');
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}