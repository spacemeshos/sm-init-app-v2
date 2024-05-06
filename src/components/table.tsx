import React from 'react';
import styled from 'styled-components';

// Define the types for the table's properties
type TableProps = {
    rows: number;
    columns: number;
    customStyles?: React.CSSProperties;
};

// Styled components for Table and TableCell
const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

const TableCell = styled.td`
    border: 1px solid #ccc;
    padding: 8px;
    text-align: center;
`;

const TableRow = styled.tr``;

// Table component
const Table: React.FC<TableProps> = ({ rows, columns, customStyles }) => {
    const renderCells = (n: number) => {
        return Array.from({ length: n }, (_, index) => <TableCell key={index}>Cell</TableCell>);
    };

    const renderRows = (r: number, c: number) => {
        return Array.from({ length: r }, (_, index) => (
            <TableRow key={index}>{renderCells(c)}</TableRow>
        ));
    };

    return (
        <StyledTable>
            <tbody>
                {renderRows(rows, columns)}
            </tbody>
        </StyledTable>
    );
};

export default Table;
