import { supabase } from './supabase'

// Fetch user's organizations
export async function getOrganizations() {
  const { data, error } = await supabase
    .from('organizations')
    .select(`
      *,
      organization_members!inner(role)
    `)
  if (error) throw error
  return data
}

// Fetch repositories for an organization
export async function getRepositories(orgId) {
  const { data, error } = await supabase
    .from('repositories')
    .select('*')
    .eq('org_id', orgId)
    .eq('active', true)
  if (error) throw error
  return data
}

// Fetch open pull requests
export async function getPullRequests(repoId) {
  const { data, error } = await supabase
    .from('pull_requests')
    .select(`
      *,
      author:profiles(github_username, avatar_url),
      reviews(status, reviewer_id)
    `)
    .eq('repo_id', repoId)
    .eq('state', 'open')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// Fetch a single PR with its checklists
export async function getPullRequestDetails(prId) {
  const { data, error } = await supabase
    .from('pull_requests')
    .select(`
      *,
      author:profiles(*),
      checklists(*),
      reviews(*, reviewer:profiles(*))
    `)
    .eq('id', prId)
    .single()
  if (error) throw error
  return data
}

// Toggle a checklist item
export async function toggleChecklistItem(checklistId, itemIndex, currentItems) {
  const newItems = [...currentItems]
  newItems[itemIndex].checked = !newItems[itemIndex].checked
  
  // Check if all items are completed
  const isCompleted = newItems.every(item => item.checked)

  const { data, error } = await supabase
    .from('checklists')
    .update({ 
      items: newItems,
      completed: isCompleted
    })
    .eq('id', checklistId)
    .select()
    .single()
    
  if (error) throw error
  return data
}
