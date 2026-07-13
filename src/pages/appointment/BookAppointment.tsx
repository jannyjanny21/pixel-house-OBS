import { useEffect, useMemo, useState, type SyntheticEvent } from 'react'
import { Check, CheckCircle2, ChevronDown, MapPin, AlertCircleIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import HomeLayout from '@/layout/HomeLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePackages } from '@/hooks/usePackages'
import { useNavigate } from 'react-router-dom'
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui/popover'
import type { CreateAppointmentDto } from '@/types/appointments/CreateAppointmentDto'
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useCreateAppointment } from '@/hooks/useCreateAppointment'



const serviceTypes = [
   { label: 'Studio Shoot', value: 'Studio Shoot' },
   { label: 'Party Rentals', value: 'Party Rentals' },
   { label: 'Event', value: 'Event' },
]


const bookingTypes = [
   { label: 'Online Booking (Advance)', value: 'Online Booking' }, { label: 'Walk-In (Immediate)', value: 'Walk-In' },
]


const timeOptions = [
   '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
   '15:00', '16:00', '17:00', '18:00',
]

const formatTimeForDisplay = (time24: string): string => {
   const [hourStr] = time24.split(':');
   const hour = parseInt(hourStr, 10);

   if (hour === 12) return '12:00 PM';
   if (hour === 0) return '12:00 AM';

   const hour12 = hour % 12 || 12;
   const period = hour >= 12 ? 'PM' : 'AM';

   return `${hour12}:00 ${period}`;
};



