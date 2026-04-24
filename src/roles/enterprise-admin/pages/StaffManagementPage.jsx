import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  UserPlus,
  Shield,
  ShieldCheck,
  MoreHorizontal,
  KeyRound,
  UserX,
  Copy,
  Check,
  Pencil,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore.js";
import { useEnterpriseUsers } from "../hooks/useEnterpriseUsers.js";
import {
  useCreateUser,
  useUpdateUser,
  useDeactivateUser,
  useResetUserPassword,
} from "../hooks/useStaffMutations.js";
import { DataTable } from "@/components/shared/DataTable.jsx";
import { Button, Input, Badge, Modal } from "@/components/ui/index.js";
import { formatDate } from "@/lib/utils/date.js";

// ── Zod schema for "Invite Staff" form ──────────────────────────────────
const inviteSchema = z.object({
  email: z.string().email("Valid email required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  password: z.string().min(8, "Min 8 characters"),
  role: z.enum(["EnterpriseAdmin", "EnterpriseStaff"]),
  honorific: z.string().optional(),
  phone: z.string().optional(),
});

// ── Zod schema for "Edit Staff" form ────────────────────────────────────
const editSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  role: z.enum(["EnterpriseAdmin", "EnterpriseStaff"]),
  honorific: z.string().optional(),
  phone: z.string().optional(),
});

