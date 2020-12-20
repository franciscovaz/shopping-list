import { Component, EventEmitter, Output } from '@angular/core';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  @Output() menuSelected = new EventEmitter<string>();
  collapsed = true;

  onSelect(menu: string){
    this.menuSelected.emit(menu);
  }

}
