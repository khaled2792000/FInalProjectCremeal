import React, { useContext } from "react";
import {
  MaterialReactTable,
  createMRTColumnHelper,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button, Typography } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { UserContext } from "../App";
import { useUsers } from "../assets/api/apiFunctions";

const columnHelper = createMRTColumnHelper();

const UsersTable = ({ setShowForm }) => {
  const { token } = useContext(UserContext);
  const { data = [], isLoading } = useUsers(token);

  const handleAddCoin = (userId) => {
    // Implement logic to add a coin to the user's account
  };

  const handleDecreaseCoin = (userId) => {
    // Implement logic to decrease a coin from the user's account
  };

  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      size: 40,
    }),
    columnHelper.accessor("name", {
      header: "Name",
      size: 120,
    }),
    columnHelper.accessor("email", {
      header: "Email",
      size: 200,
    }),
    columnHelper.accessor("coins", {
      header: "Coins",
      size: 100,
      Cell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="outlined"
            onClick={() => handleAddCoin(row.original.id)}
          >
            +1
          </Button>
          <Typography variant="body1" sx={{ mx: 2 }}>
            {row.original.coins ?? 0}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => handleDecreaseCoin(row.original.id)}
            disabled={row.original.coins <= 0}
          >
            -1
          </Button>
        </Box>
      ),
    }),
    // Add additional columns as needed based on the user structure
  ];

  const csvConfig = mkConfig({
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    selectAllMode: "page",
    enableBatchRowSelection: true,
    rowPinningDisplayMode: "select-sticky",
    columnFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        <Button onClick={handleExportData} startIcon={<FileDownloadIcon />}>
          Export All Data
        </Button>
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows)
          }
          startIcon={<FileDownloadIcon />}
        >
          Export All Rows
        </Button>
        <Button
          disabled={table.getRowModel().rows.length === 0}
          onClick={() => handleExportRows(table.getRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Page Rows
        </Button>
        <Button
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Selected Rows
        </Button>
      </Box>
    ),
    renderBottomToolbarCustomActions: ({ table }) => (
      <Button
        disabled={
          !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
        }
        onClick={() => setShowForm(true)}
      >
        Send Email to Selected Users
      </Button>
    ),
  });

  if (isLoading) return <div>Loading...</div>;

  return <MaterialReactTable table={table} />;
};

export default UsersTable;
