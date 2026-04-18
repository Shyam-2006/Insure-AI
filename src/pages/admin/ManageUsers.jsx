
import React, { useEffect, useState } from "react";
import { useNotification } from "../../components/NotificationProvider";
import Sidebar from "../../components/Sidebar";

function ManageUsers() {
	const { showNotification } = useNotification();
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [deleting, setDeleting] = useState("");
	const [editingUser, setEditingUser] = useState(null);
	const [editFormData, setEditFormData] = useState({ name: "", email: "" });
	const [searchTerm, setSearchTerm] = useState("");

	const fetchUsers = async () => {
		setLoading(true);
		setError("");
		try {
			const res = await fetch("http://localhost:5000/api/users", {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
			});
			const data = await res.json();
			if (!res.ok) setError(data.message || "Failed to fetch users");
			else setUsers(data);
		} catch (err) {
			setError("Server error. Please try again later.");
		}
		setLoading(false);
	};

	useEffect(() => { fetchUsers(); }, []);

	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this user?")) return;
		setDeleting(id);
		try {
			const res = await fetch(`http://localhost:5000/api/users/${id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
			});
			if (res.ok) {
				setUsers(users.filter(u => u._id !== id));
				showNotification("User deleted successfully!", "success");
			} else {
				const data = await res.json();
				showNotification(data.message || "Delete failed", "error");
			}
		} catch {
			showNotification("Server error. Please try again later.", "error");
		}
		setDeleting("");
	};

	const handleEdit = (user) => {
		setEditingUser(user._id);
		setEditFormData({ name: user.name, email: user.email });
	};

	const handleSaveEdit = async () => {
		try {
			const res = await fetch(`http://localhost:5000/api/users/${editingUser}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`
				},
				body: JSON.stringify(editFormData)
			});
			if (res.ok) {
				const updatedUser = await res.json();
				setUsers(users.map(u => u._id === editingUser ? updatedUser : u));
				setEditingUser(null);
				showNotification("User updated successfully!", "success");
			} else {
				const data = await res.json();
				showNotification(data.message || "Edit failed", "error");
			}
		} catch {
			showNotification("Server error. Please try again later.", "error");
		}
	};

	return (
		<div style={{ display: "flex", background: "#f4f6fb", minHeight: "100vh" }}>
			<Sidebar />
			<div style={{ flex: 1, padding: "30px" }}>
				<h1>Manage Users</h1>
				<p style={{ marginBottom: "20px", color: "#555" }}>
					View and manage registered users
				</p>

				<input
					type="text"
					placeholder="Search by name or email..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					style={{ padding: "10px", marginBottom: "20px", width: "100%", maxWidth: "400px" }}
				/>

				{loading ? (
					<div>Loading...</div>
				) : error ? (
					<div style={{ color: "red" }}>{error}</div>
				) : (
					<table style={tableStyle}>
						<thead>
							<tr style={{ background: "#1e3a8a", color: "white" }}>
								<th style={thtd}>User ID</th>
								<th style={thtd}>Name</th>
								<th style={thtd}>Email</th>
								<th style={thtd}>Action</th>
							</tr>
						</thead>
						<tbody>
							{users.filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
								<tr><td colSpan={4} style={thtd}>No users found</td></tr>
							) : users.filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase())).map(u => (
								<tr key={u._id}>
									<td style={thtd}>{u._id}</td>
									<td style={thtd}>
										{editingUser === u._id ? (
											<input
												value={editFormData.name}
												onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
											/>
										) : u.name}
									</td>
									<td style={thtd}>
										{editingUser === u._id ? (
											<input
												value={editFormData.email}
												onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
											/>
										) : u.email}
									</td>
									<td style={thtd}>
										{editingUser === u._id ? (
											<>
												<button style={saveBtn} onClick={handleSaveEdit}>Save</button>
												<button style={cancelBtn} onClick={() => setEditingUser(null)}>Cancel</button>
											</>
										) : (
											<>
												<button style={editBtn} onClick={() => handleEdit(u)}>Edit</button>
												<button
													style={deleteBtn}
													onClick={() => handleDelete(u._id)}
													disabled={deleting === u._id}
												>
													{deleting === u._id ? "Deleting..." : "Delete"}
												</button>
											</>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}

const tableStyle = {
	width: "100%",
	borderCollapse: "collapse",
	background: "white",
	marginTop: "20px"
}

const thtd = {
	padding: "12px",
	border: "1px solid #ddd",
	textAlign: "left"
}

const deleteBtn = {
	background: "#ef4444",
	color: "white",
	border: "none",
	padding: "6px 12px",
	borderRadius: "5px",
	cursor: "pointer",
	marginLeft: "5px"
}

const editBtn = {
	background: "#3b82f6",
	color: "white",
	border: "none",
	padding: "6px 12px",
	borderRadius: "5px",
	cursor: "pointer",
}

const saveBtn = {
	background: "#10b981",
	color: "white",
	border: "none",
	padding: "6px 12px",
	borderRadius: "5px",
	cursor: "pointer",
}

const cancelBtn = {
	background: "#6b7280",
	color: "white",
	border: "none",
	padding: "6px 12px",
	borderRadius: "5px",
	cursor: "pointer",
	marginLeft: "5px"
}

export default ManageUsers;