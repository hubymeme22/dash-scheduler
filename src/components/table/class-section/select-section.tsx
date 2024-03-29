import { getSectionList } from "@/services/api/schedule";
import { ChangeEvent, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function SelectSection() {
  const [sections, setSections] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedValue, setSelectedValue] = useState(
    searchParams.get("id") || "",
  );

  useEffect(() => {
    const fetchData = async () => {
      const sections = await getSectionList();
      setSections(sections);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const id = searchParams.get("id");

    if (!id) {
      searchParams.delete("id");
      setSearchParams(searchParams);
      setSelectedValue("");
    }
  }, [searchParams]);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(e.target.value);
    setSearchParams({ id: e.target.value });
  };

  return (
    <select
      value={selectedValue}
      onChange={handleChange}
      className="rounded p-1"
    >
      <option value="" disabled>
        Select Section
      </option>

      {sections &&
        sections.map((section) => (
          <option key={section} value={section}>
            {section}
          </option>
        ))}
    </select>
  );
}

export default SelectSection;
