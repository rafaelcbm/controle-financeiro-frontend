import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import * as _moment from 'moment';
import { Observable, forkJoin, of } from 'rxjs';
import { Lancamento } from '../../model/lancamento.model';
import { BooleanPipe } from '../../pipes/boolean.pipe';
import { CategoriasService } from '../../services/categorias.service';
import { ContasService } from '../../services/contas.service';
import { LancamentosService } from '../../services/lancamentos.service';
import { MessageService } from '../../services/message.service';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
import 'moment/locale/pt-br';

const moment = _rollupMoment || _moment;

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
    MatMomentDateModule,
    MatSelectModule,
    MatListModule,
    CommonModule,
    MatIconModule,
    MatListModule,
    BooleanPipe,
    MatCardModule,
  ],
  providers: [
    // MatDatepickerModule
    // provideNativeDateAdapter()
    // { provide: MAT_DATE_LOCALE, useValue: 'pt-br' },
    // provideMomentDateAdapter()
  ],
  templateUrl: './lancamentos.component.html',
  styleUrl: './lancamentos.component.scss'
})
export class LancamentosComponent implements OnInit {


  public contas$: Observable<any[]> = of([]);
  public categorias$: Observable<any[]> = of([]);

  lancamentos: any[] = [];

  lancamento: any = {
    id: '',
    nome: '',
    idConta: '',
    nomeConta: '',
    idCategoria: '',
    nomeCategoria: '',
    data: '',
    valor: 0,
    pago: false
  };

  modo: 'EDICAO' | 'INCLUSAO' = 'INCLUSAO';

  constructor(
    public contasService: ContasService,
    public categoriasService: CategoriasService,
    public lancamentosService: LancamentosService,
    private messageService: MessageService) { }


  ngOnInit() {
    this.contas$ = this.contasService.getContas();
    this.categorias$ = this.categoriasService.getCategorias();

    this.carregarLancamentos();
  }

  private carregarLancamentos() {
    this.lancamentosService.getLancamentos()
      .subscribe({
        next: lancamentos => {
          this.lancamentos = lancamentos;

          forkJoin([this.contas$, this.categorias$])
            .subscribe(result => {

              let [contasList, categoriasList] = result;

              this.lancamentos.map(l => {

                const contaEncontrada = contasList.find(c => c.id == l.idConta);
                if (contaEncontrada) {
                  l.nomeConta = contaEncontrada.nome;
                }

                const categoriaEncontrada = categoriasList.find(c => c.id == l.idCategoria);
                if (categoriaEncontrada) {
                  l.nomeCategoria = categoriaEncontrada.nome;
                }

                return l;
              })
            });
        }
      });
  }

  onSubmit(form: NgForm) {

    form.value.data =form.value.data.format('DD-MM-YYYY');   
    
    console.log('formValue:', form.value);

    if (this.modo == 'INCLUSAO') {
      this.lancamentosService.add(form.value)
        .subscribe(
          {
            next: data => {
              this.carregarLancamentos();
              this.resetForm(form);
              this.messageService.showMessage('Lançamento adicionado com sucesso.', 'Fechar');
            }
          });
    } else if (this.modo == 'EDICAO') {
      this.lancamentosService.update(this.lancamento.id, form.value)
        .subscribe(
          {
            next: data => {
              this.carregarLancamentos();
              this.resetForm(form);
              this.modo = 'INCLUSAO';
              this.messageService.showMessage('Lançamento atualizado com sucesso.', 'Fechar');
            }
          });
    }
  }

  resetForm(form: NgForm) {
    this.lancamento = {};
    form.resetForm();
    // form.form.markAsPristine();
    // form.form.markAsUntouched();
    // form.form.updateValueAndValidity();
  }

  editItem(lancamentoToEdit: Lancamento) {
    console.log('Editar lancamento:', lancamentoToEdit);

    this.modo = 'EDICAO';

    this.lancamento.id = lancamentoToEdit.id;
    this.lancamento.nome = lancamentoToEdit.nome;
    this.lancamento.idConta = lancamentoToEdit.idConta;
    this.lancamento.idCategoria = lancamentoToEdit.idCategoria;
    this.lancamento.data = moment(lancamentoToEdit.data, "DD-MM-YYYY");   
    this.lancamento.valor = lancamentoToEdit.valor;
    this.lancamento.pago = lancamentoToEdit.pago;
  }

  deleteItem(lancamento: Lancamento) {
    this.lancamentosService.delete(lancamento.id!)
      .subscribe({
        next: data => {
          this.carregarLancamentos();
          this.messageService.showMessage('Lançamento excluído com sucesso.', 'Fechar');
        }
      });
  }

  cancelar(form: NgForm) {
    this.modo = 'INCLUSAO';
    this.resetForm(form);
  }

}

