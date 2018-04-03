import { Component, OnInit } from '@angular/core';
import { MenuService } from '../services/menu.service';
import { Menu } from '../models/menu.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  isCollapsed: boolean = false;

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  constructor(private menuService:MenuService) { }
   menuData:Menu;
   
  ngOnInit() {
    this.menuData=this.menuService.getMenuData();
  }

}
