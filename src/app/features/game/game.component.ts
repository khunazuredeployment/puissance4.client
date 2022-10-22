import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeUntil, finalize } from 'rxjs';
import { DestroyedComponent } from 'src/app/core/components/destroyed.component';
import { SessionState, stop } from 'src/app/core/states/session.reducers';
import { GameDetailsModel } from './models/game-details.model';
import { GamesState } from './states/games.reducers';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent extends DestroyedComponent implements OnInit {

  menuOpen: boolean = true;
  dialogOpen: boolean = false;

  currentGame!: GameDetailsModel|null;

  constructor(
    private readonly _store: Store<{session: SessionState, gamesFeatures: {games: GamesState}}>,
    private readonly _cd: ChangeDetectorRef,
    private readonly _router: Router,
  ) { super(); }

  ngOnInit(): void {
    this._store.select(state => state.gamesFeatures.games.currentGame)
      .pipe(takeUntil(this.destroyed))
      .subscribe(game => {
        if(!game) {
          this.menuOpen = true;
        }
        if(game && !this.currentGame) {
          this.menuOpen = false;
        }
        this.currentGame = game;
        this._cd.detectChanges();
      });
  }

  logout() {
    this._store.dispatch(stop());
    this._router.navigate(['auth'])
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  
  openCreateGameDialog() {
    this.dialogOpen = true;
  }

}
