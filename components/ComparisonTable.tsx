export default function ComparisonTable({ phones }: any) {
return (
<table border={1} cellPadding={8}>
<thead>
<tr><th>Model</th><th>Price</th><th>Camera</th><th>Battery</th></tr>
</thead>
<tbody>
{phones.map((p: any) => (
<tr key={p.id}>
<td>{p.brand} {p.model}</td>
<td>₹{p.price}</td>
<td>{p.camera}</td>
<td>{p.battery}</td>
</tr>
))}
</tbody>
</table>
)
}