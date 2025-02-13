import React, { useMemo } from "react";
import { DataTable, DataTableColumn } from "@weng-lab/psychscreen-ui-components";
import { MotifTableProps, MotifTableRow } from "./types";
import { InfoOutlined } from "@mui/icons-material";
import { Stack, Tooltip, Typography } from "@mui/material";

const MotifTable: React.FC<MotifTableProps> = ({
    motifRows,
    title,
    // onPageChane,
}) => {

    const motifColumns: DataTableColumn<MotifTableRow>[] = useMemo(() => {

        const cols: DataTableColumn<MotifTableRow>[] = [
            { header: "Motif", value: (row) => row.distance, render: (row) => row.motif },
            { header: "Info", value: (row) => row.distance, render: (row) => row.info },
            {
                header: "Distance", value: (row) => row.distance.toFixed(2), HeaderRender: () =>
                    <Stack direction={"row"} alignItems={"center"} spacing={1}>
                        <Tooltip title="Euclidean Distance" arrow placement="top">
                            <InfoOutlined fontSize="small" sx={{ cursor: "pointer" }}/>
                        </Tooltip>
                        <Typography><b>Distance</b></Typography>
                    </Stack>
            },
            { header: "Best External Dataset Match", value: (row) => row.distance, render: (row) => row.match },
        ]

        return cols

    }, [])

    return (
        <DataTable
            rows={motifRows}
            columns={motifColumns}
            itemsPerPage={5}
            sortColumn={2}
            sortDescending
            hidePageMenu
            tableTitle={`Motif Search Results for ${title}`}
        />
    );
};

export default MotifTable;