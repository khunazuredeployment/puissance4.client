import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { Store } from "@ngrx/store";
import { MessageService } from "primeng/api";
import { filter } from "rxjs";
import { MessagesState } from "./core/states/messages.reducers";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private readonly _cd: ChangeDetectorRef,
    private readonly _store: Store<{ messages: MessagesState }>,
    private readonly _messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this._store.select(state => state.messages.message)
      .pipe(filter(m => !!m))
      .subscribe(m => {
        this._messageService.add({
          severity: m?.severity.toLocaleLowerCase(),
          summary: m?.content,
          sticky: m?.sticky,
        });
        this._cd.detectChanges();
      });
  }

}
