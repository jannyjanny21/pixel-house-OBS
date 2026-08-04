import { Pencil, Trash2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { GetPackageDto } from '@/types/packages/GetPackageDto'
import { formatPrice, formatMaxPeople } from '@/lib/packageFormatters' // adjust to your actual util path

type PackageCardProps = {
   pkg: GetPackageDto
   onEdit: (pkg: GetPackageDto) => void
   onDelete: (pkg: GetPackageDto) => void
}

export default function PackageCard({ pkg, onEdit, onDelete }: PackageCardProps) {
   return (
      <Card className="flex flex-col">
         <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
               <CardTitle className="text-lg">{pkg.type}</CardTitle>
               <div className="flex flex-col items-end gap-1">
                  <Badge variant={pkg.isAvailable ? 'default' : 'secondary'}>
                     {pkg.isAvailable ? 'Available' : 'Unavailable'}
                  </Badge>
                  {pkg.isFeatured && <Badge variant="outline">Featured</Badge>}
               </div>
            </div>
            <p className="text-2xl font-bold text-[#ff6b2d]">₱{formatPrice(pkg.price)}</p>
         </CardHeader>

         <CardContent className="flex flex-1 flex-col gap-3">
            <p className="line-clamp-3 text-sm text-slate-600">{pkg.description}</p>

            <div className="flex items-center gap-1 text-sm text-slate-500">
               <Users className="h-4 w-4" />
               {formatMaxPeople(pkg.maxPersons)}
            </div>

            {pkg.inclusion.length > 0 && (
               <ul className="list-inside list-disc space-y-1 text-sm text-slate-600">
                  {pkg.inclusion.map((item, index) => (
                     <li key={`${item}-${index}`}>{item}</li>
                  ))}
               </ul>
            )}

            <div className="mt-auto flex gap-2 pt-2">
               <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(pkg)}>
                  <Pencil className="mr-1 h-4 w-4" />
                  Edit
               </Button>
               <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-600"
                  onClick={() => onDelete(pkg)}
               >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
               </Button>
            </div>
         </CardContent>
      </Card>
   )
}