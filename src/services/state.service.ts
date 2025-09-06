import { Injectable } from '@angular/core';
import { AppState } from '../models/app-state.model';

@Injectable({ 
  providedIn: 'root' 
})
export class StateService {
  private readonly STORAGE_KEY = 'genesisAppState';

  saveState(state: AppState): void {
    try {
      const stateString = JSON.stringify(state);
      localStorage.setItem(this.STORAGE_KEY, stateString);
    } catch (e) {
      console.error('Error saving state to localStorage', e);
    }
  }

  loadState(): AppState | null {
    try {
      const stateString = localStorage.getItem(this.STORAGE_KEY);
      if (!stateString) {
        return null;
      }
      return JSON.parse(stateString) as AppState;
    } catch (e) {
      console.error('Error reading state from localStorage', e);
      return null;
    }
  }

  clearState(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (e) {
      console.error('Error clearing state from localStorage', e);
    }
  }
}
