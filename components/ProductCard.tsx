export default function ProductCard({ phone }: any) {
return (
<div style={{ border: "1px solid #ccc", padding: 10, margin: 5 }}>
<b>{phone.brand} {phone.model}</b>
<div>₹{phone.price}</div>
<div>{phone.camera}</div>
<div>{phone.battery}</div>
<small>Why recommended: strong overall balance</small>
</div>
)
}