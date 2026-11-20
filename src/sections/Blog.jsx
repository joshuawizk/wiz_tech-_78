import { BookOpenText } from 'lucide-react'
import { Reveal } from '../components/Reveal.jsx'
import { SectionHeading } from '../components/SectionHeading.jsx'

const drafts = [
  {
    category: 'Software development',
    title: 'From idea to first interface',
    summary: 'Notes on turning a rough concept into a small, testable first build.',
  },
  {
    category: 'Learning journey',
    title: 'Learning technology by doing',
    summary: 'Reflections on projects, practice, and building a steady learning habit.',
  },
  {
    category: 'Technology entrepreneurship',
    title: 'Building for a real problem',
    summary: 'Questions worth asking before choosing a technology for a new idea.',
  },
]

export function Blog() {
  return (
    <section className="section-wrap section-block" id="blog">
      <Reveal>
        <SectionHeading
          title={<><span className="text-accent">Blog</span></>}
          description="A space for lessons and observations on technology, building, and learning."
        />
      </Reveal>
      <div className="blog-grid">
        {drafts.map((draft, index) => (
          <Reveal className="blog-card" key={draft.title} delay={index * 0.06}>
            <div className="blog-card__top">
              <span className="blog-card__icon"><BookOpenText size={17} aria-hidden="true" /></span>
              <span className="draft-badge">DRAFT IDEA</span>
            </div>
            <span className="eyebrow">{draft.category}</span>
            <h3>{draft.title}</h3>
            <p>{draft.summary}</p>
          </Reveal>
        ))}
      </div>
      <p className="blog-note">These are planned article topics, not published posts.</p>
    </section>
  )
}
