import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './index.css';

const api = axios.create({ baseURL: 'http://localhost:8000' });

// Add interceptor for token refresh
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    // If 401 and not already retried
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem('refresh');
      if (refresh) {
        try {
          const res = await axios.post('http://localhost:8000/api/token/refresh/', { refresh });
          localStorage.setItem('access', res.data.access);
          // Update the Authorization header and retry the original request
          originalRequest.headers['Authorization'] = `Bearer ${res.data.access}`;
          return api(originalRequest);
        } catch (refreshErr) {
          // Refresh failed, log out user
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          localStorage.removeItem('userInitial');
          window.location.href = '/login';
        }
      } else {
        // No refresh token, log out user
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('userInitial');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

function Home() {
  return (
    <>
      <section className="hero">
        <h1 className="hero-title">Stay curious.</h1>
        <p className="hero-subtitle">Discover stories, thinking, and expertise from writers on any topic.</p>
        <Link to="/explore" className="button">Start reading</Link>
      </section>
      <section className="container">
        <div className="card-list">
          <div className="card">
            <div>
              <div className="card-title">How to Write a Great Blog Post</div>
              <div className="card-meta">by Jane Doe · May 2024</div>
              <div className="card-content">Learn the secrets to writing engaging, thoughtful, and well-structured blog posts that attract readers and keep them coming back for more.</div>
            </div>
            <div className="card-footer">
              <span>5 min read</span>
              <a href="#" className="button" style={{padding: '0.5em 1.5em', fontSize: '0.95em'}}>Read</a>
            </div>
          </div>
          <div className="card">
            <div>
              <div className="card-title">The Art of Storytelling</div>
              <div className="card-meta">by John Smith · May 2024</div>
              <div className="card-content">Storytelling is at the heart of every great blog. Discover how to craft stories that resonate and inspire your audience.</div>
            </div>
            <div className="card-footer">
              <span>7 min read</span>
              <a href="#" className="button" style={{padding: '0.5em 1.5em', fontSize: '0.95em'}}>Read</a>
            </div>
          </div>
          <div className="card">
            <div>
              <div className="card-title">Building Your Audience</div>
              <div className="card-meta">by Alex Lee · May 2024</div>
              <div className="card-content">Tips and strategies for growing your readership and building a loyal community around your blog.</div>
            </div>
            <div className="card-footer">
              <span>4 min read</span>
              <a href="#" className="button" style={{padding: '0.5em 1.5em', fontSize: '0.95em'}}>Read</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Navbar({ userInitial, setUserInitial, dropdownOpen, setDropdownOpen }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('userInitial');
    setUserInitial(null);
    setDropdownOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.user-initial-dropdown')) setDropdownOpen(false);
    };
    if (dropdownOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen, setDropdownOpen]);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo" style={{ textDecoration: 'none', cursor: 'pointer' }}>BlogVerse</Link>
      <div className="navbar-links">
        <Link to="/explore" className="">Explore</Link>
        {userInitial && <Link to="/write" className="">Write</Link>}
        {userInitial ? (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '1em' }}>
            <div
              className="user-initial-dropdown"
              style={{ width: 40, height: 40, borderRadius: '50%', background: '#222', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2em', cursor: 'pointer', userSelect: 'none' }}
              onClick={() => setDropdownOpen((v) => !v)}
              tabIndex={0}
            >
              {userInitial}
            </div>
            {dropdownOpen && (
              <div style={{ position: 'absolute', top: 50, right: 0, background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.10)', borderRadius: 10, minWidth: 150, zIndex: 10 }}>
                <button onMouseDown={() => { setDropdownOpen(false); navigate('/my-blogs'); }} style={{ width: '100%', background: 'none', color: '#222', border: 'none', fontWeight: 600, cursor: 'pointer', padding: '0.8em 1em', textAlign: 'left' }}>My Blogs</button>
                <button onMouseDown={handleLogout} style={{ width: '100%', background: 'none', color: '#222', border: 'none', fontWeight: 600, cursor: 'pointer', padding: '0.8em 1em', textAlign: 'left' }}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="">Sign in</Link>
            <Link to="/get-started" className="button">Get started</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  const [userInitial, setUserInitial] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // On mount, check if token exists
    const token = localStorage.getItem('access');
    const initial = localStorage.getItem('userInitial');
    if (token && initial) setUserInitial(initial);
  }, []);

  return (
    <Router>
      <Navbar userInitial={userInitial} setUserInitial={setUserInitial} dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<ExplorePage />} />
        {userInitial && <Route path="/write" element={<WritePage />} />}
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        {userInitial && <Route path="/my-blogs" element={<MyBlogsPage />} />}
        {userInitial && <Route path="/edit-blog/:id" element={<EditBlogPage />} />}
        <Route path="/login" element={<LoginPage setUserInitial={setUserInitial} />} />
        <Route path="/get-started" element={<GetStartedPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

function Dashboard() {
  return (
    <div className="container">
      <h1>Welcome! You are logged in.</h1>
      <p>This is your dashboard page.</p>
    </div>
  );
}

function LoginPage({ setUserInitial }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/login/', { username: email, password });
      // Save tokens
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      // Save user initial (first letter of email, uppercase)
      const initial = email.trim()[0].toUpperCase();
      localStorage.setItem('userInitial', initial);
      setUserInitial(initial);
      alert('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      let msg = 'Unknown error';
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'string') {
          msg = err.response.data;
        } else if (err.response.data.detail) {
          msg = err.response.data.detail;
        } else {
          msg = JSON.stringify(err.response.data);
        }
      }
      alert('Login failed: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page login-page">
      <form className="auth-form" onSubmit={handleLogin}>
        <h1>Welcome to BlogVerse</h1>
        <p>Sign in to your account</p>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" placeholder="Type your email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" placeholder="Type your password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="button" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        <div className="terms">
          By clicking "Sign in" you agree to our <a href="#">Terms of Use</a> and <a href="#">Privacy policy</a>.
        </div>
      </form>
    </div>
  );
}

function GetStartedPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/signup/', { email, password });
      alert('Registration successful! You can now sign in.');
      navigate('/login');
    } catch (err) {
      alert('Registration failed: ' + (err.response?.data?.detail || JSON.stringify(err.response?.data) || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page get-started-page">
      <form className="auth-form" onSubmit={handleRegister}>
        <h1>Get started with BlogVerse</h1>
        <p>Create your account to join the community</p>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" placeholder="Type your email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label htmlFor="new-password">Create password</label>
        <input type="password" id="new-password" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="button" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        <div className="terms">
          By clicking "Register" you agree to our <a href="#">Terms of Use</a> and <a href="#">Privacy policy</a>.
        </div>
      </form>
    </div>
  );
}

function ExplorePage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get(`/api/blogs/?page=${page}`)
      .then(res => {
        setBlogs(res.data.results || res.data);
        setCount(res.data.count || 0);
        setNext(res.data.next);
        setPrevious(res.data.previous);
      })
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="container">
      <h1>Explore Blogs</h1>
      {loading ? <p>Loading...</p> : blogs.length === 0 ? <p>No blogs found.</p> : (
        <div className="card-list">
          {blogs.map(blog => (
            <div className="card" key={blog.id}>
              <div>
                <div className="card-title">{blog.title}</div>
                <div className="card-meta">by {blog.author} · {new Date(blog.created_at).toLocaleDateString()}</div>
                <div className="card-content">{blog.content.slice(0, 120)}{blog.content.length > 120 ? '...' : ''}</div>
              </div>
              <div className="card-footer">
                <span>{Math.max(1, Math.round((blog.content.length || 100) / 250))} min read</span>
                <Link to={`/blog/${blog.id}`} className="button" style={{padding: '0.5em 1.5em', fontSize: '0.95em'}}>Read</Link>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1em', marginTop: '2em' }}>
        <button className="button" onClick={() => setPage(page - 1)} disabled={!previous || page === 1}>Previous</button>
        <span style={{ alignSelf: 'center' }}>Page {page}</span>
        <button className="button" onClick={() => setPage(page + 1)} disabled={!next}>Next</button>
      </div>
    </div>
  );
}

function WritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("access");
      const res = await api.post(
        "/api/blogs/",
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Blog published!");
      navigate("/explore");
    } catch (err) {
      setError(
        err.response?.data?.detail || JSON.stringify(err.response?.data) || "Unknown error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Write a New Blog</h1>
      <form className="auth-form" onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          placeholder="Enter blog title"
        />
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
          placeholder="Write your blog content here..."
          rows={10}
          style={{ resize: "vertical", fontSize: "1.1em", padding: "1em" }}
        />
        <button type="submit" className="button" disabled={loading}>
          {loading ? "Publishing..." : "Publish"}
        </button>
        {error && <div style={{ color: "#b00", marginTop: 10 }}>{error}</div>}
      </form>
    </div>
  );
}

function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get(`/api/blogs/${id}/`)
      .then(res => setBlog(res.data))
      .catch(() => setError("Blog not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (error) return <div className="container"><p style={{color:'#b00'}}>{error}</p></div>;
  if (!blog) return null;

  return (
    <div className="container" style={{ maxWidth: 700 }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5em' }}>{blog.title}</h1>
      <div style={{ color: '#888', marginBottom: '2em' }}>
        by <b>{blog.author}</b> · {new Date(blog.created_at).toLocaleDateString()}
      </div>
      <div style={{ fontSize: '1.2em', lineHeight: 1.7, color: '#222', whiteSpace: 'pre-line' }}>{blog.content}</div>
    </div>
  );
}

function MyBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access');
    setLoading(true);
    api.get('/api/my-blogs/', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setBlogs(res.data);
      })
      .catch(() => setError('Failed to load blogs.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    const token = localStorage.getItem('access');
    try {
      await api.delete(`/api/blogs/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
      setBlogs(blogs.filter(b => b.id !== id));
    } catch {
      alert('Failed to delete blog.');
    }
  };

  return (
    <div className="container">
      <h1>My Blogs</h1>
      {loading ? <p>Loading...</p> : error ? <p style={{color:'#b00'}}>{error}</p> : blogs.length === 0 ? <p>You have not written any blogs yet.</p> : (
        <div className="card-list">
          {blogs.map(blog => (
            <div className="card" key={blog.id}>
              <div>
                <div className="card-title">{blog.title}</div>
                <div className="card-meta">{new Date(blog.created_at).toLocaleDateString()}</div>
                <div className="card-content">{blog.content.slice(0, 120)}{blog.content.length > 120 ? '...' : ''}</div>
              </div>
              <div className="card-footer">
                <button className="button" style={{padding: '0.5em 1.2em', fontSize: '0.95em', background:'#1a8917'}} onClick={() => navigate(`/blog/${blog.id}`)}>View</button>
                <button className="button" style={{padding: '0.5em 1.2em', fontSize: '0.95em', background:'#eab308', color:'#222'}} onClick={() => navigate(`/edit-blog/${blog.id}`)}>Edit</button>
                <button className="button" style={{padding: '0.5em 1.2em', fontSize: '0.95em', background:'#b91c1c'}} onClick={() => handleDelete(blog.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EditBlogPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    api.get(`/api/blogs/${id}/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setTitle(res.data.title);
        setContent(res.data.content);
      })
      .catch(() => setError("Failed to load blog."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const token = localStorage.getItem("access");
    try {
      await api.put(`/api/blogs/${id}/`, { title, content }, { headers: { Authorization: `Bearer ${token}` } });
      alert("Blog updated!");
      navigate(`/blog/${id}`);
    } catch (err) {
      setError(err.response?.data?.detail || JSON.stringify(err.response?.data) || "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (error) return <div className="container"><p style={{color:'#b00'}}>{error}</p></div>;

  return (
    <div className="container">
      <h1>Edit Blog</h1>
      <form className="auth-form" onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          placeholder="Enter blog title"
        />
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
          placeholder="Write your blog content here..."
          rows={10}
          style={{ resize: "vertical", fontSize: "1.1em", padding: "1em" }}
        />
        <button type="submit" className="button" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {error && <div style={{ color: "#b00", marginTop: 10 }}>{error}</div>}
      </form>
    </div>
  );
}

export default App; 