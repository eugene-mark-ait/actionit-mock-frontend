import Image, { type ImageProps } from 'next/image'
import { cn } from '@/lib/cn'

type SiteImageProps = Omit<ImageProps, 'alt'> & {
  alt: string
}

/** Local `/public` images with sensible defaults for LCP and bandwidth. */
export function SiteImage({ className, quality = 85, alt, ...props }: SiteImageProps) {
  return <Image className={cn(className)} quality={quality} alt={alt} {...props} />
}
