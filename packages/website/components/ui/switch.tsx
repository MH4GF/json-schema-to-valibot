'use client'

import { Root, Thumb } from '@radix-ui/react-switch'
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from 'react'

import { cn } from '@/lib/utils'

const Switch = forwardRef<ElementRef<typeof Root>, ComponentPropsWithoutRef<typeof Root>>(
  ({ className, ...props }, ref) => (
    <Root
      className={cn(
        'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#9290c3] data-[state=unchecked]:bg-[#2b2c31]',
        className,
      )}
      {...props}
      ref={ref}
    >
      <Thumb
        className={cn(
          'pointer-events-none block h-4 w-4 rounded-full bg-[#050a1f] shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
        )}
      />
    </Root>
  ),
)
Switch.displayName = Root.displayName

export { Switch }
