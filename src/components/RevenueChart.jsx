import { Line } from "react-chartjs-2";

function RevenueChart(){

const data = {
labels:["Jan","Feb","Mar","Apr","May","Jun"],
datasets:[
{
label:"Revenue",
data:[10000,20000,15000,30000,40000,50000],
borderColor:"blue",
fill:false
}
]
};

return <Line data={data}/>

}

export default RevenueChart;