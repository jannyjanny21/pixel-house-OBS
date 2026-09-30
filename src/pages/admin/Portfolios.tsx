import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import {
   AlertCircle,
   Camera,
   Edit2,
   ImagePlus,
   Images,
   Plus,
   Sparkles,
   Trash2,
   X,
} from 'lucide-react'
import AdminLayout from '@/layout/AdminLayout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog'
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import heroBanner from '@/assets/hero.png'
import { usePortfolios } from '@/hooks/usePortfolios'
import { createPortfolio, deletePortfolio, updatePortfolio } from '@/services/portfolios.service'
import { toImageSrc } from '@/lib/portfolioImage'
import type { GetPortfolioDto } from '@/types/portfolios/GetPortfolioDto'
import type { CreatePortfolioDto } from '@/types/portfolios/CreatePortfolioDto'
import type { UpdatePortfolioDto } from '@/types/portfolios/UpdatePortfolioDto'

const accentClasses = [
   'from-slate-950/85 via-slate-950/35 to-transparent',
   'from-cyan-950/85 via-cyan-900/35 to-transparent',
   'from-orange-950/85 via-orange-900/30 to-transparent',
   'from-amber-950/85 via-amber-900/30 to-transparent',
   'from-fuchsia-950/85 via-fuchsia-900/30 to-transparent',
]

// Mirrors the backend [ImageFiles] validation
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

type PortfolioFormState = {
   title: string
   category: string
   description: string
}

type PortfolioFormErrors = Partial<Record<'title' | 'category', string>>

type PendingImage = {
   key: string
   file: File
   previewUrl: string
}

const EMPTY_FORM: PortfolioFormState = {
   title: '',
   category: '',
   description: '',
}

type ImageThumbProps = {
   src: string
   alt: string
   badge?: string
   disabled?: boolean
   onRemove: () => void
}

function ImageThumb({ src, alt, badge, disabled, onRemove }: ImageThumbProps) {
   return (
      <div className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
         <img src={src} alt={alt} className="h-full w-full object-cover" />

         {badge && (
            <span className="absolute left-1.5 top-1.5 rounded-full bg-[#ff6b2d] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
               {badge}
            </span>
         )}

         <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            aria-label={`Remove ${alt}`}
            className="absolute right-1.5 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-red-600 disabled:opacity-50"
         >
            <X className="h-4 w-4" />
         </button>
      </div>
   )
}

type PortfolioFormDialogProps = {
   open: boolean
   onOpenChange: (open: boolean) => void
   mode: 'create' | 'edit'
   initialData?: GetPortfolioDto
   onSubmit: (dto: CreatePortfolioDto | UpdatePortfolioDto) => Promise<void>
}

