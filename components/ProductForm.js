import { useEffect, useState } from "react";
import axios from "axios";
import { Router, useRouter } from "next/router";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import Button from '@mui/material/Button';

export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: exstingPrice,
    quantity: exstingQuantity,
    images: existingImages,
    category: assignedCategory,
    properties: assignedProperties,
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [category, setCategory] = useState(assignedCategory || '');
    const [productProperties, setProductProperties] = useState(assignedProperties || {});
    const [price, setPrice] = useState(exstingPrice || '');
    const [quantity, setQuantity] = useState(exstingQuantity || '');
    const [images, setImages] = useState(existingImages || []);
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const router = useRouter();
    useEffect(() => {
        setCategoriesLoading(true)
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
            setCategoriesLoading(false);
        })
    }, []);
    async function saveProduct(ev) {
        ev.preventDefault();
        const data = {
            title, description, price, quantity, images, category,
            properties: productProperties
        };
        if (_id) {
            //update
            const res = await axios.put('/api/products', { ...data, _id });

            if (res.data != null) {
                router.push('/products'); // Chuyển hướng sau khi tạo thành công
            }
        }
        else {
            //create
            const request = async () => {
                const res = await axios.post('/api/products', {
                    ...data,
                    category: category || null, // Đảm bảo category là chuỗi hexa hoặc null
                    _id
                });
                // next
                console.log("data: ", data)
                if (res.data != null) return true;
                return false;
            }

            request().then((isNavigate) => isNavigate && router.push('/products'));
        }

    }

    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append('file', file);
            }
            const res = await axios.post('/api/upload', data);
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            });
            setIsUploading(false);
        }
    }

    function updateImagesOrder(images) {
        setImages(images);
    }

    const propertiesToFill = [];
    if (categories.length > 0 && category) {
        let catInfo = categories.find(({ _id }) => _id === category);
        propertiesToFill.push(...catInfo.properties);
        while (catInfo?.parent?._id) {
            const parentCat = categories.find(({ _id }) => _id === catInfo?.parent?._id);
            propertiesToFill.push(...parentCat.properties);
            catInfo = parentCat;
        }
    }

    function setProductProp(propName, value) {
        setProductProperties(prev => {
            const newProductProps = { ...prev };
            newProductProps[propName] = value;
            return newProductProps;
        })
    }
    return (
        <form>
            <div className="form-group">
                <label>Tên sản phẩm:</label>
                <input
                    style={{ marginTop: '5px', padding: '5px' }}
                    type='text'
                    placeholder="Tên sản phẩm"
                    value={title}
                    onChange={ev => setTitle(ev.target.value)}
                />
            </div>
            <label>Danh mục sản phẩm</label>
            <select value={category}
                onChange={ev => setCategory(ev.target.value)}>
                <option>Chưa có danh mục</option>
                {categories.length > 0 && categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                ))}
            </select>
            {categoriesLoading && (
                <Spinner fullWidth={true}></Spinner>
            )}
            {propertiesToFill.length > 0 && propertiesToFill.map(p => (
                // eslint-disable-next-line react/jsx-key
                <div className="">
                    <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
                    <div>
                        <select value={productProperties[p.name]}
                            onChange={ev =>

                                setProductProp(p.name, ev.target.value)
                            }
                        >
                            <option value="default">Thêm đặc điểm</option>
                            {p.values.map(v => (
                                <option key={v} value={v}> {v} </option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}
            <div className="form-group">
                <label>Mô tả:</label>
                <textarea
                    style={{
                        marginTop: '5px', padding: '5px',  // Đặt chiều rộng mặc định
                        height: '250px',
                    }}
                    placeholder="Mô tả"
                    value={description}
                    onChange={ev => setDescription(ev.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Giá:</label>
                <input
                    style={{ marginTop: '5px', padding: '5px' }}
                    type="number"
                    placeholder="Giá"
                    value={price}
                    onChange={ev => setPrice(ev.target.value)}
                />
            </div>
            <div className="form-group">
                <label > Số lượng:</label>
                <input
                    style={{ marginTop: '5px', padding: '5px' }}
                    type="number"
                    placeholder="Số lượng"
                    value={quantity}
                    onChange={ev => setQuantity(ev.target.value)}
                />
            </div>
            <label>
                Ảnh sản phẩm
            </label>
            <div className="mb-2 flex flex-wrap gap-1">
                <ReactSortable
                    list={images}
                    className="flex flex-warp gap-1"
                    setList={updateImagesOrder} >
                    {!!images?.length && images.map(link => (
                        <div key={link} className="h-24 bg-white p-4 shadow-sm rounded-sm border-gray-200">
                            <img src={link} alt="" className="rounded-lg" />
                        </div>
                    ))}
                </ReactSortable>
                {isUploading && (
                    <div className="h-24 flex items-center">
                        <Spinner></Spinner>
                    </div>
                )}
                <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-lg bg-white shadow-md border border-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>
                        Tải ảnh
                    </div>
                    <input type="file" onChange={uploadImages} className="hidden"></input>
                </label>
            </div>
            <Button type='button' onClick={saveProduct} variant="contained" startIcon={<SaveRoundedIcon />} sx={{
                color: '#ffff', borderColor: '#26a69a', background: '#26a69a', textTransform: 'none', '&:hover': {
                    background: '#00897b', // Màu sắc khi hover
                },
            }} size="large">
                Lưu
            </Button>
        </form>
    );
}

//thêm dữ liệu mẫu
//làm đăng xuất