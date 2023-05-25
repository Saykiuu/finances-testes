import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class Formate {
    telefone(val: string){
        let sp = val.trim();
        return `(${sp.slice(0, 2)}) ${sp.slice(2, 6)}-${sp.slice(7)}`
    }

    data(val: Date){
        let dataFomated = new Date(val)
        return dataFomated.toLocaleDateString();
    }

    moeda(val: number){
        let formated = val.toLocaleString('pt-br', { minimumFractionDigits: 2 });
        return formated;
    }
}