import { useEffect, useRef, useState } from 'react'
import { Check, Eye, EyeOff, LoaderCircle, Pencil, Plus, Trash2, X } from 'lucide-react'

const PROJECT_COLUMNS = [
  'id',
  'slug',
  'name',
  'kind',
  'description',
  'stack',
  'repo_url',
  'demo_url',
  'project_status',
  'visual',
  'mark',
  'sort_order',
  'is_published',
  'published_at',
  'created_at',
  'updated_at',
].join(',')

const EMPTY_PROJECT = {
  slug: '',
  name: '',
  kind: '',
  description: '',
  stackText: '',
  repo_url: '',
  demo_url: '',
  project_status: '',
  visual: 'default',
  mark: '',
  sort_order: '0',
  is_published: false,
}

function getProjectValues(project) {
  if (!project) return EMPTY_PROJECT

  return {
    slug: project.slug ?? '',
    name: project.name ?? '',
    kind: project.kind ?? '',
    description: project.description ?? '',
    stackText: Array.isArray(project.stack) ? project.stack.join('\n') : '',
    repo_url: project.repo_url ?? '',
    demo_url: project.demo_url ?? '',
    project_status: project.project_status ?? '',
    visual: project.visual ?? 'default',
    mark: project.mark ?? '',
    sort_order: String(project.sort_order ?? 0),
    is_published: Boolean(project.is_published),
  }
}

function isValidHttpsUrl(value) {
  if (!value) return true

  try {
    const url = new URL(value)
    return url.protocol === 'https:' && Boolean(url.hostname) && !url.username && !url.password
  } catch {
    return false
  }
}

function validateProject(values) {
  const errors = {}
  const slug = values.slug.trim()
  const name = values.name.trim()
  const kind = values.kind.trim()
  const description = values.description.trim()
  const visual = values.visual.trim()
  const sortOrder = Number(values.sort_order)
  const stack = values.stackText
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)

  if (!slug) {
    errors.slug = 'Enter a project slug.'
  } else if (slug.length > 160 || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    errors.slug = 'Use lowercase letters, numbers, and single hyphens between words.'
  }
  if (!name) errors.name = 'Enter a project name.'
  else if (name.length > 160) errors.name = 'Use no more than 160 characters.'
  if (!kind) errors.kind = 'Enter a project type or category.'
  else if (kind.length > 120) errors.kind = 'Use no more than 120 characters.'
  if (!description) errors.description = 'Enter a project description.'
  else if (description.length > 4000) errors.description = 'Use no more than 4,000 characters.'
  if (stack.length > 50) errors.stackText = 'Add no more than 50 stack items.'
  else if (stack.some((item) => item.length > 80)) {
    errors.stackText = 'Each stack item must be no more than 80 characters.'
  }
  if (!isValidHttpsUrl(values.repo_url.trim())) {
    errors.repo_url = 'Enter a valid HTTPS URL or leave this field empty.'
  }
  if (!isValidHttpsUrl(values.demo_url.trim())) {
    errors.demo_url = 'Enter a valid HTTPS URL or leave this field empty.'
  }
  if (values.project_status.trim().length > 120) {
    errors.project_status = 'Use no more than 120 characters.'
  }
  if (!visual || visual.length > 80 || !/^[a-z0-9_-]+$/.test(visual)) {
    errors.visual = 'Use a visual key with lowercase letters, numbers, hyphens, or underscores.'
  }
  if (values.mark.trim().length > 32) errors.mark = 'Use no more than 32 characters.'
  if (!Number.isInteger(sortOrder) || sortOrder < -2147483648 || sortOrder > 2147483647) {
    errors.sort_order = 'Enter a whole number in the supported range.'
  }

  return {
    errors,
    project: {
      slug,
      name,
      kind,
      description,
      stack,
      repo_url: values.repo_url.trim() || null,
      demo_url: values.demo_url.trim() || null,
      project_status: values.project_status.trim() || null,
      visual,
      mark: values.mark.trim() || null,
      sort_order: sortOrder,
      is_published: values.is_published,
    },
  }
}

function ProjectField({ id, label, error, hint, className = '', children }) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const descriptions = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ')

  return (
    <div className={`form-field ${className}`.trim()}>
      <label htmlFor={id}>{label}</label>
      {children(descriptions || undefined, Boolean(error))}
      {hint && <span className="project-field-hint" id={hintId}>{hint}</span>}
      {error && <span className="field-error" id={errorId}>{error}</span>}
    </div>
  )
}

