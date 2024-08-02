import React from "react";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { MemeOccurrence } from "./Types";

interface Props {
  rows: MemeOccurrence[];
}

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "region", headerName: "Region", width: 150 },
  { field: "count", headerName: "Count", width: 150 },
];

const MemeOccuDataTable: React.FC<Props> = ({ rows }) => {
  const formattedRows: GridRowsProp = rows.map((row) => ({
    id: row.id, // Use the provided id
    region: row.region,
    count: row.count,
  }));

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={formattedRows}
        columns={columns}
        pageSizeOptions={[5]}
        initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
      />
    </div>
  );
};

export default MemeOccuDataTable;
