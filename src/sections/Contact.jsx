import { useState } from 'react'
import { ArrowUpRight, BriefcaseBusiness, CodeXml, Mail, MapPin, Send } from 'lucide-react'
import { Reveal } from '../components/Reveal.jsx'
import { SectionHeading } from '../components/SectionHeading.jsx'
import { contact } from '../data/contact.js'

const initialForm = { name: '', email: '', subject: '', message: '' }

function validateForm(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Please enter your name.'
  if (!form.email.trim()) {
    errors.email = 'Please enter your email address.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }
  if (!form.subject.trim()) errors.subject = 'Please add a subject.'
  if (!form.message.trim()) errors.message = 'Please write a message.'
  return errors
}

export function Contact() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    setNotice('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    const validationErrors = validateForm(form)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      setNotice('Please review the highlighted fields.')
      return
    }

    setNotice(`The form does not send messages yet. Email me directly at ${contact.email}.`)
  }

  return (
    <section className="section-wrap section-block contact-section" id="contact">
      <Reveal>
        <SectionHeading
          title={<><span className="text-accent">Contact</span></>}
          description="Interested in building something useful, collaborating, or sharing ideas? I would love to hear what you are working on."
        />
      </Reveal>
      <div className="contact-layout">
        <Reveal className="contact-aside">
          <span className="eyebrow muted-eyebrow">CONTACT DETAILS</span>
          <h3>Let&apos;s make something meaningful.</h3>
          <p>Reach out by email or connect with me on GitHub and LinkedIn.</p>
          <div className="contact-detail-list">
            <div className="contact-detail">
              <span className="contact-detail__icon"><Mail size={17} aria-hidden="true" /></span>
              <span><small>EMAIL</small><strong><a href={`mailto:${contact.email}`}>{contact.email}</a></strong></span>
            </div>
            <div className="contact-detail">
              <span className="contact-detail__icon"><CodeXml size={17} aria-hidden="true" /></span>
              <span><small>GITHUB</small><strong><a href={contact.github} target="_blank" rel="noreferrer">View profile</a></strong></span>
            </div>
            <div className="contact-detail">
              <span className="contact-detail__icon"><BriefcaseBusiness size={17} aria-hidden="true" /></span>
              <span><small>LINKEDIN</small><strong><a href={contact.linkedIn} target="_blank" rel="noreferrer">View profile</a></strong></span>
            </div>
            <div className="contact-detail">
              <span className="contact-detail__icon"><MapPin size={17} aria-hidden="true" /></span>
              <span><small>LOCATION</small><strong>Uganda, East Africa</strong></span>
            </div>
          </div>
          <a className="inline-link" href="#home">
            Back to the beginning <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </Reveal>

        <Reveal className="contact-form-panel">
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="contact-name">Your name</label>
                <input id="contact-name" name="name" autoComplete="name" value={form.name} onChange={updateField} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />
                {errors.name && <span className="field-error" id="name-error">{errors.name}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="contact-email">Email address</label>
                <input id="contact-email" name="email" type="email" autoComplete="email" value={form.email} onChange={updateField} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />
                {errors.email && <span className="field-error" id="email-error">{errors.email}</span>}
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="contact-subject">Subject</label>
              <input id="contact-subject" name="subject" value={form.subject} onChange={updateField} aria-invalid={Boolean(errors.subject)} aria-describedby={errors.subject ? 'subject-error' : undefined} />
              {errors.subject && <span className="field-error" id="subject-error">{errors.subject}</span>}
            </div>
            <div className="form-field">
              <label htmlFor="contact-message">Your message</label>
              <textarea id="contact-message" name="message" rows="4" value={form.message} onChange={updateField} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : undefined} />
              {errors.message && <span className="field-error" id="message-error">{errors.message}</span>}
            </div>
            {notice && <p className="form-notice" role="status">{notice}</p>}
            <button className="button button--primary form-submit" type="submit">
              Prepare message <Send size={15} aria-hidden="true" />
            </button>
            <p className="form-disclaimer">This form validates your message in the browser only; it does not transmit or store it.</p>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