function ProjectForm({ project, onCancel, onSave }) {
  const firstFieldRef = useRef(null)
  const [values, setValues] = useState(() => getProjectValues(project))
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    firstFieldRef.current?.focus()
  }, [])

  function updateField(event) {
    const { name, value, type, checked } = event.target
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    setSubmitError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const result = validateProject(values)
    setErrors(result.errors)
    setSubmitError('')

    if (Object.keys(result.errors).length > 0) return

    setIsSaving(true)
    try {
      await onSave(project, result.project)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to save this project.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="admin-card project-form-card" aria-labelledby="project-form-title">
      <p className="admin-eyebrow">
        <span className="status-dot" aria-hidden="true" />
        {project ? 'EDIT PROJECT' : 'NEW PROJECT'}
      </p>
      <div className="project-form-heading">
        <h2 id="project-form-title">{project ? 'Edit project' : 'Create project'}</h2>
        <button
          className="project-icon-button"
          type="button"
          onClick={onCancel}
          aria-label="Close project form"
        >
          <X size={17} aria-hidden="true" />
        </button>
      </div>
      <p className="admin-description">
        Project details are saved to the protected projects table. Publication time is set automatically when you publish.
      </p>

      <form className="project-form" onSubmit={handleSubmit} noValidate>
        <div className="project-form-grid">
          <ProjectField id="project-slug" label="Slug" error={errors.slug} hint="Lowercase URL-safe identifier; must be unique.">
            {(describedBy, invalid) => (
              <input
                ref={firstFieldRef}
                id="project-slug"
                name="slug"
                value={values.slug}
                onChange={updateField}
                maxLength={160}
                autoComplete="off"
                aria-invalid={invalid}
                aria-describedby={describedBy}
              />
            )}
          </ProjectField>
          <ProjectField id="project-name" label="Project name" error={errors.name}>
            {(describedBy, invalid) => (
              <input
                id="project-name"
                name="name"
                value={values.name}
                onChange={updateField}
                maxLength={160}
                aria-invalid={invalid}
                aria-describedby={describedBy}
              />
            )}
          </ProjectField>
          <ProjectField id="project-kind" label="Project type / category" error={errors.kind}>
            {(describedBy, invalid) => (
              <input
                id="project-kind"
                name="kind"
                value={values.kind}
                onChange={updateField}
                maxLength={120}
                aria-invalid={invalid}
                aria-describedby={describedBy}
              />
            )}
          </ProjectField>
          <ProjectField
            id="project-description"
            label="Description"
            error={errors.description}
            className="project-field--full"
          >
            {(describedBy, invalid) => (
              <textarea
                id="project-description"
                name="description"
                value={values.description}
                onChange={updateField}
                maxLength={4000}
                rows={4}
                aria-invalid={invalid}
                aria-describedby={describedBy}
              />
            )}
          </ProjectField>
          <ProjectField
            id="project-stack"
            label="Technology stack"
            error={errors.stackText}
            hint="One item per line; saved as the stack text array."
            className="project-field--full"
          >
            {(describedBy, invalid) => (
              <textarea
                id="project-stack"
                name="stackText"
                value={values.stackText}
                onChange={updateField}
                rows={3}
                aria-invalid={invalid}
                aria-describedby={describedBy}
              />
            )}
          </ProjectField>
          <ProjectField id="project-repo-url" label="Repository URL" error={errors.repo_url}>
            {(describedBy, invalid) => (
              <input
                id="project-repo-url"
                name="repo_url"
                type="url"
                inputMode="url"
                value={values.repo_url}
                onChange={updateField}
                maxLength={2048}
                placeholder="https://"
                aria-invalid={invalid}
                aria-describedby={describedBy}
              />
            )}
          </ProjectField>
          <ProjectField id="project-demo-url" label="Demo URL" error={errors.demo_url}>
            {(describedBy, invalid) => (
              <input
                id="project-demo-url"
                name="demo_url"
                type="url"
                inputMode="url"
                value={values.demo_url}
                onChange={updateField}
                maxLength={2048}
                placeholder="https://"
                aria-invalid={invalid}
                aria-describedby={describedBy}
              />
            )}
          </ProjectField>
          <ProjectField id="project-status" label="Project status label" error={errors.project_status} hint="Optional display label; separate from publication status.">
            {(describedBy, invalid) => (
              <input
                id="project-status"
                name="project_status"
                value={values.project_status}
                onChange={updateField}
                maxLength={120}
                aria-invalid={invalid}
                aria-describedby={describedBy}
              />
            )}
          </ProjectField>
          <ProjectField id="project-visual" label="Visual style key" error={errors.visual}>
            {(describedBy, invalid) => (
              <input
                id="project-visual"
                name="visual"
                value={values.visual}
                onChange={updateField}
                maxLength={80}
                aria-invalid={invalid}
                aria-describedby={describedBy}
              />
            )}
          </ProjectField>
          <ProjectField id="project-mark" label="Mark" error={errors.mark} hint="Optional short initials or label.">
            {(describedBy, invalid) => (
              <input
                id="project-mark"
                name="mark"
                value={values.mark}
                onChange={updateField}
                maxLength={32}
                aria-invalid={invalid}
                aria-describedby={describedBy}
              />
            )}
          </ProjectField>
          <ProjectField id="project-sort-order" label="Sort order" error={errors.sort_order} hint="Lower numbers appear first.">
            {(describedBy, invalid) => (
              <input
                id="project-sort-order"
                name="sort_order"
                type="number"
                step="1"
                value={values.sort_order}
                onChange={updateField}
                aria-invalid={invalid}
                aria-describedby={describedBy}
              />
            )}
          </ProjectField>
        </div>

        <div className="project-publish-setting">
          <label htmlFor="project-is-published">
            <input
              id="project-is-published"
              name="is_published"
              type="checkbox"
              checked={values.is_published}
              onChange={updateField}
            />
            <span>Publish this project</span>
          </label>
          <p>Unpublished projects remain visible only to authorized admins.</p>
        </div>

        {Object.keys(errors).length > 0 && (
          <p className="admin-error" role="alert">Please correct the highlighted fields before saving.</p>
        )}
        {submitError && <p className="admin-error" role="alert">{submitError}</p>}
        <div className="project-form-actions">
          <button className="button button--primary" type="submit" disabled={isSaving}>
            {isSaving ? <LoaderCircle className="project-spinner" size={15} aria-hidden="true" /> : <Check size={15} aria-hidden="true" />}
            {isSaving ? 'Saving…' : project ? 'Save changes' : 'Create project'}
          </button>
          <button className="button button--outline" type="button" onClick={onCancel} disabled={isSaving}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  )
}

