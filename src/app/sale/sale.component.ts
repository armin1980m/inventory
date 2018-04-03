import { Component, OnInit,TemplateRef } from '@angular/core';
// import { BsModalService } from 'ngx-bootstrap/modal';
// import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {
  addNewItem:boolean=false;
  pickNewItem:boolean=false;
  // modalRef: BsModalRef;

  // constructor(private modalService: BsModalService) {}
 
  // openModal(template: TemplateRef<any>) {
  //   this.modalRef = this.modalService.show(template,{ class: 'modal-lg modal-primary' });
  // }

  ngOnInit() {
  }

  addItemMaunaully(){
    this.pickNewItem=true;
  }

  doSomething(){
    this.pickNewItem=false;
  }
}
