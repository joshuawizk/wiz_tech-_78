import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '../components/Reveal.jsx'
import { SectionHeading } from '../components/SectionHeading.jsx'

const journey = [
  {
    title: 'Curiosity became direction',
    text: 'My interest in information technology grew from a simple question: how can technology make everyday challenges easier to solve?',
  },
  {
    title: 'Learning by building',
    text: 'I am developing my software and IT foundations through study and practical projects—learning by turning ideas into working experiences.',
  },
  {
    title: 'Thinking beyond the screen',
    text: 'Entrepreneurship and community are part of the picture too. I am interested in creating useful solutions, bringing people together, and opening up opportunity.',
  },
]

export function About() {
  return (
    <section className="section-wrap section-block" id="about">
      <Reveal>
        <SectionHeading
          title={<>About <span className="text-accent">Me</span></>}
          description="A learner, builder, and entrepreneur in the making."
        />
      </Reveal>
      <div className="about-layout">
        <Reveal className="about-intro">
          <span className="eyebrow muted-eyebrow">MY APPROACH</span>
          <p>
            I&apos;m a technology enthusiast, aspiring full-stack developer, and technology
            entrepreneur passionate about building meaningful digital solutions. I enjoy
            transforming ideas into practical applications, exploring emerging technologies,
            solving problems, and creating opportunities through innovation.
          </p>
          <a className="inline-link" href="#experience">
            More about my journey <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </Reveal>
        <div className="journey-list">
          {journey.map((item, index) => (
            <Reveal className="journey-item" key={item.title} delay={index * 0.06}>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
