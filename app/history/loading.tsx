import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function Loading() {
  return (
    <div>
      {/* History Hero Section Skeleton */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <Skeleton className="h-12 w-64 mb-6" />
            <Skeleton className="h-6 w-full max-w-3xl mb-2" />
            <Skeleton className="h-6 w-full max-w-2xl" />
          </div>
        </div>
      </section>

      {/* History Content Section Skeleton */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Card className="border-none shadow-md">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>
                    <Skeleton className="h-8 w-48" />
                  </CardTitle>
                  <CardDescription>
                    <Skeleton className="h-5 w-64 mt-2" />
                  </CardDescription>
                </div>
                <Skeleton className="h-10 w-32" />
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters Skeleton */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Skeleton className="h-10 flex-1" />
                <div className="flex flex-col sm:flex-row gap-4">
                  <Skeleton className="h-10 w-[180px]" />
                  <Skeleton className="h-10 w-[180px]" />
                </div>
              </div>

              {/* Table Skeleton */}
              <div className="space-y-4">
                <div className="flex">
                  <Skeleton className="h-10 flex-1" />
                </div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex">
                    <Skeleton className="h-16 flex-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

