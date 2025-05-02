import Link from "next/link"

export function PaniniLogo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="text-2xl font-bold text-primary">
        panini<span className="text-3xl">8</span>
      </span>
    </Link>
  )
}
