import React, { useMemo } from "react";
import { DataTable, DataTableColumn } from "@weng-lab/psychscreen-ui-components";
import { MotifTableProps, MotifTableRow } from "./types";

const MotifTable: React.FC<MotifTableProps> = ({
    motifRows,
    // onPageChane,
}) => {

    const motifColumns: DataTableColumn<MotifTableRow>[] = useMemo(() => {

        const cols: DataTableColumn<MotifTableRow>[] = [
            { header: "Info", value: (row) => row.distance, render: (row) => row.info },
        ]
    
        return cols
    
    }, [])
    
    return (
        <DataTable
            rows={motifRows}
            columns={motifColumns}
            itemsPerPage={3}
            
        />
    );
};

export default MotifTable;