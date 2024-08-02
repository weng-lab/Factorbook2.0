import React from "react";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "name", headerName: "Name", width: 150 },
  { field: "round", headerName: "Round", width: 150 },
];

const rows: GridRowsProp = [
  { id: 1, name: "Motif 1", round: 1 },
  { id: 2, name: "Motif 2", round: 2 },
];

const DeepLearnedMotifOccurrenceDataTable: React.FC = () => {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5]}
        initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
      />
    </div>
  );
};

export default DeepLearnedMotifOccurrenceDataTable;
