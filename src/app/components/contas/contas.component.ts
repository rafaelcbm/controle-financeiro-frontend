import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';


import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ContasService } from '../../services/contas.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-contas',
  standalone: true,
  imports: [MatListModule, MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule, HeaderComponent],
  templateUrl: './contas.component.html',
  styleUrl: './contas.component.scss'
})
export class ContasComponent {

  items: any[] = [];
  novoItem: any = { nome: '' };
  modo: 'EDICAO' | 'INCLUSAO' = 'INCLUSAO';


  constructor(private contasService: ContasService) { }

  ngOnInit(): void {
    this.carregarContas();
  }

  private carregarContas() {
    this.contasService.getContas()
      .subscribe(
        {
          next: data => {
            this.items = data;
          }
        });
  }

  adicionarAtualizarItem() {
    // Verificar se o campo de texto está vazio
    if (this.novoItem.nome.trim() === '') {
      return;
    }

    if (this.modo == 'INCLUSAO') {
      // Adicionar novo item à lista
      this.contasService.add(this.novoItem.nome)
        .subscribe(
          {
            next: data => {
              this.carregarContas();
              this.novoItem.nome = '';
            }
          });
    } else if (this.modo == 'EDICAO') {
      this.contasService.update(this.novoItem.id, this.novoItem.nome)
        .subscribe(
          {
            next: data => {
              this.carregarContas();
              this.novoItem.nome = '';
              this.modo = 'INCLUSAO';
            }
          });
    }
  }

  editItem(item: any) {
    // Lógica para editar o item
    console.log('Editar item:', item);

    this.novoItem.id = item.id;
    this.novoItem.nome = item.nome;
    this.modo = 'EDICAO';
  }

  deleteItem(item: any) {
    // Lógica para excluir o item
    console.log('Excluir item:', item);

    this.contasService.delete(item.id)
      .subscribe(
        {
          next: data => this.carregarContas()
        });
  }

  cancelar() {
    this.modo = 'INCLUSAO';
    this.novoItem.nome = '';
  }

}
