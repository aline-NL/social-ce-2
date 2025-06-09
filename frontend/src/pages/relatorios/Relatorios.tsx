import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Tabs, Tab, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, AlertTitle } from '@mui/material';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { relatoriosApi } from '../../services/api';
import { 
  FrequenciaReport, 
  CestasReport, 
  TamanhosReport, 
  ProgramasReport 
} from '../../types';

const Relatorios: React.FC = () => {
  const { handleError } = useErrorHandler();
  const [tab, setTab] = useState(0);
  const [reports, setReports] = useState({
    frequencia: null as FrequenciaReport | null,
    cestas: null as CestasReport | null,
    tamanhos: null as TamanhosReport | null,
    programas: null as ProgramasReport | null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async (type: string) => {
    try {
      setLoading(true);
      setError(null);
      let response;
      switch (type) {
        case 'frequencia':
          response = await relatoriosApi.getFrequencia();
          setReports(prev => ({ ...prev, frequencia: response.data }));
          break;
        case 'cestas':
          response = await relatoriosApi.getCestas();
          setReports(prev => ({ ...prev, cestas: response.data }));
          break;
        case 'tamanhos':
          response = await relatoriosApi.getTamanhos();
          setReports(prev => ({ ...prev, tamanhos: response.data }));
          break;
        case 'programas':
          response = await relatoriosApi.getProgramas();
          setReports(prev => ({ ...prev, programas: response.data }));
          break;
      }
    } catch (error) {
      const errorDetails = handleError(error);
      setError(errorDetails.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    fetchReport(['frequencia', 'cestas', 'tamanhos', 'programas'][newValue]);
  };

  useEffect(() => {
    fetchReport(['frequencia', 'cestas', 'tamanhos', 'programas'][tab]);
  }, [tab]);

  const renderReport = () => {
    // Corrigindo o acesso ao array
    const report = reports[['frequencia', 'cestas', 'tamanhos', 'programas'][tab]];
  
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error">
            <AlertTitle>Erro ao carregar relatório</AlertTitle>
            {error}
          </Alert>
        </Box>
      );
    }

    if (!report) return null;

    switch (tab) {
      case 0: // Frequência
        return (
          <Box>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Frequência de Presença
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Membro</TableCell>
                    <TableCell>Família</TableCell>
                    <TableCell>Presenças</TableCell>
                    <TableCell>Encontros</TableCell>
                    <TableCell>% Presença</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {report.frequencia.map((item: any) => (
                    <TableRow key={item.membro__nome}>
                      <TableCell>{item.membro__nome}</TableCell>
                      <TableCell>{item.membro__familia__nome}</TableCell>
                      <TableCell>{item.total_presencas}</TableCell>
                      <TableCell>{item.total_encontros}</TableCell>
                      <TableCell>{item.percentual_presenca.toFixed(2)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Typography>
                Total: {report.frequencia.length} membros - 
                Média de Presença: {report.statistics.media_presenca.toFixed(2)}%
              </Typography>
            </Box>
          </Box>
        );

      case 1: // Cestas
        return (
          <Box>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Entregas de Cestas
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Mês</TableCell>
                    <TableCell>Entregas</TableCell>
                    <TableCell>Famílias</TableCell>
                    <TableCell>Média por Família</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {report.cestas.map((item: any) => (
                    <TableRow key={`${item.mes}-${item.ano}`}>
                      <TableCell>{item.mes}/{item.ano}</TableCell>
                      <TableCell>{item.total_entregas}</TableCell>
                      <TableCell>{item.total_familias}</TableCell>
                      <TableCell>{item.media_por_familia.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Typography>
                Total: {report.statistics.total_entregas} entregas - 
                Média por mês: {report.statistics.media_entregas_por_mes.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        );

      case 2: // Tamanhos
        return (
          <Box>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Distribuição de Tamanhos
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tamanho</TableCell>
                    <TableCell>Quantidade</TableCell>
                    <TableCell>% Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(report.distribuicao).map(([tipo, items]) => (
                    <React.Fragment key={tipo}>
                      <TableRow>
                        <TableCell colSpan={3}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      {items.map((item: any) => (
                        <TableRow key={`${tipo}-${item.tamanho}`}>
                          <TableCell>{item.tamanho}</TableCell>
                          <TableCell>{item.quantidade}</TableCell>
                          <TableCell>
                            {((item.quantidade / report.statistics[`total_${tipo}`]) * 100).toFixed(2)}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Typography>
                Total: {report.statistics.total_membros} membros - 
                Calçados: {report.statistics.total_calcoes} - 
                Calças: {report.statistics.total_calcas} - 
                Blusas: {report.statistics.total_blusas}
              </Typography>
            </Box>
          </Box>
        );

      case 3: // Programas
        return (
          <Box>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Programas Sociais
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Programa</TableCell>
                    <TableCell>Famílias</TableCell>
                    <TableCell>% Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {report.programas.map((programa: any) => (
                    <TableRow key={programa.programas_sociais}>
                      <TableCell>{programa.programas_sociais}</TableCell>
                      <TableCell>{programa.total_familias}</TableCell>
                      <TableCell>{programa.percentual.toFixed(2)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Typography>
                Total: {report.statistics.total_familias} famílias - 
                Com programas: {report.statistics.total_com_programas} - 
                % com programas: {report.statistics.percentual_com_programas.toFixed(2)}%
              </Typography>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography component="h1" variant="h4" align="center">
          Relatórios
        </Typography>

        <Tabs value={tab} onChange={handleChangeTab} sx={{ mt: 2 }}>
          <Tab label="Frequência" />
          <Tab label="Cestas" />
          <Tab label="Tamanhos" />
          <Tab label="Programas" />
        </Tabs>

        {renderReport()}
        </Paper>
    </Container>
  );
};

export default Relatorios;
