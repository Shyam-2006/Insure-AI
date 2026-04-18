
import React, { useEffect, useState } from "react";
import { useNotification } from "../../components/NotificationProvider";
import Sidebar from "../../components/Sidebar";

function ClaimsManagement() {
	const { showNotification } = useNotification();
	const [claims, setClaims] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [updating, setUpdating] = useState("");
	const [editingClaim, setEditingClaim] = useState(null);
	const [editFormData, setEditFormData] = useState({ amount: "", status: "", document: "" });
	const [file, setFile] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");

	const fetchClaims = async () => {
		setLoading(true);
		setError("");
		try {
			const res = await fetch("http://localhost:5000/api/claims", {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
			});
			const data = await res.json();
			if (!res.ok) setError(data.message || "Failed to fetch claims");
			else setClaims(data);
		} catch (err) {
			setError("Server error. Please try again later.");
		}
		setLoading(false);
	};

	useEffect(() => { fetchClaims(); }, []);

	const handleUpdate = async (id, status) => {
		setUpdating(id + status);
		try {
			const res = await fetch(`http://localhost:5000/api/claims/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`
				},
				body: JSON.stringify({ status })
			});
			if (res.ok) {
				setClaims(claims.map(c => c._id === id ? { ...c, status } : c));
				showNotification("Claim status updated!", "success");
			} else {
				const data = await res.json();
				showNotification(data.message || "Update failed", "error");
			}
		} catch {
			showNotification("Server error. Please try again later.", "error");
		}
		setUpdating("");
	};

	const handleEdit = (claim) => {
		setEditingClaim(claim._id);
		setEditFormData({
			amount: claim.amount,
			status: claim.status,
			document: claim.document || ""
		});
		setFile(null);
	};

	const handleSaveEdit = async () => {
		try {
			let documentUrl = editFormData.document;
			if (file) {
				setUploading(true);
				const formData = new FormData();
				formData.append("document", file);
				const uploadRes = await fetch("http://localhost:5000/api/claims/upload", {
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
			const res = await fetch(`http://localhost:5000/api/claims/${editingClaim}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`
				},
				body: JSON.stringify({ ...editFormData, document: documentUrl })
			});
			if (res.ok) {
				const updatedClaim = await res.json();
				setClaims(claims.map(c => c._id === editingClaim ? { ...c, amount: updatedClaim.amount, status: updatedClaim.status, document: updatedClaim.document } : c));
				setEditingClaim(null);
				setFile(null);
				showNotification("Claim updated successfully!", "success");
			} else {
				const data = await res.json();
				showNotification(data.message || "Update failed", "error");
			}
		} catch {
			setUploading(false);
			showNotification("Server error. Please try again later.", "error");
		}
	};

	const filteredClaims = claims.filter(c => {
		const matchesSearch = (c.user?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
			(c.policy?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus = statusFilter === "all" || c.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	return (
		<div style={{ display: "flex", background: "#f4f6fb", minHeight: "100vh" }}>
			<Sidebar />
			<div style={{ flex: 1, padding: "30px" }}>
				<h1>Claims Management</h1>
				<p style={{ marginBottom: "20px", color: "#555" }}>
					Approve or reject insurance claims
				</p>

				<div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
					<input
						type="text"
						placeholder="Search by user or policy name..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						style={{ padding: "10px", width: "100%", maxWidth: "300px" }}
					/>
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
						style={{ padding: "10px" }}
					>
						<option value="all">All Statuses</option>
						<option value="pending">Pending</option>
						<option value="approved">Approved</option>
						<option value="rejected">Rejected</option>
					</select>
				</div>

				{loading ? (
					<div>Loading...</div>
				) : error ? (
					<div style={{ color: "red" }}>{error}</div>
				) : (
					<table style={tableStyle}>
						<thead>
							<tr style={{ background: "#1e3a8a", color: "white" }}>
								<th style={thtd}>Claim ID</th>
								<th style={thtd}>User</th>
								<th style={thtd}>Policy</th>
								<th style={thtd}>Amount</th>
								<th style={thtd}>Status</th>
								<th style={thtd}>Action</th>
							</tr>
						</thead>
						<tbody>
							{filteredClaims.length === 0 ? (
								<tr><td colSpan={6} style={thtd}>No claims found</td></tr>
							) : filteredClaims.map(claim => (
								<tr key={claim._id}>
									<td style={thtd}>{claim._id}</td>
									<td style={thtd}>{claim.user?.name || "-"}</td>
									<td style={thtd}>{claim.policy?.name || "-"}</td>
									<td style={thtd}>
										{editingClaim === claim._id ? (
											<>
												<input type="number" value={editFormData.amount} onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })} />
												<div style={{ marginTop: 8 }}>
													<input type="file" accept="application/pdf,image/*" onChange={e => setFile(e.target.files[0])} />
													{uploading && <span style={{ marginLeft: 8 }}>Uploading...</span>}
													{editFormData.document && !file && (
														<a href={editFormData.document} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 8 }}>View</a>
													)}
												</div>
											</>
										) : (
											<>
												₹{claim.amount}
												{claim.document && (
													<div><a href={claim.document} target="_blank" rel="noopener noreferrer">View Document</a></div>
												)}
											</>
										)}
									</td>
									<td style={thtd}>
										{editingClaim === claim._id ? (
											<select value={editFormData.status} onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}>
												<option value="pending">pending</option>
												<option value="approved">approved</option>
												<option value="rejected">rejected</option>
											</select>
										) : claim.status}
									</td>
									<td style={thtd}>
										{editingClaim === claim._id ? (
											<>
												<button style={{ ...approveBtn, background: "#10b981" }} onClick={handleSaveEdit}>Save</button>
												<button style={{ ...rejectBtn, background: "#6b7280" }} onClick={() => setEditingClaim(null)}>Cancel</button>
											</>
										) : (
											<>
												<button style={{ ...approveBtn, background: "#3b82f6" }} onClick={() => handleEdit(claim)}>Edit</button>
												{claim.status === "pending" && (
													<>
														<button
															style={approveBtn}
															onClick={() => handleUpdate(claim._id, "approved")}
															disabled={updating === claim._id + "approved"}
														>
															{updating === claim._id + "approved" ? "Approving..." : "Approve"}
														</button>
														<button
															style={rejectBtn}
															onClick={() => handleUpdate(claim._id, "rejected")}
															disabled={updating === claim._id + "rejected"}
														>
															{updating === claim._id + "rejected" ? "Rejecting..." : "Reject"}
														</button>
													</>
												)}
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

const approveBtn = {
	background: "#22c55e",
	color: "white",
	border: "none",
	padding: "6px 12px",
	marginRight: "5px",
	borderRadius: "5px",
	cursor: "pointer"
}

const rejectBtn = {
	background: "#ef4444",
	color: "white",
	border: "none",
	padding: "6px 12px",
	borderRadius: "5px",
	cursor: "pointer"
}

export default ClaimsManagement;