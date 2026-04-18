
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";

function AdminDashboard() {
	const [stats, setStats] = useState({ userCount: 0, policyCount: 0, claimCount: 0 });
	const [pendingClaims, setPendingClaims] = useState(0);
	const [revenue, setRevenue] = useState(0);
	const [activity, setActivity] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchStats = async () => {
			setLoading(true);
			setError("");
			try {
				// Stats
				const statsRes = await fetch("http://localhost:5000/api/admin/stats", {
					headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
				});
				const statsData = await statsRes.json();
				if (statsRes.ok) setStats(statsData);

				// Claims for revenue and pending
				const claimsRes = await fetch("http://localhost:5000/api/claims", {
					headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
				});
				const claimsData = await claimsRes.json();
				if (claimsRes.ok && Array.isArray(claimsData)) {
					setPendingClaims(claimsData.filter(c => c.status === "pending").length);
					setRevenue(claimsData.filter(c => c.status === "approved").reduce((sum, c) => sum + (Number(c.amount) || 0), 0));
					setActivity(claimsData.slice(-5).reverse());
				}
			} catch (err) {
				setError("Server error. Please try again later.");
			}
			setLoading(false);
		};
		fetchStats();
	}, []);

	return (
		<div style={{ display: "flex", background: "#f4f6fb", minHeight: "100vh" }}>
			{/* Sidebar */}
			<Sidebar />
			{/* Main Content */}
			<div style={{ flex: 1, padding: "30px" }}>
				<h1 style={{ marginBottom: "10px" }}>Admin Dashboard</h1>
				<p style={{ marginBottom: "25px", color: "#555" }}>
					Manage Users and Policies
				</p>
				{loading ? (
					<div>Loading...</div>
				) : error ? (
					<div style={{ color: "red" }}>{error}</div>
				) : (
					<>
						{/* Cards */}
						<div style={{
							display: "grid",
							gridTemplateColumns: "repeat(4,1fr)",
							gap: "20px"
						}}>
							<div style={cardStyle}>
								<h3>Total Users</h3>
								<p>{stats.userCount}</p>
							</div>
							<div style={cardStyle}>
								<h3>Policies Sold</h3>
								<p>{stats.policyCount}</p>
							</div>
							<div style={cardStyle}>
								<h3>Total Revenue</h3>
								<p>₹{revenue}</p>
							</div>
							<div style={cardStyle}>
								<h3>Pending Claims</h3>
								<p>{pendingClaims}</p>
							</div>
						</div>
						<h2 style={{ marginTop: "40px" }}>Recent Activity</h2>
						<table style={tableStyle}>
							<thead>
								<tr style={{ background: "#1e3a8a", color: "white" }}>
									<th style={thtd}>User</th>
									<th style={thtd}>Policy</th>
									<th style={thtd}>Status</th>
								</tr>
							</thead>
							<tbody>
								{activity.length === 0 ? (
									<tr><td colSpan={3} style={thtd}>No recent activity</td></tr>
								) : activity.map((a, i) => (
									<tr key={i}>
										<td style={thtd}>{a.user?.name || "-"}</td>
										<td style={thtd}>{a.policy?.name || "-"}</td>
										<td style={thtd}>{a.status}</td>
									</tr>
								))}
							</tbody>
						</table>
					</>
				)}
			</div>
		</div>
	);
}

/* Card Style */

const cardStyle={
background:"white",
padding:"20px",
borderRadius:"8px",
boxShadow:"0 5px 15px rgba(0,0,0,0.1)",
textAlign:"center"
};

/* Table Style */

const tableStyle={
width:"100%",
marginTop:"20px",
borderCollapse:"collapse",
background:"white"
};

const thtd={
padding:"12px",
border:"1px solid #ddd",
textAlign:"left"
};

export default AdminDashboard;