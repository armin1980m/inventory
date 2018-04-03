import { Injectable } from '@angular/core';
import { Menu } from '../models/menu.model';
import { MenuItem } from '../models/menuItem.model';
@Injectable()
export class MenuService
{
    constructor(){

    }

    getMenuData():Menu
    {
        let menu=new Menu();
        menu.brand='Rodeway Inn Suites';

        menu.items.push(new MenuItem('Sale','/sale',['Admin','User']));
        menu.items.push(new MenuItem('Report','/report',['Admin']));
        menu.items.push(new MenuItem('Admin','/admin',['Admin']));
        menu.items.push(new MenuItem('Logout','/logout',['Admin','User']));

        return menu;
    }
}