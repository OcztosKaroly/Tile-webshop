import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  filterUpdated = new EventEmitter<any>();

  updateFilters(filters: any) {
    if (filters !== null) {
      this.filterUpdated.emit(filters);
    }
  }
}