import { useEffect, useRef, useState } from 'react'
import { Check, Eye, EyeOff, LoaderCircle, Pencil, Plus, Trash2, X } from 'lucide-react'

const GROUP_COLUMNS = 'id,name,sort_order,is_published,created_at,updated_at'
const SKILL_COLUMNS = 'id,group_id,name,sort_order,is_published,created_at,updated_at'

function isValidSortOrder(value) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed >= -2147483648 && parsed <= 2147483647
}

function FormField({ id, label, error, hint, children }) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ')

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      {children(describedBy || undefined, Boolean(error))}
      {hint && <span className="project-field-hint" id={hintId}>{hint}</span>}
      {error && <span className="field-error" id={errorId}>{error}</span>}
    </div>
  )
}

function FormActions({ isSaving, onCancel, saveLabel }) {
  return (
    <div className="project-form-actions">
      <button className="button button--primary" type="submit" disabled={isSaving}>
        {isSaving
          ? <LoaderCircle className="project-spinner" size={15} aria-hidden="true" />
          : <Check size={15} aria-hidden="true" />}
        {isSaving ? 'Saving…' : saveLabel}
      </button>
      <button className="button button--outline" type="button" onClick={onCancel} disabled={isSaving}>
        Cancel
      </button>
    </div>
  )
}

function GroupForm({ group, groups, onCancel, onSave }) {
  const nameRef = useRef(null)
  const [values, setValues] = useState({
    name: group?.name ?? '',
    sort_order: String(group?.sort_order ?? 0),
    is_published: Boolean(group?.is_published),
  })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    nameRef.current?.focus()
  }, [])

  function updateField(event) {
    const { name, value, checked, type } = event.target
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    setErrors((current) => {
      const next = { ...current }
      delete next[name]
      return next
    })
    setSubmitError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const name = values.name.trim()
    const errors = {}
    const sortOrder = Number(values.sort_order)

    if (!name) errors.name = 'Enter a group name.'
    else if (name.length > 120) errors.name = 'Use no more than 120 characters.'
    else if (groups.some((item) => item.name === name && item.id !== group?.id)) {
      errors.name = 'A group with this exact name already exists.'
    }
    if (!isValidSortOrder(sortOrder)) errors.sort_order = 'Enter a whole number in the supported range.'

    setErrors(errors)
    setSubmitError('')
    if (Object.keys(errors).length > 0) return

    setIsSaving(true)
    try {
      await onSave(group, {
        name,
        sort_order: sortOrder,
        is_published: values.is_published,
      })
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to save this skill group.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="admin-card skill-form-card" aria-labelledby="group-form-title">
      <p className="admin-eyebrow">
        <span className="status-dot" aria-hidden="true" />
        {group ? 'EDIT SKILL GROUP' : 'NEW SKILL GROUP'}
      </p>
      <div className="project-form-heading">
        <h2 id="group-form-title">{group ? 'Edit group' : 'Create group'}</h2>
        <button className="project-icon-button" type="button" onClick={onCancel} aria-label="Close group form">
          <X size={17} aria-hidden="true" />
        </button>
      </div>
      <form className="project-form" onSubmit={handleSubmit} noValidate>
        <div className="skill-form-grid">
          <FormField id="group-name" label="Group name" error={errors.name}>
            {(describedBy, invalid) => (
              <input
                ref={nameRef}
                id="group-name"
                name="name"
                value={values.name}
                onChange={updateField}
                maxLength={120}
                aria-invalid={invalid}
                aria-describedby={describedBy}
              />
            )}
          </FormField>
          <FormField id="group-sort-order" label="Sort order" error={errors.sort_order} hint="Lower numbers appear first.">
            {(describedBy, invalid) => (
              <input
                id="group-sort-order"
                name="sort_order"
                type="number"
                step="1"
                value={values.sort_order}
                onChange={updateField}
                aria-invalid={invalid}
                aria-describedby={describedBy}
              />
            )}
          </FormField>
        </div>
        <div className="project-publish-setting">
          <label htmlFor="group-is-published">
            <input
              id="group-is-published"
              name="is_published"
              type="checkbox"
              checked={values.is_published}
              onChange={updateField}
            />
            <span>Publish this group</span>
          </label>
          <p>Skills are publicly readable only when both the skill and its group are published.</p>
        </div>
        {Object.keys(errors).length > 0 && (
          <p className="admin-error" role="alert">Please correct the highlighted fields before saving.</p>
        )}
        {submitError && <p className="admin-error" role="alert">{submitError}</p>}
        <FormActions isSaving={isSaving} onCancel={onCancel} saveLabel={group ? 'Save group' : 'Create group'} />
      </form>
    </section>
  )
}

