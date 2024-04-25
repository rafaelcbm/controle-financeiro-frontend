import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { Observable, of } from 'rxjs';
import { CategoriasService } from '../../services/categorias.service';
import { ContasService } from '../../services/contas.service';
import { LancamentosService } from '../../services/lancamentos.service';
import { Lancamento } from '../../model/lancamento.model';



@Component({
  selector: 'app-lancamentos',
  standalone: true,
  imports: [HeaderComponent,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    DatePipe,
    MatDatepickerModule,
    MatSelectModule,
    MatListModule,
    CommonModule,
    MatIconModule,
    MatListModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './lancamentos.component.html',
  styleUrl: './lancamentos.component.scss'
})
export class LancamentosComponent implements OnInit {


  public contas: Observable<any[]> = of([]);
  public categorias: Observable<any[]> = of([]);

  lancamentos: any[] = [];

  lancamento: any = {
    id: '',
    nome: '',
    idConta: '',
    idCategoria: '',
    data: '',
    valor: 0,
    pago: false
  };

  modo: 'EDICAO' | 'INCLUSAO' = 'INCLUSAO';

  constructor(
    public contasService: ContasService,
    public categoriasService: CategoriasService,
    public lancamentosService: LancamentosService) { }


  ngOnInit() {
    this.contas = this.contasService.getContas();
    this.categorias = this.categoriasService.getCategorias();

    this.carregarLancamentos();
  }

  private carregarLancamentos() {
    this.lancamentosService.getLancamentos()
      .subscribe({ next: lancamentos => this.lancamentos = lancamentos });
  }

  onSubmit(form: NgForm) {
    // console.log('Entidade salva:', this.entidade);

    form.value.data = this.formatarDataParaString(form.value.data);
    console.log('formValue:', form.value);

    this.lancamentosService.add(form.value)
      .subscribe(
        {
          next: data => {
            this.carregarLancamentos();
            this.resetForm(form);
          }
        });
  }

  resetForm(form: NgForm) {
    this.lancamento = {};
    form.resetForm();
    // form.form.markAsPristine();
    // form.form.markAsUntouched();
    // form.form.updateValueAndValidity();
  }

  formatarDataParaString(data: Date) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Os meses são indexados a partir de 0
    const ano = data.getFullYear();

    return `${dia}-${mes}-${ano}`;
  }


  editItem(lancamento: Lancamento) {
    // Lógica para editar o item
    console.log('Editar lancamento:', lancamento);

    // this.novoItem.id = item.id;
    // this.novoItem.nome = item.nome;
    // this.modo = 'EDICAO';
  }

  deleteItem(lancamento: Lancamento) {
    this.lancamentosService.delete(lancamento.id!)
      .subscribe({ next: data => this.carregarLancamentos() });
  }

  cancelar(form: NgForm) {
    this.modo = 'INCLUSAO';
    this.resetForm(form);
  }

}

