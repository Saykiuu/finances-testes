import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { RequestService } from 'src/app/http/requestService';
import { ToastService } from 'src/app/toast-service/toast.service';

@Component({
  selector: 'app-debitos',
  templateUrl: './debitos.component.html',
  styleUrls: ['./debitos.component.css']
})
export class DebitosComponent implements OnInit {

  @ViewChild('addDebitos', { static: false }) modalAdicionar: ModalDirective | undefined
  @ViewChild('filtro', { static: false }) modalFiltro: ModalDirective | undefined
  @ViewChild('view', { static: false }) modalDetalhes: ModalDirective | undefined


  loading: boolean = false;
  constructor(
    private toast: ToastService,
    private http: RequestService) { }

  listOfDays: Array<number> = [];
  listaDebitos: Array<{
    id: number,
    descricao: string,
    valor_p: number,
    qtd_p: number,
    atual_p: number,
    status: string,
    valor_t: number
  }> = []

  addDebito: {
    descricao: string,
    valor: number,
    qtd_parcela: number,
    dia_pagamento: number
  } = {
      descricao: '',
      dia_pagamento: 1,
      qtd_parcela: 1,
      valor: 0,

    }

  filtros: {
    descricao: string,
    status: string
  } = {
      descricao: '',
      status: ''
    }

  viewDebitos: {
    id: number,
    descricao: string,
    valor_p: number,
    qtd_p: number,
    atual_p: number,
    status: string,
    valor_t: number
  } = {
      id: 0,
      descricao: '',
      valor_p: 0,
      qtd_p: 0,
      atual_p: 0,
      status: '',
      valor_t: 0
    }

  ngOnInit(): void {
    for (let i = 1; i <= 28; i++) {
      this.listOfDays.push(i)
    }
    this.getListDebito()
  }

  async getListDebito(data: any = { status: 'A' }) {
    try {
      console.log(data)
      this.loading = true;
      this.listaDebitos = [];
      let con = await this.http.getRequest('tesouraria/debitos/listaDebitos/' + JSON.stringify(data)).toPromise();
      console.log(con)
      if (con.status == 200) {
        con.result.forEach((element: any) => {
          this.listaDebitos.push({
            atual_p: element.atual_parcela,
            descricao: element.descricao,
            id: element.id,
            qtd_p: element.qtd_parcelas,
            status: element.status,
            valor_p: element.valor_p,
            valor_t: element.valor_t,
          }
          );
        });
      }
      this.loading = false;
    } catch (error) {
      console.log(error)
      this.loading = false;
      this.toast.addToast({
        mensagem: 'Erro ao consutar',
        tipo: 'E',
        titulo: 'Erro'
      })
    }
  }

  formatCurrency(val: number): string {
    return `R$ ${val.toLocaleString('pt-br', { maximumFractionDigits: 2, style: 'decimal' })}`
  }

  async insereDebito() {
    try {
      let temp = {
        descricao: this.addDebito.descricao,
        valor_p: Math.round((this.addDebito.valor / this.addDebito.qtd_parcela) * 100) / 100,
        valor_t: this.addDebito.valor,
        qtd_parcelas: this.addDebito.qtd_parcela,
        dia_pg: this.addDebito.dia_pagamento
      }
      let con = await this.http.postRequest('tesouraria/debitos/insert', temp).toPromise();
      if (con.status == 200) {
        this.addDebito = {
          descricao: '',
          dia_pagamento: 1,
          qtd_parcela: 1,
          valor: 0
        }
        this.modalAdicionar?.hide();
        this.toast.addToast({
          mensagem: 'Débito adicionado com sucesso!',
          tipo: 'S',
          titulo: 'Sucesso'
        })
      }
      this.getListDebito()
    } catch (error) {
      this.toast.addToast({
        mensagem: 'Erro! Tente novamente mais tarde',
        tipo: 'E',
        titulo: 'Erro'
      })
    }
  }

  calcResumo(): string {
    let temp = Math.round((this.addDebito.valor / this.addDebito.qtd_parcela) * 100) / 100;

    return `${this.addDebito.qtd_parcela}x de R$ ${temp.toLocaleString('pt-br', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2 })}`
  }

  openModalAdicionar() {
    this.modalAdicionar?.show()

  }

  formateStatus(val: string): string {
    switch (val) {
      case 'A':
        return "Aberto"
      case 'F':
        return "Finalizado"
      default:
        return "ativo"
        break;
    }
  }

  filtrar() {
    this.getListDebito({ status: this.filtros.status, descricao: this.filtros.descricao });
    this.modalFiltro?.hide();
  }

  openModalFiltro() {
    this.filtros = {
      descricao: '',
      status: 'A'
    }
    this.modalFiltro?.show();
  }

  openModalDetalhes(id: number) {
    console.log(id)
    console.log(this.listaDebitos)
    let temp = this.listaDebitos.filter(e => e.id == id)
    console.log(temp)
    this.viewDebitos = {
      atual_p: temp[0].atual_p,
      descricao: temp[0].descricao,
      id: temp[0].id,
      qtd_p: temp[0].qtd_p,
      status: temp[0].status,
      valor_p: temp[0].valor_p,
      valor_t: temp[0].valor_t
    }
    console.log(this.viewDebitos)
    this.modalDetalhes?.show()
  }
}