function PortfolioFormDialog({
   open,
   onOpenChange,
   mode,
   initialData,
   onSubmit,
}: PortfolioFormDialogProps) {
   const [form, setForm] = useState<PortfolioFormState>(EMPTY_FORM)
   const [errors, setErrors] = useState<PortfolioFormErrors>({})
   const [isSubmitting, setIsSubmitting] = useState(false)
   const [submitError, setSubmitError] = useState<string | null>(null)

   // Images held locally until Save
   const [newImages, setNewImages] = useState<PendingImage[]>([])
   const [removedImageIds, setRemovedImageIds] = useState<number[]>([])
   const [imageError, setImageError] = useState<string | null>(null)

   const fileInputRef = useRef<HTMLInputElement>(null)
   const newImagesRef = useRef<PendingImage[]>([])

   useEffect(() => {
      newImagesRef.current = newImages
   }, [newImages])

   // Free preview URLs when the component unmounts
   useEffect(() => {
      return () => newImagesRef.current.forEach((img) => URL.revokeObjectURL(img.previewUrl))
   }, [])

   const clearNewImages = () => {
      newImagesRef.current.forEach((img) => URL.revokeObjectURL(img.previewUrl))
      setNewImages([])
   }

   useEffect(() => {
      if (!open) return

      if (mode === 'edit' && initialData) {
         setForm({
            title: initialData.title,
            category: initialData.category,
            description: initialData.description ?? '',
         })
      } else {
         setForm(EMPTY_FORM)
      }

      clearNewImages()
      setRemovedImageIds([])
      setImageError(null)
      setErrors({})
      setSubmitError(null)
   }, [open, mode, initialData])

   const existingImages =
      mode === 'edit' && initialData
         ? initialData.images.filter((img) => !removedImageIds.includes(img.id))
         : []

   const totalImages = existingImages.length + newImages.length

   const handleFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? [])
      event.target.value = '' // allows picking the same file again later

      const accepted: PendingImage[] = []
      const rejected: string[] = []

      for (const file of files) {
         if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            rejected.push(`${file.name} (unsupported type)`)
            continue
         }
         if (file.size > MAX_IMAGE_BYTES) {
            rejected.push(`${file.name} (over 5 MB)`)
            continue
         }
         accepted.push({
            key: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            file,
            previewUrl: URL.createObjectURL(file),
         })
      }

      setNewImages((prev) => [...prev, ...accepted])
      setImageError(rejected.length > 0 ? `Skipped: ${rejected.join(', ')}` : null)
   }

   const removeNewImage = (key: string) => {
      setNewImages((prev) => {
         const target = prev.find((img) => img.key === key)
         if (target) URL.revokeObjectURL(target.previewUrl)
         return prev.filter((img) => img.key !== key)
      })
   }

   const removeExistingImage = (id: number) => {
      setRemovedImageIds((prev) => [...prev, id])
   }

   const validate = () => {
      const nextErrors: PortfolioFormErrors = {}

      if (!form.title.trim()) nextErrors.title = 'Portfolio title is required.'
      if (!form.category.trim()) nextErrors.category = 'Category is required.'

      setErrors(nextErrors)
      return Object.keys(nextErrors).length === 0
   }

   const handleSubmit = async (event: FormEvent) => {
      event.preventDefault()
      if (!validate()) return

      const base = {
         title: form.title.trim(),
         category: form.category.trim(),
         description: form.description.trim() || undefined,
      }

      const payload: CreatePortfolioDto | UpdatePortfolioDto =
         mode === 'create'
            ? { ...base, images: newImages.map((img) => img.file) }
            : {
               ...base,
               newImages: newImages.map((img) => img.file),
               removeImageIds: removedImageIds,
            }

      setIsSubmitting(true)
      setSubmitError(null)

      try {
         await onSubmit(payload)
         onOpenChange(false)
      } catch {
         setSubmitError('Something went wrong while saving the portfolio. Please try again.')
      } finally {
         setIsSubmitting(false)
      }
   }

   return (
      <Dialog open={open} onOpenChange={(next) => !isSubmitting && onOpenChange(next)}>
         <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
               <DialogTitle>{mode === 'create' ? 'Add Portfolio' : 'Edit Portfolio'}</DialogTitle>
               <DialogDescription>
                  {mode === 'create'
                     ? 'Create a new portfolio item for the public gallery.'
                     : 'Update this portfolio item for the public gallery.'}
               </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                     id="title"
                     value={form.title}
                     onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                     placeholder="e.g. Wedding Highlights"
                  />
                  {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
               </div>

               <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                     id="category"
                     value={form.category}
                     onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                     placeholder="e.g. Weddings, Events, Studio"
                  />
                  {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
               </div>

               <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                     id="description"
                     value={form.description}
                     onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                     placeholder="Short description for the portfolio card"
                     rows={4}
                  />
               </div>

               <div className="space-y-2">
                  <div className="flex items-center justify-between">
                     <Label>Images</Label>
                     <span className="text-xs text-slate-500">
                        {totalImages} {totalImages === 1 ? 'image' : 'images'} · first image is the cover
                     </span>
                  </div>

                  <input
                     ref={fileInputRef}
                     type="file"
                     accept={ALLOWED_IMAGE_TYPES.join(',')}
                     multiple
                     className="hidden"
                     onChange={handleFilesSelected}
                  />

                  <div className="grid grid-cols-3 gap-3">
                     {existingImages.map((img) => (
                        <ImageThumb
                           key={`existing-${img.id}`}
                           src={toImageSrc(img)}
                           alt={img.fileName ?? `Image ${img.id}`}
                           disabled={isSubmitting}
                           onRemove={() => removeExistingImage(img.id)}
                        />
                     ))}

                     {newImages.map((img) => (
                        <ImageThumb
                           key={img.key}
                           src={img.previewUrl}
                           alt={img.file.name}
                           badge={mode === 'edit' ? 'New' : undefined}
                           disabled={isSubmitting}
                           onRemove={() => removeNewImage(img.key)}
                        />
                     ))}

                     <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isSubmitting}
                        className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 transition hover:border-[#ff6b2d] hover:text-[#ff6b2d] disabled:opacity-50"
                     >
                        <ImagePlus className="h-6 w-6" />
                        <span className="text-xs font-semibold">Upload Image</span>
                     </button>
                  </div>

                  <p className="text-xs text-slate-500">JPG, PNG, WEBP or GIF, up to 5 MB each.</p>

                  {removedImageIds.length > 0 && (
                     <p className="text-xs text-amber-600">
                        {removedImageIds.length} existing{' '}
                        {removedImageIds.length === 1 ? 'image' : 'images'} will be removed when you save.{' '}
                        <button
                           type="button"
                           onClick={() => setRemovedImageIds([])}
                           className="font-semibold underline"
                        >
                           Undo
                        </button>
                     </p>
                  )}

                  {imageError && <p className="text-sm text-red-500">{imageError}</p>}
               </div>

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
                     {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Portfolio' : 'Save Changes'}
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   )
}

export default function ManagePortfolios() {
   const { portfolios, isLoading, error, refetch } = usePortfolios()

   const [formOpen, setFormOpen] = useState(false)
   const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
   const [selectedPortfolio, setSelectedPortfolio] = useState<GetPortfolioDto | undefined>(undefined)

   const [deleteTarget, setDeleteTarget] = useState<GetPortfolioDto | null>(null)
   const [isDeleting, setIsDeleting] = useState(false)
   const [deleteError, setDeleteError] = useState<string | null>(null)

   const openCreateForm = () => {
      setFormMode('create')
      setSelectedPortfolio(undefined)
      setFormOpen(true)
   }

   const openEditForm = (portfolio: GetPortfolioDto) => {
      setFormMode('edit')
      setSelectedPortfolio(portfolio)
      setFormOpen(true)
   }

   const handleFormSubmit = async (dto: CreatePortfolioDto | UpdatePortfolioDto) => {
      if (formMode === 'create') {
         await createPortfolio(dto as CreatePortfolioDto)
      } else if (selectedPortfolio) {
         await updatePortfolio(selectedPortfolio.id, dto as UpdatePortfolioDto)
      }

      refetch()
   }

   const confirmDelete = async () => {
      if (!deleteTarget) return

      setIsDeleting(true)
      setDeleteError(null)

      try {
         await deletePortfolio(deleteTarget.id)
         setDeleteTarget(null)
         refetch()
      } catch {
         setDeleteError('Failed to delete this portfolio. Please try again.')
      } finally {
         setIsDeleting(false)
      }
   }

   return (
      <AdminLayout>
         <main className="bg-slate-100">
            <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
               <div className="relative overflow-hidden rounded-[28px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
                  <div className="absolute inset-0">
                     <img
                        src={heroBanner}
                        alt="Portfolio banner"
                        className="h-full w-full object-cover"
                     />
                     <div className="absolute inset-0 bg-[#203b62]/75" />
                  </div>

                  <div className="relative flex min-h-[260px] flex-col items-center justify-center px-6 py-16 text-center text-white sm:min-h-[300px]">
                     <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] backdrop-blur-sm">
                        <Camera className="h-4 w-4" />
                        Portfolio Manager
                     </div>
                     <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                        Manage Portfolio
                     </h1>
                     <p className="mt-4 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
                        Create, update, and remove portfolio items shown on the public gallery.
                     </p>
                  </div>
               </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
               <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                     <h2 className="mt-2 text-2xl font-black tracking-tight text-[#1f3a60] sm:text-3xl">
                        Featured Collections
                     </h2>
                     <p className="mt-1 text-sm text-slate-500">
                        Keep the public portfolio fresh with the latest highlights.
                     </p>
                  </div>

                  <Button
                     onClick={openCreateForm}
                     className="rounded-full bg-[#ff6b2d] px-5 font-semibold text-white hover:bg-[#ff5a17]"
                  >
                     <Plus className="mr-2 h-4 w-4" />
                     Add Portfolio
                  </Button>
               </div>

               {error && (
                  <div className="mb-6 flex items-center gap-2 rounded-[20px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                     <AlertCircle className="h-4 w-4" />
                     {error}
                  </div>
               )}

               {isLoading ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                     {Array.from({ length: 6 }).map((_, index) => (
                        <Card
                           key={index}
                           className="h-[420px] animate-pulse rounded-[24px] border-0 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.08)]"
                        />
                     ))}
                  </div>
               ) : portfolios.length === 0 ? (
                  <div className="rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
                     <p className="text-lg font-semibold text-slate-700">No portfolios yet.</p>
                     <p className="mt-2 text-sm text-slate-500">
                        Add your first portfolio item to start building the gallery.
                     </p>
                     <Button onClick={openCreateForm} className="mt-6 rounded-full bg-[#ff6b2d] text-white hover:bg-[#ff5a17]">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Portfolio
                     </Button>
                  </div>
               ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                     {portfolios.map((portfolio, index) => {
                        const cover = portfolio.images[0]

                        return (
                           <Card
                              key={portfolio.id}
                              className="group overflow-hidden rounded-[24px] border-0 bg-white p-0 shadow-[0_10px_28px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(15,23,42,0.16)]"
                           >
                              <div className="relative aspect-[4/5] overflow-hidden">
                                 <img
                                    src={cover ? toImageSrc(cover) : '/portfolio/fallback.jpg'}
                                    alt={portfolio.title}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                 />

                                 <div
                                    className={`absolute inset-0 bg-gradient-to-t ${accentClasses[index % accentClasses.length]} opacity-90 transition duration-300 group-hover:opacity-100`}
                                 />

                                 <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 p-4">
                                    <div className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                                       <Images className="h-3.5 w-3.5" />
                                       {portfolio.images.length}
                                    </div>

                                    <div className="flex items-center gap-2">
                                       <Button
                                          type="button"
                                          variant="secondary"
                                          size="icon"
                                          className="h-9 w-9 rounded-full bg-white/90 text-slate-900 shadow-lg backdrop-blur-md hover:bg-white"
                                          onClick={() => openEditForm(portfolio)}
                                       >
                                          <Edit2 className="h-4 w-4" />
                                       </Button>
                                       <Button
                                          type="button"
                                          variant="secondary"
                                          size="icon"
                                          className="h-9 w-9 rounded-full bg-white/90 text-red-600 shadow-lg backdrop-blur-md hover:bg-white hover:text-red-700"
                                          onClick={() => setDeleteTarget(portfolio)}
                                       >
                                          <Trash2 className="h-4 w-4" />
                                       </Button>
                                    </div>
                                 </div>

                                 <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] backdrop-blur-md">
                                       <Sparkles className="h-3.5 w-3.5" />
                                       {portfolio.category}
                                    </div>

                                    <h3 className="text-xl font-extrabold tracking-tight transition duration-300 group-hover:-translate-y-1">
                                       {portfolio.title}
                                    </h3>

                                    <p className="mt-2 text-sm text-white/85 transition duration-300 group-hover:-translate-y-1">
                                       {portfolio.description ?? 'Studio portfolio collection'}
                                    </p>
                                 </div>
                              </div>
                           </Card>
                        )
                     })}
                  </div>
               )}
            </section>
         </main>

         <PortfolioFormDialog
            open={formOpen}
            onOpenChange={setFormOpen}
            mode={formMode}
            initialData={selectedPortfolio}
            onSubmit={handleFormSubmit}
         />

         <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Delete "{deleteTarget?.title}"?</AlertDialogTitle>
                  <AlertDialogDescription>
                     This will permanently remove this portfolio item and all of its images. This action cannot be undone.
                  </AlertDialogDescription>
               </AlertDialogHeader>

               {deleteError && <p className="text-sm text-red-500">{deleteError}</p>}

               <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                     onClick={confirmDelete}
                     disabled={isDeleting}
                     className="bg-red-600 hover:bg-red-700"
                  >
                     {isDeleting ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </AdminLayout>
   )
}