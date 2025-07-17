import {
  DataGrid as MuiDataGrid,
  DataGridProps as MuiDataGridProps,
  GridColDef,
  GridToolbar,
  ptBR,
} from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

type DataGridProps = MuiDataGridProps & {
  title?: string;
  columns: GridColDef[];
  loading?: boolean;
  rows: any[];
  totalRows?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onRowClick?: (row: any) => void;
};

const StyledDataGrid = styled(MuiDataGrid)(({ theme }) => ({
  border: 'none',
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '& .MuiDataGrid-cell': {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '& .MuiDataGrid-row': {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      cursor: 'pointer',
    },
  },
}));

export const DataGrid: React.FC<DataGridProps> = ({
  title,
  columns,
  loading = false,
  rows = [],
  totalRows = 0,
  page = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  onRowClick,
  ...props
}) => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {title && (
        <Typography variant="h6" sx={{ mb: 2 }}>
          {title}
        </Typography>
      )}
      <Box sx={{ flexGrow: 1 }}>
        <StyledDataGrid
          rows={rows}
          columns={columns}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 25, 50]}
          paginationMode="server"
          rowCount={totalRows}
          page={page}
          onPageChange={(newPage) => onPageChange?.(newPage)}
          onPageSizeChange={(newPageSize) => onPageSizeChange?.(newPageSize)}
          loading={loading}
          onRowClick={(params) => onRowClick?.(params.row)}
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          components={{
            Toolbar: GridToolbar,
          }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          disableColumnMenu
          disableSelectionOnClick
          {...props}
        />
      </Box>
    </Box>
  );
};

export default DataGrid;
