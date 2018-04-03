import { Component, OnInit,TemplateRef,OnChanges,SimpleChanges,Input,ViewChild,Output,EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.css']
})
export class ModalDialogComponent implements OnInit {
  @Input() title:string;
  @Input() showDialog:boolean;
  @Input() name:string;
  @Output() showDialogChange:EventEmitter<boolean>;
  @ViewChild('template') template:TemplateRef<any>;
  modalRef: BsModalRef;

  constructor(private modalService: BsModalService) {
     this.showDialogChange=new EventEmitter<boolean>();
  }
 
  ngOnChanges(changes: SimpleChanges) {
    for (let property in changes) {
       if(property==='showDialog' && changes[property].previousValue!==undefined &&   changes[property].previousValue!==changes[property].currentValue){
        changes[property].currentValue===true?this.openModal(this.template):this.closeModal(this.template);
       }
    }
  }

  openModal(template: TemplateRef<any>) {
    setTimeout( ()=>{
      this.modalRef= this.modalService.show(template,{ class: 'modal-lg modal-primary' });
      this.showDialogChange.emit(true);
    });
  }

  closeModal(template: TemplateRef<any>) {
    setTimeout(()=>{ 
      this.modalService.hide(1);
      this.showDialogChange.emit(false);
    });
  }
  ngOnInit() {
  }


}
