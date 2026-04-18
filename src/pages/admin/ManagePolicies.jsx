import React, { useEffect, useState } from "react";
import { useNotification } from "../../components/NotificationProvider";
import Sidebar from "../../components/Sidebar";
import "../../App.css";

function ManagePolicies() {
  const { showNotification } = useNotification();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState("");
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", coverage: "", premium: "", description: "", document: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState("");

  const fetchPolicies = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/policies", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      if (!res.ok) setError(data.message || "Failed to fetch policies");
      else setPolicies(data);
    } catch (err) {
      setError("Server error. Please try again later.");
    }
    setLoading(false);
  };

  useEffect(() => { fetchPolicies(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this policy?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`http://localhost:5000/api/policies/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        setPolicies(policies.filter(p => p._id !== id));
        showNotification("Policy deleted successfully!", "success");
      } else {
        const data = await res.json();
        showNotification(data.message || "Delete failed", "error");
      }
    } catch {
      showNotification("Server error. Please try again later.", "error");
    }
    setDeleting("");
  };

  const handleEdit = (policy) => {
    setEditingPolicy(policy._id);
    setEditFormData({
      name: policy.name,
      coverage: policy.coverage,
      premium: policy.premium,
      description: policy.description,
      document: policy.document || ""
    });
    setUploadedFile("");
  };

  const handleSaveEdit = async () => {
    try {
      let documentUrl = editFormData.document;
      if (uploadedFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append("document", uploadedFile);
        const uploadRes = await fetch("http://localhost:5000/api/policies/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          body: formData
        });
        setUploading(false);
        if (uploadRes.ok) {
          const data = await uploadRes.json();
          documentUrl = data.filePath;
        } else {
          showNotification("File upload failed", "error");
          return;
        }
      }
      const res = await fetch(`http://localhost:5000/api/policies/${editingPolicy}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ ...editFormData, document: documentUrl })
      });
      if (res.ok) {
        const updatedPolicy = await res.json();
        setPolicies(policies.map(p => p._id === editingPolicy ? updatedPolicy : p));
        setEditingPolicy(null);
        setUploadedFile("");
        showNotification("Policy updated successfully!", "success");
      } else {
        const data = await res.json();
        showNotification(data.message || "Edit failed", "error");
      }
    } catch {
      setUploading(false);
      showNotification("Server error. Please try again later.", "error");
    }
  };

  return (
    <div className="dashboard-container" style={{ minHeight: "100vh", display: "flex" }}>
      <Sidebar />
      <div className="dashboard-content" style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", background: "#f4f6fa" }}>
        <div style={{ width: "100%", maxWidth: 900, background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: 32, margin: 32 }}>
          <h1 style={{ textAlign: "center", marginBottom: 32, color: "#1e293b", fontWeight: 700, letterSpacing: 1 }}>Manage Insurance Policies</h1>
          <input
            type="text"
            placeholder="Search by policy name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "12px 16px", marginBottom: 24, width: "100%", maxWidth: 400, borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 16, marginLeft: "auto", marginRight: "auto", display: "block" }}
          />
          {loading ? (
            <div style={{ textAlign: "center", fontSize: 18, color: "#64748b" }}>Loading...</div>
          ) : error ? (
            <div style={{ color: "#ef4444", textAlign: "center", fontWeight: 500 }}>{error}</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="activity-table" style={{ width: "100%", borderCollapse: "collapse", marginTop: 16, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <thead>
                  <tr style={{ background: "#e0e7ef" }}>
                    <th style={{ padding: 14, fontWeight: 600, color: "#334155" }}>Policy Name</th>
                    <th style={{ padding: 14, fontWeight: 600, color: "#334155" }}>Coverage</th>
                    <th style={{ padding: 14, fontWeight: 600, color: "#334155" }}>Premium</th>
                    <th style={{ padding: 14, fontWeight: 600, color: "#334155" }}>Description</th>
                    <th style={{ padding: 14, fontWeight: 600, color: "#334155" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {policies.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: "center", padding: 24, color: "#64748b" }}>No policies found</td></tr>
                  ) : policies.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase())).map(policy => (
                    <tr key={policy._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: 12 }}>
                        {editingPolicy === policy._id ? (
                          <input value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} style={{ padding: 8, borderRadius: 6, border: "1px solid #cbd5e1", width: "100%" }} />
                        ) : policy.name}
                      </td>
                      <td style={{ padding: 12 }}>
                        {editingPolicy === policy._id ? (
                          <input type="number" value={editFormData.coverage} onChange={(e) => setEditFormData({ ...editFormData, coverage: e.target.value })} style={{ padding: 8, borderRadius: 6, border: "1px solid #cbd5e1", width: "100%" }} />
                        ) : `₹${policy.coverage}`}
                      </td>
                      <td style={{ padding: 12 }}>
                        {editingPolicy === policy._id ? (
                          <input type="number" value={editFormData.premium} onChange={(e) => setEditFormData({ ...editFormData, premium: e.target.value })} style={{ padding: 8, borderRadius: 6, border: "1px solid #cbd5e1", width: "100%" }} />
                        ) : `₹${policy.premium} / month`}
                      </td>
                      <td style={{ padding: 12 }}>
                        {editingPolicy === policy._id ? (
                          <>
                            <input value={editFormData.description} onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })} style={{ padding: 8, borderRadius: 6, border: "1px solid #cbd5e1", width: "100%", marginBottom: 8 }} />
                            <div style={{ marginTop: 8 }}>
                              <input
                                type="file"
                                accept="application/pdf,image/*"
                                onChange={e => setUploadedFile(e.target.files[0])}
                                style={{ marginBottom: 8 }}
                              />
                              {uploading && <span style={{ marginLeft: 8, color: "#0ea5e9" }}>Uploading...</span>}
                              {editFormData.document && !uploadedFile && (
                                <a href={editFormData.document} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 8, color: "#2563eb" }}>View</a>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            {policy.description}
                            {policy.document && (
                              <div><a href={policy.document} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb" }}>View Document</a></div>
                            )}
                          </>
                        )}
                      </td>
                      <td style={{ padding: 12 }}>
                        {editingPolicy === policy._id ? (
                          <>
                            <button className="edit-btn" style={{ background: "#10b981", color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", marginRight: 8, fontWeight: 600, cursor: "pointer", boxShadow: "0 1px 4px rgba(16,185,129,0.08)" }} onClick={handleSaveEdit}>Save</button>
                            <button className="delete-btn" style={{ background: "#6b7280", color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", fontWeight: 600, cursor: "pointer" }} onClick={() => setEditingPolicy(null)}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <button className="edit-btn" style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", marginRight: 8, fontWeight: 600, cursor: "pointer", boxShadow: "0 1px 4px rgba(37,99,235,0.08)" }} onClick={() => handleEdit(policy)}>Edit</button>
                            <button
                              className="delete-btn"
                              style={{ background: deleting === policy._id ? "#f87171" : "#ef4444", color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", fontWeight: 600, cursor: deleting === policy._id ? "not-allowed" : "pointer" }}
                              onClick={() => handleDelete(policy._id)}
                              disabled={deleting === policy._id}
                            >
                              {deleting === policy._id ? "Deleting..." : "Delete"}
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
        }
export default ManagePolicies;
