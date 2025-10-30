const baseUrl = 'http://localhost:3001/anecdotes';

export const getAnecdotes = async () => {
  const response = await fetch(baseUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch notes');
  }
  return response.json();
}

export const postAnecdote = async (content) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(content)
  }
  const response = await fetch(baseUrl, options);
  if (!response.ok) {
    throw new Error('Failed to create a note');
  }
  return response.json();
}
export const upvoteAnecdote = async (anecdote) => {
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(anecdote)
  }
  const response = await fetch(`${baseUrl}/${anecdote.id}`, options);
  if (!response.ok) {
    throw new Error('Failed to create a note');
  }
  return response.json();
}