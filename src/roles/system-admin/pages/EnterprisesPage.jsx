import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEnterprises } from "../hooks/useEnterprises.js";
import { DataTable } from "@/components/shared/DataTable.jsx";
import {Input, Badge } from "@/components/ui/index.js";
import { ROUTES } from "@/config/routes.js";
import { formatDate } from "@/lib/utils/date.js";
import { ENTERPRISE_STATUS } from "@/config/constants.js";
import { Search } from "lucide-react";

export default function EnterprisesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Using React Query to fetch
  const { data, isLoading } = useEnterprises({ limit: 50, search: searchTerm || undefined });
  const enterprises = data?.data || [];

  const columns = [
    {
      header: "Workspace",
      className: "w-1/3 min-w-[200px]",
      accessor: (row) => (
        <div>
          <div className="font-semibold text-[15px] text-notion-blue">{row.displayName || "Unknown"}</div>
          <div className="text-[13px] text-warm-gray-500">{row.slug ? `${row.slug}.veritas.com` : ".veritas.com"}</div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (row) => {
        let variant = "neutral";
        if (row.status === ENTERPRISE_STATUS.ACTIVE) variant = "success";
        if (row.status === ENTERPRISE_STATUS.PENDING_APPROVAL) variant = "warning";
        if (row.status === ENTERPRISE_STATUS.SUSPENDED) variant = "destructive";
        
        // Add spaces before uppercase letters for nicer display (e.g., PendingApproval -> Pending Approval)
        const displayStatus = row.status ? row.status.replace(/([A-Z])/g, ' $1').trim() : "Unknown";
        
        return <Badge variant={variant}>{displayStatus}</Badge>;
      },
    },
    {
      header: "Contact Email",
      accessor: "contactEmail",
    },
    {
      header: "Created",
      accessor: (row) => row.createdAt ? formatDate(row.createdAt) : "N/A",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-whisper pb-6">
        <div>
          <h1 className="text-2xl font-bold text-notion-black">Enterprises</h1>
          <p className="text-warm-gray-500 text-[15px] mt-1">Manage tenant workspaces and approvals.</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-warm-gray-300" />
          </div>
          <Input 
            placeholder="Search enterprise..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={enterprises} 
        isLoading={isLoading} 
        onRowClick={(row) => navigate(ROUTES.ADMIN_ENTERPRISE_DETAIL.replace(":id", row.id))}
        emptyMessage="No enterprises match your criteria."
      />
    </div>
  );
}
