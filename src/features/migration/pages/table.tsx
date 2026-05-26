import { DynamicTable } from "@/Share/components/DynamicTable/DynamicTable";

 

const tableData = [
  {
    assetName: "Asset_00123",
    category: "MOVIE",
    status: "MIGRATION_COMPLETED",
    barcode: "000136",
    size: 245,
    lastUpdateDate: "2026-05-26",
  },
  {
    assetName: "Asset_002",
    category: "SPORTS",
    status: "MIGRATION_FAILED",
    barcode: "000150",
    size: 120,
    lastUpdateDate: "2026-05-25",
  },
  {
    assetName: "Asset_003",
    category: "NEWS",
    status: "PENDING",
    barcode: "000136",
    size: 90,
    lastUpdateDate: "2026-05-24",
  },
];

export default function MigrationPage() {
  return (
    <div className="h-screen overflow-hidden p-4 pb-6">
      <DynamicTable data={tableData} />
    </div>
  );
}