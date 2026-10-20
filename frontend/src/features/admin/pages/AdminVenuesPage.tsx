import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useResource } from '@/hooks/useResource'
import { adminApi } from '../api/admin.api'
import { AdminPageHeader, EmptyRow, ResourceView, TableShell, Th } from '../components/AdminPage'
import { describeAdminError } from '../utils/errors'
import { Sheet } from '../components/Sheet'
import { venueSchema, type VenueFormValues } from '../schemas/admin.schemas'
import type { Venue } from '../types'

export function AdminVenuesPage() {
  const venues = useResource(adminApi.listVenues)
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  return (
    <>
      <AdminPageHeader
        title="Venues"
        count={venues.status === 'success' ? venues.data.length : undefined}
        description="Places events happen. Capacity caps the seats an event can sell."
        actions={
          <Button className="h-10 px-4 text-sm" onClick={() => setOpen(true)}>
            <Plus className="size-4" aria-hidden />
            New venue
          </Button>
        }
      />
      <div className="mt-8">
        <ResourceView resource={venues}>
          {(list) => (
            <TableShell>
              <thead>
                <tr>
                  <Th>Venue</Th>
                  <Th>Address</Th>
                  <Th>City</Th>
                  <Th className="text-right">Capacity</Th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 && <EmptyRow colSpan={4}>No venues yet.</EmptyRow>}
                {list.map((v, i) => (
                  <motion.tr
                    key={v.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(i, 10) * 0.03 }}
                    className="border-b border-paper/[0.06] last:border-0 hover:bg-paper/[0.02]"
                  >
                    <td className="px-4 py-3.5 font-medium text-paper">{v.name}</td>
                    <td className="px-4 py-3.5 text-paper/60">
                      {v.address ? `${v.address.street}, ${v.address.pinCode}` : '—'}
                    </td>
                    <td className="px-4 py-3.5 text-paper/70">
                      {v.address ? `${v.address.city}, ${v.address.country}` : '—'}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-paper/80 tabular-nums">
                      {v.seatCapacity.toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </TableShell>
          )}
        </ResourceView>
      </div>

      <Sheet open={open} onClose={close} title="New venue" description="Where will the show be?">
        <VenueForm
          onCreated={(venue) => {
            venues.setData((all) => [...all, venue])
            close()
          }}
        />
      </Sheet>
    </>
  )
}

function VenueForm({ onCreated }: { onCreated: (venue: Venue) => void }) {
  const { token } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VenueFormValues>({
    resolver: zodResolver(venueSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      seatCapacity: '',
      street: '',
      city: '',
      pinCode: '',
      country: 'India',
    },
  })

  const onSubmit = handleSubmit(async (v) => {
    if (!token) return
    setFormError(null)
    try {
      const venue = await adminApi.createVenue(token, {
        name: v.name.trim(),
        seatCapacity: Number(v.seatCapacity),
        addressDto: { street: v.street, city: v.city, pinCode: v.pinCode, country: v.country },
      })
      toast.success(`${venue.name} added.`)
      onCreated(venue)
    } catch (err) {
      setFormError(describeAdminError(err))
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {formError && <Alert>{formError}</Alert>}
      <TextField label="Venue name" autoFocus error={errors.name?.message} {...register('name')} />
      <TextField
        label="Seat capacity"
        inputMode="numeric"
        error={errors.seatCapacity?.message}
        {...register('seatCapacity')}
      />
      <TextField label="Street" error={errors.street?.message} {...register('street')} />
      <div className="grid grid-cols-2 gap-3">
        <TextField label="City" error={errors.city?.message} {...register('city')} />
        <TextField
          label="PIN code"
          inputMode="numeric"
          maxLength={6}
          error={errors.pinCode?.message}
          {...register('pinCode')}
        />
      </div>
      <TextField label="Country" error={errors.country?.message} {...register('country')} />
      <Button type="submit" loading={isSubmitting} loadingText="Saving…" className="w-full">
        Add venue
      </Button>
    </form>
  )
}
