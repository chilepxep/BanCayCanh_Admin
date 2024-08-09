import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Button from '@mui/material/Button';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

export default function DeleteProductPage() {
    const router = useRouter();
    const [productInfo, setProductInfo] = useState();
    const { id } = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/products?id=' + id).then(Response => {
            setProductInfo(Response.data);
        });
    }, [id]);
    function goBack() {
        router.push('/products');
    }
    async function DeleteProduct() {
        await axios.delete('/api/products?id=' + id);
        goBack();
    }
    return (
        <Layout>
            <h1 className="text-center">Bạn muốn xóa sản phẩm &nbsp; {productInfo?.title} ?</h1>
            <div className="flex gap-3 justify-center">
                <Button onClick={DeleteProduct} variant="text" startIcon={<DeleteOutlineOutlinedIcon />} sx={{
                    color: '#ffff', borderColor: '#e91e63', background: '#e91e63', textTransform: 'none', '&:hover': {
                        background: '#d81b60', // Màu sắc khi hover
                    },
                }} size="small">
                    Xóa
                </Button>
                <Button variant="contained" startIcon={<CloseOutlinedIcon />} sx={{
                    color: '#e91e63', borderColor: '#ffb74d', background: '#ffff', textTransform: 'none', '&:hover': {
                        background: '#e0e0e0', // Màu sắc khi hover
                    },
                }} size="small">
                    Hủy
                </Button>
            </div>
        </Layout>
    );
}