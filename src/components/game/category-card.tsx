import Link from 'next/link';
import { cn } from '@/lib/utils'; // Assuming you have a utils file for class merging like clsx/tailwind-merge

interface CategoryCardProps {
    title: string;
    image: string;
    href: string;
    className?: string;
}

export function CategoryCard({ title, image, href, className }: CategoryCardProps) {
    return (
        <Link href={href} className={cn("group relative block overflow-hidden rounded-xl bg-muted/40", className)}>
            {/* Aspect Ratio Container (16:9 or custom height) */}
            <div className="relative h-48 sm:h-56 md:h-64 w-full">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${image})` }}
                />

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity group-hover:via-black/50" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 p-6 w-full">
                    <h3 className="text-xl md:text-2xl font-bold text-white font-headline tracking-tight group-hover:translate-x-1 transition-transform">
                        {title}
                    </h3>
                </div>
            </div>
        </Link>
    );
}
