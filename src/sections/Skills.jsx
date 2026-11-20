import { Code2, Database, Network, Server, Wrench } from 'lucide-react'
import { Reveal } from '../components/Reveal.jsx'
import { SectionHeading } from '../components/SectionHeading.jsx'
import { skillGroups } from '../data/skills.js'

const icons = [Code2, Server, Database, Network, Wrench]

export function Skills() {
  return (
    <section className="section-wrap section-block section-block--photo section-block--photo-circuit" id="skills">
      <Reveal>
        <SectionHeading
          title={<>My <span className="text-accent">Skills</span></>}
          description="Technologies I have worked with or am actively learning. No scores—just the tools behind the work."
        />
      </Reveal>
      <div className="skills-grid">
        {skillGroups.map((group, index) => {
          const Icon = icons[index]
          return (
            <Reveal className="skill-card" key={group.category} delay={index * 0.04}>
              <div className="skill-card__top">
                <span className="skill-card__icon"><Icon size={18} strokeWidth={1.7} aria-hidden="true" /></span>
              </div>
              <h3>{group.category}</h3>
              <ul className="skill-list">
                {group.skills.map((skill) => <li key={skill}>{skill}</li>)}
              </ul>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
