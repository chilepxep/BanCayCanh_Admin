import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
//import ProductForm from "../../../../components/ProductForm";
import ProductForm from "@/components/ProductForm";
import Spinner from "@/components/Spinner";

export default function EditProductPage() {
    const [productInfo, setProductInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter();
    const { id } = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        setIsLoading(true);
        axios.get('/api/products?id=' + id).then(response => {
            setProductInfo(response.data);
            setIsLoading(false);
        });
    }, [id]);
    return (
        <Layout>
            <h1>Chỉnh sửa sản phẩm</h1>
            {isLoading && (
                <Spinner fullWidth={true}></Spinner>
            )}
            {productInfo && (
                <ProductForm {...productInfo}></ProductForm>
            )}
        </Layout>
    )
}