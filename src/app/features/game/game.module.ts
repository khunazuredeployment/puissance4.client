import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateGameComponent } from './components/create-game/create-game.component';
import { StoreModule } from '@ngrx/store';
import { GamesReducer } from './states/games.reducers';
import { BoardComponent } from './components/board/board.component';
import { GamesComponent } from './components/games/games.component';


@NgModule({
  declarations: [
    GameComponent,
    CreateGameComponent,
    BoardComponent,
    GamesComponent
  ],
  imports: [
    CommonModule,
    GameRoutingModule,
    SharedModule,
    StoreModule.forFeature( 'gamesFeatures', { games: GamesReducer } ),
  ]
})
export class GameModule { }
