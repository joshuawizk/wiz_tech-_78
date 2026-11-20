import { ArrowUpRight, BookOpen, Compass, HandHeart, Layers3 } from 'lucide-react'
import { Reveal } from '../components/Reveal.jsx'
import { SectionHeading } from '../components/SectionHeading.jsx'

const entries = [
  {
    icon: BookOpen,
    category: 'Education',
    title: 'BYU-Pathway Worldwide',
    detail: 'Information Technology',
    description:
      'Building a foundation in information technology through coursework and continued independent study.',
    badge: 'Studies',
  },
  {
    icon: Layers3,
    category: 'Personal projects',
    title: 'Learning through making',
    detail: 'Software & IT projects',
    description:
      'Developing practical software and networking projects to apply concepts, learn new tools, and grow as a builder.',
    badge: 'Hands-on',
  },
  {
    icon: HandHeart,
    category: 'Community initiatives',
    title: 'Learning together',
    detail: 'Digital literacy & service-learning',
    description:
      'Interested in community digital literacy, service-learning, and creating more ways for people to participate in technology.',
    badge: 'Community',
  },
  {
    icon: Compass,
    category: 'Entrepreneurial interests',
    title: 'Technology with opportunity',
    detail: 'Community development',
    description:
      'Exploring how technology communities can support learning, collaboration, and new opportunities.',
    badge: 'In progress',
  },
]

export function Experience() {
  return (
    <section className="section-wrap section-block section-block--subtle" id="experience">
      <Reveal>
        <SectionHeading
          title={<><span className="text-accent">Experience</span></>}
          description="An honest snapshot of my education, practical work, and areas of interest."
        />
      </Reveal>
      <div className="experience-layout">
        <Reveal className="education-feature">
          <span className="education-feature__icon"><BookOpen size={20} aria-hidden="true" /></span>
          <span className="eyebrow">EDUCATION</span>
          <h3>Information Technology</h3>
          <p>BYU-Pathway Worldwide</p>
          <div className="education-rule" />
          <span className="education-note">Coursework &amp; ongoing learning</span>
          <a href="#contact" className="inline-link">
            Connect about learning <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </Reveal>
        <div className="experience-list">
          {entries.slice(1).map((entry, index) => {
            const Icon = entry.icon
            return (
              <Reveal className="experience-entry" key={entry.category} delay={index * 0.06}>
                <span className="experience-entry__icon"><Icon size={17} aria-hidden="true" /></span>
                <div className="experience-entry__main">
                  <span className="eyebrow">{entry.category}</span>
                  <h3>{entry.title}</h3>
                  <span className="experience-detail">{entry.detail}</span>
                  <p>{entry.description}</p>
                </div>
                <span className="experience-badge">{entry.badge}</span>
              </Reveal>
            )
          })}
          <p className="experience-note">These are personal projects and initiatives, not formal employment roles or certifications.</p>
        </div>
      </div>
    </section>
  )
}
