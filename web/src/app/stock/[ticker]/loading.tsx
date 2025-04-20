import * as React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function StockLoading() {
  return (
    <div className='container mx-auto py-6 space-y-8 max-w-7xl'>
      {/* Stock Header Loading State */}
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='space-y-2'>
            <Skeleton className='h-8 w-32' />
            <Skeleton className='h-6 w-48' />
          </div>
          <div className='text-right space-y-2'>
            <Skeleton className='h-8 w-24' />
            <Skeleton className='h-6 w-16' />
          </div>
        </div>
        <Skeleton className='h-24 w-full' />
      </div>

      {/* Price Chart Loading State */}
      <div className='rounded-lg border p-6 space-y-4'>
        <div className='flex items-center justify-between'>
          <Skeleton className='h-6 w-24' />
          <div className='flex gap-2 justify-center'>
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className='h-8 w-12' />
              ))}
          </div>
        </div>
        <Skeleton className='h-[400px] w-full' />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='md:col-span-2 space-y-6'>
          {/* Company Overview Loading State */}
          <div className='rounded-lg border p-6 space-y-4'>
            <Skeleton className='h-6 w-48 mx-auto' />
            <div className='space-y-2'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-3/4 mx-auto' />
            </div>
          </div>

          {/* Financial Data Tabs Loading State */}
          <div className='rounded-lg border p-6 space-y-4'>
            <div className='flex gap-2 border-b justify-center mb-4'>
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className='h-10 w-24' />
                ))}
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className='space-y-2 flex flex-col items-center'>
                    <Skeleton className='h-4 w-24' />
                    <Skeleton className='h-6 w-32' />
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className='space-y-6'>
          {/* Key Stats Loading State */}
          <div className='rounded-lg border p-6 space-y-4'>
            <Skeleton className='h-6 w-32 mx-auto mb-4' />
            <div className='grid grid-cols-2 gap-4'>
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className='space-y-2 flex flex-col items-center'>
                    <Skeleton className='h-4 w-20' />
                    <Skeleton className='h-6 w-24' />
                  </div>
                ))}
            </div>
          </div>

          {/* News Feed Loading State */}
          <div className='rounded-lg border p-6 space-y-4'>
            <Skeleton className='h-6 w-24 mx-auto mb-2' />
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className='space-y-2 flex flex-col items-center'>
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-3/4' />
                  <Skeleton className='h-4 w-24' />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
