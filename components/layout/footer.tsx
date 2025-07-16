export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border pt-3 pb-4 bg-card flex justify-center items-center">
      <p className="text-center text-sm text-muted-foreground">
        &copy; {currentYear} Cultivo Indoor Analytics. Feito com 🌱 e código.
      </p>
    </footer>
  )
} 