import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";
import Button from '@mui/material/Button';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

function SettingsPage({ swal }) {
    const [products, setProducts] = useState([])
    const [featuredProductId, setFeaturedProductId] = useState('');
    const [shippingFree, setShippingFree] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true)
        fecthAll().then(() => {
            setIsLoading(false)
        });
    }, []);

    async function fecthAll() {
        await axios.get('/api/products').then(res => {
            setProducts(res.data)

        });
        await axios.get('/api/settings?name=featuredProductId').then(res => {
            setFeaturedProductId(res.data.value);
        });
        await axios.get('/api/settings?name=shippingFree').then(res => {
            setShippingFree(res.data.value);
        })
    }

    async function saveSettings() {
        setIsLoading(true)
        await axios.put('/api/settings', {
            name: 'featuredProductId',
            value: featuredProductId,
        });

        await axios.put('/api/settings', {
            name: 'shippingFree',
            value: shippingFree,
        });
        setIsLoading(false)
        await swal.fire({
            title: 'Thay đổi sản phẩm nổi bật thành công!',
            icon: 'success'
        })

    }
    return (
        <Layout>
            <h1>Cài đặt</h1>
            {isLoading && (
                <Spinner fullWidth={true}></Spinner>
            )}
            {!isLoading && (
                <>
                    <label style={{ fontSize: '1.1em' }}>Sản phẩm nổi bật</label>
                    <select style={{ marginTop: '1.3rem' }} value={featuredProductId} onChange={ev => setFeaturedProductId(ev.target.value)}>
                        {products.length > 0 && products.map(product => (
                            <option value={product._id} key={product._id}>{product.title}</option>
                        ))}
                    </select>

                    <label style={{ fontSize: '1.1em' }}>Phí vận chuyển</label>
                    <input style={{ marginTop: '1.3rem' }} type="number" value={shippingFree} onChange={ev => setShippingFree(ev.target.value)}></input>
                    <div>
                        <Button onClick={saveSettings} type='button' variant="contained" startIcon={<SaveRoundedIcon />} sx={{
                            color: '#ffff', borderColor: '#26a69a', background: '#26a69a', textTransform: 'none', marginTop: '.8rem', '&:hover': {
                                background: '#00897b', // Màu sắc khi hover
                            },
                        }} size="medium">
                            Lưu
                        </Button>
                    </div>
                </>
            )}
        </Layout>
    )
}

export default withSwal(({ swal }) => (
    <SettingsPage swal={swal}></SettingsPage>
));