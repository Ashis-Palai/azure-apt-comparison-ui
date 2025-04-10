import React, { useState } from "react";
import { Button } from "./components/ui/button";
import { Table, Thead, Tbody, Tr, Th, Td } from "./components/ui/table";

const App = () => {
  const [aptGroups, setAptGroups] = useState(["", "", ""]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (index, value) => {
    const newGroups = [...aptGroups];
    newGroups[index] = value;
    setAptGroups(newGroups);
  };

  const getTTPId = (ttp) => {
    return ttp.external_references.find(ref => ref.external_id)?.external_id || "N/A";
  };

  const fetchTTPs = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://cti-analysis-mitre-backend.onrender.com/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apt_groups: aptGroups.filter((g) => g.trim() !== "") }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data); // 🔍 Debug: Check what the API is returning

      if (!data.apt_ttps) {
        throw new Error("Invalid response format");
      }

      // Extract TTPs and find common ones
      const allTTPs = Object.values(data.apt_ttps).map(group =>
        group.map(ttp => getTTPId(ttp))
      );

      const commonTTPs = allTTPs.reduce((acc, curr) => {
        if (acc === null) return new Set(curr);
        return new Set([...acc].filter(id => curr.includes(id)));
      }, null);

      // Filter TTPs to show only common ones
      const filteredResults = Object.fromEntries(
        Object.entries(data.apt_ttps).map(([group, ttps]) => [
          group,
          ttps.filter(ttp => commonTTPs.has(getTTPId(ttp)))
        ])
      );

      setResults(filteredResults);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const downloadJSON = async () => {
    const response = await fetch("https://cti-analysis-mitre-backend.onrender.com/download");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "navigator.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">APT Groups TTPs Analysis</h1>
      {aptGroups.map((group, index) => (
        <input
          key={index}
          type="text"
          value={group}
          onChange={(e) => handleChange(index, e.target.value)}
          placeholder={`APT Group ${index + 1}`}
          className="border p-2 rounded w-full mb-2"
        />
      ))}
      <Button onClick={fetchTTPs} disabled={loading}>
        {loading ? "Loading..." : "Get TTPs"}
      </Button>
      {results && (
        <div className="mt-4">
          <Table>
            <Thead>
              <Tr>
                <Th>APT Group</Th>
                <Th>TTP Names</Th>
                <Th>TTP ID</Th>
                <Th>External Link</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.entries(results).map(([group, ttps]) =>
                ttps.map((ttp) => (
                  <Tr key={getTTPId(ttp)}>
                    <Td>{group}</Td>
                    <Td>{ttp.name}</Td>
                    <Td>{getTTPId(ttp)}</Td>
                    <Td>
                      <a href={ttp.external_references.find(ref => ref.url)?.url || "#"}
                         target="_blank" className="text-blue-500">
                        Reference
                      </a>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
          <Button onClick={downloadJSON} className="mt-4">Download Navigator JSON</Button>
        </div>
      )}
    </div>
  );
};

export default App;