export default function BookAppointment() {
   const { compactPackages, morePackages, featuredPackage } = usePackages()
   const { submitAppointment, isSubmitting, error, setError } = useCreateAppointment()
   const [successMessage, setSuccessMessage] = useState<string | null>(null)

   const navigate = useNavigate()

   const allPackages = useMemo(() => {
      const items = [featuredPackage, ...compactPackages, ...morePackages].filter(
         (pkg): pkg is NonNullable<typeof pkg> => Boolean(pkg),
      )
      return items
   }, [featuredPackage, compactPackages, morePackages])

   const [formData, setFormData] = useState<CreateAppointmentDto>({
      fullName: '',
      contactNumber: '',
      email: '',
      bookingType: 'Online Booking',
      serviceType: 'Studio Shoot',
      packageIDs: [],
      preferredDate: '',
      preferredTime: '',
   })


   const [submitMessage, setSubmitMessage] = useState<string | null>(null)


   function updateField<K extends keyof CreateAppointmentDto>(
      key: K,
      value: CreateAppointmentDto[K],
   ) {
      setFormData((current) => ({
         ...current,
         [key]: value,
      }))
   }


   const [packageOpen, setPackageOpen] = useState(false)
   const selectedPackages = allPackages.filter((pkg) =>
      formData.packageIDs.includes(pkg.id),
   )


   function addPackage(packageId: number) {
      setFormData((current) => {
         if (current.packageIDs.includes(packageId)) return current

         return {
            ...current,
            packageIDs: [...current.packageIDs, packageId],
         }
      })
      setPackageOpen(false)
   }


   // Auto-dismiss for error and success alerts
   useEffect(() => {
      let errorTimeout: ReturnType<typeof setTimeout> | null = null
      let successTimeout: ReturnType<typeof setTimeout> | null = null

      if (error) {
         errorTimeout = setTimeout(() => {
            setError(null)
         }, 5000) // Auto-dismiss after 5 seconds
      }

      if (successMessage) {
         successTimeout = setTimeout(() => {
            setSuccessMessage(null)
         }, 5000) // Auto-dismiss after 5 seconds
      }

      return () => {
         if (errorTimeout) clearTimeout(errorTimeout)
         if (successTimeout) clearTimeout(successTimeout)
      }
   }, [error, successMessage, setError])



   //VALIDATION
   function validateForm(data: CreateAppointmentDto): string | null {
      if (!data.fullName.trim()) return 'Please enter your full name.'
      if (!data.contactNumber.trim()) return 'Please enter your contact number.'

      const phonePattern = /^09\d{9}$/
      if (!phonePattern.test(data.contactNumber.trim())) {
         return 'Contact number must be a valid PH mobile number (e.g. 09xxxxxxxxx).'
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!data.email.trim() || !emailPattern.test(data.email.trim())) {
         return 'Please enter a valid email address.'
      }

      if (!data.preferredDate) return 'Please select a preferred date.'

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const selectedDate = new Date(data.preferredDate)
      if (selectedDate < today) {
         return 'Preferred date cannot be in the past.'
      }

      if (!data.preferredTime) return 'Please select a preferred time.'
      if (data.packageIDs.length === 0) return 'Please select at least one package.'

      return null
   }



   async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
      event.preventDefault()
      setSuccessMessage(null)

      const validationError = validateForm(formData)
      if (validationError) {
         setError(validationError)
         return
      }

      const result = await submitAppointment(formData)
      if (result) {
         setSuccessMessage('Appointment created successfully.')
         setFormData({
            fullName: '',
            contactNumber: '',
            email: '',
            bookingType: 'Online Booking',
            serviceType: 'Studio Shoot',
            packageIDs: [],
            preferredDate: '',
            preferredTime: '',
         })

         navigate('/') // Redirect to home page after successful submission
      }
   }


   return (
      <HomeLayout>
         <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

            {/* Animated Alerts Container */}
            <div className="fixed top-[100px] left-0 right-0 z-[100] flex justify-center px-4 sm:px-6 lg:px-8 pointer-events-none">
               <div className="max-w-7xl space-y-3">
                  {/* Error Alert */}
                  <div
                     className={cn(
                        "transition-all duration-500 ease-in-out transform",
                        error
                           ? "opacity-100 translate-y-0"
                           : "opacity-0 -translate-y-4 pointer-events-none"
                     )}
                  >
                     {error && (
                        <Alert className="bg-white text-destructive border-destructive/50 shadow-lg">
                           <AlertCircleIcon className="h-4 w-4" />
                           <AlertTitle>Error</AlertTitle>
                           <AlertDescription>{error}</AlertDescription>
                        </Alert>
                     )}
                  </div>

                  {/* Success Alert */}
                  <div
                     className={cn(
                        "transition-all duration-500 ease-in-out transform",
                        successMessage
                           ? "opacity-100 translate-y-0"
                           : "opacity-0 -translate-y-4 pointer-events-none"
                     )}
                  >
                     {successMessage && (
                        <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800 shadow-lg">
                           <AlertTitle>Success</AlertTitle>
                           <AlertDescription>{successMessage}</AlertDescription>
                        </Alert>
                     )}
                  </div>
               </div>
            </div>

            <Card className="overflow-hidden rounded-[24px] border-0 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.12)] ">

               <div className="grid min-h-[760px] lg:grid-cols-[0.92fr_1.25fr] h-full">
                  <div className="flex h-full flex-col justify-between bg-[#203b62] px-8 py-10 text-white sm:px-10">
                     <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
                           Pixel House Studio
                        </p>
                        <h2 className="mt-4 max-w-sm text-3xl font-black leading-tight">
                           Let&apos;s capture your moments together.
                        </h2>
                        <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
                           Fill out the form to secure your slot and choose the package
                           that fits your session best.
                        </p>
                     </div>

                     <div className="mt-10 space-y-4 text-sm font-medium text-slate-200">
                        <div className="flex items-center gap-3">
                           <CheckCircle2 className="h-4 w-4 text-orange-300" />
                           Professional Equipment
                        </div>
                        <div className="flex items-center gap-3">
                           <CheckCircle2 className="h-4 w-4 text-orange-300" />
                           Expert Editing
                        </div>
                        <div className="flex items-center gap-3">
                           <CheckCircle2 className="h-4 w-4 text-orange-300" />
                           Quick Turnaround
                        </div>
                     </div>

                     <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                        <div className="flex items-center gap-2 font-semibold">
                           <MapPin className="h-4 w-4 text-orange-300" />
                           Pixel House Studio
                        </div>
                        <p className="mt-2 text-slate-300">
                           Located at Tomas Claudio, Bagsakan, Dipolog City.
                        </p>
                     </div>
                  </div>

                  <CardContent className="h-full px-6 py-8 sm:px-8 lg:px-10">
                     <form onSubmit={handleSubmit} className="space-y-8">
                        {submitMessage && (
                           <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                              {submitMessage}
                           </div>
                        )}

                        <section className="space-y-4">
                           <div className="border-b border-slate-200 pb-2">
                              <h3 className="text-sm font-bold tracking-[0.2em] text-slate-500">
                                 CONTACT INFORMATION
                              </h3>
                           </div>

                           <div className="grid gap-4 sm:grid-cols-2">
                              <div className="space-y-2">
                                 <Label htmlFor="fullName">Full Name</Label>
                                 <Input
                                    id="fullName"
                                    value={formData.fullName}
                                    onChange={(event) =>
                                       updateField('fullName', event.target.value)
                                    }
                                    placeholder="ex:John Doe"
                                 />
                              </div>

                              <div className="space-y-2">
                                 <Label htmlFor="contactNumber">Contact Number</Label>
                                 <Input
                                    id="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={(event) =>
                                       updateField('contactNumber', event.target.value)
                                    }
                                    placeholder="09xx xxx xxxx"
                                 />
                              </div>
                           </div>

                           <div className="space-y-2">
                              <Label htmlFor="email">Email Address</Label>
                              <Input
                                 id="email"
                                 type="email"
                                 value={formData.email}
                                 onChange={(event) => updateField('email', event.target.value)}
                                 placeholder="john@example.com"
                              />
                           </div>
                        </section>

                        <section className="space-y-4">
                           <div className="border-b border-slate-200 pb-2">
                              <h3 className="text-sm font-bold tracking-[0.2em] text-slate-500">
                                 SESSION DETAILS
                              </h3>
                           </div>

                           <div className="space-y-3">
                              <Label>Booking Type</Label>
                              <div className="flex flex-wrap gap-4">
                                 {bookingTypes.map((option) => (
                                    <label
                                       key={option.value}
                                       className="inline-flex items-center gap-2 text-sm text-slate-700"
                                    >
                                       <input
                                          type="radio"
                                          name="bookingType"
                                          checked={formData.bookingType === option.value}
                                          onChange={() =>
                                             updateField('bookingType', option.value)
                                          }
                                          className="h-4 w-4 accent-[#ff6b2d]"
                                       />
                                       {option.label}
                                    </label>
                                 ))}
                              </div>
                           </div>

                           <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                              <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                 <MapPin className="h-4 w-4 text-[#ff6b2d]" />
                                 Location
                              </Label>
                              <div className="text-sm text-slate-700">
                                 <p className="font-semibold">Pixel House Studio</p>
                                 <p className="text-slate-500">
                                    Located at Tomas Claudio Bagsakan Dipolog City.
                                 </p>
                              </div>
                           </div>

                           <div className="space-y-3">
                              <Label>Service Type</Label>
                              <div className="grid grid-cols-3 gap-3">
                                 {serviceTypes.map((option) => {
                                    const isActive = formData.serviceType === option.value

                                    return (
                                       <button
                                          key={option.value}
                                          type="button"
                                          onClick={() => updateField('serviceType', option.value)}
                                          className={[
                                             'rounded-xl border px-4 py-4 text-sm font-semibold transition',
                                             isActive
                                                ? 'border-transparent bg-[#7b8794] text-white'
                                                : 'border-slate-200 bg-white text-[#ff6b2d] hover:bg-slate-50',
                                          ].join(' ')}
                                       >
                                          {option.label}
                                       </button>
                                    )
                                 })}
                              </div>
                           </div>

                           <div className="space-y-3">
                              <Label>Select Package</Label>

                              <Popover open={packageOpen} onOpenChange={setPackageOpen}>
                                 <PopoverTrigger
                                    role="combobox"
                                    aria-expanded={packageOpen}
                                    className="flex h-11 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 hover:bg-slate-50"
                                 >
                                    Choose a package...
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                 </PopoverTrigger>

                                 <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                    <Command>
                                       <CommandInput placeholder="Search package..." />
                                       <CommandList>
                                          <CommandEmpty>No package found.</CommandEmpty>
                                          <CommandGroup>
                                             {allPackages.map((pkg) => {
                                                const isSelected = formData.packageIDs.includes(pkg.id)

                                                return (
                                                   <CommandItem
                                                      key={pkg.id}
                                                      value={pkg.type}
                                                      disabled={isSelected}
                                                      onSelect={() => addPackage(pkg.id)}
                                                   >
                                                      <Check
                                                         className={cn(
                                                            'mr-2 h-4 w-4',
                                                            isSelected ? 'opacity-100' : 'opacity-0',
                                                         )}
                                                      />
                                                      <div className="flex w-full items-center justify-between gap-3">
                                                         <span className="font-medium">{pkg.type}</span>
                                                         <span className="text-sm text-slate-500">₱ {pkg.price}</span>
                                                         <span className="text-sm text-slate-500"> |•| </span>
                                                         <span className="text-sm text-slate-500">{pkg.maxPersons} persons</span>
                                                         <span className="text-sm text-slate-500"> |•| </span>
                                                         <span className="text-sm text-slate-500">{pkg.inclusion.join(', ')}</span>
                                                      </div>
                                                   </CommandItem>
                                                )
                                             })}
                                          </CommandGroup>
                                       </CommandList>
                                    </Command>
                                 </PopoverContent>
                              </Popover>

                              {selectedPackages.length > 0 && (
                                 <div className="space-y-3">
                                    {selectedPackages.map((pkg) => (
                                       <div
                                          key={pkg.id}
                                          className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4"
                                       >
                                          <div className="flex-1">
                                             <div className="flex items-center justify-between gap-3">
                                                <span className="font-semibold text-slate-800">{pkg.type}</span>
                                                <span className="font-bold text-[#1f3a60]">₱ {pkg.price}</span>
                                             </div>
                                             <p className="mt-1 text-xs text-slate-500">{pkg.description}</p>
                                             <div className="mt-2 flex flex-wrap gap-2">
                                                {pkg.inclusion?.map((item) => (
                                                   <Badge
                                                      key={item}
                                                      variant="secondary"
                                                      className="rounded-full bg-slate-100 text-slate-700"
                                                   >
                                                      {item}
                                                   </Badge>
                                                ))}
                                             </div>
                                          </div>

                                          <button
                                             type="button"
                                             onClick={() =>
                                                setFormData((current) => ({
                                                   ...current,
                                                   packageIds: current.packageIDs.filter((id) => id !== pkg.id),
                                                }))
                                             }
                                             className="rounded-full px-3 py-1 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                                          >
                                             Remove
                                          </button>
                                       </div>
                                    ))}
                                 </div>
                              )}
                           </div>

                           <div className="grid gap-4 sm:grid-cols-2">
                              <div className="space-y-2">
                                 <Label htmlFor="preferredDate">Preferred Date</Label>
                                 <Input
                                    id="preferredDate"
                                    type="date"
                                    value={formData.preferredDate}
                                    onChange={(event) =>
                                       updateField('preferredDate', event.target.value)
                                    }
                                 />
                              </div>

                              <div className="space-y-2">
                                 <Label htmlFor="preferredTime">Preferred Time</Label>
                                 <select
                                    id="preferredTime"
                                    value={formData.preferredTime}
                                    onChange={(event) =>
                                       updateField('preferredTime', event.target.value)
                                    }
                                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                 >
                                    <option value="">Select a preferred time...</option>
                                    {timeOptions.map((time) => (
                                       <option key={time} value={time}>
                                          {formatTimeForDisplay(time)}
                                       </option>
                                    ))}
                                 </select>
                              </div>
                           </div>
                        </section>

                        <Button
                           type="submit"
                           disabled={isSubmitting}
                           className="h-14 w-full rounded-full bg-[#ff6b2d] text-base font-bold text-white shadow-[0_12px_24px_rgba(255,107,45,0.35)] hover:bg-[#ff5a17]"
                        >
                           {isSubmitting ? 'Creating Appointment...' : 'Confirm Booking'}
                        </Button>
                     </form>
                  </CardContent>
               </div>
            </Card>
         </section>
      </HomeLayout>
   )
}