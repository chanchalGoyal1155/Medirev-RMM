import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Blogs.css";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [productId, setProductId] = useState("");
  const [editId, setEditId] = useState(null);

  // Fetch blogs
  const fetchBlogs = async () => {
    const res = await axios.get("http://localhost:5000/api/blogs");
    setBlogs(res.data);
  };

  // Fetch products
  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/api/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchBlogs();
    fetchProducts();
  }, []);

  const addBlog = async (e) => {
    e.preventDefault();
    if (!productId || !title || !content) return alert("All fields required");
    await axios.post("http://localhost:5000/api/blogs", { productId, title, content });
    setTitle(""); setContent(""); setProductId("");
    fetchBlogs();
  };

  const deleteBlog = async (id) => {
    await axios.delete(`http://localhost:5000/api/blogs/${id}`);
    fetchBlogs();
  };

  const startEdit = (blog) => {
    setEditId(blog._id);
    setTitle(blog.title);
    setContent(blog.content);
    setProductId(blog.product._id);
  };

  const updateBlog = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:5000/api/blogs/${editId}`, { title, content });
    setEditId(null);
    setTitle(""); setContent(""); setProductId("");
    fetchBlogs();
  };

  return (
    <div className="blogs-container">
      <h2 className="blogs-title">📝 Ayurvedic Blogs</h2>
      <form className="blogs-form" onSubmit={editId ? updateBlog : addBlog}>
        <select
          className="blogs-input"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          required
        >
          <option value="">Select Product</option>
          {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
        <input
          className="blogs-input"
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <textarea
          className="blogs-textarea"
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
        <button className={`blogs-btn ${editId ? "blogs-update-btn" : "blogs-add-btn"}`} type="submit">
          {editId ? "Update Blog" : "Add Blog"}
        </button>
      </form>

      <h3 className="blogs-subtitle">All Blogs</h3>
      <ul className="blogs-list">
        {blogs.map(blog => (
          <li className="blogs-card" key={blog._id}>
            <div className="blogs-card-header">
              <strong>{blog.title}</strong>
              <span className="blogs-product">({blog.product?.name})</span>
            </div>
            <div className="blogs-card-content">{blog.content}</div>
            <div className="blogs-card-actions">
              <button className="blogs-btn blogs-edit-btn" onClick={() => startEdit(blog)}>Edit</button>
              <button className="blogs-btn blogs-delete-btn" onClick={() => deleteBlog(blog._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blogs;