// ── Columns ─────────────────────────────────────────────────────────────
const buildColumns = (onAction) => [
  {
    header: "Name",
    accessor: (row) => (
      <div>
        <p className="font-medium text-notion-black text-[14px]">
          {row.honorific ? `${row.honorific} ` : ""}{row.firstName} {row.lastName}
        </p>
        <p className="text-[12px] text-warm-gray-500">{row.email}</p>
      </div>
    ),
  },
  {
    header: "Role",
    accessor: (row) => {
      const isAdmin = row.role === "EnterpriseAdmin";
      return (
        <Badge variant={isAdmin ? "info" : "neutral"}>
          <span className="flex items-center gap-1">
            {isAdmin ? <ShieldCheck size={12} /> : <Shield size={12} />}
            {isAdmin ? "Admin" : "Staff"}
          </span>
        </Badge>
      );
    },
  },
  {
    header: "Status",
    accessor: (row) => (
      <Badge variant={row.isActive ? "success" : "neutral"}>
        {row.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    header: "Joined",
    accessor: (row) => (
      <span className="text-[13px] text-warm-gray-500 whitespace-nowrap">
        {formatDate(row.createdAt)}
      </span>
    ),
  },
  {
    header: "",
    className: "w-12",
    accessor: (row) => (
      <ActionMenu user={row} onAction={onAction} />
    ),
  },
];

// ── Action dropdown (minimal, accessible) ───────────────────────────────
function ActionMenu({ user, onAction }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-micro text-warm-gray-300 hover:text-notion-black hover:bg-warm-white transition-colors"
      >
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-50 w-48 bg-white border border-whisper rounded-comfortable shadow-deep py-1">
            <button
              onClick={() => { onAction("edit", user); setOpen(false); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-warm-gray-500 hover:bg-warm-white hover:text-notion-black transition-colors"
            >
              <Pencil size={14} /> Edit
            </button>
            {user.isActive && (
              <button
                onClick={() => { onAction("deactivate", user); setOpen(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-warm-gray-500 hover:bg-warm-white hover:text-notion-black transition-colors"
              >
                <UserX size={14} /> Deactivate
              </button>
            )}
            <button
              onClick={() => { onAction("reset-password", user); setOpen(false); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-warm-gray-500 hover:bg-warm-white hover:text-notion-black transition-colors"
            >
              <KeyRound size={14} /> Reset Password
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────────────
export default function StaffManagementPage() {
  const user = useAuthStore((s) => s.user);
  const enterpriseId = user?.enterpriseId;

  const [page, setPage] = useState(1);
  const LIMIT = 10;
  const { data, isLoading } = useEnterpriseUsers(enterpriseId, { page, limit: LIMIT, sort: "created_at", sort_dir: "desc" });
  const users = data?.data || [];
  const meta = data?.metadata;

  // ── Modals state
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [tempPassword, setTempPassword] = useState(null);
  const [copied, setCopied] = useState(false);

  // ── Mutations
  const createUser = useCreateUser(enterpriseId);
  const updateUser = useUpdateUser(enterpriseId);
  const deactivateUser = useDeactivateUser(enterpriseId);
  const resetPassword = useResetUserPassword(enterpriseId);

  // ── Action handler
  function handleAction(action, targetUser) {
    if (action === "edit") {
      setEditTarget(targetUser);
    }
    if (action === "deactivate") {
      if (window.confirm(`Deactivate ${targetUser.firstName} ${targetUser.lastName}?`)) {
        deactivateUser.mutate(targetUser.id);
      }
    }
    if (action === "reset-password") {
      if (window.confirm(`Reset password for ${targetUser.email}? A temporary password will be generated.`)) {
        resetPassword.mutate(targetUser.id, {
          onSuccess: (res) => setTempPassword(res.temporary_password),
        });
      }
    }
  }

  const columns = buildColumns(handleAction);

  // ── Invite form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(inviteSchema), defaultValues: { role: "EnterpriseStaff" } });

  function onInvite(values) {
    // Strip empty optional fields so the API doesn't receive empty strings
    const payload = { ...values };
    if (!payload.honorific) delete payload.honorific;
    if (!payload.phone) delete payload.phone;

    createUser.mutate(payload, {
      onSuccess: () => {
        setInviteOpen(false);
        reset();
      },
    });
  }

  // ── Edit form
  const {
    register: editRegister,
    handleSubmit: editHandleSubmit,
    reset: editReset,
    formState: { errors: editErrors },
  } = useForm({ resolver: zodResolver(editSchema) });

  // Populate edit form when a target is selected
  useEffect(() => {
    if (editTarget) {
      editReset({
        first_name: editTarget.firstName || "",
        last_name: editTarget.lastName || "",
        role: editTarget.role || "EnterpriseStaff",
        honorific: editTarget.honorific || "",
        phone: editTarget.phone || "",
      });
    }
  }, [editTarget, editReset]);

  function onEdit(values) {
    const payload = { ...values };
    if (!payload.honorific) delete payload.honorific;
    if (!payload.phone) delete payload.phone;

    updateUser.mutate(
      { userId: editTarget.id, payload },
      {
        onSuccess: () => {
          setEditTarget(null);
          editReset();
        },
      },
    );
  }

  function handleCopy() {
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-whisper pb-6">
        <div>
          <h1 className="text-2xl font-bold text-notion-black">Staff Management</h1>
          <p className="text-warm-gray-500 text-[15px] mt-1">
            Invite and manage users within your enterprise.
          </p>
        </div>
        <Button onClick={() => setInviteOpen(true)}>
          <UserPlus size={16} className="mr-2" />
          Invite Staff
        </Button>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={users} isLoading={isLoading} emptyMessage="No staff members yet. Invite your first team member!" />

      {/* Pagination */}
      {meta && meta.total_pages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-[13px] text-warm-gray-500">
            Page {meta.current_page} of {meta.total_pages} &middot; {meta.total_elements} total
          </p>
          <div className="flex gap-2">
            <button
              disabled={!meta.has_previous}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 text-[13px] font-medium rounded-micro border border-whisper text-notion-black hover:bg-warm-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              disabled={!meta.has_next}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 text-[13px] font-medium rounded-micro border border-whisper text-notion-black hover:bg-warm-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ── Invite Staff Modal ─────────────────────────────────────────── */}
      <Modal isOpen={inviteOpen} onClose={() => { setInviteOpen(false); reset(); }} title="Invite Staff Member">
        <form onSubmit={handleSubmit(onInvite)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[14px] font-medium text-notion-black mb-1.5">Honorific</label>
              <select
                {...register("honorific")}
                className="w-full border border-[#ddd] rounded-micro px-3.5 py-2 text-[14px] text-notion-black focus:outline-none focus:border-notion-blue focus:ring-2 focus:ring-notion-blue/20 transition-all bg-white appearance-none"
              >
                <option value="">None</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Ms">Ms</option>
                <option value="Dr">Dr</option>
                <option value="Prof">Prof</option>
              </select>
            </div>
            <Input
              label="Phone"
              id="invite_phone"
              type="tel"
              placeholder="+251 9XX XXX XXX"
              error={errors.phone?.message}
              {...register("phone")}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              id="first_name"
              placeholder="Jane"
              error={errors.first_name?.message}
              {...register("first_name")}
            />
            <Input
              label="Last Name"
              id="last_name"
              placeholder="Doe"
              error={errors.last_name?.message}
              {...register("last_name")}
            />
          </div>
          <Input
            label="Email"
            id="email"
            type="email"
            placeholder="jane@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Temporary Password"
            id="password"
            type="password"
            placeholder="Min 8 characters"
            error={errors.password?.message}
            {...register("password")}
          />
          <div>
            <label className="block text-[14px] font-medium text-notion-black mb-1.5">Role</label>
            <select
              {...register("role")}
              className="w-full border border-[#ddd] rounded-micro px-3.5 py-2 text-[14px] text-notion-black focus:outline-none focus:border-notion-blue focus:ring-2 focus:ring-notion-blue/20 transition-all bg-white appearance-none"
            >
              <option value="EnterpriseStaff">Staff</option>
              <option value="EnterpriseAdmin">Admin</option>
            </select>
          </div>

          {createUser.isError && (
            <p className="text-warning text-[13px]">
              {createUser.error?.response?.data?.error || "Failed to create user."}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => { setInviteOpen(false); reset(); }}>
              Cancel
            </Button>
            <Button type="submit" disabled={createUser.isPending}>
              {createUser.isPending ? "Creating…" : "Send Invite"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── Edit Staff Modal ───────────────────────────────────────────── */}
      <Modal isOpen={!!editTarget} onClose={() => { setEditTarget(null); editReset(); }} title="Edit Staff Member">
        <form onSubmit={editHandleSubmit(onEdit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[14px] font-medium text-notion-black mb-1.5">Honorific</label>
              <select
                {...editRegister("honorific")}
                className="w-full border border-[#ddd] rounded-micro px-3.5 py-2 text-[14px] text-notion-black focus:outline-none focus:border-notion-blue focus:ring-2 focus:ring-notion-blue/20 transition-all bg-white appearance-none"
              >
                <option value="">None</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Ms">Ms</option>
                <option value="Dr">Dr</option>
                <option value="Prof">Prof</option>
              </select>
            </div>
            <Input
              label="Phone"
              id="edit_phone"
              type="tel"
              placeholder="+251 9XX XXX XXX"
              error={editErrors.phone?.message}
              {...editRegister("phone")}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              id="edit_first_name"
              placeholder="Jane"
              error={editErrors.first_name?.message}
              {...editRegister("first_name")}
            />
            <Input
              label="Last Name"
              id="edit_last_name"
              placeholder="Doe"
              error={editErrors.last_name?.message}
              {...editRegister("last_name")}
            />
          </div>
          <div>
            <label className="block text-[14px] font-medium text-notion-black mb-1.5">Role</label>
            <select
              {...editRegister("role")}
              className="w-full border border-[#ddd] rounded-micro px-3.5 py-2 text-[14px] text-notion-black focus:outline-none focus:border-notion-blue focus:ring-2 focus:ring-notion-blue/20 transition-all bg-white appearance-none"
            >
              <option value="EnterpriseStaff">Staff</option>
              <option value="EnterpriseAdmin">Admin</option>
            </select>
          </div>

          {updateUser.isError && (
            <p className="text-warning text-[13px]">
              {updateUser.error?.response?.data?.error || "Failed to update user."}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => { setEditTarget(null); editReset(); }}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateUser.isPending}>
              {updateUser.isPending ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── Temp Password Modal ────────────────────────────────────────── */}
      <Modal isOpen={!!tempPassword} onClose={() => setTempPassword(null)} title="Temporary Password">
        <div className="space-y-4">
          <p className="text-[14px] text-warm-gray-500">
            The users password has been reset. Share this temporary password securely — it will not be shown again.
          </p>
          <div className="flex items-center gap-2 bg-warm-white border border-whisper rounded-micro px-4 py-3">
            <code className="flex-1 text-[15px] font-mono text-notion-black tracking-wide select-all">
              {tempPassword}
            </code>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-micro text-warm-gray-500 hover:text-notion-black hover:bg-white transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
            </button>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setTempPassword(null)}>Done</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
