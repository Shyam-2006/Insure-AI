import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import "../../App.css";

function BuyPolicy() {
	const [policies, setPolicies] = useState([]);
	const [selectedPolicy, setSelectedPolicy] = useState("");
	const [coverage, setCoverage] = useState("");
	const [duration, setDuration] = useState("");
	const [premium, setPremium] = useState("");
	const [success, setSuccess] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		// Fetch available policies from backend
		fetch("http://localhost:5000/api/policies", {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`
			}
		})
			.then(res => res.json())
			.then(data => {
				if (Array.isArray(data)) setPolicies(data);
			});
	}, []);

	const calculatePremium = () => {
		if (!selectedPolicy || !coverage || !duration) return;
		// Use backend premium if available, else simple calculation
		const policy = policies.find(p => p._id === selectedPolicy);
		if (policy) {
			// Example: premium = (coverage / duration) * (policy.premium / policy.coverage)
			const result = (coverage / duration) * (policy.premium / policy.coverage);
			setPremium(result.toFixed(2));
		}
	};

	const handleBuy = async () => {
		setError("");
		setSuccess("");
		setLoading(true);
		try {
			const user = JSON.parse(localStorage.getItem("user"));
			if (!user) {
				setError("Please login to buy a policy.");
				setLoading(false);
				return;
			}
			const res = await fetch("http://localhost:5000/api/claims", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`
				},
				body: JSON.stringify({
					user: user.id,
					policy: selectedPolicy,
					amount: coverage,
					description: `Duration: ${duration} years`
				})
			});
			const data = await res.json();
			if (!res.ok) {
				setError(data.message || "Purchase failed");
			} else {
				setSuccess("Policy purchased successfully!");
			}
		} catch (err) {
			setError("Server error. Please try again later.");
		}
		setLoading(false);
	};

	return (
		<div>
			<Navbar />
			<div style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "85vh",
				background: "#f4f6fb"
			}}>
				<div style={{
					background: "white",
					padding: "40px",
					borderRadius: "10px",
					boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
					width: "400px",
					display: "flex",
					flexDirection: "column",
					gap: "15px"
				}}>
					<h2 style={{ textAlign: "center" }}>
						Buy Insurance Policy
					</h2>
					<select
						value={selectedPolicy}
						onChange={e => setSelectedPolicy(e.target.value)}
						style={{ padding: "12px" }}
						required
					>
						<option value="">Select Policy</option>
						{policies.map(policy => (
							<option key={policy._id} value={policy._id}>
								{policy.name} (₹{policy.premium}/mo, Coverage: ₹{policy.coverage})
							</option>
						))}
					</select>
					<input
						type="number"
						placeholder="Coverage Amount"
						value={coverage}
						onChange={e => setCoverage(e.target.value)}
						style={{ padding: "12px" }}
						required
					/>
					<input
						type="number"
						placeholder="Duration (Years)"
						value={duration}
						onChange={e => setDuration(e.target.value)}
						style={{ padding: "12px" }}
						required
					/>
					<button
						onClick={calculatePremium}
						style={{
							background: "#2563eb",
							color: "white",
							padding: "12px",
							border: "none",
							borderRadius: "6px"
						}}
						disabled={!selectedPolicy || !coverage || !duration}
					>
						Calculate Premium
					</button>
					{premium && (
						<div style={{
							textAlign: "center",
							fontWeight: "bold",
							color: "#16a34a"
						}}>
							Monthly Premium: ₹{premium}
						</div>
					)}
					<button
						onClick={handleBuy}
						style={{
							background: "#22c55e",
							color: "white",
							padding: "12px",
							border: "none",
							borderRadius: "6px"
						}}
						disabled={loading || !selectedPolicy || !coverage || !duration}
					>
						{loading ? "Processing..." : "Buy Policy"}
					</button>
					{error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
					{success && <div style={{ color: "green", marginTop: 8 }}>{success}</div>}
				</div>
			</div>
		</div>
	);
}

export default BuyPolicy;