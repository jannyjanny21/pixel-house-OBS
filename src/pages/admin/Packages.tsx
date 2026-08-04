import { useState } from 'react'
import { AlertCircle, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
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
import AdminLayout from '@/layout/AdminLayout'
import PackageCard from '@/components/packages/PackageCard'
import PackageFormDialog from '@/components/packages/PackageFormDialog'
import { usePackages } from '@/hooks/useManagePackages'
import type { GetPackageDto } from '@/types/packages/GetPackageDto'
import type { CreatePackageDto } from '@/types/packages/CreatePackageDto'
import type { UpdatePackageDto } from '@/types/packages/UpdatePackageDto'

export default function ManagePackages() {
   const { packages, isLoading, error, addPackage, editPackage, removePackage } = usePackages()

   const [formOpen, setFormOpen] = useState(false)
   const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
   const [selectedPackage, setSelectedPackage] = useState<GetPackageDto | undefined>(undefined)

   const [deleteTarget, setDeleteTarget] = useState<GetPackageDto | null>(null)
   const [isDeleting, setIsDeleting] = useState(false)
   const [deleteError, setDeleteError] = useState<string | null>(null)

   const openCreateForm = () => {
      setFormMode('create')
      setSelectedPackage(undefined)
      setFormOpen(true)
   }

   const openEditForm = (pkg: GetPackageDto) => {
      setFormMode('edit')
      setSelectedPackage(pkg)
      setFormOpen(true)
   }

   const handleFormSubmit = async (dto: CreatePackageDto | UpdatePackageDto) => {
      if (formMode === 'create') {
         await addPackage(dto as CreatePackageDto)
      } else if (selectedPackage) {
         await editPackage(selectedPackage.id, dto)
      }
   }

   const confirmDelete = async () => {
      if (!deleteTarget) return
      setIsDeleting(true)
      setDeleteError(null)
      try {
         await removePackage(deleteTarget.id)
         setDeleteTarget(null)
      } catch {
         setDeleteError('Failed to delete this package. Please try again.')
      } finally {
         setIsDeleting(false)
      }
   }

   return (
      <AdminLayout>
         <div className="mb-6 flex items-center justify-between">
            <div>
               <h1 className="text-2xl font-bold text-slate-800">Manage Packages</h1>
               <p className="text-slate-500">Create, update, and manage your studio packages.</p>
            </div>
            <Button onClick={openCreateForm} className="bg-[#ff6b2d] hover:bg-[#e85f27]">
               <Plus className="mr-2 h-4 w-4" />
               Add Package
            </Button>
         </div>

         {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
               <AlertCircle className="h-4 w-4" />
               {error}
            </div>
         )}

         {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
               {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-72 rounded-xl" />
               ))}
            </div>
         ) : packages.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center text-slate-500">
               <p className="mb-3">No packages yet.</p>
               <Button variant="outline" onClick={openCreateForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create your first package
               </Button>
            </div>
         ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
               {packages.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} onEdit={openEditForm} onDelete={setDeleteTarget} />
               ))}
            </div>
         )}

         <PackageFormDialog
            open={formOpen}
            onOpenChange={setFormOpen}
            mode={formMode}
            initialData={selectedPackage}
            onSubmit={handleFormSubmit}
         />

         <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Delete "{deleteTarget?.type}"?</AlertDialogTitle>
                  <AlertDialogDescription>
                     This will permanently remove this package. This action cannot be undone.
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
      </AdminLayout >
   )
}