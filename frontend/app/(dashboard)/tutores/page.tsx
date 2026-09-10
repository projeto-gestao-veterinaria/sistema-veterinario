import FiltersContainer from "@/components/filters/FiltersContainer";
import TableContainer from "@/components/tables/TableContainer";

export default function Tutores() {
  return (
    <div className="flex flex-col gap-6 pt-8">
      <FiltersContainer />
      <TableContainer />
    </div>
  );
}
