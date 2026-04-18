import { useState } from "react";
import Navbar from "../../components/Navbar";
import "../../App.css";

function PremiumCalculator() {

  const [age, setAge] = useState("");
  const [coverage, setCoverage] = useState("");
  const [duration, setDuration] = useState("");
  const [premium, setPremium] = useState("");

  const calculatePremium = () => {

    let ageFactor = 1;

    if (age > 50) {
      ageFactor = 1.5;
    }

    const result = (coverage * ageFactor) / (duration * 10);

    setPremium(result.toFixed(2));
  };

  return (

    <div>

      <Navbar />

      <div style={{
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        height:"85vh",
        background:"#f4f6fb"
      }}>

        <div style={{
          background:"white",
          padding:"40px",
          borderRadius:"10px",
          boxShadow:"0 10px 25px rgba(0,0,0,0.1)",
          width:"380px",
          display:"flex",
          flexDirection:"column",
          gap:"15px"
        }}>

          <h2 style={{textAlign:"center"}}>
            Insurance Premium Calculator
          </h2>

          <input
            type="number"
            placeholder="Enter Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            style={{
              padding:"12px",
              border:"1px solid #ccc",
              borderRadius:"6px"
            }}
          />

          <input
            type="number"
            placeholder="Coverage Amount"
            value={coverage}
            onChange={(e) => setCoverage(e.target.value)}
            style={{
              padding:"12px",
              border:"1px solid #ccc",
              borderRadius:"6px"
            }}
          />

          <input
            type="number"
            placeholder="Duration (Years)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            style={{
              padding:"12px",
              border:"1px solid #ccc",
              borderRadius:"6px"
            }}
          />

          <button
            onClick={calculatePremium}
            style={{
              background:"#2563eb",
              color:"white",
              padding:"12px",
              border:"none",
              borderRadius:"6px",
              cursor:"pointer",
              fontSize:"16px"
            }}
          >
            Calculate Premium
          </button>

          {premium && (
            <div style={{
              marginTop:"10px",
              textAlign:"center",
              fontWeight:"bold",
              color:"#16a34a"
            }}>
              Your Monthly Premium: ₹{premium}
            </div>
          )}

        </div>

      </div>

    </div>

  );
}

export default PremiumCalculator;