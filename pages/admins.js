import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import { prettyDate } from "@/lib/date";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import Button from '@mui/material/Button';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

function AdminPage({ swal }) {

    const [email, setEmail] = useState('');
    const [adminEmails, setAdminEmails] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    function addAdmin(ev) {
        ev.preventDefault();
        axios.post('/api/admins', { email }).then(res => {
            swal.fire({
                title: 'Tạo quản trị viên thành công!',
                icon: 'success',
            })
            setEmail('');
            loadAdmins();
        }).catch(err => {
            swal.fire({
                title: 'Lỗi hệ thống!',
                text: err.response.data.message,
                icon: 'error',
            })
        });
    }
    function loadAdmins() {
        setIsLoading(true);
        axios.get('/api/admins').then(res => {
            setAdminEmails(res.data);
            setIsLoading(false);
        });

    }
    function deleteAdmin(_id, email) {
        swal.fire({
            title: 'Thông báo xóa!',
            text: `Bạn có muốn xóa Admin ${email} ?`,
            showCancelButton: true,
            cancelButtonText: 'Hủy',
            confirmButtonText: 'Xác nhận xóa!',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(async result => {
            if (result.isConfirmed) {
                axios.delete('/api/admins?_id=' + _id).then(() => {
                    swal.fire({
                        title: 'Xóa thành công!',
                        icon: 'success',
                    });
                    loadAdmins();
                });
            }
        });
    }
    useEffect(() => {
        loadAdmins();
    }, [])
    return (
        <Layout>
            <h1>Quản trị viên</h1>
            <h2>Thêm quản trị viên</h2>
            <form onSubmit={addAdmin}>
                <div className="flex gap-2">
                    <input type="text" value={email} className="mb-0" placeholder="google email" style={{ width: '85%', padding: '5px' }}
                        onChange={ev => setEmail(ev.target.value)}
                    ></input>
                    <Button type="submit" variant="contained" startIcon={<AddOutlinedIcon />} sx={{
                        color: '#ffff', borderColor: '#26a69a', background: '#26a69a', textTransform: 'none', '&:hover': {
                            background: '#00897b', // Màu sắc khi hover
                        },
                    }} size="medium">
                        Thêm quản trị viên
                    </Button>
                </div>
            </form>
            <table className="basic">
                <thead>
                    <tr>
                        <th style={{ paddingTop: '32px' }} className="text-left">Google Email</th>
                        <th></th>
                        <th></th>
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
                    {adminEmails.length > 0 && adminEmails.map((adminEmail, index) => (
                        <tr key={index}>
                            <td>{adminEmail.email}</td>
                            <td>
                                {adminEmail.createdAt &&
                                    prettyDate(adminEmail.createdAt)}</td>
                            <td>
                                <Button onClick={() => deleteAdmin(adminEmail._id, adminEmail.email)} variant="text" startIcon={<DeleteOutlineOutlinedIcon />} sx={{
                                    color: '#ffff', borderColor: '#e91e63', background: '#e91e63', textTransform: 'none', '&:hover': {
                                        background: '#d81b60', // Màu sắc khi hover
                                    },
                                }} size="small">
                                    Xóa
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}

export default withSwal(({ swal }) => (
    <AdminPage swal={swal}></AdminPage>
))