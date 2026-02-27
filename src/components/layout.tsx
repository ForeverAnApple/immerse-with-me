import { Navbar } from "@/components/navbar"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
