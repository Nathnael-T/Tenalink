export default function AuditFilters({
  selectedRole,
  setSelectedRole,
}) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <label className="block mb-2 font-medium">
        Filter by Role
      </label>

      <select
        value={selectedRole}
        onChange={(e) =>
          setSelectedRole(e.target.value)
        }
        className="border rounded-lg p-2 w-full"
      >
        <option value="ALL">All Roles</option>
        <option value="Doctor">Doctor</option>
        <option value="Patient">Patient</option>
        <option value="Admin">Admin</option>
      </select>
    </div>
  );
}