function formatDate(value) {
  if (!value) return 'Not published'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Unknown date'

  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date)
}

export function ProjectsManager({ supabase }) {
  const [listState, setListState] = useState({ status: 'loading', projects: [], error: '' })
  const [reloadKey, setReloadKey] = useState(0)
  const [formState, setFormState] = useState(null)
  const [notice, setNotice] = useState('')
  const [actionError, setActionError] = useState('')
  const [deleteCandidateId, setDeleteCandidateId] = useState(null)
  const [busyProjectId, setBusyProjectId] = useState(null)

  useEffect(() => {
    let active = true

    supabase
      .from('projects')
      .select(PROJECT_COLUMNS)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!active) return
        if (error) {
          setListState({ status: 'error', projects: [], error: error.message })
          return
        }
        setListState({ status: 'ready', projects: data ?? [], error: '' })
      })
      .catch((error) => {
        if (!active) return
        setListState({
          status: 'error',
          projects: [],
          error: error instanceof Error ? error.message : 'Unable to load projects.',
        })
      })

    return () => {
      active = false
    }
  }, [supabase, reloadKey])

  async function saveProject(project, values) {
    const payload = {
      ...values,
      published_at: values.is_published
        ? project?.published_at || new Date().toISOString()
        : null,
    }
    const query = project
      ? supabase.from('projects').update(payload).eq('id', project.id)
      : supabase.from('projects').insert(payload)
    const { error } = await query.select('id').single()

    if (error) throw new Error(error.message)

    setFormState(null)
    setNotice(project ? 'Project changes saved.' : 'Project created.')
    setActionError('')
    setReloadKey((current) => current + 1)
  }

  async function togglePublication(project) {
    setBusyProjectId(project.id)
    setActionError('')
    setNotice('')
    const isPublishing = !project.is_published

    try {
      const { error } = await supabase
        .from('projects')
        .update({
          is_published: isPublishing,
          published_at: isPublishing ? project.published_at || new Date().toISOString() : null,
        })
        .eq('id', project.id)
        .select('id')
        .single()

      if (error) throw new Error(error.message)

      setNotice(isPublishing ? 'Project published.' : 'Project unpublished.')
      setReloadKey((current) => current + 1)
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to update publication status.')
    } finally {
      setBusyProjectId(null)
    }
  }

  async function deleteProject(project) {
    setBusyProjectId(project.id)
    setActionError('')
    setNotice('')

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id)
        .select('id')
        .single()

      if (error) throw new Error(error.message)

      setDeleteCandidateId(null)
      setNotice('Project deleted.')
      setReloadKey((current) => current + 1)
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to delete this project.')
    } finally {
      setBusyProjectId(null)
    }
  }

  function openCreateForm() {
    setNotice('')
    setActionError('')
    setDeleteCandidateId(null)
    setFormState({ project: null })
  }

  function openEditForm(project) {
    setNotice('')
    setActionError('')
    setDeleteCandidateId(null)
    setFormState({ project })
  }

  return (
    <section className="projects-admin" aria-labelledby="projects-admin-title">
      <header className="projects-admin-heading">
        <div>
          <p className="admin-eyebrow">
            <span className="status-dot" aria-hidden="true" />
            CONTENT MANAGEMENT
          </p>
          <h1 id="projects-admin-title">Projects</h1>
          <p className="admin-description">
            Create and maintain the portfolio project records. Row Level Security remains the authority for every operation.
          </p>
        </div>
        <button className="button button--primary" type="button" onClick={openCreateForm} disabled={Boolean(formState) || Boolean(busyProjectId)}>
          <Plus size={16} aria-hidden="true" />
          New project
        </button>
      </header>

      {formState && (
        <ProjectForm
          key={formState.project?.id ?? 'new'}
          project={formState.project}
          onCancel={() => setFormState(null)}
          onSave={saveProject}
        />
      )}

      {notice && <p className="admin-notice" role="status">{notice}</p>}
      {actionError && <p className="admin-error" role="alert">{actionError}</p>}

      {listState.status === 'loading' ? (
        <p className="project-list-state" role="status">
          <LoaderCircle className="project-spinner" size={17} aria-hidden="true" />
          Loading projects…
        </p>
      ) : listState.status === 'error' ? (
        <div className="project-list-state project-list-state--error">
          <p className="admin-error" role="alert">{listState.error}</p>
          <button
            className="button button--outline button--small"
            type="button"
            onClick={() => setReloadKey((current) => current + 1)}
          >
            Retry loading
          </button>
        </div>
      ) : listState.projects.length === 0 ? (
        <div className="project-empty-state">
          <p className="admin-eyebrow">NO PROJECTS YET</p>
          <h2>Start with your first project</h2>
          <p>New projects are drafts by default unless you choose to publish them.</p>
          <button className="button button--outline button--small" type="button" onClick={openCreateForm} disabled={Boolean(formState) || Boolean(busyProjectId)}>
            <Plus size={15} aria-hidden="true" />
            Create a project
          </button>
        </div>
      ) : (
        <div className="project-admin-list" role="list" aria-label="Projects">
          {listState.projects.map((project) => {
            const isBusy = busyProjectId === project.id
            const isProcessing = Boolean(busyProjectId)
            const isConfirmingDelete = deleteCandidateId === project.id

            return (
              <article className="project-admin-card" key={project.id} role="listitem">
                <div className="project-admin-card__main">
                  <div className="project-admin-card__heading">
                    <div className="project-admin-card__title">
                      <p className="project-admin-card__kind">{project.kind}</p>
                      <h2>{project.name}</h2>
                      <p className="project-admin-card__slug">{project.slug}</p>
                    </div>
                    <span className={`project-status-badge ${project.is_published ? 'project-status-badge--published' : ''}`}>
                      <span className="status-dot" aria-hidden="true" />
                      {project.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  <p className="project-admin-card__description">{project.description}</p>
                  <ul className="project-admin-card__stack" aria-label="Technology stack">
                    {(project.stack ?? []).map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <div className="project-admin-card__metadata">
                    {project.project_status && <span>Label: {project.project_status}</span>}
                    <span>Order: {project.sort_order}</span>
                    <span>Updated: {formatDate(project.updated_at)}</span>
                    {project.is_published && <span>Published: {formatDate(project.published_at)}</span>}
                  </div>
                </div>

                {isConfirmingDelete ? (
                  <div className="project-delete-confirmation" role="group" aria-label={`Confirm deleting ${project.name}`}>
                    <p>Delete <strong>{project.name}</strong>? This cannot be undone.</p>
                    <div>
                      <button
                        className="project-action"
                        type="button"
                        onClick={() => setDeleteCandidateId(null)}
                        disabled={isProcessing}
                      >
                        Cancel
                      </button>
                      <button
                        className="project-action project-action--danger"
                        type="button"
                        onClick={() => deleteProject(project)}
                        disabled={isProcessing}
                      >
                        <Trash2 size={14} aria-hidden="true" />
                        {isBusy ? 'Deleting…' : 'Delete permanently'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="project-admin-card__actions" aria-label={`Actions for ${project.name}`}>
                    <button className="project-action" type="button" onClick={() => openEditForm(project)} disabled={isProcessing || Boolean(formState)}>
                      <Pencil size={14} aria-hidden="true" />
                      Edit
                    </button>
                    <button className="project-action" type="button" onClick={() => togglePublication(project)} disabled={isProcessing || Boolean(formState)}>
                      {project.is_published
                        ? <EyeOff size={14} aria-hidden="true" />
                        : <Eye size={14} aria-hidden="true" />}
                      {isBusy ? 'Updating…' : project.is_published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      className="project-action project-action--danger"
                      type="button"
                      onClick={() => setDeleteCandidateId(project.id)}
                      disabled={isProcessing || Boolean(formState)}
                    >
                      <Trash2 size={14} aria-hidden="true" />
                      Delete
                    </button>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
