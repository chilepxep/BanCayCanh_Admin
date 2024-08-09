import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';
import Spinner from "@/components/Spinner";
import Button from '@mui/material/Button';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

function Categories({ swal }) {
    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        fetchCategories();
    }, [])
    function fetchCategories() {
        setIsLoading(true)
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
            setIsLoading(false);
        });
    }
    async function saveCategory(ev) {
        ev.preventDefault();
        const data = {
            name,
            parentCategory,
            properties: properties.map(p => ({
                name: p.name,
                values: p.values.split(','),
            })),
        };
        if (editedCategory) {
            data._id = editedCategory._id;
            await axios.put('/api/categories', data);
            setEditedCategory(null);
        } else {
            await axios.post('/api/categories', data);
        }
        setName('');
        setParentCategory('');
        setProperties([]);
        fetchCategories();
    }
    function editCategory(category) {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(
            category.properties.map(({ name, values }) => ({
                name,
                values: values.join(',')
            }))
        );
    }
    function deleteCategory(category) {
        swal.fire({
            title: 'Thông báo xóa!',
            text: `Bạn có muốn xóa danh mục ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: 'Hủy',
            confirmButtonText: 'Xác nhận xóa!',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(async result => {
            if (result.isConfirmed) {
                const { _id } = category;
                await axios.delete('/api/categories?_id=' + _id);
                fetchCategories();
            }
        });
    }
    function addProperty() {
        setProperties(prev => {
            return [...prev, { name: '', values: '' }];
        });
    }
    function handlePropertyNameChange(index, property, newName) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        });
    }
    function handlePropertyValuesChange(index, property, newValues) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        });
    }
    function removeProperty(indexToRemove) {
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove;
            });
        });
    }
    return (
        <Layout>
            <h1>Danh mục sản phẩm</h1>
            <label style={{ fontSize: '1.1em' }}>
                {editedCategory
                    ? `Chỉnh sửa danh mục ${editedCategory.name}`
                    : 'Tên danh mục'}
            </label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1">
                    <input
                        type="text"
                        placeholder={'Tên loại cây'}
                        onChange={ev => setName(ev.target.value)}
                        value={name} />
                    <select
                        onChange={ev => setParentCategory(ev.target.value)}
                        value={parentCategory}>
                        <option value="">Chưa có danh loại cây</option>
                        {categories.length > 0 && categories.map(category => (
                            <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-2">
                    <label style={{ fontSize: '1.1em' }} className="block">Đặc điểm</label>
                    <Button onClick={addProperty}

                        type="button" variant="contained" startIcon={<AddOutlinedIcon />} sx={{
                            marginTop: 2, marginBottom: 2,
                            color: '#ffff', borderColor: '#26a69a', background: '#26a69a', textTransform: 'none', '&:hover': {
                                background: '#00897b', // Màu sắc khi hover
                            },
                        }} size="medium">
                        Thêm đặc điểm
                    </Button>
                    {properties.length > 0 && properties.map((property, index) => (
                        <div key={index} className="flex gap-1 mb-2">
                            <input type="text"
                                value={property.name}
                                className="mb-0"
                                onChange={ev => handlePropertyNameChange(index, property, ev.target.value)}
                                placeholder="Đặc điểm về...(Đất)" ></input>
                            <input type="text"
                                className="mb-0"
                                onChange={ev =>
                                    handlePropertyValuesChange(
                                        index,
                                        property, ev.target.value
                                    )}
                                value={property.values}
                                placeholder="Nội dung,..(phù sa,phèn chua,..)" ></input>

                            <Button onClick={() => removeProperty(index)}
                                type="button" variant="text" startIcon={<DeleteOutlineOutlinedIcon />} sx={{
                                    color: '#ffff', borderColor: '#e91e63', background: '#e91e63', textTransform: 'none', '&:hover': {
                                        background: '#d81b60', // Màu sắc khi hover
                                    },
                                }} size="small">
                                Xóa
                            </Button>

                        </div>
                    ))}
                </div>
                <div className="flex gap-1">
                    {editedCategory && (
                        <Button type="button"
                            onClick={() => {
                                setEditedCategory(null);
                                setName('');
                                setParentCategory('');
                                setProperties([]);
                            }} variant="contained" startIcon={<CloseOutlinedIcon />} sx={{
                                color: '#e91e63', borderColor: '#ffb74d', background: '#ffff', textTransform: 'none', marginRight: 3, marginTop: 3, '&:hover': {
                                    background: '#e0e0e0', // Màu sắc khi hover
                                },
                            }} size="small">
                            Hủy
                        </Button>
                    )}
                    {properties.length > 0 && <Button type="submit" variant="contained" startIcon={<SaveRoundedIcon />} sx={{
                        color: '#ffff', borderColor: '#448aff', background: '#448aff', textTransform: 'none', marginTop: 3, '&:hover': {
                            background: '#0288d1', // Màu sắc khi hover
                        },
                    }} size="medium">
                        Lưu
                    </Button>}
                </div>
            </form>
            {!editedCategory && (
                <table className="basic mt-4">
                    <thead>
                        <tr>
                            <td className="font-bold">Tên loại</td>
                            <td className="font-bold">Loại cây</td>
                            <td className="font-bold">Chức năng</td>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && (
                            <tr>
                                <td colSpan={3}>
                                    <div className="py-4">
                                        <Spinner fullWidth={true}></Spinner>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {categories.length > 0 && categories.map(category => (
                            <tr key={category._id}>
                                <td>{category.name}</td>
                                <td>{category?.parent?.name}</td>
                                <td>
                                    <Button onClick={() => editCategory(category)} variant="contained" startIcon={<EditOutlinedIcon />} sx={{ color: '#ffff', borderColor: '#448aff', background: '#448aff', textTransform: 'none', marginRight: 3, }} size="small">
                                        Sửa
                                    </Button>
                                    <Button onClick={() => deleteCategory(category)} variant="text" startIcon={<DeleteOutlineOutlinedIcon />} sx={{
                                        color: '#ffff', borderColor: '#e91e63', background: '#e91e63', textTransform: 'none', marginRight: 3, '&:hover': {
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
            )}
        </Layout>
    );
}

export default withSwal(({ swal }, ref) => (
    <Categories swal={swal} />
));