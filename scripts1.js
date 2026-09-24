const books = [
  { title: 'The Kite Runner', description: 'A tale of friendship, betrayal, guilt, redemption, and forgiveness in Afghanistan.', image: '1.jpg', genre: 'Stories of Family & Friendship' },
  { title: 'A Thousand Splendid Suns', description: 'Love, suffering, oppression, and womens resilience in Afghanistan.', image: '2.jpg', genre: 'Stories of Family & Friendship' },
  { title: 'And the Mountains Echoed', description: 'A family story spanning generations and continents, by Khaled Hosseini.', image: '3.jpg', genre: 'Stories of Family & Friendship' },
  { title: 'They Both Die at the End', description: 'A story about love, life, and death on one final day.', image: '6.jpg', genre: 'Love & Life' },
  { title: 'I Want to Eat Your Pancreas', description: 'An unexpected friendship shaped by life, death, and the time we have.', image: '44.webp', genre: 'Love & Life' },
  { title: 'Tuesdays with Morrie', description: 'Life lessons about love and mortality, shared between teacher and student.', image: '5.jpg', genre: 'Love & Life' },
  { title: 'Before the Coffee Gets Cold', description: 'Four interconnected stories explore love, regret, and second chances.', image: '7.jpg', genre: 'Love & Life' },
  { title: 'Tales from the Cafe', description: 'Four interconnected stories explore love, regret, and second chances.', image: '8.jpg', genre: 'Love & Life' },
  { title: 'Before Your Memory Fades', description: 'Stories of love, memory, and second chances.', image: '9.jpg', genre: 'Love & Life' },
  { title: 'Before We Say Goodbye', description: 'Stories of love, memory, and second chances.', image: '10.jpg', genre: 'Love & Life' },
  { title: 'A Man Called Ove', description: 'A grumpy old mans life is transformed by unexpected friendship and love.', image: '11.jpg', genre: 'Love & Life' },
  { title: 'A Silent Voice', description: 'A bullied deaf girl and her former tormentor find a path toward understanding.', image: '16.jpg', genre: 'Love & Life' },
  { title: 'Lives Not Lived', description: 'Two women struggle with child marriage and abuse.', image: '22.jpg', genre: 'Stories of Family & Friendship' },
  { title: 'A Little Life', description: 'Four college friends navigate love, trauma, and identity in New York.', image: '23.jpg', genre: 'Stories of Family & Friendship' },
  { title: 'The Seeker of Nothing', description: 'A young womans journey to self-discovery and spiritual enlightenment.', image: '13.jpg', genre: 'Fantasy & Adventure' },
  { title: 'Solo Leveling', description: 'A weak hunter gains power and battles monsters alone.', image: '18.jpg', genre: 'Fantasy & Adventure' },
  { title: 'The Alchemist', description: 'A story about following dreams, self-discovery, and pursuing a personal legend.', image: '41.jpg', genre: 'Fantasy & Adventure' },
  { title: 'The Silent Patient', description: 'A womans silence, secrets, and shocking revelations.', image: '36.jfif', genre: 'Mystery & Suspense' },
  { title: 'Verity', description: 'A psychological thriller about lies, manipulation, obsession, and truth.', image: '42.jpg', genre: 'Mystery & Suspense' },
  { title: 'Atomic Habits', description: 'Small habits can lead to lasting change.', image: '04.jpg', genre: 'Personal Growth' },
  { title: 'The Subtle Art of Not Giving a F*ck', description: 'A guide to focusing on what truly matters in life.', image: '40.jpg', genre: 'Personal Growth' }
];

const storageKey = 'novelHubSocial';
const currentUser = sessionStorage.getItem('novelHubUser');
const loginForm = document.getElementById('loginForm');
const genreSections = document.getElementById('genreSections');

if (loginForm) {
  if (currentUser) window.location.replace('library.html');
  loginForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('username').value.trim();
    if (!name) return;
    sessionStorage.setItem('novelHubUser', name);
    window.location.href = 'library.html';
  });
}

