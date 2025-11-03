import { Component } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { Observable } from 'rxjs';
import { Provider } from '../../../model/provider.model';
import { AsyncPipe } from '@angular/common';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-edit-provider.component',
  imports: [AsyncPipe, NgIf],
  templateUrl: './edit-provider.component.html',
  styleUrl: './edit-provider.component.css',
})
export class EditProviderComponent {

  // FIX: Allow 'null' in the Observable type to match the DataService.
  providerData$!: Observable<Provider | null>; // 👈 Changed to include | null

  constructor(private dataService: DataService) {
    // This assignment is now valid.
    this.providerData$ = this.dataService.currentProvider;
  }

}
