import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ColorEnum } from '../../enums/color.enum';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss']
})
export class CreateGameComponent implements OnInit {

  @Output()
  close: EventEmitter<boolean> = new EventEmitter<boolean>();

  selectedColor: ColorEnum = ColorEnum.RED;
  ColorEnum = ColorEnum;

  constructor(
    private readonly _gameService: GameService,
  ) { }

  ngOnInit(): void {
  }

  createGame() {
    this._gameService.createGame({ color: this.selectedColor });
    this.close.emit(false);
  }
}