function SkillForm({ skill, groups, skills, defaultGroupId, onCancel, onSave }) {
  const nameRef = useRef(null)
  const [values, setValues] = useState({
    name: skill?.name ?? '',
    group_id: skill?.group_id ?? defaultGroupId ?? groups[0]?.id ?? '',
    sort_order: String(skill?.sort_order ?? 0),
    is_published: Boolean(skill?.is_published),
  })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    nameRef.current?.focus()
  }, [])

  function updateField(event) {
    const { name, value, checked, type } = event.target
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    setErrors((current) => {
      const next = { ...current }
      delete next[name]
      return next
    })
    setSubmitError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const name = values.name.trim()
    const errors = {}
    const sortOrder = Number(values.sort_order)

    if (!name) errors.name = 'Enter a skill name.'
    else if (name.length > 120) errors.name = 'Use no more than 120 characters.'
    else if (skills.some((item) => (
      item.group_id === values.group_id
      && item.name === name
      && item.id !== skill?.id
    ))) {
      errors.name = 'This group already contains a skill with this exact name.'
    }
    if (!groups.some((group) => group.id === values.group_id)) {
      errors.group_id = 'Select a valid group.'
    }
    if (!isValidSortOrder(sortOrder)) errors.sort_order = 'Enter a whole number in the supported range.'

    setErrors(errors)
    setSubmitError('')
    if (Object.keys(errors).length > 0) return

    setIsSaving(true)
    try {
      await onSave(skill, {
        name,
        group_id: values.group_id,
        sort_order: sortOrder,
        is_published: values.is_published,
      })
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to save this skill.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="admin-card skill-form-card" aria-labelledby="skill-form-title">
      <p className="admin-eyebrow">
        <span className="status-dot" aria-hidden="true" />
        {skill ? 'EDIT SKILL' : 'NEW SKILL'}
      </p>
      <div className="project-form-heading">
        <h2 id="skill-form-title">{skill ? 'Edit skill' : 'Create skill'}</h2>
        <button className="project-icon-button" type="button" onClick={onCancel} aria-label="Close skill form">
          <X size={17} aria-hidden="true" />
        </button>
      </div>
      <form className="project-form" onSubmit={handleSubmit} noValidate>
        <div className="skill-form-grid">
          <FormField id="skill-name" label="Skill name" error={errors.name}>
            {(describedBy, invalid) => (
              <input
                ref={nameRef}
                id="skill-name"
                name="name"
                value={values.name}
                onChange={updateField}
                maxLength={120}
                aria-invalid={invalid}
                aria-describedby={describedBy}
              />
            )}
          </FormField>
          <FormField id="skill-group" label="Group" error={errors.group_id}>
            {(describedBy, invalid) => (
              <select
                id="skill-group"
                name="group_id"
                value={values.group_id}
                onChange={updateField}
                aria-invalid={invalid}
                aria-describedby={describedBy}
              >
                <option value="">Select a group</option>
                {groups.map((group) => (
                  <option value={group.id} key={group.id}>{group.name}</option>
                ))}
              </select>
            )}
          </FormField>
          <FormField id="skill-sort-order" label="Sort order" error={errors.sort_order} hint="Lower numbers appear first within the group.">
            {(describedBy, invalid) => (
              <input
                id="skill-sort-order"
                name="sort_order"
                type="number"
                step="1"
                value={values.sort_order}
                onChange={updateField}
                aria-invalid={invalid}
                aria-describedby={describedBy}
              />
            )}
          </FormField>
        </div>
        <div className="project-publish-setting">
          <label htmlFor="skill-is-published">
            <input
              id="skill-is-published"
              name="is_published"
              type="checkbox"
              checked={values.is_published}
              onChange={updateField}
            />
            <span>Publish this skill</span>
          </label>
          <p>The skill is public only if its group is also published.</p>
        </div>
        {Object.keys(errors).length > 0 && (
          <p className="admin-error" role="alert">Please correct the highlighted fields before saving.</p>
        )}
        {submitError && <p className="admin-error" role="alert">{submitError}</p>}
        <FormActions isSaving={isSaving} onCancel={onCancel} saveLabel={skill ? 'Save skill' : 'Create skill'} />
      </form>
    </section>
  )
}

