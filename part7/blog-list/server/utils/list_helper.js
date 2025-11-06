const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((res, blog) => {
    return res + blog.likes;
  }, 0);
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((res, blog) => {
    return res.likes > blog.likes ? res : blog;
  }, blogs[0]);
}

const mostBlogs = (blogs) => {
  const countMap = {};
  let currMaxAuthor = blogs[0]?.author ?? '';
  blogs.forEach((blog) => {
    const count = (countMap[blog.author] ?? 0) + 1;
    if (count > countMap[currMaxAuthor]) {
      currMaxAuthor = blog.author;
    }
    countMap[blog.author] = count;
  });

  return {
    author: currMaxAuthor,
    blogs: countMap[currMaxAuthor]
  };
}

const mostLikes = (blogs) => {
  const authors = [];
  const counted = blogs.reduce((res, blog) => {
    if (authors.includes(blog.author)) {
      res[authors.indexOf(blog.author)].likes += blog.likes;
    } else {
      authors.push(blog.author);
      res.push({
        author: blog.author,
        likes: blog.likes,
      })
    }
    return res;
  }, [])

  let curRes = counted[0];

  for (let i = 1; i < counted.length; i++) {
    if (counted[i].likes > curRes.likes) {
      curRes = counted[i];
    }
  }

  return curRes;
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}