import { useMemo } from "react";

type ManicImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  format?: "webp" | "avif" | "png";
  priority?: boolean;
  className?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>;

export const Image = ({
  src,
  alt,
  width = 512,
  height,
  priority = false,
  className,
  format = "webp",
  ...props
}: ManicImageProps) => {
  const { base, srcset } = useMemo(() => {
    const baseUrl = `/img/transform?src=${encodeURIComponent(src)}&format=${format}`;
    const set = [320, 640, 960, 1280]
      .map((w) => `${baseUrl}&w=${w} ${w}w`)
      .join(", ");
    return { base: baseUrl, srcset: set };
  }, [src, format]);

  return (
    <img
      src={`${base}`}
      srcSet={srcset}
      sizes="(max-width: 640px) 100vw, 640px"
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      className={className}
      {...props}
    />
  );
};
