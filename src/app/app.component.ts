import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { filter } from 'rxjs';
import { MessageState } from './core/states/message.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private readonly _store: Store<{ message: MessageState }>,
    private readonly _messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this._store.select(state => state.message)
      .pipe(filter(m => !m.summary))
      .subscribe(message => this._messageService.add(message));
  }
}
