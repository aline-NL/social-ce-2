export interface EntregaData {
  id: number;
  familia: {
    id: number;
    nome: string;
  };
  data_entrega: string;
  observacoes: string | null;
}

export interface FamiliaData {
  id: number;
  nome: string;
  ultima_entrega: string | null;
  pode_receber: boolean;
}
