import Layout from "@/components/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Spinner from "@/components/Spinner";
import Button from '@mui/material/Button';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
export default function Products() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true)
        axios.get('/api/products').then(Response => {

            setProducts(Response.data);
            setIsLoading(false);
        });
    }, []);
    return (
        <Layout>
            <h1>Danh sách sản phẩm</h1>
            <Link
                href={'/products/new'}>
                <Button variant="contained" startIcon={<AddOutlinedIcon />} sx={{
                    color: '#ffff', borderColor: '#26a69a', background: '#26a69a', textTransform: 'none', '&:hover': {
                        background: '#00897b', // Màu sắc khi hover
                    },
                }} size="medium">
                    Thêm sản phẩm
                </Button>

            </Link>
            <table className="basic mt-12">
                <thead>
                    <tr>
                        <td className="font-bold">Tên sản phẩm</td>
                        <td className="font-bold">Giá tiền</td>
                        <td className="font-bold">Chức năng</td>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={2}>
                                <div className="py-8">
                                    <Spinner fullWidth={true}></Spinner>
                                </div>
                            </td>
                        </tr>
                    )}

                    {products.map(product => (
                        <tr key={product._id}>
                            <td>{product.title}</td>
                            <td>{product.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                            <td>
                                <Link href={'/products/edit/' + product._id}>
                                    <Button variant="contained" startIcon={<EditOutlinedIcon />} sx={{ color: '#ffff', borderColor: '#448aff', background: '#448aff', textTransform: 'none' }} size="small">
                                        Sửa
                                    </Button>
                                </Link>

                                <Link href={'/products/delete/' + product._id}>
                                    <Button variant="text" startIcon={<DeleteOutlineOutlinedIcon />} sx={{
                                        color: '#ffff', borderColor: '#e91e63', background: '#e91e63', textTransform: 'none', '&:hover': {
                                            background: '#d81b60', // Màu sắc khi hover
                                        },
                                    }} size="small">
                                        Xóa
                                    </Button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </Layout>

    );
}