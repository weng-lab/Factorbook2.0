"use client";

import React, { useState } from "react";

interface TableProps {
  data: {
    name: string;
    experiments: number;
    factors: number;
    description: string;
  }[];
  columns: string[];
}

const Table: React.FC<TableProps> = ({ data, columns }) => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to the first page
  };

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const displayedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="container mx-auto p-4">
      <table className="min-w-full bg-white border rounded-lg">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="py-2 px-4 border-b-2 border-gray-200 text-center font-bold"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayedData.map((row, index) => (
            <tr key={index} className="hover:bg-gray-100">
              {columns.map((column) => (
                <td
                  key={column}
                  className="py-2 px-4 border-b border-gray-200 text-center"
                >
                  {row[column as keyof typeof row]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end items-center mt-4">
        <div className="flex items-center">
          <span className="mr-2">Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="py-1 px-2 border rounded-md"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        <div className="flex items-center ml-4">
          <span className="mr-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="py-1 px-2 border rounded-md mr-2"
          >
            &lt;
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="py-1 px-2 border rounded-md"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
