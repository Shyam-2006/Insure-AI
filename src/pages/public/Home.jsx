import Navbar from "../../components/Navbar";
import { useRef, useState, useEffect } from "react";

function Home() {
	const plansRef = useRef(null);
	const [selectedPlan, setSelectedPlan] = useState(null);
	const [heroVisible, setHeroVisible] = useState(false);
	const [plansVisible, setPlansVisible] = useState(false);
	const [featuresVisible, setFeaturesVisible] = useState(false);

	useEffect(() => {
		setTimeout(() => setHeroVisible(true), 100);
		setTimeout(() => setPlansVisible(true), 400);
		setTimeout(() => setFeaturesVisible(true), 800);
	}, []);

	const scrollToPlans = () => {
		plansRef.current.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<div style={{ fontFamily: "Inter, Poppins, Arial, sans-serif", background: "#f6f8fb" }}>
			<Navbar />

			{/* HERO */}
			<section
				style={{
					padding: "120px 20px 100px 20px",
					textAlign: "center",
					color: "white",
					opacity: heroVisible ? 1 : 0,
					transition: "opacity 1s",
					background: `linear-gradient(rgba(30,58,138,0.7), rgba(37,99,235,0.7)), url('https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat`
				}}
			>
				<h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 20, textShadow: "0 2px 8px rgba(0,0,0,0.25)" }}>SecureLife Insurance</h1>
				<p style={{ fontSize: 22, marginBottom: 40, textShadow: "0 2px 8px rgba(0,0,0,0.18)" }}>Protecting your future, today.</p>
				<button style={{
					...viewBtn,
					fontSize: 20,
					padding: "16px 36px",
					fontWeight: 600,
					boxShadow: "0 2px 8px rgba(34,197,94,0.18)"
				}} onClick={scrollToPlans}>
					View Plans
				</button>
			</section>

			{/* PLANS */}
			<section
				ref={plansRef}
				style={{
					padding: "60px",
					textAlign: "center",
					opacity: plansVisible ? 1 : 0,
					transition: "opacity 1s"
				}}
			>
				<h2>Our Plans</h2>

				<div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "28px" }}>

					{/* LIFE */}
					<div
						style={{
							...cardStyle,
							border: "1.5px solid #e0e7ef",
							boxShadow: "0 8px 32px rgba(30,58,138,0.07)",
							transition: "box-shadow 0.2s, transform 0.2s, background 0.2s",
							fontFamily: "inherit",
							background: "linear-gradient(135deg, #fff 80%, #e0e7ef 100%)"
						}}
						onMouseOver={e => {
							e.currentTarget.style.boxShadow = "0 12px 36px rgba(30,58,138,0.13)";
							e.currentTarget.style.transform = "translateY(-6px) scale(1.03)";
							e.currentTarget.style.background = "linear-gradient(135deg, #f1f5fa 70%, #dbeafe 100%)";
						}}
						onMouseOut={e => {
							e.currentTarget.style.boxShadow = "0 8px 32px rgba(30,58,138,0.07)";
							e.currentTarget.style.transform = "none";
							e.currentTarget.style.background = "linear-gradient(135deg, #fff 80%, #e0e7ef 100%)";
						}}
					>
						<img src="https://cdn-icons-png.flaticon.com/512/2910/2910768.png" alt="life" style={{ width: "60px", marginBottom: "10px" }} />
						<h3>Life Insurance</h3>
						<p>Protect your family financially.</p>
						<button style={viewBtn} onClick={() => setSelectedPlan("life")}>View Plan</button>
					</div>

					{/* HEALTH */}
					<div
						style={{
							...cardStyle,
							border: "1.5px solid #e0e7ef",
							boxShadow: "0 8px 32px rgba(30,58,138,0.07)",
							transition: "box-shadow 0.2s, transform 0.2s, background 0.2s",
							fontFamily: "inherit",
							background: "linear-gradient(135deg, #fff 80%, #e0e7ef 100%)"
						}}
						onMouseOver={e => {
							e.currentTarget.style.boxShadow = "0 12px 36px rgba(30,58,138,0.13)";
							e.currentTarget.style.transform = "translateY(-6px) scale(1.03)";
							e.currentTarget.style.background = "linear-gradient(135deg, #f1f5fa 70%, #dbeafe 100%)";
						}}
						onMouseOut={e => {
							e.currentTarget.style.boxShadow = "0 8px 32px rgba(30,58,138,0.07)";
							e.currentTarget.style.transform = "none";
							e.currentTarget.style.background = "linear-gradient(135deg, #fff 80%, #e0e7ef 100%)";
						}}
					>
						<img src="https://cdn-icons-png.flaticon.com/512/2966/2966488.png" alt="health" style={{ width: "60px", marginBottom: "10px" }} />
						<h3>Health Insurance</h3>
						<p>Medical protection for your family.</p>
						<button style={viewBtn} onClick={() => setSelectedPlan("health")}>View Plan</button>
					</div>

					{/* VEHICLE */}
					<div
						style={{
							...cardStyle,
							border: "1.5px solid #e0e7ef",
							boxShadow: "0 8px 32px rgba(30,58,138,0.07)",
							transition: "box-shadow 0.2s, transform 0.2s, background 0.2s",
							fontFamily: "inherit",
							background: "linear-gradient(135deg, #fff 80%, #e0e7ef 100%)"
						}}
						onMouseOver={e => {
							e.currentTarget.style.boxShadow = "0 12px 36px rgba(30,58,138,0.13)";
							e.currentTarget.style.transform = "translateY(-6px) scale(1.03)";
							e.currentTarget.style.background = "linear-gradient(135deg, #f1f5fa 70%, #dbeafe 100%)";
						}}
						onMouseOut={e => {
							e.currentTarget.style.boxShadow = "0 8px 32px rgba(30,58,138,0.07)";
							e.currentTarget.style.transform = "none";
							e.currentTarget.style.background = "linear-gradient(135deg, #fff 80%, #e0e7ef 100%)";
						}}
					>
						<img src="https://cdn-icons-png.flaticon.com/512/744/744465.png" alt="vehicle" style={{ width: "60px", marginBottom: "10px" }} />
						<h3>Vehicle Insurance</h3>
						<p>Protection for your car or bike.</p>
						<button style={viewBtn} onClick={() => setSelectedPlan("vehicle")}>View Plan</button>
					</div>

					{/* TRAVEL */}
					<div
						style={{
							...cardStyle,
							border: "1.5px solid #e0e7ef",
							boxShadow: "0 8px 32px rgba(30,58,138,0.07)",
							transition: "box-shadow 0.2s, transform 0.2s, background 0.2s",
							fontFamily: "inherit",
							background: "linear-gradient(135deg, #fff 80%, #e0e7ef 100%)"
						}}
						onMouseOver={e => {
							e.currentTarget.style.boxShadow = "0 12px 36px rgba(30,58,138,0.13)";
							e.currentTarget.style.transform = "translateY(-6px) scale(1.03)";
							e.currentTarget.style.background = "linear-gradient(135deg, #f1f5fa 70%, #dbeafe 100%)";
						}}
						onMouseOut={e => {
							e.currentTarget.style.boxShadow = "0 8px 32px rgba(30,58,138,0.07)";
							e.currentTarget.style.transform = "none";
							e.currentTarget.style.background = "linear-gradient(135deg, #fff 80%, #e0e7ef 100%)";
						}}
					>
						<img src="https://cdn-icons-png.flaticon.com/512/201/201623.png" alt="travel" style={{ width: "60px", marginBottom: "10px" }} />
						<h3>Travel Insurance</h3>
						<p>Safe and secure journeys.</p>
						<button style={viewBtn} onClick={() => setSelectedPlan("travel")}>View Plan</button>
					</div>

				</div>

				{/* PLAN DETAILS */}
				{selectedPlan && (
					<div style={{
						marginTop: "40px",
						background: "white",
						padding: "30px",
						borderRadius: "10px",
						boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
						maxWidth: "800px",
						marginLeft: "auto",
						marginRight: "auto"
					}}>

						{selectedPlan === "life" && (
							<>
								<h3>Life Insurance Details</h3>
								<ul style={listStyle}>
									<li>Coverage up to ₹10,00,000</li>
									<li>Low monthly premium</li>
									<li>Family financial protection</li>
									<li>Easy claim process</li>
								</ul>
							</>
						)}

						{selectedPlan === "health" && (
							<>
								<h3>Health Insurance Details</h3>
								<ul style={listStyle}>
									<li>Hospital coverage up to ₹5,00,000</li>
									<li>Cashless treatment</li>
									<li>Doctor consultation coverage</li>
									<li>Family protection plans</li>
								</ul>
							</>
						)}

						{selectedPlan === "vehicle" && (
							<>
								<h3>Vehicle Insurance Details</h3>
								<ul style={listStyle}>
									<li>Accident damage coverage</li>
									<li>Theft protection</li>
									<li>Third-party liability cover</li>
									<li>24/7 roadside assistance</li>
								</ul>
							</>
						)}

						{selectedPlan === "travel" && (
							<>
								<h3>Travel Insurance Details</h3>
								<ul style={listStyle}>
									<li>Medical emergency coverage</li>
									<li>Trip cancellation protection</li>
									<li>Lost luggage compensation</li>
									<li>International travel coverage</li>
								</ul>
							</>
						)}

					</div>
				)}

			</section>

			{/* FEATURES */}
			<section
				style={{
					padding: "80px 40px",
					textAlign: "center",
					opacity: featuresVisible ? 1 : 0,
					transform: featuresVisible ? "translateY(0)" : "translateY(40px)",
					transition: "opacity 1s, transform 1s"
				}}
			>
				<h2>Why Choose SecureLife?</h2>
				<img
					src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80"
					alt="Insurance Family Protection"
					style={{
						width: "100%",
						maxWidth: 400,
						borderRadius: 14,
						boxShadow: "0 4px 18px rgba(0,0,0,0.10)",
						margin: "32px auto 40px auto",
						display: "block"
					}}
				/>
				<div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "25px", marginTop: "40px" }}>
					<div style={featureCard}>
						<h3>Fast Claim Processing</h3>
						<p>Quick and easy claim approval.</p>
					</div>

					<div style={featureCard}>
						<h3>Affordable Premiums</h3>
						<p>Flexible premium plans.</p>
					</div>

					<div style={featureCard}>
						<h3>24/7 Support</h3>
						<p>Always available for help.</p>
					</div>

					<div style={featureCard}>
						<h3>Trusted by Thousands</h3>
						<p>Reliable insurance services.</p>
					</div>
				</div>
			</section>

			{/* FOOTER */}
			<footer
				style={{
					background: `linear-gradient(rgba(30,58,138,0.85), rgba(37,99,235,0.85)), url('https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat`,
					color: "white",
					textAlign: "center",
					padding: "40px 20px 24px 20px",
					marginTop: 60
				}}
			>
				<p style={{ fontSize: 18, fontWeight: 500, marginBottom: 12 }}>© 2026 SecureLife Insurance. All Rights Reserved.</p>
				<p style={{ fontSize: 14, opacity: 0.85 }}>Your trusted partner in protection and peace of mind.</p>
			</footer>
		</div>
	);
}

const cardStyle = {
	background: "white",
	padding: "25px",
	borderRadius: "12px",
	boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
	textAlign: "center"
};

const viewBtn = {
	background: "linear-gradient(90deg, #2563eb 60%, #1e40af 100%)",
	color: "white",
	border: "none",
	padding: "10px 18px",
	marginTop: "10px",
	borderRadius: "8px",
	cursor: "pointer",
	fontWeight: 600,
	letterSpacing: 0.2,
	boxShadow: "0 2px 8px rgba(37,99,235,0.10)",
	transition: "background 0.2s, box-shadow 0.2s, transform 0.2s"
};

const featureCard = {
	background: "white",
	padding: "25px",
	borderRadius: "10px",
	boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
};

const listStyle = {
	textAlign: "left",
	marginTop: "15px",
	lineHeight: "1.8"
};

export default Home;