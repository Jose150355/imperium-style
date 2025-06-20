function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--color-principal)',
      color: 'var(--color-secundario)',
      padding: '1rem',
      textAlign: 'center'
    }}>
      <img
        src="/imperium-logo.JPG" // Asegúrate que este archivo esté en la carpeta public
        alt="Logo de IMPERIUM STYLE"
        style={{ height: '40px', marginBottom: '0.5rem' }}
      />
      <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>IMPERIUM STYLE</div>
      <div style={{ fontSize: '0.9rem' }}>Tu estilo, Tu historia.</div>
      <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
        © {new Date().getFullYear()} Todos los derechos reservados.
      </div>
    </footer>
  )
}

export default Footer
