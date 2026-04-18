import { Link } from "react-router-dom";

function Sidebar(){

return(

<div style={{
width:"220px",
background:"#1e3a8a",
color:"white",
minHeight:"100vh",
padding:"20px"
}}>

<h2 style={{marginBottom:"30px"}}>
Admin Panel
</h2>

<ul style={{
listStyle:"none",
padding:"0",
display:"flex",
flexDirection:"column",
gap:"15px"
}}>

<li>
<Link to="/admin-dashboard" style={linkStyle}>
Dashboard
</Link>
</li>

<li>
<Link to="/users" style={linkStyle}>
Users
</Link>
</li>

<li>
<Link to="/policies" style={linkStyle}>
Policies
</Link>
</li>

<li>
<Link to="/claims" style={linkStyle}>
Claims
</Link>
</li>

<li>
<Link to="/notifications" style={linkStyle}>
Notifications
</Link>
</li>

<li>
<Link to="/admin" style={linkStyle}>
Logout
</Link>
</li>

</ul>

</div>

)

}

const linkStyle={
color:"white",
textDecoration:"none",
fontSize:"16px",
padding:"8px",
display:"block"
};

export default Sidebar;