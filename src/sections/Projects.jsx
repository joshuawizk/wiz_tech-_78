import { ArrowUpRight, CodeXml, ExternalLink } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Reveal } from '../components/Reveal.jsx'
import { SectionHeading } from '../components/SectionHeading.jsx'
import { projects } from '../data/projects.js'

function ProjectCard({ project, index }) {
  const reduceMotion = useReducedMotion()

  return (
    <Reveal delay={(index % 2) * 0.08}>
      <motion.article
        className="project-card"
        whileHover={reduceMotion ? undefined : { y: -4 }}
        transition={{ duration: 0.24 }}
      >
        <div className={`project-visual project-visual--${project.visual}`}>
          <span className="project-visual__grid" />
          <span className="project-visual__mark">{project.mark}</span>
          <span className="project-visual__line" />
          <span className="project-visual__caption">WIZTECH — SELECTED WORK</span>
        </div>
        <div className="project-card__content">
          <div className="project-card__heading">
            <div>
              <span className="project-kind">{project.kind}</span>
              <h3>{project.name}</h3>
            </div>
            <ArrowUpRight className="project-arrow" size={18} aria-hidden="true" />
          </div>
          <p>{project.description}</p>
          <ul className="tag-list" aria-label="Technologies and focus">
            {project.stack.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <div className="project-card__footer">
            <span className="project-status"><span className="status-dot" />{project.status}</span>
            <div className="project-links" aria-label={`${project.name} links`}>
              <span title="Repository link not provided"><CodeXml size={14} aria-hidden="true" /> Repo pending</span>
              <span title="Live demo not provided"><ExternalLink size={14} aria-hidden="true" /> Demo pending</span>
            </div>
          </div>
        </div>
      </motion.article>
    </Reveal>
  )
}

export function Projects() {
  return (
    <section className="section-wrap section-block section-block--photo section-block--photo-workspace" id="projects">
      <Reveal>
        <SectionHeading
          title={<>Featured <span className="text-accent">Projects</span></>}
          description="A mix of personal builds, community ideas, and practical technical explorations."
        />
      </Reveal>
      <div className="projects-grid">
        {projects.map((project, index) => (
          <ProjectCard project={project} index={index} key={project.name} />
        ))}
      </div>
    </section>
  )
}
