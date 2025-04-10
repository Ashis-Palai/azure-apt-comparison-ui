import React from "react";

const Table = ({ children }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        {children}
      </table>
    </div>
  );
};

const Thead = ({ children }) => (
  <thead className="bg-gray-200 border-b">{children}</thead>
);

const Tbody = ({ children }) => <tbody>{children}</tbody>;

const Tr = ({ children }) => <tr className="border-b">{children}</tr>;

const Th = ({ children }) => (
  <th className="px-4 py-2 border border-gray-300">{children}</th>
);

const Td = ({ children }) => (
  <td className="px-4 py-2 border border-gray-300">{children}</td>
);

export { Table, Thead, Tbody, Tr, Th, Td };
