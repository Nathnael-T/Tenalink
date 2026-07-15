// DEAD CODE: This page is not routed and contains legacy mock audit content.
import { useState } from "react";

import AuditFilters from "../../features/Audit/components/AuditFilters";
import { AuditLogEntryCard } from "../../features/Audit/components/AuditLogCard";

export default function AuditLogsPage() {
  const [selectedRole, setSelectedRole] =
    useState("ALL");

  const logs = [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Audit Logs
        </h1>

        <p className="text-gray-500 mt-2">
          All audit logs are immutable and
          cannot be modified.
        </p>
      </div>

      <AuditFilters
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
      />

      <div className="space-y-4">
        {logs.map((log) => (
          <AuditLogEntryCard
            key={log.id}
            entry={log}
          />
        ))}
      </div>
    </div>
  );
}
