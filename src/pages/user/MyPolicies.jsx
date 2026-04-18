import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import "../../App.css";

function MyPolicies() {
	const [policies, setPolicies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchPolicies = async () => {
			setLoading(true);
			setError("");
			try {
				const user = JSON.parse(localStorage.getItem("user"));
				if (!user) {
					setError("Please login to view your policies.");
					setLoading(false);
					return;
				}
				const res = await fetch("http://localhost:5000/api/claims", {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`
					}
				});
				const data = await res.json();
				if (!res.ok) {
					setError(data.message || "Failed to fetch policies");
				} else {
					// Filter claims for this user
					const myClaims = data.filter(claim => claim.user._id === user.id);
					setPolicies(myClaims);
				}
			} catch (err) {
				setError("Server error. Please try again later.");
			}
			setLoading(false);
		};
		fetchPolicies();
	}, []);

	return (
		<>
			<Navbar />
			<div className="policies-container">
				<h1>My Policies</h1>
				{loading ? (
					<div>Loading...</div>
				) : error ? (
					<div style={{ color: "red" }}>{error}</div>
				) : policies.length === 0 ? (
					<div>You have not purchased any policies yet.</div>
				) : (
					<table className="activity-table">
						<thead>
							<tr>
								<th>Policy Name</th>
								<th>Coverage</th>
								<th>Description</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							{policies.map((p, index) => (
								<tr key={index}>
									<td>{p.policy?.name || "-"}</td>
									<td>₹{p.amount}</td>
									<td>{p.description}</td>
									<td>{p.status}</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</>
	);
}

export default MyPolicies;