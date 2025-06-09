export interface FrequenciaReport {
  membro: {
    id: number;
    nome: string;
    familia: {
      id: number;
      nome: string;
    };
  };
  total_presencas: number;
  total_encontros: number;
  percentual_presenca: number;
}

export interface CestasReport {
  mes: string;
  total_entregas: number;
  total_familias: number;
  media_por_familia: number;
}

export interface TamanhosReport {
  tamanho: string;
  quantidade: number;
  tipo: 'calcao' | 'calca' | 'blusa';
}

export interface ProgramasReport {
  programa: string;
  total_familias: number;
  percentual: number;
}
