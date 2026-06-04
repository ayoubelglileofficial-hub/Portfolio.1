"use client"

import Image from "next/image"
import React from "react"

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string
  alt?: string
  fill?: boolean
  sizes?: string
}

export default function UniversalImage({ src, alt = "", fill, sizes, className, ...rest }: Props) {
  const isHttp = typeof src === "string" && (src.startsWith("http://") || src.startsWith("https://"))
  const isData = typeof src === "string" && src.startsWith("data:")

  // Use next/image for http(s) sources; fallback to native img for data URLs and others
  if (isHttp && !isData) {
    if (fill) {
      // @ts-ignore - pass-through props to next/image
      return <Image src={src} alt={alt} fill className={className} sizes={sizes} {...(rest as any)} />
    }
    // @ts-ignore
    return <Image src={src} alt={alt} className={className} sizes={sizes} {...(rest as any)} />
  }

  if (fill) {
    return <img src={src} alt={alt} className={className} {...rest} />
  }

  return <img src={src} alt={alt} className={className} {...rest} />
}
