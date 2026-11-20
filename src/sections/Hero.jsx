import { ArrowDown, ArrowRight, ArrowUpRight, BriefcaseBusiness, CodeXml, MapPin } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { contact } from '../data/contact.js'
import portrait from '../assets/wiztech-portrait.png'

export function Hero() {
  const reduceMotion = useReducedMotion()
  const intro = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
      }

  return (
    <section className="hero section-wrap" id="home" aria-labelledby="hero-title">
      <motion.div className="hero-copy" {...intro}>
        <div className="hero-availability">
          <span className="status-dot" />
          <span>Learning &amp; building · Uganda, East Africa</span>
        </div>
        <p className="eyebrow hero-label">FULL-STACK DEVELOPER &amp; TECHNOLOGY ENTREPRENEUR</p>
        <h1 id="hero-title">
          WIZ<span className="text-accent">TECH</span>
          <span className="hero-title-period">.</span>
        </h1>
        <p className="hero-tagline">
          Building Digital Experiences.
          <br />
          <span>Turning Ideas Into Technology.</span>
        </p>
        <p className="hero-description">
          I&apos;m a technology enthusiast and aspiring full-stack developer, exploring how
          thoughtful software can solve real problems and create new opportunities.
        </p>
        <div className="hero-actions">
          <a className="button button--primary" href="#projects">
            Explore projects <ArrowRight size={16} aria-hidden="true" />
          </a>
          <a className="button button--text" href="#contact">
            Let&apos;s work together <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
        <div className="hero-links" aria-label="Social profiles and location">
          <a className="hero-social" href={contact.github} target="_blank" rel="noreferrer">
            <CodeXml size={16} aria-hidden="true" /> GitHub <span>view profile</span>
          </a>
          <a className="hero-social" href={contact.linkedIn} target="_blank" rel="noreferrer">
            <BriefcaseBusiness size={16} aria-hidden="true" /> LinkedIn <span>view profile</span>
          </a>
          <span className="hero-location"><MapPin size={15} aria-hidden="true" /> Uganda, East Africa</span>
        </div>
      </motion.div>

      <motion.div
        className="hero-art"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
      >
        <img className="hero-portrait" src={portrait} alt="Portrait of WIZTECH" />
      </motion.div>

      <a href="#about" className="hero-scroll" aria-label="Scroll to about">
        <span>SCROLL TO EXPLORE</span>
        <ArrowDown size={14} aria-hidden="true" />
      </a>
    </section>
  )
}
