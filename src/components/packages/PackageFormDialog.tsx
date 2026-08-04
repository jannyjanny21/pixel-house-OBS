import { useEffect, useState, type FormEvent } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog'
import type { GetPackageDto } from '@/types/packages/GetPackageDto'
import type { CreatePackageDto } from '@/types/packages/CreatePackageDto'
import type { UpdatePackageDto } from '@/types/packages/UpdatePackageDto'

type PackageFormDialogProps = {
   open: boolean
   onOpenChange: (open: boolean) => void
   mode: 'create' | 'edit'
   initialData?: GetPackageDto
   onSubmit: (dto: CreatePackageDto | UpdatePackageDto) => Promise<void>
}

type InclusionField = {
   id: string
   value: string
}

type FormState = {
   type: string
   price: string
   description: string
   maxPersons: string
   isAvailable: boolean
}

type FormErrors = Partial<Record<'type' | 'price' | 'description' | 'maxPersons', string>>

const EMPTY_FORM: FormState = {
   type: '',
   price: '',
   description: '',
   maxPersons: '',
   isAvailable: true,
}

function createInclusionField(value = ''): InclusionField {
   return { id: crypto.randomUUID(), value }
}

export default function PackageFormDialog({
   open,
   onOpenChange,
   mode,
   initialData,
   onSubmit,
}: PackageFormDialogProps) {
   const [form, setForm] = useState<FormState>(EMPTY_FORM)
   const [inclusions, setInclusions] = useState<InclusionField[]>([createInclusionField()])
   const [errors, setErrors] = useState<FormErrors>({})
   const [isSubmitting, setIsSubmitting] = useState(false)
   const [submitError, setSubmitError] = useState<string | null>(null)

   // Re-seed the form every time the dialog opens, so stale state from a
   // previous edit never leaks into a subsequent create (or vice versa).
   useEffect(() => {
      if (!open) return

      if (mode === 'edit' && initialData) {
         setForm({
            type: initialData.type,
            price: String(initialData.price),
            description: initialData.description,
            maxPersons: String(initialData.maxPersons),
            isAvailable: initialData.isAvailable,
         })
         setInclusions(
            initialData.inclusion.length > 0
               ? initialData.inclusion.map((item) => createInclusionField(item))
               : [createInclusionField()],
         )
      } else {
         setForm(EMPTY_FORM)
         setInclusions([createInclusionField()])
      }

      setErrors({})
      setSubmitError(null)
   }, [open, mode, initialData])

   const handleInclusionChange = (id: string, value: string) => {
      setInclusions((prev) => prev.map((field) => (field.id === id ? { ...field, value } : field)))
   }

   const handleAddInclusion = () => {
      setInclusions((prev) => [...prev, createInclusionField()])
   }

   const handleRemoveInclusion = (id: string) => {
      setInclusions((prev) => (prev.length > 1 ? prev.filter((field) => field.id !== id) : prev))
   }

   const validate = (): boolean => {
      const nextErrors: FormErrors = {}
      const priceValue = Number(form.price)
      const maxPersonsValue = Number(form.maxPersons)

      if (!form.type.trim()) nextErrors.type = 'Package type is required.'
      if (!form.price || Number.isNaN(priceValue) || priceValue <= 0) {
         nextErrors.price = 'Enter a valid price greater than 0.'
      }
      if (!form.description.trim()) nextErrors.description = 'Description is required.'
      if (!form.maxPersons || !Number.isInteger(maxPersonsValue) || maxPersonsValue < 1) {
         nextErrors.maxPersons = 'Enter a valid whole number of at least 1.'
      }

      setErrors(nextErrors)
      return Object.keys(nextErrors).length === 0
   }

   const handleSubmit = async (event: FormEvent) => {
      event.preventDefault()
      if (!validate()) return

      const cleanedInclusions = inclusions
         .map((field) => field.value.trim())
         .filter((value) => value.length > 0)

      const payload: CreatePackageDto | UpdatePackageDto = {
         type: form.type.trim(),
         price: Number(form.price),
         description: form.description.trim(),
         inclusion: cleanedInclusions,
         maxPersons: Number(form.maxPersons),
         ...(mode === 'edit' ? { isAvailable: form.isAvailable } : {}),
      }

      setIsSubmitting(true)
      setSubmitError(null)
      try {
         await onSubmit(payload)
         onOpenChange(false)
      } catch {
         setSubmitError('Something went wrong while saving the package. Please try again.')
      } finally {
         setIsSubmitting(false)
      }
   }

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
               <DialogTitle>{mode === 'create' ? 'Add Package' : 'Edit Package'}</DialogTitle>
               <DialogDescription>
                  {mode === 'create'
                     ? 'Fill in the details to create a new package.'
                     : 'Update the details for this package.'}
               </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="type">Package Type</Label>
                  <Input
                     id="type"
                     value={form.type}
                     onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
                     placeholder="e.g. Solo Session"
                  />
                  {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label htmlFor="price">Price (PHP)</Label>
                     <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.price}
                        onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                        placeholder="0.00"
                     />
                     {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="maxPersons">Max Persons</Label>
                     <Input
                        id="maxPersons"
                        type="number"
                        min="1"
                        step="1"
                        value={form.maxPersons}
                        onChange={(e) => setForm((prev) => ({ ...prev, maxPersons: e.target.value }))}
                        placeholder="1"
                     />
                     {errors.maxPersons && <p className="text-sm text-red-500">{errors.maxPersons}</p>}
                  </div>
               </div>

               <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                     id="description"
                     value={form.description}
                     onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                     placeholder="Describe what this package offers"
                     rows={3}
                  />
                  {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
               </div>

               <div className="space-y-2">
                  <div className="flex items-center justify-between">
                     <Label>Inclusions</Label>
                     <Button type="button" variant="ghost" size="sm" onClick={handleAddInclusion}>
                        <Plus className="mr-1 h-4 w-4" />
                        Add
                     </Button>
                  </div>
                  <div className="space-y-2">
                     {inclusions.map((field) => (
                        <div key={field.id} className="flex items-center gap-2">
                           <Input
                              value={field.value}
                              onChange={(e) => handleInclusionChange(field.id, e.target.value)}
                              placeholder="e.g. 5 printed photos"
                           />
                           <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveInclusion(field.id)}
                              disabled={inclusions.length === 1}
                           >
                              <X className="h-4 w-4" />
                           </Button>
                        </div>
                     ))}
                  </div>
               </div>

               {mode === 'edit' && (
                  <div className="flex items-center justify-between rounded-lg border p-3">
                     <div>
                        <Label htmlFor="isAvailable">Available for booking</Label>
                        <p className="text-sm text-slate-500">Toggle off to hide this package from clients.</p>
                     </div>
                     <Switch
                        id="isAvailable"
                        checked={form.isAvailable}
                        onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isAvailable: checked }))}
                     />
                  </div>
               )}

               {submitError && <p className="text-sm text-red-500">{submitError}</p>}

               <DialogFooter>
                  <Button
                     type="button"
                     variant="outline"
                     onClick={() => onOpenChange(false)}
                     disabled={isSubmitting}
                  >
                     Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                     {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Package' : 'Save Changes'}
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   )
}