if (genreSections) {
  if (!currentUser) window.location.replace('index.html');
  else {
    document.getElementById('welcomeUser').textContent = `Hi, ${currentUser}`;
    document.getElementById('logoutButton').addEventListener('click', () => {
      sessionStorage.removeItem('novelHubUser');
      window.location.href = 'index.html';
    });
    renderLibrary();
  }
}

function readSocialData() {
  try { return JSON.parse(localStorage.getItem(storageKey) || '{}'); }
  catch { return {}; }
}

function saveSocialData(data) {
  localStorage.setItem(storageKey, JSON.stringify(data));
}

function renderLibrary() {
  const socialData = readSocialData();
  const groups = [...new Set(books.map(book => book.genre))];
  groups.forEach(genre => {
    const section = document.createElement('section');
    section.className = 'genre-section';
    const heading = document.createElement('h2');
    heading.textContent = genre;
    const grid = document.createElement('div');
    grid.className = 'book-grid';
    books.filter(book => book.genre === genre).forEach(book => {
      const key = book.title;
      const saved = socialData[key] || { likes: [], comments: [] };
      grid.appendChild(createBookCard(book, saved));
    });
    section.append(heading, grid);
    genreSections.appendChild(section);
  });
}

function createBookCard(book, saved) {
  const card = document.createElement('article');
  card.className = 'book-item';
  const cover = document.createElement('img');
  cover.src = book.image;
  cover.alt = `${book.title} cover`;
  const title = document.createElement('p');
  title.className = 'book-title';
  title.textContent = book.title;
  title.title = book.description;
  const pdfNote = document.createElement('p');
  pdfNote.className = 'pdf-note';
  pdfNote.textContent = 'PDF not included in this shareable copy';
  const actions = document.createElement('div');
  actions.className = 'social-actions';
  const like = document.createElement('button');
  like.type = 'button';
  like.className = 'like-button';
  const isLiked = saved.likes.includes(currentUser);
  like.setAttribute('aria-pressed', String(isLiked));
  like.textContent = `${isLiked ? '♥ Liked' : '♡ Like'} · ${saved.likes.length}`;
  like.addEventListener('click', () => {
    const data = readSocialData();
    const entry = data[book.title] || { likes: [], comments: [] };
    entry.likes = entry.likes || [];
    const index = entry.likes.indexOf(currentUser);
    if (index >= 0) entry.likes.splice(index, 1);
    else entry.likes.push(currentUser);
    data[book.title] = entry;
    saveSocialData(data);
    renderLibrary();
  });
  const commentToggle = document.createElement('button');
  commentToggle.type = 'button';
  commentToggle.className = 'comment-toggle';
  commentToggle.textContent = `Comments · ${saved.comments.length}`;
  const commentPanel = document.createElement('div');
  commentPanel.className = 'comment-panel';
  commentPanel.hidden = true;
  const commentList = document.createElement('ul');
  commentList.className = 'comment-list';
  saved.comments.forEach(comment => {
    const item = document.createElement('li');
    const author = document.createElement('strong');
    author.textContent = `${comment.user}: `;
    item.append(author, document.createTextNode(comment.text));
    commentList.appendChild(item);
  });
  const commentForm = document.createElement('form');
  commentForm.className = 'comment-form';
  const input = document.createElement('input');
  input.type = 'text';
  input.maxLength = 240;
  input.placeholder = 'Write a comment';
  input.setAttribute('aria-label', `Comment on ${book.title}`);
  input.required = true;
  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.textContent = 'Post';
  commentForm.append(input, submit);
  commentForm.addEventListener('submit', event => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    const data = readSocialData();
    const entry = data[book.title] || { likes: [], comments: [] };
    entry.comments = entry.comments || [];
    entry.comments.push({ user: currentUser, text });
    data[book.title] = entry;
    saveSocialData(data);
    renderLibrary();
  });
  commentToggle.addEventListener('click', () => { commentPanel.hidden = !commentPanel.hidden; });
  commentPanel.append(commentList, commentForm);
  actions.append(like, commentToggle);
  card.append(cover, title, pdfNote, actions, commentPanel);
  return card;
}


