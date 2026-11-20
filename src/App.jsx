import { Footer } from './components/Footer.jsx'
import { Navbar } from './components/Navbar.jsx'
import { AdminApp } from './admin/AdminApp.jsx'
import { About } from './sections/About.jsx'
import { Blog } from './sections/Blog.jsx'
import { Contact } from './sections/Contact.jsx'
import { Experience } from './sections/Experience.jsx'
import { Hero } from './sections/Hero.jsx'
import { Projects } from './sections/Projects.jsx'
import { Skills } from './sections/Skills.jsx'
import './App.css'

function App() {
  const pathname = window.location.pathname
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/')

  if (isAdminRoute) {
    return <AdminApp pathname={pathname} />
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
