import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";



export default function OrdersPage() {
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true)
        axios.get('/api/orders').then(response => {
            setOrders(response.data);
            setIsLoading(false)
        })
    }, [])
    return (
        <Layout>
            <h1>Đơn hàng</h1>
            <table className="basic">
                <thead>
                    <tr>
                        <th>Ngày</th>
                        <th>Người đặt</th>
                        <th>Sản phẩm</th>
                        <th>Ghi chú</th>
                        <th>Thanh toán</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={5}>
                                <div className="py-8">
                                    <Spinner fullWidth={true}></Spinner>
                                </div>
                            </td>
                        </tr>
                    )}
                    {orders.length > 0 && orders.map(order => (
                        <tr key={''}>
                            <td>{(new Date(order.createdAt))
                                .toLocaleString()}</td>
                            <td>{order.name} | {order.phone} <br></br>
                                {order.address} <br></br>
                                {order.email}
                            </td>
                            <td>
                                {order.line_items.map(l => (
                                    <>
                                        {l.price_data?.product_data.name} x {l.quantity}
                                    </>
                                ))}
                            </td>
                            <td>{order.note}</td>
                            <td className={order.paid ? 'text-green-600' : 'text-red-600'}>
                                {order.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}