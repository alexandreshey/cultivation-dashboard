export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border pt-3 pb-4 bg-card flex justify-center items-center">
      <p className="text-center text-sm text-muted-foreground">
        &copy; {currentYear} ErvApp. Feito com 🌱 e código.<br />
        <span className="text-xs">feito por heyalexandre</span>
      </p>
    </footer>
  )
} 