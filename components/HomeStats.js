import axios from "axios"
import { useEffect, useState } from "react"
import Spinner from "./Spinner";
import { subHours } from "date-fns";


export default function HomeStats() {
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true)
        axios.get('/api/orders').then(res => {
            setOrders(res.data)
            setIsLoading(false)
        })
    }, [])



    function ordersTotal(orders) {
        let sum = 0;
        orders.forEach(order => {
            const { line_items } = order
            line_items.forEach(li => {
                //const lineSum = li.quantity * li.price_data.unit_amount / 100;
                const lineSum = li.quantity * li.price_data.unit_amount;
                sum += lineSum;
            })
        });
        return new Intl.NumberFormat('vi-VN').format(sum);;
    }
    if (isLoading) {
        return (
            <div className="my-4">
                <Spinner fullWidth={true}></Spinner>
            </div>

        )
    }

    const ordersToday = orders.filter(o => new Date(o.createdAt) > subHours(new Date, 24));
    const ordersWeek = orders.filter(o => new Date(o.createdAt) > subHours(new Date, 24 * 7));
    const ordersMonth = orders.filter(o => new Date(o.createdAt) > subHours(new Date, 24 * 30));
    return (
        <div>
            <h2>Đơn hàng</h2>
            <div className="tile-grid">
                <div className=" tile">
                    <h3 className="tile-header">Ngày hôm nay</h3>
                    <div className="tile-number">{ordersToday.length}</div>
                    <div className="tile-desc">có {ordersToday.length} đơn đặt hàng hôm nay</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">Tuần này</h3>
                    <div className="tile-number">{ordersWeek.length}</div>
                    <div className="tile-desc">có {ordersWeek.length} đơn đặt hàng tuần này</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">Tháng này</h3>
                    <div className="tile-number">{ordersMonth.length}</div>
                    <div className="tile-desc">có {ordersMonth.length} đơn đặt hàng tháng này</div>
                </div>
            </div>
            <h2>Doanh thu</h2>
            <div className="tile-grid">
                <div className=" tile">
                    <h3 className="tile-header">Ngày hôm nay</h3>
                    <div className="tile-number"> {ordersTotal(ordersToday)} VNĐ</div>
                    <div className="tile-desc">Doanh thu hôm nay</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">Tuần này</h3>
                    <div className="tile-number">{ordersTotal(ordersWeek)} VNĐ</div>
                    <div className="tile-desc">Doanh thu tuần này</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">Tháng này</h3>
                    <div className="tile-number">{ordersTotal(ordersMonth)} VNĐ</div>
                    <div className="tile-desc">Doanh thu tháng này</div>
                </div>
            </div>
        </div>
    )
}

