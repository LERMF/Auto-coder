import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { marked } from 'marked';
import { PlanStep } from '../models/plan.model';
import { firstValueFrom, map } from 'rxjs';

interface PlanResponse {
  steps: Omit<PlanStep, 'status'>[];
}

interface ReviewResponse {
  review: string;
}

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private http = inject(HttpClient);
  
  // This is the endpoint for the backend-proxy (serverless function).
  // This frontend code assumes the proxy is configured to handle requests at this path.
  private proxyUrl = '/api/genesis'; 

  async generatePlan(goal: string): Promise<Omit<PlanStep, 'status'>[]> {
    const requestBody = {
      goal,
      mode: 'develop'
    };
    
    // Use firstValueFrom to convert Observable to Promise, minimizing changes in the component
    const response$ = this.http.post<PlanResponse>(this.proxyUrl, requestBody).pipe(
      map(response => response.steps)
    );

    try {
      // In a real application, the backend would handle JSON parsing and validation.
      // We assume the proxy returns the "steps" array directly.
      return await firstValueFrom(response$);
    } catch (error) {
      console.error('Proxy Error (generatePlan):', error);
      throw new Error('Falha na comunicação com o backend-proxy.');
    }
  }

  async reviewCode(code: string): Promise<string> {
    const requestBody = {
      code,
      mode: 'review'
    };

    const response$ = this.http.post<ReviewResponse>(this.proxyUrl, requestBody).pipe(
      // The backend proxy should return the raw markdown from Gemini.
      // The frontend is responsible for rendering it.
      map(response => marked.parse(response.review) as string)
    );

    try {
      return await firstValueFrom(response$);
    } catch (error) {
      console.error('Proxy Error (reviewCode):', error);
      throw new Error('Falha na comunicação com o backend-proxy para a revisão de código.');
    }
  }
}