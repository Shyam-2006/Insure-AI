import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import "../../App.css";

function Claims() {
	const [claims, setClaims] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [showForm, setShowForm] = useState(false);
	const [formData, setFormData] = useState({ policy: "", amount: "", description: "" });
	const [file, setFile] = useState(null);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		const fetchClaims = async () => {
			setLoading(true);
			setError("");
			try {
				const user = JSON.parse(localStorage.getItem("user"));
				if (!user) {
					setError("Please login to view your claims.");
					setLoading(false);
					return;
				}
				const res = await fetch("http://localhost:5000/api/claims", {
					headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
				});
				const data = await res.json();
				if (!res.ok) {
					setError(data.message || "Failed to fetch claims");
				} else {
					const myClaims = data.filter(claim => claim.user._id === user.id);
					setClaims(myClaims);
				}
			} catch (err) {
				setError("Server error. Please try again later.");
			}
			setLoading(false);
		};
		fetchClaims();
	}, []);

	const handleFormChange = e => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleFileChange = e => {
		setFile(e.target.files[0]);
	};

	const handleSubmit = async e => {
		e.preventDefault();
		setSubmitting(true);
		let documentUrl = "";
		try {
			if (file) {
				const form = new FormData();
				form.append("document", file);
				const uploadRes = await fetch("http://localhost:5000/api/claims/upload", {
					method: "POST",
					headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
					body: form
				});
				if (uploadRes.ok) {
					const data = await uploadRes.json();
					documentUrl = data.filePath;
				} else {
					alert("File upload failed");
					setSubmitting(false);
					return;
				}
			}
			const user = JSON.parse(localStorage.getItem("user"));
			const res = await fetch("http://localhost:5000/api/claims", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`
				},
				body: JSON.stringify({
					user: user.id,
					policy: formData.policy,
					amount: formData.amount,
					description: formData.description,
					document: documentUrl
				})
			});
			if (res.ok) {
				alert("Claim submitted successfully!");
				setShowForm(false);
				setFormData({ policy: "", amount: "", description: "" });
				setFile(null);
				// Refresh claims
				const claimsRes = await fetch("http://localhost:5000/api/claims", {
					headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
				});
				const claimsData = await claimsRes.json();
				const myClaims = claimsData.filter(claim => claim.user._id === user.id);
				setClaims(myClaims);
			} else {
				const data = await res.json();
				alert(data.message || "Claim submission failed");
			}
		} catch {
			alert("Server error. Please try again later.");
		}
		setSubmitting(false);
	};

	return (
		<>
			<Navbar />
			<div className="policies-container">
				<h1>My Claims</h1>
				<button style={{ marginBottom: 16 }} onClick={() => setShowForm(f => !f)}>
					{showForm ? "Cancel" : "Submit New Claim"}
				</button>
				{showForm && (
					<form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
						<div>
							<label>Policy ID:</label>
							<input name="policy" value={formData.policy} onChange={handleFormChange} required />
						</div>
						<div>
							<label>Amount:</label>
							<input name="amount" type="number" value={formData.amount} onChange={handleFormChange} required />
						</div>
						<div>
							<label>Description:</label>
							<input name="description" value={formData.description} onChange={handleFormChange} required />
						</div>
						<div>
							<label>Document (optional):</label>
							<input type="file" accept="application/pdf,image/*" onChange={handleFileChange} />
						</div>
						<button type="submit" disabled={submitting}>{submitting ? "Submitting..." : "Submit Claim"}</button>
					</form>
				)}
				{loading ? (
					<div>Loading...</div>
				) : error ? (
					<div style={{ color: "red" }}>{error}</div>
				) : claims.length === 0 ? (
					<div>You have not submitted any claims yet.</div>
				) : (
					<table className="activity-table">
						<thead>
							<tr>
								<th>Policy</th>
								<th>Amount</th>
								<th>Description</th>
								<th>Status</th>
								<th>Document</th>
							</tr>
						</thead>
						<tbody>
							{claims.map((c, i) => (
								<tr key={i}>
									<td>{c.policy?.name || "-"}</td>
									<td>₹{c.amount}</td>
									<td>{c.description}</td>
									<td>{c.status}</td>
									<td>
										{c.document ? (
											<a href={c.document} target="_blank" rel="noopener noreferrer">View</a>
										) : "-"}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</>
	);
}

export default Claims;