function PublishedBadge({ isPublished }) {
  return (
    <span className={`project-status-badge ${isPublished ? 'project-status-badge--published' : ''}`}>
      <span className="status-dot" aria-hidden="true" />
      {isPublished ? 'Published' : 'Draft'}
    </span>
  )
}

export function SkillsManager({ supabase }) {
  const [listState, setListState] = useState({
    status: 'loading',
    groups: [],
    skills: [],
    error: '',
  })
  const [reloadKey, setReloadKey] = useState(0)
  const [formState, setFormState] = useState(null)
  const [notice, setNotice] = useState('')
  const [actionError, setActionError] = useState('')
  const [deleteCandidate, setDeleteCandidate] = useState(null)
  const [busyItem, setBusyItem] = useState(null)

  useEffect(() => {
    let active = true

    Promise.all([
      supabase
        .from('skill_groups')
        .select(GROUP_COLUMNS)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true }),
      supabase
        .from('skills')
        .select(SKILL_COLUMNS)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true }),
    ])
      .then(([groupResult, skillResult]) => {
        if (!active) return
        if (groupResult.error || skillResult.error) {
          setListState({
            status: 'error',
            groups: [],
            skills: [],
            error: groupResult.error?.message || skillResult.error?.message || 'Unable to load skills.',
          })
          return
        }
        setListState({
          status: 'ready',
          groups: groupResult.data ?? [],
          skills: skillResult.data ?? [],
          error: '',
        })
      })
      .catch((error) => {
        if (!active) return
        setListState({
          status: 'error',
          groups: [],
          skills: [],
          error: error instanceof Error ? error.message : 'Unable to load skills.',
        })
      })

    return () => {
      active = false
    }
  }, [supabase, reloadKey])

  function refreshList() {
    setReloadKey((current) => current + 1)
  }

  async function saveGroup(group, values) {
    const query = group
      ? supabase.from('skill_groups').update(values).eq('id', group.id)
      : supabase.from('skill_groups').insert(values)
    const { error } = await query.select('id').single()

    if (error) throw new Error(error.message)

    setFormState(null)
    setNotice(group ? 'Skill group changes saved.' : 'Skill group created.')
    setActionError('')
    refreshList()
  }

  async function saveSkill(skill, values) {
    const query = skill
      ? supabase.from('skills').update(values).eq('id', skill.id)
      : supabase.from('skills').insert(values)
    const { error } = await query.select('id').single()

    if (error) throw new Error(error.message)

    setFormState(null)
    setNotice(skill ? 'Skill changes saved.' : 'Skill created.')
    setActionError('')
    refreshList()
  }

  async function toggleSkillPublication(skill) {
    setBusyItem({ type: 'skill', id: skill.id })
    setActionError('')
    setNotice('')
    const isPublishing = !skill.is_published

    try {
      const { error } = await supabase
        .from('skills')
        .update({ is_published: isPublishing })
        .eq('id', skill.id)
        .select('id')
        .single()

      if (error) throw new Error(error.message)

      setNotice(isPublishing ? 'Skill published.' : 'Skill unpublished.')
      refreshList()
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to update skill publication status.')
    } finally {
      setBusyItem(null)
    }
  }

  async function deleteSkill(skill) {
    setBusyItem({ type: 'skill', id: skill.id })
    setActionError('')
    setNotice('')

    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', skill.id)
        .select('id')
        .single()

      if (error) throw new Error(error.message)

      setDeleteCandidate(null)
      setNotice('Skill deleted.')
      refreshList()
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to delete this skill.')
    } finally {
      setBusyItem(null)
    }
  }

  async function deleteGroup(group) {
    setBusyItem({ type: 'group', id: group.id })
    setActionError('')
    setNotice('')

    try {
      const { error } = await supabase
        .from('skill_groups')
        .delete()
        .eq('id', group.id)
        .select('id')
        .single()

      if (error) throw new Error(error.message)

      setDeleteCandidate(null)
      setNotice('Skill group and its assigned skills were deleted.')
      refreshList()
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to delete this skill group.')
    } finally {
      setBusyItem(null)
    }
  }

  function startGroupForm(group = null) {
    setNotice('')
    setActionError('')
    setDeleteCandidate(null)
    setFormState({ type: 'group', group })
  }

  function startSkillForm(skill = null, defaultGroupId = null) {
    setNotice('')
    setActionError('')
    setDeleteCandidate(null)
    setFormState({ type: 'skill', skill, defaultGroupId })
  }

  return (
    <section className="skills-admin" aria-labelledby="skills-admin-title">
      <header className="projects-admin-heading">
        <div>
          <p className="admin-eyebrow">
            <span className="status-dot" aria-hidden="true" />
            CONTENT MANAGEMENT
          </p>
          <h1 id="skills-admin-title">Skills</h1>
          <p className="admin-description">
            Organize skills into groups and control their display order and publication state.
          </p>
        </div>
        <button
          className="button button--primary"
          type="button"
          onClick={() => startGroupForm()}
          disabled={listState.status !== 'ready' || Boolean(formState) || Boolean(busyItem)}
        >
          <Plus size={16} aria-hidden="true" />
          New group
        </button>
      </header>

      <p className="skills-visibility-note">
        Public readers see a skill only when both the skill and its group are published.
      </p>

      {formState?.type === 'group' && (
        <GroupForm
          key={formState.group?.id ?? 'new-group'}
          group={formState.group}
          groups={listState.groups}
          onCancel={() => setFormState(null)}
          onSave={saveGroup}
        />
      )}
      {formState?.type === 'skill' && (
        <SkillForm
          key={formState.skill?.id ?? `new-skill-${formState.defaultGroupId ?? 'none'}`}
          skill={formState.skill}
          groups={listState.groups}
          skills={listState.skills}
          defaultGroupId={formState.defaultGroupId}
          onCancel={() => setFormState(null)}
          onSave={saveSkill}
        />
      )}

      {notice && <p className="admin-notice" role="status">{notice}</p>}
      {actionError && <p className="admin-error" role="alert">{actionError}</p>}

      {listState.status === 'loading' ? (
        <p className="project-list-state" role="status">
          <LoaderCircle className="project-spinner" size={17} aria-hidden="true" />
          Loading skill groups and skills…
        </p>
      ) : listState.status === 'error' ? (
        <div className="project-list-state project-list-state--error">
          <p className="admin-error" role="alert">{listState.error}</p>
          <button className="button button--outline button--small" type="button" onClick={refreshList}>
            Retry loading
          </button>
        </div>
      ) : listState.groups.length === 0 ? (
        <div className="project-empty-state">
          <p className="admin-eyebrow">NO SKILL GROUPS YET</p>
          <h2>Start by creating a group</h2>
          <p>Skills belong to a group. Create a group first, then add skills to it.</p>
          <button className="button button--outline button--small" type="button" onClick={() => startGroupForm()} disabled={listState.status !== 'ready' || Boolean(formState) || Boolean(busyItem)}>
            <Plus size={15} aria-hidden="true" />
            Create a group
          </button>
        </div>
      ) : (
        <div className="skill-group-list" role="list" aria-label="Skill groups">
          {listState.groups.map((group) => {
            const groupSkills = listState.skills.filter((skill) => skill.group_id === group.id)
            const busy = busyItem !== null
            const isDeletingGroup = deleteCandidate?.type === 'group' && deleteCandidate.id === group.id
            const busyGroup = busyItem?.type === 'group' && busyItem.id === group.id

            return (
              <article className="skill-group-card" key={group.id} role="listitem">
                <header className="skill-group-card__header">
                  <div className="skill-group-card__identity">
                    <p className="skill-group-card__order">GROUP ORDER · {group.sort_order}</p>
                    <h2>{group.name}</h2>
                    <p>{groupSkills.length} {groupSkills.length === 1 ? 'skill' : 'skills'}</p>
                  </div>
                  <PublishedBadge isPublished={group.is_published} />
                </header>

                <div className="skill-group-card__actions">
                  <button className="project-action" type="button" onClick={() => startGroupForm(group)} disabled={busy || Boolean(formState)}>
                    <Pencil size={14} aria-hidden="true" />
                    Edit group
                  </button>
                  <button className="project-action" type="button" onClick={() => startSkillForm(null, group.id)} disabled={busy || Boolean(formState)}>
                    <Plus size={14} aria-hidden="true" />
                    Add skill
                  </button>
                  <button
                    className="project-action project-action--danger"
                    type="button"
                    onClick={() => setDeleteCandidate({ type: 'group', id: group.id })}
                    disabled={busy || Boolean(formState)}
                  >
                    <Trash2 size={14} aria-hidden="true" />
                    Delete group
                  </button>
                </div>

                {isDeletingGroup && (
                  <div className="skills-delete-confirmation" role="group" aria-label={`Confirm deleting ${group.name}`}>
                    <p>
                      Delete <strong>{group.name}</strong>? This cannot be undone.
                      {groupSkills.length > 0
                        ? ` The database will also permanently delete all ${groupSkills.length} ${groupSkills.length === 1 ? 'skill' : 'skills'} assigned to this group.`
                        : ' This group currently has no assigned skills.'}
                    </p>
                    <div className="skills-delete-confirmation__actions">
                      <button className="project-action" type="button" onClick={() => setDeleteCandidate(null)} disabled={busy}>
                        Cancel
                      </button>
                      <button className="project-action project-action--danger" type="button" onClick={() => deleteGroup(group)} disabled={busy}>
                        <Trash2 size={14} aria-hidden="true" />
                        {busyGroup ? 'Deleting…' : 'Delete group and skills'}
                      </button>
                    </div>
                  </div>
                )}

                {groupSkills.length === 0 ? (
                  <p className="skill-group-empty">No skills in this group yet.</p>
                ) : (
                  <div className="skill-list" role="list" aria-label={`Skills in ${group.name}`}>
                    {groupSkills.map((skill) => {
                      const isDeletingSkill = deleteCandidate?.type === 'skill' && deleteCandidate.id === skill.id
                      const busySkill = busyItem?.type === 'skill' && busyItem.id === skill.id

                      return (
                        <article className="skill-row" key={skill.id} role="listitem">
                          <div className="skill-row__details">
                            <h3>{skill.name}</h3>
                            <span>Order: {skill.sort_order}</span>
                            {skill.is_published && !group.is_published && (
                              <span className="skill-row__visibility-warning">Group is unpublished</span>
                            )}
                          </div>
                          <PublishedBadge isPublished={skill.is_published} />
                          {isDeletingSkill ? (
                            <div className="skill-row__confirm" role="group" aria-label={`Confirm deleting ${skill.name}`}>
                              <span>Delete this skill permanently?</span>
                              <button className="project-action" type="button" onClick={() => setDeleteCandidate(null)} disabled={busy}>
                                Cancel
                              </button>
                              <button className="project-action project-action--danger" type="button" onClick={() => deleteSkill(skill)} disabled={busy}>
                                <Trash2 size={14} aria-hidden="true" />
                                {busySkill ? 'Deleting…' : 'Confirm delete'}
                              </button>
                            </div>
                          ) : (
                            <div className="skill-row__actions" aria-label={`Actions for ${skill.name}`}>
                              <button className="project-action" type="button" onClick={() => startSkillForm(skill)} disabled={busy || Boolean(formState)}>
                                <Pencil size={14} aria-hidden="true" />
                                Edit
                              </button>
                              <button className="project-action" type="button" onClick={() => toggleSkillPublication(skill)} disabled={busy || Boolean(formState)}>
                                {skill.is_published
                                  ? <EyeOff size={14} aria-hidden="true" />
                                  : <Eye size={14} aria-hidden="true" />}
                                {busySkill ? 'Updating…' : skill.is_published ? 'Unpublish' : 'Publish'}
                              </button>
                              <button className="project-action project-action--danger" type="button" onClick={() => setDeleteCandidate({ type: 'skill', id: skill.id })} disabled={busy || Boolean(formState)}>
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
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
