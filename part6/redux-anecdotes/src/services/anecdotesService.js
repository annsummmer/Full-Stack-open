const baseURL = 'http://localhost:3001/anecdotes';

const getAll = async () => {
  const response = await fetch(baseURL);

  if (!response.ok) {
    throw new Error('Failed to fetch notes');
  }

  return response.json();
}

const createNew = async (content) => {
  const response = await fetch(baseURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({content, votes: 0})
  });

  if (!response.ok) {
    console.log(response);
    throw new Error('Failed to create new anecdote');
  }

  return await response.json();
}

const updateVote = async (anecdote) => {
  const response = await fetch(`${baseURL}/${anecdote.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(anecdote)
  });

  if (!response.ok) {
    console.log(response);
    throw new Error('Failed to upvote an anecdote');
  }

  return await response.json();
}

export { getAll, createNew, updateVote };