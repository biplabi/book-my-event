import { motion } from 'framer-motion'
import { useResource } from '@/hooks/useResource'
import { adminApi } from '../api/admin.api'
import { AdminPageHeader, EmptyRow, ResourceView, TableShell, Th } from '../components/AdminPage'
import { RoleBadge } from '../components/StatusBadge'

const dateFormat = new Intl.DateTimeFormat(undefined, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

function formatDate(iso?: string) {
  if (!iso) return '—'
  const d = new Date(`${iso.slice(0, 10)}T00:00:00`)
  return Number.isNaN(d.getTime()) ? iso : dateFormat.format(d)
}

export function AdminUsersPage() {
  const users = useResource(adminApi.listUsers)

  return (
    <>
      <AdminPageHeader
        title="Users"
        count={users.status === 'success' ? users.data.length : undefined}
        description="Everyone with an account, newest first."
      />
      <div className="mt-8">
        <ResourceView resource={users}>
          {(list) => (
            <TableShell>
              <thead>
                <tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Mobile</Th>
                  <Th>Date of birth</Th>
                  <Th>Role</Th>
                  <Th>Joined</Th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 && <EmptyRow colSpan={6}>No users yet.</EmptyRow>}
                {list.map((u, i) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(i, 12) * 0.03 }}
                    className="border-b border-paper/[0.06] last:border-0 hover:bg-paper/[0.02]"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full border border-paper/15 font-mono text-[11px] text-paper/70">
                          {`${u.firstName[0] ?? ''}${u.lastName[0] ?? ''}`.toUpperCase()}
                        </span>
                        <span className="font-medium text-paper">
                          {u.firstName} {u.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-paper/70">{u.email}</td>
                    <td className="px-4 py-3.5 font-mono text-xs text-paper/60">{u.phoneNumber}</td>
                    <td className="px-4 py-3.5 text-paper/60">{formatDate(u.dateOfBirth)}</td>
                    <td className="px-4 py-3.5">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-4 py-3.5 text-paper/60">{formatDate(u.createdAt)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </TableShell>
          )}
        </ResourceView>
      </div>
    </>
  )
}
